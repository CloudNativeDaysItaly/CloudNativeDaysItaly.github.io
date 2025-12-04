'use client';
import { useState, useEffect } from 'react';
import { Ticket, ArrowRight, Calendar } from 'lucide-react';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';

const TicketItem = ({ ticket }) => {
  const [isLive, setIsLive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = parseISO(ticket.salesStartDate);
    const endDate = parseISO(ticket.salesEndDate);
    setIsLive(isAfter(now, startDate) && isBefore(now, endDate));
    setIsExpired(isAfter(now, endDate));
  }, [ticket]);

  if (!ticket) return null;

  const startDate = parseISO(ticket.salesStartDate);
  const endDate = parseISO(ticket.salesEndDate);

  const getStatusBadge = () => {
    if (isLive)
      return (
        <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700'>
          On Sale
        </span>
      );
    if (isExpired)
      return (
        <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600'>
          Not Available
        </span>
      );
    return (
      <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700'>
        Upcoming
      </span>
    );
  };

  return (
    <div
      className={clsx('p-4 border rounded-lg transition-all', {
        'border-blue-300 bg-blue-50 shadow-sm': isLive,
        'border-gray-200': !isLive,
        'opacity-60': isExpired,
      })}
    >
      <div className='flex justify-between items-start'>
        <p className='font-bold text-gray-800 pr-2'>{ticket.name}</p>
        {getStatusBadge()}
      </div>
      <p className='text-sm text-gray-500 mt-1'>{ticket.description}</p>
      <div className='flex justify-between items-end mt-3'>
        <div className='flex items-center gap-2 text-xs text-gray-500'>
          <Calendar className='h-4 w-4 flex-shrink-0' />
          <span>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
          </span>
        </div>
        <p
          className={clsx(
            'font-extrabold text-lg',
            isExpired ? 'text-gray-400 line-through' : 'text-blue-600'
          )}
        >
          {ticket.price}
        </p>
      </div>
    </div>
  );
};

export default function TicketsCard({ data }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!data) return null;

  const now = new Date();
  const firstSaleDate =
    data.type.length > 0 ? parseISO(data.type[0].salesStartDate) : null;
  const isComingSoon = firstSaleDate && isBefore(now, firstSaleDate);

  const renderContent = () => {
    if (!isClient) {
      return (
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='h-6 bg-gray-200 rounded w-full'></div>
          <div className='h-12 bg-gray-200 rounded-lg mt-auto'></div>
        </div>
      );
    }

    if (isComingSoon) {
      return (
        <>
          <h3 className='text-2xl font-bold text-gray-900'>
            Tickets Coming Soon!
          </h3>
          <p className='text-gray-600 mt-2'>{data.comingSoonText}</p>
          <div className='mt-auto pt-6'>
            <div className='mt-auto pt-6'>
              <Link
                href='https://t.me/cloudnativedaysitaly'
                target='_blank'
                className='group w-full inline-flex items-center justify-center text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105'
              >
                Join the community!{' '}
                <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className='text-2xl font-bold text-gray-900'>Secure Your Spot</h3>
        <p className='text-gray-600 mt-2'>
          Choose your ticket below. Early tiers have limited availability.
        </p>
        <div className='mt-6 space-y-3'>
          {data.type
            .sort(
              (a, b) => new Date(a.salesStartDate) - new Date(b.salesStartDate)
            )
            .map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
        </div>
        <div className='mt-auto pt-6'>
          <Link
            href={data.link}
            target='_blank'
            className='group w-full inline-flex items-center justify-center text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105'
          >
            Buy Tickets Now{' '}
            <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className='bg-white h-full p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col relative overflow-hidden'>
      <div className='absolute top-0 right-0 text-xs font-bold px-4 py-1.5 rounded-bl-lg bg-blue-100 text-blue-800'>
        TICKETS
      </div>
      {renderContent()}
    </div>
  );
}
