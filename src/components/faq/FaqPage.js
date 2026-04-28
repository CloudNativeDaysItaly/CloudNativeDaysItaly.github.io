'use client';

import { useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Car,
  Plane,
  Train,
  Bus,
  Cloud,
  Landmark,
  UtensilsCrossed,
  Star,
  Coffee,
} from 'lucide-react';

const transportIconMap = { Car, Plane, Train, Bus, MapPin };
const infoIconMap = { Cloud, Landmark, UtensilsCrossed };
const hotelIconMap = { Star, Coffee };

function renderRichText(text) {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className='font-semibold text-gray-800'>
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith('http');
      return (
        <a
          key={i}
          href={url}
          className='text-blue-600 hover:underline'
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function AccordionItem({ title, iconSlot, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border border-gray-200 rounded-xl overflow-hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left'
      >
        <div className='flex items-center gap-3'>
          {iconSlot && (
            <div className='flex-shrink-0 h-8 min-w-[2rem] rounded-lg bg-blue-50 flex items-center justify-center gap-1 px-2'>
              {iconSlot}
            </div>
          )}
          <span className='font-semibold text-gray-900'>{title}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className='px-5 pb-5 pt-1 border-t border-gray-100 bg-white'>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── FAQ ─────────────────────────────────────────────── */
function FaqSection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='text-sm font-bold text-blue-600 uppercase tracking-wider mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>{data.label}</h2>
      <div className='space-y-3'>
        {data.items.map((item, i) => (
          <AccordionItem key={i} title={item.question}>
            <p className='text-gray-600 leading-relaxed pt-3'>
              {renderRichText(item.answer)}
            </p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

/* ── Transport content (varies by type) ─────────────── */
function TransportContent({ section }) {
  if (section.type === 'routes') {
    return (
      <div className='pt-3 space-y-5'>
        {section.routes.map((route, i) => (
          <div key={i}>
            <h4 className='font-semibold text-gray-800 mb-2'>{route.label}</h4>
            <ol className='list-decimal list-inside space-y-1.5'>
              {route.steps.map((step, j) => (
                <li key={j} className='text-gray-600 text-sm leading-relaxed'>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'paragraphs') {
    return (
      <div className='pt-3 space-y-2'>
        {section.paragraphs.map((p, i) => (
          <p key={i} className='text-gray-600 text-sm leading-relaxed'>
            {p}
          </p>
        ))}
      </div>
    );
  }

  if (section.type === 'buses') {
    return (
      <div className='pt-3 space-y-5'>
        <p className='text-gray-600 text-sm'>{section.intro}</p>
        <div className='space-y-3'>
          {section.buses.map((bus, i) => (
            <div key={i} className='bg-gray-50 rounded-lg p-3'>
              <span className='font-semibold text-blue-600 text-sm'>
                {bus.line}
              </span>
              <p className='text-gray-600 text-sm mt-0.5'>{bus.description}</p>
              <p className='text-gray-500 text-xs mt-1'>Stop: {bus.stop}</p>
            </div>
          ))}
        </div>
        <div>
          <h4 className='font-semibold text-gray-800 mb-2 text-sm'>
            Taxi &amp; Uber
          </h4>
          <div className='space-y-1.5'>
            {section.taxis.map((taxi, i) => (
              <div key={i} className='flex items-center gap-2 text-sm text-gray-600'>
                <span className='font-medium'>{taxi.name}</span>
                {taxi.phone && (
                  <a
                    href={`tel:${taxi.phone.replace(/\s/g, '')}`}
                    className='text-blue-600 hover:underline'
                  >
                    {taxi.phone}
                  </a>
                )}
                {taxi.note && (
                  <span className='text-gray-400'>— {taxi.note}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function HowToGetHereSection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='text-sm font-bold text-blue-600 uppercase tracking-wider mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>{data.label}</h2>
      <div className='space-y-3'>
        {data.sections.map((section, i) => {
          const Icon = transportIconMap[section.icon];
          return (
            <AccordionItem
              key={i}
              title={section.title}
              iconSlot={Icon ? <Icon className='h-4 w-4 text-blue-600' /> : null}
            >
              <TransportContent section={section} />
            </AccordionItem>
          );
        })}
      </div>
    </section>
  );
}

/* ── Where to stay ───────────────────────────────────── */
function HotelCard({ hotel }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ', ' + hotel.address)}`;

  return (
    <div className='py-3 border-b border-gray-100 last:border-0'>
      <p className='font-semibold text-gray-900 text-sm'>{hotel.name}</p>
      <div className='mt-1.5 flex flex-wrap gap-x-5 gap-y-1'>
        <a
          href={mapsUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors'
        >
          <MapPin className='h-3.5 w-3.5 flex-shrink-0' />
          <span>{hotel.address}</span>
        </a>
        {hotel.phone && (
          <a
            href={`tel:${hotel.phone.replace(/[\s/]/g, '')}`}
            className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors'
          >
            <Phone className='h-3.5 w-3.5 flex-shrink-0' />
            <span>{hotel.phone}</span>
          </a>
        )}
        {hotel.email && (
          <a
            href={`mailto:${hotel.email}`}
            className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors'
          >
            <Mail className='h-3.5 w-3.5 flex-shrink-0' />
            <span>{hotel.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function WhereToStaySection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='text-sm font-bold text-blue-600 uppercase tracking-wider mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>{data.label}</h2>
      <div className='space-y-3'>
        {data.tiers.map((tier, i) => {
          const Icon = hotelIconMap[tier.icon];
          const iconSlot =
            tier.stars > 0 ? (
              <>
                <span className='text-xs font-bold text-blue-700 leading-none'>
                  {tier.stars}
                </span>
                <Star className='h-3.5 w-3.5 text-blue-600 fill-blue-600' />
              </>
            ) : Icon ? (
              <Icon className='h-4 w-4 text-blue-600' />
            ) : null;

          return (
            <AccordionItem key={i} title={tier.title} iconSlot={iconSlot}>
              <div className='pt-2'>
                {tier.hotels.map((hotel, j) => (
                  <HotelCard key={j} hotel={hotel} />
                ))}
              </div>
            </AccordionItem>
          );
        })}
      </div>
    </section>
  );
}

/* ── Useful info ─────────────────────────────────────── */
function UsefulInfoSection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='text-sm font-bold text-blue-600 uppercase tracking-wider mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>{data.label}</h2>
      <div className='space-y-6'>
        {data.cards.map((card, i) => {
          const Icon = infoIconMap[card.icon];
          return (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-200 p-6'
            >
              <div className='flex items-center gap-3 mb-4'>
                {Icon && (
                  <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                    <Icon className='h-5 w-5 text-blue-600' />
                  </div>
                )}
                <h3 className='font-bold text-gray-900'>{card.title}</h3>
              </div>
              <div className='space-y-3'>
                {card.paragraphs.map((p, j) => (
                  <p key={j} className='text-gray-600 text-sm leading-relaxed'>
                    {renderRichText(p)}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Page root ───────────────────────────────────────── */
export default function FaqPage({ data }) {
  return (
    <div className='bg-gray-50'>
      <div className='container mx-auto max-w-7xl px-4 py-16 lg:py-24'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <span className='text-sm font-bold text-blue-600 uppercase tracking-wider'>
            {data.page.label}
          </span>
          <h1 className='mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter'>
            {data.page.title}
          </h1>
          <p className='mt-4 text-lg text-gray-600'>{data.page.description}</p>
        </div>

        {/* Sections */}
        <div className='max-w-3xl mx-auto space-y-16'>
          <FaqSection data={data.faq} />
          <HowToGetHereSection data={data.howToGetHere} />
          <WhereToStaySection data={data.whereToStay} />
          <UsefulInfoSection data={data.usefulInfo} />
        </div>
      </div>
    </div>
  );
}
