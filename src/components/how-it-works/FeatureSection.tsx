import { productStatus, type ProductStatus } from '../landing/content';
import { CheckIcon } from '../landing/icons';
import type { GuideFeature } from './content';

export function FeatureSection({ feature, index }: { feature: GuideFeature; index: number }) {
  const status: ProductStatus = feature.status ?? (feature.comingSoon ? 'beta' : 'available');
  const imageFirst = index % 2 === 1;

  return (
    <section id={feature.id} className="border-t border-white/10 py-16 sm:py-24">
      <div className={`grid items-center gap-10 ${feature.image ? 'lg:grid-cols-2' : ''}`}>
        <div className={imageFirst ? 'lg:order-2' : ''} data-reveal={imageFirst ? 'right' : 'left'}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-emerald-400">{feature.eyebrow}</p>
            <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white/65">{productStatus[status].label}</span>
          </div>
          <h2 className="mt-5 text-4xl leading-[.92] sm:text-5xl">{feature.title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">{feature.copy}</p>
          <ul className="mt-8 space-y-3">
            {feature.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-white/55">
                <span className="mt-0.5 shrink-0 text-[#eefb7a]"><CheckIcon /></span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-white/38">
            <span className="rounded-full border border-white/10 px-3 py-1.5">User-directed</span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">No auto-submit</span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">Reviewable</span>
          </div>
        </div>
        {feature.image && (
          <figure className={`media-frame ${imageFirst ? 'lg:order-1' : ''}`} data-reveal={imageFirst ? 'left' : 'right'}>
            <img src={feature.image} alt={`${feature.title} ${feature.concept ? 'concept preview' : 'shown in UploadFlow'}`} width="2880" height="1800" loading="lazy" className="h-auto w-full object-contain object-top" />
            <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/48">
              <span>{feature.imageLabel ?? `${productStatus[status].label} · ${feature.concept ? 'Prototype interface' : 'Extension workspace'}`}</span>
              <span className="text-[#eefb7a]">{String(index + 1).padStart(2, '0')}</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
