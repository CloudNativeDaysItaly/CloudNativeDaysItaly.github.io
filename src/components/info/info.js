'use client';

import { ArrowRight, Mic, Users, Wrench, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const getYouTubeEmbedUrl = (videoId) => {
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const FeatureCard = ({ icon, title, children }) => (
  <div className='text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
    <div className='inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-6 shadow-lg'>
      {icon}
    </div>
    <h3 className='text-xl font-bold text-gray-900 mb-2'>{title}</h3>
    <p className='text-gray-600'>{children}</p>
  </div>
);

const DayCard = ({ data }) => (
  <div className='bg-blue-600 rounded-2xl p-6 lg:px-10 lg:py-6 text-white shadow-sm hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
    <span className='text-lg font-bold uppercase tracking-wider text-blue-200'>
      {data.label}
    </span>
    <ul className='mt-3 space-y-2'>
      {data.bullets.map((b, i) => (
        <li key={i} className='flex items-center gap-2 text-lg text-white'>
          <span className='h-1.5 w-1.5 rounded-full bg-white/60 flex-shrink-0' />
          {b.bold ? <strong>{b.text}</strong> : b.text}
        </li>
      ))}
    </ul>
  </div>
);

const Info = ({ data }) => {
  if (!data) return null;

  const videoEmbedUrl = getYouTubeEmbedUrl(data.video?.id);

  return (
    <section className='relative bg-gray-50 py-20 lg:py-32 overflow-hidden'>
      <div className='absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2'>
        <div className='w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full filter blur-3xl opacity-50'></div>
      </div>
      <div className='absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2'>
        <div className='w-[40rem] h-[40rem] bg-gradient-to-bl from-green-50 to-cyan-50 rounded-full filter blur-3xl opacity-50'></div>
      </div>

      <div className='container mx-auto max-w-7xl px-4 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
          <div>
            <span className='text-sm font-bold text-blue-600 uppercase tracking-wider'>
              The Event
            </span>
            <h2 className='mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter leading-tight'>
              {data.title}
            </h2>
            <p className='mt-8 text-xl text-gray-600'>{data.description}</p>
            <p className='mt-5 text-gray-600'>{data.longDescription}</p>
            {data.CTA?.active && (
              <div className='mt-6'>
                <Link
                  href={data.CTA.url}
                  className='inline-flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors'
                >
                  {data.CTA.label} <ArrowRight className='h-5 w-5' />
                </Link>
              </div>
            )}
          </div>

          {videoEmbedUrl && (
            <div className='transform transition-transform duration-500 hover:scale-105'>
              <div className='bg-gray-800 rounded-2xl p-2 shadow-2xl shadow-gray-400/30'>
                <div className='bg-gray-900 rounded-lg p-1.5'>
                  <div className='aspect-video w-full'>
                    <iframe
                      className='w-full h-full rounded-md'
                      src={videoEmbedUrl}
                      title={data.video.title}
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {data.extra && (
          <div className='mt-20 lg:mt-28'>
            <div className='text-center'>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-800'>
                {data.extra.title}
              </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12'>
              <FeatureCard
                icon={<Mic size={36} />}
                title={data.extra.boxes.talks.title}
              >
                {data.extra.boxes.talks.description}
              </FeatureCard>
              <FeatureCard
                icon={<Users size={36} />}
                title={data.extra.boxes.networking.title}
              >
                {data.extra.boxes.networking.description}
              </FeatureCard>
              <FeatureCard
                icon={<Wrench size={36} />}
                title={data.extra.boxes.workshop.title}
              >
                {data.extra.boxes.workshop.description}
              </FeatureCard>
              <FeatureCard
                icon={<HeartHandshake size={36} />}
                title={data.extra.boxes.community.title}
              >
                {data.extra.boxes.community.description}
              </FeatureCard>
            </div>
          </div>
        )}

        {data.glance && (
          <div className='mt-20 lg:mt-28'>
            <div className='text-center mb-8'>
              <h3 className='text-xl font-semibold text-gray-900 uppercase tracking-wider'>
                {data.glance.label}
              </h3>
              <span className='text-sm font-bold text-blue-600 uppercase tracking-wider'>
                2 days, 2 areas
              </span>
            </div>

            {/* Griglia cards + video — stessa altezza */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 lg:items-stretch'>

              {/* Colonna sinistra — 2 days */}
              <div className='grid grid-cols-2 lg:grid-cols-1 gap-4'>
                <DayCard data={data.glance.days.day1} />
                <DayCard data={data.glance.days.day2} />
              </div>

              {/* Colonna destra — video */}
              <div className='relative aspect-square lg:aspect-auto w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm'>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className='w-full h-full object-cover'
                >
                  <source src={data.glance.areas.image} type='video/webm' />
                </video>
              </div>

            </div>

            {/* CTA sotto la griglia */}
            <div className='mt-6'>
              <Link
                href={data.glance.agendaCTA.url}
                className='inline-flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors'
              >
                {data.glance.agendaCTA.label} <ArrowRight className='h-5 w-5' />
              </Link>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Info;
