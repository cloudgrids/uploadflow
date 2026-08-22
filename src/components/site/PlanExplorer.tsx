'use client';

import { Fragment, useCallback, useRef, useState, useSyncExternalStore } from 'react';
import {
  accountStates,
  annualSaving,
  billingPeriods,
  monthlyEquivalent,
  plans,
  type AccountStateId,
  type BillingPeriod,
  type Plan,
  type PlanId
} from './plansContent';
import { isApiError, isPayablePlan, startCheckout } from '../../lib/api';
import { isNotConfigured, messageForFailure } from './apiMessages';

const chipTone = { quiet: 'uf-chip', on: 'uf-chip uf-chip-ok', outline: 'uf-chip uf-chip-beta' } as const;

/**
 * Feeds the card's radial highlight the pointer position. CSS decides whether
 * anything is drawn — the layer is off for coarse pointers and reduced motion —
 * so this only ever sets two custom properties and never reads them back.
 */
function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  const box = card.getBoundingClientRect();
  card.style.setProperty('--uf-mx', `${event.clientX - box.left}px`);
  card.style.setProperty('--uf-my', `${event.clientY - box.top}px`);
}

/**
 * Free shows $0 rather than the word "Free" — the card is already titled Free,
 * and a figure in the same slot as the paid tiers is what makes the comparison
 * land. It carries no period, because it does not change with the toggle.
 */
function PlanPrice({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  if (!plan.price) {
    return (
      <div className="uf-price">
        <span className="uf-price-amount">
          <span className="uf-price-cur">$</span>0
        </span>
        <span className="uf-price-note">Always free. No card.</span>
      </div>
    );
  }

  const annual = period === 'annual';
  const amount = annual ? monthlyEquivalent(plan.price) : plan.price.monthly;
  const saving = annualSaving(plan.price);

  return (
    <div className="uf-price">
      <span key={period} className="uf-price-amount">
        <span className="uf-price-cur">$</span>
        {amount}
        <span className="uf-price-per">/month</span>
      </span>
      <span className="uf-price-note">
        {annual ? <>Billed ${plan.price.annual} a year &middot; save ${saving}</> : <>Billed monthly</>}
      </span>
    </div>
  );
}

/**
 * How far from the active card a plan can sit and still be drawn. At depth 1 a
 * card is the immediate neighbour on one side; anything further is the card
 * diagonally opposite in the rotation and never has a side of its own.
 */
const DECK_DEPTH = 1;

/**
 * The account panel and the plan grid move together: picking a state changes
 * which plan is marked as yours, so the two never disagree on screen.
 */
export function PlanExplorer() {
  const [stateId, setStateId] = useState<AccountStateId>('out');
  const [period, setPeriod] = useState<BillingPeriod>('monthly');
  /**
   * Which card the deck opens on.
   *
   * **Not the first one.** `plans[0]` is Free, whose button is disabled because it is what somebody
   * already has — so the page loaded with its one interactive card offering nothing to press, and
   * every plan you could actually buy sitting behind it, visible and inert. Opening on the
   * recommended tier means the default state has something to do in it.
   */
  const [active, setActive] = useState(() => {
    const recommended = plans.findIndex((plan) => plan.recommended && isPayablePlan(plan.id));
    return recommended >= 0 ? recommended : Math.max(0, plans.findIndex((plan) => isPayablePlan(plan.id)));
  });
  const [dragging, setDragging] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number } | null>(null);
  /**
   * Whether the pointer moved rather than tapped.
   *
   * A browser still fires a click after a drag that ends on the element it started on, so a swipe
   * finishing over a neighbour would step the deck *and* then be caught by that neighbour's reach
   * target — two jumps for one gesture. This lets the target ignore the click that belongs to a
   * swipe already handled.
   */
  const swiped = useRef(false);
  const account = accountStates.find((s) => s.id === stateId) ?? accountStates[0];
  const count = plans.length;

  /**
   * `inert` waits for hydration. It is a DOM attribute, not a style, so applying
   * it server-side would strip three of the four plans from the accessibility
   * tree for anyone whose JavaScript never arrives — and without JavaScript
   * there is no way to swipe them back into view. Same `useSyncExternalStore`
   * shape as ThemeToggle: false on the server, true on the client, never again.
   */
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  /**
   * Signed distance from the active card, taking the shorter way round: negative
   * sits to the left, positive to the right, zero is the card in the middle. The
   * sign drives direction (offset, tilt) and the magnitude drives depth (scale,
   * fade, stacking), which is what keeps the fan symmetrical about the middle.
   */
  const offsetOf = (index: number) => {
    const half = count / 2;
    let distance = index - active;
    if (distance > half) distance -= count;
    if (distance < -half) distance += count;
    return distance;
  };
  const step = useCallback((delta: number) => setActive((a) => (a + delta + count) % count), [count]);

  const setDragOffset = (dx: number) => {
    const el = deckRef.current;
    if (!el) return;
    el.style.setProperty('--uf-drag', `${dx}px`);
    // a second, unitless copy: `calc()` cannot turn px into deg for the tilt
    el.style.setProperty('--uf-drag-n', `${dx}`);
  };

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    drag.current = { id: event.pointerId, x: event.clientX };
    // throws if the pointer is already gone; the drag still works without capture
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* no capture available — pointerup on the document still ends the drag */
    }
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    setDragOffset(event.clientX - drag.current.x);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    const dx = event.clientX - drag.current.x;
    // Four pixels: enough to tell a tap from a drag without demanding a steady hand.
    swiped.current = Math.abs(dx) > 4;
    drag.current = null;
    setDragging(false);
    setDragOffset(0);
    const width = deckRef.current?.getBoundingClientRect().width ?? 0;
    // proportional, with a floor: at 150px a fixed 60px threshold is 40% of the card
    const threshold = Math.max(36, width * 0.22);
    if (dx <= -threshold) step(1);
    else if (dx >= threshold) step(-1);
  }

  /**
   * Which plan is mid-checkout, if any. One at a time: the browser leaves the page on success, so
   * a second click would only ever be a double submit.
   */
  const [starting, setStarting] = useState<PlanId | null>(null);
  const [notice, setNotice] = useState('');

  const buy = async (plan: Plan) => {
    if (starting || !isPayablePlan(plan.id)) return;

    setStarting(plan.id);
    setNotice('');
    try {
      window.location.assign(await startCheckout(plan.id, period));
    } catch (cause) {
      // A subscription belongs to an account, so nobody signed in means sign in first rather than
      // an error — the visitor asked to buy something and that is still the thing to help them do.
      if (isApiError(cause) && cause.outcome === 'auth') {
        window.location.assign('/sign-in');
        return;
      }
      // Naming the plan is worth the extra branch: the notice sits under a deck where three other
      // cards are one swipe away, so "that part of the service" leaves it ambiguous which one was
      // refused.
      setNotice(
        isNotConfigured(cause)
          ? `${plan.name} cannot be bought yet. Nothing is wrong on your side, and trying again will not change it.`
          : messageForFailure(cause, 'Could not start checkout. Try again.')
      );
      setStarting(null);
    }
  };

  return (
    <div className="uf-stack-l">
      <div className="uf-acct uf-rise">
        <div className="uf-acct-bar">
          <span className="uf-avatar" aria-hidden="true">
            {account.initials}
          </span>
          <span className="uf-who">
            <b>{account.name}</b>
            <span>{account.sub}</span>
          </span>
          <span style={{ marginLeft: 'auto' }}>
            <span className={chipTone[account.chipTone]}>{account.chip}</span>
          </span>
        </div>

        <div className="uf-acct-body">
          <div className="uf-stack-6">
            <h2>{account.title}</h2>
            <p className="uf-small">{account.copy}</p>
          </div>

          <div className="uf-cta-row">
            <button type="button" className="uf-btn uf-btn-primary">
              {account.primary}
            </button>
            <button type="button" className="uf-btn uf-btn-ghost">
              {account.secondary}
            </button>
          </div>

          <div className="uf-stack-6">
            <span className="uf-eyebrow uf-eyebrow-dim">Preview account states</span>
            <div className="uf-switch" role="group" aria-label="Account state">
              {accountStates.map((s) => (
                <button key={s.id} type="button" aria-pressed={s.id === stateId} onClick={() => setStateId(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="uf-billing">
        <span className="uf-eyebrow uf-eyebrow-dim">Billing</span>
        <div className="uf-switch" role="group" aria-label="Billing period">
          {billingPeriods.map((option) => (
            <button key={option.id} type="button" aria-pressed={option.id === period} onClick={() => setPeriod(option.id)}>
              {option.label}
            </button>
          ))}
        </div>
        <span className="uf-small uf-billing-hint">
          {period === 'annual' ? 'Every paid plan costs less per month — up to 25% less.' : 'Switch to annual to pay less per month.'}
        </span>
      </div>

      <div
        className="uf-deck"
        ref={deckRef}
        data-dragging={dragging || undefined}
        role="group"
        aria-roledescription="Plan deck"
        aria-label="Plans"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        }}
      >
        <div
          className="uf-deck-stack"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
        {plans.map((plan, index) => {
          const current = plan.id === account.plan;
          // current wins: "most popular" is noise on the plan you already hold
          const flag = current ? 'Your plan' : plan.recommended ? 'Most popular' : null;
          const offset = offsetOf(index);
          const depth = Math.abs(offset);
          const top = offset === 0;
          return (
            <Fragment key={plan.id}>
            <div
              className="uf-card uf-plan"
              data-current={current}
              data-recommended={!current && plan.recommended ? true : undefined}
              data-top={top ? true : undefined}
              data-buried={depth > DECK_DEPTH ? true : undefined}
              inert={hydrated && !top}
              role="group"
              aria-roledescription="Plan card"
              aria-label={`${plan.name}, ${index + 1} of ${count}`}
              onPointerMove={trackPointer}
              style={
                { animationDelay: `${index * 70}ms`, '--uf-d': offset, '--uf-depth': depth } as React.CSSProperties
              }
            >
              {flag ? <span className="uf-plan-flag">{flag}</span> : null}
              <div>
                <div className="uf-plan-name">{plan.name}</div>
                <div className="uf-plan-access">{plan.access}</div>
              </div>
              <PlanPrice plan={plan} period={period} />
              <p className="uf-plan-line">{plan.line}</p>

              <div>
                {plan.features.map((feature) => (
                  <div key={feature.title} className="uf-feat" data-state={feature.state}>
                    <span className="uf-tick" aria-hidden="true">
                      {feature.state === 'included' ? '✓' : ''}
                    </span>
                    <span>
                      <b>
                        {feature.title}
                        {feature.state === 'soon' ? <span className="uf-feat-soon">Coming soon</span> : null}
                      </b>
                      <span>{feature.copy}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="uf-plan-foot">
                <button
                  type="button"
                  className={`uf-btn ${!current && plan.recommended ? 'uf-btn-primary' : 'uf-btn-ghost'}`}
                  disabled={current || !isPayablePlan(plan.id) || starting !== null}
                  style={current ? { opacity: 0.55, cursor: 'default' } : undefined}
                  onClick={() => void buy(plan)}
                >
                  {current ? 'Current plan' : starting === plan.id ? 'Starting…' : plan.cta}
                </button>
              </div>
            </div>
            {/*
              A way to reach a card you can see.

              The fan shows the neighbours on purpose, and `inert` makes them untouchable on
              purpose — which together told somebody three plans were right there and then ignored
              the click. Worse, the top card's box overlaps their inner halves, so even a click on
              exposed artwork landed on the wrong card and did nothing at all: no request, no notice,
              nothing to explain it.

              This sits outside the inert subtree, over the neighbour and under the top card, and
              its only job is to bring that card forward. `inert` keeps doing its job for the
              keyboard and the accessibility tree; the pointer gets an answer.
            */}
            {!top && depth <= DECK_DEPTH ? (
              <button
                type="button"
                className="uf-plan-reach"
                aria-label={`Show ${plan.name}`}
                onClick={() => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  setActive(index);
                }}
                style={{ '--uf-d': offset, '--uf-depth': depth } as React.CSSProperties}
              />
            ) : null}
            </Fragment>
          );
        })}
        </div>

        <div className="uf-deck-nav">
          <button type="button" className="uf-deck-arrow" aria-label="Previous plan" onClick={() => step(-1)}>
            &larr;
          </button>
          <div className="uf-deck-dots">
            {plans.map((plan, index) => (
              <button
                key={plan.id}
                type="button"
                aria-label={plan.name}
                aria-current={index === active}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button type="button" className="uf-deck-arrow" aria-label="Next plan" onClick={() => step(1)}>
            &rarr;
          </button>
        </div>

        {/* the cards behind are inert, so the change of top card needs saying */}
        <p className="uf-sr" aria-live="polite">
          {hydrated ? `${plans[active].name}, plan ${active + 1} of ${count}` : ''}
        </p>

        {/*
          Outside the cards on purpose. They share one grid cell, so the stack is as tall as the
          tallest of them — a message rendered inside would resize the whole deck the moment it
          appeared, and there is only ever one checkout in flight to report on anyway.
        */}
        {notice ? (
          <p className="uf-small" role="status" aria-live="polite">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
