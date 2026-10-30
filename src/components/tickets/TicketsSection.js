'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';

// Sezione tickets standalone (wireframe: 08-tickets) — tre card affiancate,
// scorporata dalla vecchia ActionsSection/TicketsCard.
const TicketCard = ({ ticket }) => {
  const [isLive, setIsLive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const now = new Date();
    setIsLive(
      isAfter(now, parseISO(ticket.salesStartDate)) &&
        isBefore(now, parseISO(ticket.salesEndDate)),
    );
    setIsExpired(isAfter(now, parseISO(ticket.salesEndDate)));
  }, [ticket]);

  const getStatusBadge = () => {
    if (isLive)
      return (
        <span className='border border-ink bg-brand-yellow px-2 py-0.5 text-xs font-bold uppercase text-ink'>
          On Sale
        </span>
      );
    if (isExpired)
      return (
        <span className='border border-ink bg-gray-200 px-2 py-0.5 text-xs font-bold uppercase text-ink-muted'>
          Not Available
        </span>
      );
    return (
      <span className='border border-ink bg-white px-2 py-0.5 text-xs font-bold uppercase text-brand-blue'>
        Upcoming
      </span>
    );
  };

  return (
    <div
      className={clsx('flex flex-col border-pop bg-white p-6', {
        'border-brand-magenta shadow-pop-sm': isLive,
        'border-ink': !isLive,
        'opacity-60': isExpired,
      })}
    >
      <div className='flex items-start justify-between'>
        <h3 className='pr-2 font-bold text-ink'>{ticket.name}</h3>
        {getStatusBadge()}
      </div>
      <p className='mt-2 flex-1 text-sm text-ink-muted'>{ticket.description}</p>
      <div className='mt-6 flex items-end justify-between'>
        <div className='flex items-center gap-2 text-xs text-ink-muted'>
          <Calendar className='h-4 w-4 flex-shrink-0' />
          <span>
            {format(parseISO(ticket.salesStartDate), 'MMM d')} -{' '}
            {format(parseISO(ticket.salesEndDate), 'MMM d')}
          </span>
        </div>
        <p
          className={clsx(
            'font-display text-stat',
            isExpired ? 'text-gray-400 line-through' : 'text-brand-magenta',
          )}
        >
          {ticket.price.split('(')[0].trim()}
        </p>
      </div>
      {ticket.price.includes('(') && (
        <p className='mt-1 text-right text-xs text-ink-faint'>
          {ticket.price.split('(')[1].replace(')', '')}
        </p>
      )}
    </div>
  );
};

export default function TicketsSection({ data }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!data) return null;

  const now = new Date();
  const firstSaleDate =
    data.type.length > 0 ? parseISO(data.type[0].salesStartDate) : null;
  const isComingSoon =
    isClient && firstSaleDate && isBefore(now, firstSaleDate);

  return (
    <section className='border-t-2 border-ink bg-cream py-16 lg:py-24' id='tickets'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <span className='stamp'>Tickets</span>
        <h2 className='section-heading mt-6'>Be part of it</h2>
        {isComingSoon ? (
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>
            {data.comingSoonText}
          </p>
        ) : (
          <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
            {data.type.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}

        <div className='mt-10'>
          <Link
            href={data.link}
            target={data.link.startsWith('http') ? '_blank' : undefined}
            rel={data.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            className='btn-pop btn-pop-primary group inline-flex items-center'
          >
            {isClient && isComingSoon ? 'Join our Telegram' : 'Get your ticket'}
            <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </div>
    </section>
  );
}
