'use client';
import { useState, useEffect } from 'react';
import { Info, Calendar, Flag, CheckCircle, ArrowRight } from 'lucide-react';
import {
  format,
  differenceInDays,
  parseISO,
  isBefore,
  isAfter,
} from 'date-fns';
import Link from 'next/link';

export default function C4P_Card({ data }) {
  const [status, setStatus] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    if (!data) return;
    const now = new Date();
    const startDate = parseISO(data.startDate);
    const endDate = parseISO(data.endDate);

    let currentStatus = 'closed';
    if (isBefore(now, startDate)) currentStatus = 'comingsoon';
    if (isAfter(now, startDate) && isBefore(now, endDate))
      currentStatus = 'open';

    setStatus(currentStatus);
    setDaysLeft(differenceInDays(endDate, now));
  }, [data]);

  if (!data || !status) {
    return (
      <div className='bg-white h-full p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col relative overflow-hidden'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='h-6 bg-gray-200 rounded w-full'></div>
          <div className='h-12 bg-gray-200 rounded-lg mt-auto'></div>
        </div>
      </div>
    );
  }

  const endDate = parseISO(data.endDate);

  const renderContent = () => {
    switch (status) {
      case 'open':
        return (
          <>
            <h3 className='text-2xl font-bold text-gray-900'>
              Share Your Expertise
            </h3>
            <p className='text-gray-600 mt-2'>
              We are looking for passionate speakers to share their knowledge
              with the community.
            </p>
            <div className='mt-6 space-y-3 text-sm'>
              <div className='flex items-center gap-3'>
                <Calendar className='h-5 w-5 text-green-500' />
                <p>
                  Submissions close on{' '}
                  <span className='font-bold'>
                    {format(endDate, 'MMMM do, yyyy')}
                  </span>
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <Flag className='h-5 w-5 text-green-500' />
                <p>
                  <span className='font-bold text-green-600'>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
                  </span>{' '}
                  to submit your proposal.
                </p>
              </div>
            </div>
            <div className='mt-6 p-4 bg-sky-50 border-l-4 border-sky-400 text-sky-800 text-sm rounded-r-lg'>
              <div className='flex items-start gap-3'>
                <Info className='h-5 w-5 mt-0.5 flex-shrink-0' />
                <p>{data.rollingSelectionText}</p>
              </div>
            </div>
            <div className='mt-auto pt-6'>
              <Link
                href={data.url}
                target='_blank'
                className='group w-full inline-flex items-center justify-center text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105'
              >
                Submit Your Talk{' '}
                <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          </>
        );
      case 'closed':
        return (
          <>
            <h3 className='text-2xl font-bold text-gray-900'>
              Submissions Closed
            </h3>
            <p className='text-gray-600 mt-2'>
              Thank you to everyone who submitted. We are reviewing all
              proposals and will announce the final agenda soon.
            </p>
            <div className='mt-6 space-y-3 text-sm'>
              <div className='flex items-center gap-3'>
                <CheckCircle className='h-5 w-5 text-gray-500' />
                <p>
                  Submissions closed on{' '}
                  <span className='font-bold'>
                    {format(endDate, 'MMMM do, yyyy')}
                  </span>
                </p>
              </div>
            </div>
            <div className='mt-auto pt-6'>
              <Link
                href={data.agendaUrl}
                target='_blank'
                className='group w-full inline-flex items-center justify-center text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105'
              >
                View Agenda
              </Link>
            </div>
          </>
        );
      case 'comingsoon':
      default:
        return (
          <>
            <h3 className='text-2xl font-bold text-gray-900'>
              Call for Papers Opens Soon
            </h3>
            <p className='text-gray-600 mt-2'>
              Get ready to share your ideas! Our Call for Papers will be opening
              on{' '}
              <span className='font-bold'>
                {format(parseISO(data.startDate), 'MMMM do')}
              </span>
              .
            </p>
            <div className='mt-6 p-4 bg-sky-50 border-l-4 border-sky-400 text-sky-800 text-sm rounded-r-lg'>
              <div className='flex items-start gap-3'>
                <Info className='h-5 w-5 mt-0.5 flex-shrink-0' />
                <p>{data.rollingSelectionText}</p>
              </div>
            </div>
            <div className='mt-auto pt-6'>
              <div className='w-full text-center bg-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-lg cursor-not-allowed'>
                Stay Tuned
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className='bg-white h-full p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col relative overflow-hidden'>
      <div className='absolute top-0 right-0 text-xs font-bold px-4 py-1.5 rounded-bl-lg bg-blue-100 text-blue-800'>
        C4P
      </div>
      {renderContent()}
    </div>
  );
}
