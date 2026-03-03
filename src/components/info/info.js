'use client';

import { ArrowRight, Mic, Users, Wrench } from 'lucide-react';
import Link from 'next/link';

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
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Info;
