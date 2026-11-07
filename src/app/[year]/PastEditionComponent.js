'use client';

import { MapPin } from 'lucide-react';
import Metrics from '@/components/metrics/metrics';
import config from '@/config/website.json';
import communityConfig from '@/config/community.json';
import PersonCard from '@/components/people/PersonCard';
import Sponsors from '@/components/sponsor/sponsor';
import ContentHub from '@/components/ContentHub/ContentHub';
import OpenStreetMapEmbed from '@/components/maps/OpenStreetMapEmbed';
import TransparencyReport from '@/components/transparency/TransparencyReport';

// Griglia loghi community/open source/media partner di un'edizione passata
const CommunityTierSection = ({ tierKey, partners }) => {
  if (!partners || partners.length === 0) return null;
  const tierConfig = communityConfig.tiers[tierKey] || { title: tierKey };
  return (
    <div className='mb-12'>
      <h3 className='font-display text-stamp uppercase text-ink mb-6'>
        {tierConfig.title}
      </h3>
      <div className='grid grid-cols-2 gap-3 [&>:only-child]:col-span-2 [&>:only-child]:justify-self-center [&>:only-child]:w-[200px] sm:flex sm:flex-wrap sm:gap-4 sm:[&>:only-child]:w-[160px]'>
        {partners
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-[70px] w-full items-center justify-center border-pop border-ink bg-white transition-all duration-100 hover:shadow-pop-sm sm:h-[80px] sm:w-[160px]'
            >
              <img
                src={partner.logo}
                alt={partner.name}
                loading='lazy'
                style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain' }}
              />
            </a>
          ))}
      </div>
    </div>
  );
};

export default function PastEditionComponent({ year, initialEventData }) {
  const speakersCount = initialEventData.speakers.length;
  const sponsorsCount =
    initialEventData.metrics?.sponsors ??
    Object.values(initialEventData.sponsors).flat().length;
  const teamCount = initialEventData.team.length;
  const isCurrentEvent = false;

  return (
    <>
      <main className='bg-white'>
        <section className='relative bg-brand-blue text-white py-12 md:py-16 overflow-hidden'>
          <div className='absolute inset-0 bg-black opacity-20'></div>
          <div className='container mx-auto px-4 relative z-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
              <div className='text-center md:text-left'>
                <span className='stamp mb-6'>From the archive</span>
                <h1 className='mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-down'>
                  {initialEventData.name}
                </h1>
                <p className='text-lg sm:text-xl lg:text-2xl opacity-80 animate-fade-in-up'>
                  {initialEventData.description}
                </p>
              </div>
              {initialEventData.headerVideo && (
                <div className='animate-fade-in-up'>
                  <iframe
                    className='w-full aspect-video border-pop border-ink'
                    src={initialEventData.headerVideo}
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </section>

        <Metrics
          data={initialEventData.metrics}
          teamCount={teamCount}
          speakersCount={speakersCount}
          sponsorsCount={sponsorsCount}
        />

        <TransparencyReport report={initialEventData.transparencyReport} year={year} />

        <ContentHub
          talks={initialEventData.talks}
          title={`${year} Talks`}
          description='Explore our schedule of talks, workshops, and networking opportunities.'
          limit={3}
          showPagination={false}
        />

        <section id='speakers' className='bg-white py-12 lg:py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='section-heading mb-12'>
              {year} Speakers
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'>
              {initialEventData.speakers
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((speaker, index) => (
                  <PersonCard
                    key={index}
                    person={speaker}
                    link={`/profile/${speaker.id}`}
                  />
                ))}
            </div>
          </div>
        </section>

        <section id='team' className='py-12 lg:py-16'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='section-heading mb-12'>
              {year} Team
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'>
              {initialEventData.team
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((member, index) => (
                  <PersonCard
                    key={index}
                    person={member}
                    link={`/profile/${member.id}`}
                  />
                ))}
            </div>
          </div>
        </section>

        <Sponsors
          sponsorsByTier={initialEventData.sponsors}
          tiersConfig={config.sponsors.tiers}
          sectionsContent={config.sponsors}
          order={[
            'main',
            'platinum',
            'gold',
            'silver',
            'smart',
            'workshop',
            'techPartner',
            'partner',
          ]}
          isCurrent={isCurrentEvent}
        />

        {initialEventData.communities &&
          Object.values(initialEventData.communities).flat().length > 0 && (
            <section
              id='partners'
              className='border-t-2 border-ink bg-white py-12 lg:py-16'
            >
              <div className='mx-auto max-w-[1200px] px-6'>
                <h2 className='section-heading mb-12'>
                  {year} Communities & Partners
                </h2>
                {['community', 'opensource', 'media'].map((tierKey) => (
                  <CommunityTierSection
                    key={tierKey}
                    tierKey={tierKey}
                    partners={initialEventData.communities[tierKey]}
                  />
                ))}
              </div>
            </section>
          )}

        <section className='bg-ink text-white py-12 lg:py-16'>
          <div className='container mx-auto px-4 text-center'>
            <MapPin className='h-12 w-12 mx-auto mb-4 text-brand-yellow' />
            <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
              Event Location
            </h2>
            <p className='text-xl sm:text-2xl'>
              {initialEventData.location.name}, {initialEventData.location.city}
            </p>
            {initialEventData.location.street && (
              <p className='text-lg text-white/70 mt-3'>
                {initialEventData.location.street}
              </p>
            )}
            {initialEventData.location.image && (
              <img
                src={initialEventData.location.image}
                alt={initialEventData.location.name}
                className='mt-8 border-pop border-white w-full max-w-4xl mx-auto'
              />
            )}
            <OpenStreetMapEmbed
              mapLink={initialEventData.location.mapLink}
              mapDirectionsUrl={initialEventData.location.mapDirectionsUrl}
              rootClassName='mt-8 max-w-4xl mx-auto w-full'
              iframeTitle={`Map: ${initialEventData.location.name} (OpenStreetMap)`}
            />
          </div>
        </section>

        {initialEventData.thankyou && (
          <section className='py-12 bg-blue-50'>
            <div className='container mx-auto px-4 text-center'>
              <p className='text-xl sm:text-2xl text-ink-muted italic'>
                {initialEventData.thankyou}
              </p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
