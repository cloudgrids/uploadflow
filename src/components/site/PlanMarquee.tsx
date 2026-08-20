import { marqueeLines } from './plansContent';

/** The run is duplicated so the -50% translate loops without a seam. */
export function PlanMarquee() {
  const run = (
    <div className="uf-marquee-run">
      {marqueeLines.map(([label, value]) => (
        <span key={label + value} style={{ display: 'contents' }}>
          <span>
            {label} <b>{value}</b>
          </span>
          <i />
        </span>
      ))}
    </div>
  );

  return (
    <div className="uf-marquee" aria-hidden="true">
      <div className="uf-marquee-track">
        {run}
        {run}
      </div>
    </div>
  );
}
