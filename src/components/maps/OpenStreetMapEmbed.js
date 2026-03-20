'use client';

import { ArrowRight } from 'lucide-react';

export default function OpenStreetMapEmbed({
  mapLink,
  mapDirectionsUrl,
  rootClassName = 'mt-8',
  iframeTitle = 'Map — venue location (OpenStreetMap)',
}) {
  if (!mapLink) return null;

  return (
    <div className={rootClassName}>
      <div className="rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
        <div className="h-64 w-full bg-black/30">
          <iframe
            className="w-full h-full"
            title={iframeTitle}
            src={mapLink}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="border-t border-white/10 bg-white/[0.04] px-3.5 py-2.5 sm:px-4">
          <p className="text-[11px] sm:text-xs leading-snug text-white/40">
            <span className="text-white/35">Map data</span>
            {' · '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-blue-300 underline underline-offset-2 decoration-white/25 hover:decoration-blue-300/70 transition-colors"
            >
              © OpenStreetMap contributors
            </a>
          </p>
        </div>
      </div>
      {mapDirectionsUrl ? (
        <div className="mt-6">
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-lg font-semibold text-blue-400 hover:text-white transition-colors"
          >
            Get Directions{' '}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      ) : null}
    </div>
  );
}
