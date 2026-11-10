import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Invito alla sponsorship: superficie gialla (il giallo è il contenitore
// dell'invito, i bottoni restano magenta/bianco/ink) con l'anteprima del
// prospectus a destra. Usato in home dentro la vetrina sponsor e sulla
// pagina /sponsors: un solo posto da modificare.
export default function BecomeSponsorBox({
  content,
  contactEmail,
  className = '',
}) {
  const { become, prospectus, guide } = content;
  if (!become) return null;

  const cover = prospectus?.cover;
  const prospectusReady = Boolean(prospectus?.active && prospectus?.url);

  return (
    <div
      id='become-a-sponsor'
      className={`card-pop grid grid-cols-1 gap-8 bg-brand-yellow p-8 shadow-pop-lg lg:grid-cols-[2fr_1fr] lg:items-center lg:p-12 ${className}`}
    >
      <div>
        <span className='stamp'>We need you</span>
        <h2 className='section-heading mt-6'>{become.title}</h2>
        <p className='mt-4 max-w-2xl text-ink-soft'>{become.description}</p>
        <div className='mt-8 flex flex-wrap items-center gap-4'>
          <Link
            className='btn-pop btn-pop-primary w-full sm:w-auto sm:whitespace-nowrap'
            href={`mailto:${contactEmail}`}
          >
            Contact Us
          </Link>
          {prospectusReady && (
            <a
              href={prospectus.url}
              target='_blank'
              rel='noopener noreferrer'
              className='btn-pop btn-pop-secondary w-full sm:w-auto sm:whitespace-nowrap'
            >
              {prospectus.label}
            </a>
          )}
        </div>
        {guide?.active && (
          <p className='mt-6 text-sm text-ink-soft'>
            {guide.boxText}{' '}
            <a
              href={guide.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group font-semibold text-ink no-underline hover:text-brand-magenta'
            >
              {guide.boxLinkLead}{' '}
              <span className='underline'>{guide.linkLabel}</span>{' '}
              {guide.boxLinkTail}{' '}
              <ArrowRight className='inline h-4 w-4 transition-transform group-hover:translate-x-1' />
            </a>
          </p>
        )}
      </div>

      {/* Cover del prospectus: link scaricabile quando è pubblicato,
          altrimenti anteprima con chip "Soon" (pattern brand kit) */}
      {cover && (
        <div className='justify-self-center lg:justify-self-end'>
          {prospectusReady ? (
            <a
              href={prospectus.url}
              target='_blank'
              rel='noopener noreferrer'
              className='card-pop group block max-w-[300px] overflow-hidden p-2 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]'
            >
              {/* Tagliata ai lati (4:3) per lasciare spazio ai bottoni su una riga */}
              <img
                src={cover}
                alt={prospectus.label}
                className='block aspect-[4/3] w-full object-cover'
              />
            </a>
          ) : (
            <div className='card-pop relative max-w-[300px] overflow-hidden p-2 shadow-pop-lg'>
              <img
                src={cover}
                alt='Sponsorship prospectus'
                className='block w-full'
              />
              <span className='absolute left-4 top-4 border-pop border-ink bg-white px-2 py-0.5 text-xs font-bold uppercase text-brand-blue'>
                Soon
              </span>
              <span className='mt-2 flex items-center justify-center py-1 text-sm font-bold uppercase tracking-wide text-ink-muted'>
                Sponsorship prospectus
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
