import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import config from '@/config/website.json';
import agendaConfig from '@/config/agenda.json';
import { formatAgendaDateRange } from '@/lib/agendaDate';
import BecomeSponsorBox from '@/components/sponsor/BecomeSponsorBox';
import BrandRings from '@/components/decor/BrandRings';
import Metrics from '@/components/metrics/metrics';
import { SessionTypeBadge } from '@/components/agenda/sessionTypes';
import { DownloadList } from '@/components/brandkit/DownloadButtons';
import { DsBlock, DsSection, DsStage, DsToken } from './DsKit';

/*
 * Componenti. Dove il componente esiste come modulo condiviso lo
 * importiamo (BecomeSponsorBox, Metrics, SessionTypeBadge, DownloadList,
 * BrandRings). Dove vive dentro una pagina o un componente client con
 * logica propria (pannello navbar, timeline /about) ne riproduciamo la
 * forma e il commento dice dove sta l'originale.
 */

// Voci del pannello: forma dei dropdown della navbar
// (src/components/navbar/navbar.js), superficie piena colorata e hover invert.
const PANEL_ITEMS = ['Agenda', 'Speakers', 'Content hub', 'Brand & Media Kit'];

const TIMELINE = [
  { year: '2026', title: 'Bologna, second edition', text: '285 attendees and a bigger room.' },
  { year: '2027', title: 'Bologna, third edition', text: `${formatAgendaDateRange(agendaConfig.days)}, ${config.hero.venue}.`, live: true },
];

export default function ComponentsSection() {
  return (
    <DsSection
      id='components'
      tone='white'
      eyebrow='Assembled'
      title='Components'
      lead='The recurring pieces of the site, rendered here with the same code that runs the home page.'
    >
      <DsBlock
        title='Grid card and feature card'
        rule='Grid cards are white and lift on hover. A feature card is a coloured surface that stays put and always carries its shadow.'
      >
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='card-pop p-6 transition-all duration-100 hover:-translate-y-[2px] hover:shadow-pop'>
            <SessionTypeBadge type='keynote' />
            <h4 className='mt-4 text-xl font-bold text-ink'>
              Running Kubernetes on a pizza budget
            </h4>
            <p className='mt-2 text-sm text-ink-muted'>Ada Lovelace, Platform Engineer</p>
            <p className='mt-4 flex items-center gap-2 text-sm text-ink-soft'>
              <Calendar className='h-4 w-4' /> 09:30
              <MapPin className='ml-2 h-4 w-4' /> Main room
            </p>
            <p className='mt-6 text-xs font-bold uppercase tracking-widest text-ink-muted'>
              Hover: lift and shadow
            </p>
          </div>

          <div className='card-pop bg-brand-blue p-6 text-white lg:px-10 lg:py-8'>
            <span className='eyebrow text-brand-yellow'>Agenda at a glance</span>
            <p className='mt-2 font-display text-2xl uppercase'>One day, three tracks</p>
            <ul className='mt-4 space-y-2 text-sm'>
              <li className='flex items-center gap-2'>
                <span className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow' />
                Keynotes in the main room
              </li>
              <li className='flex items-center gap-2'>
                <span className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow' />
                Hands on workshops
              </li>
            </ul>
            <p className='mt-6 text-xs font-bold uppercase tracking-widest text-white/80'>
              Coloured surface, neutral atoms
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Dropdown panel'
        rule='A full colour surface with an ink border and a hard shadow: blue for the Hub, magenta for About. Items invert on hover, a rings sticker sits in the bottom right corner.'
      >
        <div className='flex flex-wrap gap-8'>
          {[
            { tone: 'bg-brand-blue', label: 'Hub' },
            { tone: 'bg-brand-magenta', label: 'About' },
          ].map((panel) => (
            <div
              key={panel.label}
              className={`relative w-full max-w-[280px] overflow-hidden border-pop border-ink shadow-pop ${panel.tone}`}
            >
              <p className='border-b-2 border-ink px-5 py-3 font-display text-sm uppercase tracking-widest text-white'>
                {panel.label}
              </p>
              <ul className='relative z-10 pb-12 pt-2'>
                {PANEL_ITEMS.map((item) => (
                  <li key={item}>
                    <span className='block px-5 py-2 font-bold text-white transition-colors hover:bg-ink hover:text-white'>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <BrandRings
                cluster='duo'
                className='pointer-events-none absolute -bottom-6 -right-6 w-24 opacity-90'
              />
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Timeline'
        rule='Square yellow node, ink line, year in display blue. The node of the edition that is coming blinks between blue and magenta, and stops still for anyone who asked for reduced motion.'
      >
        <ul className='border-pop border-ink bg-white p-8'>
          {TIMELINE.map((step, i) => (
            <li key={step.year} className='relative pl-8 sm:pl-12'>
              {i < TIMELINE.length - 1 && (
                <span
                  aria-hidden='true'
                  className='absolute left-[7px] top-6 h-full w-0.5 bg-ink sm:left-[11px]'
                />
              )}
              <span
                aria-hidden='true'
                className={`absolute left-0 top-1.5 h-4 w-4 border-pop border-ink sm:h-6 sm:w-6 ${
                  step.live ? 'timeline-node-live' : 'bg-brand-yellow'
                }`}
              />
              <div className='pb-8'>
                <span className='font-display text-stat uppercase leading-none text-brand-blue'>
                  {step.year}
                </span>
                <h4 className='mt-2 text-xl font-bold text-ink'>{step.title}</h4>
                <p className='mt-1 text-ink-muted'>{step.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </DsBlock>

      <DsBlock
        title='Downloads'
        rule='An asset that does not exist yet is a disabled button with a Soon chip, never a dead link. Filling in the url turns it into a real download.'
      >
        <DownloadList
          items={[
            { label: 'Halftone pattern (SVG)', url: '/images/pattern_halftone.svg' },
            { label: 'Logo pack (SVG + PNG)', url: null },
          ]}
        />
      </DsBlock>

      <DsBlock
        title='Invite box and document preview'
        rule='Yellow is the container of an invitation, so the buttons inside it stay magenta, white or ink. The document cover carries the large shadow and becomes a link when the file is published.'
      >
        <BecomeSponsorBox
          content={config.sponsors}
          contactEmail={config.sponsors.contactEmail}
        />
      </DsBlock>

      <DsBlock
        title='Numbers band'
        rule='Ink band, display numbers in the three brand colours, labels in white. It counts up when it enters the viewport: it is the celebratory one. For documental numbers, look at the press facts in the brand kit.'
      >
        <div className='border-pop border-ink'>
          <Metrics
            items={[
              { value: 285, label: 'Attendees 2026', accent: 'text-brand-yellow' },
              { value: 49, label: 'Speakers', accent: 'text-brand-magenta' },
              { value: 15, label: 'Sponsors', accent: 'text-brand-blue' },
            ]}
          />
        </div>
        <p className='mt-3 text-sm text-ink-muted'>
          Component: <DsToken>src/components/metrics/metrics.js</DsToken>
        </p>
      </DsBlock>

      <DsBlock
        title='Speaker: role, company, credentials'
        rule='One composition for the whole site: whoever fills a profile can write the company inside the role, it is never repeated. In cards and lists everything is grey, because those surfaces are dense. The profile page is the only place with colour, and the only place where magenta marks a recognition of the person instead of an action.'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <DsStage label='Cards, agenda, talk page: all grey, two roles at most'>
            <div className='text-center'>
              <p className='text-xl font-bold text-ink'>Eleni Grosdouli</p>
              <p className='mt-1 text-sm text-ink-muted'>
                DevOps Consulting Engineer @Cisco Systems
              </p>
              <p className='mt-1 text-[0.8rem] font-semibold text-ink-muted'>Kubestronaut</p>
            </div>
          </DsStage>
          <DsStage label='Profile page: labelled, blue role, magenta credential'>
            <div className='text-center'>
              <p className='text-xl font-bold text-ink'>Eleni Grosdouli</p>
              <p className='mt-4 text-xs font-bold uppercase tracking-widest text-ink-muted'>
                Role
              </p>
              <p className='mt-1 font-semibold text-brand-blue'>
                DevOps Consulting Engineer{' '}
                <span className='underline decoration-brand-blue/30 decoration-2 underline-offset-4'>
                  @Cisco Systems
                </span>
              </p>
              <p className='mt-4 text-xs font-bold uppercase tracking-widest text-ink-muted'>
                Community role
              </p>
              <p className='mt-1 text-sm font-semibold text-brand-magenta'>Kubestronaut</p>
            </div>
          </DsStage>
        </div>
        <p className='mt-3 text-sm text-ink-muted'>
          Composition: <DsToken>src/lib/speakerMeta.js</DsToken>. The company is a link only
          on the profile page, and only when the profile carries a real URL. Credentials
          sit on one line, separated by a pipe, from the most recognisable to the most
          niche, and the organisers close the line with CND Italy Organizer. Vendor
          certifications stay in the bio: this field is a community role.
        </p>
      </DsBlock>

      <DsBlock
        title='Section link'
        rule='Inline links are blue and turn magenta on hover. A link that has to look like a button is a button.'
      >
        <span className='inline-flex items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-magenta'>
          All the speakers
          <ArrowRight className='h-4 w-4' />
        </span>
      </DsBlock>
    </DsSection>
  );
}
