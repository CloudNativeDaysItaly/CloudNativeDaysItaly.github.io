import { Download } from 'lucide-react';

// Transparency report di un'edizione passata: card bianca con testo e
// download a sinistra, cover cliccabile a destra (stesso trattamento della
// cover del prospectus in BecomeSponsorBox). Dati da editions/<year>.json.
export default function TransparencyReport({ report, year }) {
  if (!report?.url) return null;

  return (
    <section id='transparency-report' className='bg-white py-12 lg:py-16'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='card-pop grid grid-cols-1 gap-8 bg-white p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-12'>
          <div>
            <span className='chip-pop'>{year} edition</span>
            <h2 className='section-heading mt-6'>{report.title}</h2>
            {report.description && (
              <p className='mt-4 max-w-2xl text-ink-soft'>{report.description}</p>
            )}
            <div className='mt-8 flex flex-wrap items-center gap-4'>
              <a
                href={report.url}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-pop btn-pop-primary inline-flex items-center gap-2 whitespace-nowrap'
              >
                <Download className='h-5 w-5' aria-hidden='true' />
                {report.label}
              </a>
            </div>
          </div>

          {report.cover && (
            <a
              href={report.url}
              target='_blank'
              rel='noopener noreferrer'
              className='card-pop block max-w-[340px] justify-self-center overflow-hidden p-2 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111] lg:justify-self-end'
            >
              <img
                src={report.cover}
                alt={`${report.title} ${year}`}
                loading='lazy'
                className='block w-full'
              />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
