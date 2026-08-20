import type { ComponentProps } from 'react';

/**
 * UploadFlow's own loading mark: the extension icon's glyph — a tray, then the
 * arrow rising out of it — stroked on a loop while a surface resolves.
 *
 * Ported from the extension's ui-system so the site and the tool share a
 * loading state. The stroke is `currentColor`, so the surface it sits in
 * decides the colour and this component never reads a token itself. The
 * keyframes live in `globals.css` beside the rest of the `uf-` system.
 */
export function UploadFlowLoader({
  className,
  size = 48,
  label = 'Loading',
  ...props
}: ComponentProps<'div'> & { size?: number; label?: string }) {
  return (
    <div
      data-slot="upload-flow-loader"
      className={['uf-loader', className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
      {...props}
    >
      <svg width={size} height={size} viewBox="0 0 128 128" aria-hidden="true" focusable="false">
        <path
          className="uf-loader__stroke uf-loader__stroke--tray"
          d="M35 78V88C35 98.493 43.507 107 54 107H74C84.493 107 93 98.493 93 88V78"
        />
        <path className="uf-loader__stroke" d="M64 84V38M64 38L45 57M64 38L83 57" />
      </svg>
    </div>
  );
}
