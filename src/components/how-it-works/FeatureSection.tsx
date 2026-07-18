import { productStatus, type ProductStatus } from '../landing/content';
import { CheckIcon } from '../landing/icons';
import type { GuideFeature } from './content';

export function FeatureSection({ feature, index }: { feature: GuideFeature; index: number }) {
  const status: ProductStatus = feature.status ?? (feature.comingSoon ? 'beta' : 'available');

  return (
    <section id={feature.id} className="border-t border-white/10 py-16 sm:py-24">
      <div
        className={`grid items-center gap-10 ${feature.image ? 'lg:grid-cols-2' : ''} ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[9px] font-black uppercase tracking-[.2em] text-emerald-400">{feature.eyebrow}</p>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[7px] font-black uppercase tracking-widest text-white/55">
              {productStatus[status].label}
            </span>
          </div>
          <h2 className="mt-5 text-4xl leading-[.92] sm:text-5xl">{feature.title}</h2>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/50">{feature.copy}</p>
          <ul className="mt-8 space-y-3">
            {feature.points.map((point) => (
              <li key={point} className="flex gap-3 text-xs leading-5 text-white/45">
                <span className="text-[#eefb7a]">
                  <CheckIcon />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        {feature.image && (
          <figure className="overflow-hidden rounded-[24px] border border-white/15 bg-black/20 shadow-2xl">
            <img
              src={feature.image}
              alt={`${feature.title} ${feature.concept ? 'concept preview' : 'shown in UploadFlow'}`}
              width="2880"
              height="1800"
              loading="lazy"
              className="h-auto w-full object-contain object-top"
            />
            <figcaption className="border-t border-white/10 px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-white/35">
              {feature.imageLabel ?? `${productStatus[status].label} · ${feature.concept ? 'Prototype interface' : 'Extension workspace'}`}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
