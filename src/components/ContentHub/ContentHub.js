'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Mic, ArrowRight, ArrowLeft } from 'lucide-react';

const TalkCard = ({ talk }) => {
  const defaultImage = '/images/placeholder.png';
  const imageUrl = talk.image ? talk.image : defaultImage;
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col'>
      <div className='relative w-full h-48 sm:h-56 overflow-hidden'>
        <Image
          src={imageUrl ? imageUrl : defaultImage}
          alt={`Preview for ${talk.title}`}
          fill
          style={{ objectFit: 'cover' }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority={false}
        />
      </div>
      <div className='p-6 flex-grow flex flex-col'>
        <div className='flex justify-between items-center mb-3'>
          <span className='text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800'>
            Edition {talk.year}
          </span>
          {talk.type && (
            <span className='text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700'>
              {talk.type}
            </span>
          )}
        </div>
        <h3
          className='font-bold text-gray-900 text-lg line-clamp-2'
          title={talk.title}
        >
          {talk.title}
        </h3>
        {talk.speakers && talk.speakers.length > 0 && (
          <p className='text-sm text-gray-500 mt-2 flex items-center gap-2'>
            <Mic size={14} />
            <span className='truncate'>
              {talk.speakers.map((s) => s.name).join(', ')}
            </span>
          </p>
        )}
        <p className='text-sm text-gray-600 line-clamp-3 mt-3'>
          {talk.abstract}
        </p>
        <div className='mt-auto pt-4 border-t border-gray-100 mt-4'>
          <Link
            href={`/talk/${talk.id}`}
            className='inline-flex items-center gap-1 text-sm text-blue-600 font-semibold hover:gap-2 transition-all'
          >
            View Session <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className='flex items-center justify-center gap-4 mt-12'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 hover:bg-gray-50'
      >
        <ArrowLeft size={16} /> Previous
      </button>
      <span className='font-medium text-gray-600'>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 hover:bg-gray-50'
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default function ContentHub({
  talks = [],
  title = 'Event Talks',
  description = 'Explore our schedule of talks, workshops, and networking opportunities.',
  showPagination = false,
  limit = null,
  hubLink = '/content-hub',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const TALKS_PER_PAGE = 9;

  const filteredTalks = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return talks;

    return talks.filter(
      (talk) =>
        talk.title.toLowerCase().includes(lowercasedQuery) ||
        (talk.abstract &&
          talk.abstract.toLowerCase().includes(lowercasedQuery)) ||
        (talk.speakers &&
          talk.speakers.some((speaker) =>
            speaker.name.toLowerCase().includes(lowercasedQuery),
          )) ||
        (talk.tags &&
          talk.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery))),
    );
  }, [searchQuery, talks]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTalks.length / TALKS_PER_PAGE);

  const talksToDisplay = useMemo(() => {
    if (limit) {
      return talks.slice(0, limit);
    }
    if (showPagination) {
      return filteredTalks.slice(
        (currentPage - 1) * TALKS_PER_PAGE,
        currentPage * TALKS_PER_PAGE,
      );
    }
    return filteredTalks;
  }, [
    limit,
    talks,
    showPagination,
    filteredTalks,
    currentPage,
    TALKS_PER_PAGE,
  ]);

  const showViewAllButton = limit && talks.length > limit;

  return (
    <section className='bg-gray-50 min-h-[60vh] py-16 lg:py-24'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter'>
            {title}
          </h1>
          <p className='mt-4 text-lg text-gray-600'>{description}</p>
          {!limit && (
            <div className='relative mt-8 max-w-lg mx-auto'>
              <input
                type='text'
                placeholder='Search sessions, speakers, tags...'
                value={searchQuery}
                onChange={handleSearch}
                className='w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors'
              />
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400' />
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {talksToDisplay.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>

        {!limit && filteredTalks.length === 0 && (
          <div className='text-center mt-16'>
            <h3 className='text-2xl font-bold text-gray-800'>
              No results found
            </h3>
            <p className='text-gray-500 mt-2'>
              Try adjusting your search query.
            </p>
          </div>
        )}

        {showViewAllButton && (
          <div className='text-center mt-12'>
            <Link
              href={hubLink}
              className='inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md'
            >
              Go to the Content Hub to see all available content
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!limit && showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
}
