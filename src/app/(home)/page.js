import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Hero from '@/components/hero/hero';
import Info from '@/components/info/info';
import WhatToExpect from '@/components/info/WhatToExpect';
import PhotoStrip from '@/components/info/PhotoStrip';
import ThemeSection from '@/components/theme/ThemeSection';
import CfpSection from '@/components/actions/CfpSection';
import AgendaGlance from '@/components/agenda/AgendaGlance';
import TicketsSection from '@/components/tickets/TicketsSection';
import Sponsors from '@/components/sponsor/sponsor';
import Metrics from '@/components/metrics/metrics';
import CommunityStrip from '@/components/community/CommunityStrip';
import FaqTeaser from '@/components/faq/FaqTeaser';
import config from '@/config/website.json';
import faqConfig from '@/config/faq.json';
import agendaConfig from '@/config/agenda.json';
import Venue from '@/components/venue/venue';
import { formatAgendaDateRange, getAgendaDateBounds } from '@/lib/agendaDate';

// Communities e progetti OS presenti all'evento, per la strip in home
// (wireframe: 11-community-partners). I md vivono in config/communities.
async function getEventCommunities(edition) {
  const groups = ['community', 'opensource'];
  const ids = groups.flatMap((group) => edition.communities?.[group] || []);
  const partners = await Promise.all(
    ids.map(async (id) => {
      try {
        const filePath = path.join(
          process.cwd(),
          'src',
          'config',
          'communities',
          `${id}.md`,
        );
        return matter(await fs.readFile(filePath, 'utf8')).data;
      } catch {
        return null;
      }
    }),
  );
  return partners.filter(Boolean);
}

// Statistiche dell'edizione precedente per la banda numeri sotto il hero
// (wireframe: 02-numbers-strip). Communities & OS projects e media partner
// sono conteggiati separatamente.
async function getPreviousEditionStats(year) {
  try {
    const editionPath = path.join(
      process.cwd(),
      'src',
      'config',
      'editions',
      `${year}.json`,
    );
    const edition = JSON.parse(await fs.readFile(editionPath, 'utf8'));
    const communities = edition.communities || {};
    return {
      attendees: edition.metrics?.attendees,
      speakers: (edition.speakers || []).length,
      sponsors:
        edition.metrics?.sponsors ??
        Object.values(edition.sponsors || {}).flat().length,
      communitiesAndOs:
        (communities.community || []).length +
        (communities.opensource || []).length,
      mediaPartners: (communities.media || []).length,
    };
  } catch {
    return null;
  }
}

async function getSponsorsData() {
  try {
    const currentEdition = config.general.edition.toString();
    const editionConfigPath = path.join(
      process.cwd(),
      'src',
      'config',
      'editions',
      `${currentEdition}.json`,
    );
    const editionConfig = JSON.parse(
      await fs.readFile(editionConfigPath, 'utf8'),
    );

    const sponsorsByIds = editionConfig.sponsors || {};
    const hydratedSponsors = {};

    for (const tier in sponsorsByIds) {
      const sponsorIds = sponsorsByIds[tier];
      hydratedSponsors[tier] = await Promise.all(
        sponsorIds.map(async (sponsorId) => {
          const sponsorPath = path.join(
            process.cwd(),
            'src',
            'config',
            'sponsors',
            `${sponsorId}.md`,
          );
          try {
            const fileContents = await fs.readFile(sponsorPath, 'utf8');
            return matter(fileContents).data;
          } catch (error) {
            console.error(`Error reading sponsor file: ${sponsorId}.md`, error);
            return null;
          }
        }),
      );
      hydratedSponsors[tier] = hydratedSponsors[tier].filter(Boolean);
    }
    return hydratedSponsors;
  } catch (error) {
    console.error('Failed to load sponsors data:', error);
    return {};
  }
}

async function getCurrentEdition() {
  const currentEdition = config.general.edition.toString();
  const editionConfigPath = path.join(
    process.cwd(),
    'src',
    'config',
    'editions',
    `${currentEdition}.json`,
  );
  const editionConfig = JSON.parse(
    await fs.readFile(editionConfigPath, 'utf8'),
  );
  return editionConfig;
}

export async function generateMetadata() {
  const siteUrl = config.general.event.website;
  const eventName = `${config.general.event.name} ${config.general.edition}`;
  const description = config.general.event.description;
  const imageUrl = `${siteUrl}${config.hero.image}`;

  return {
    title: eventName,
    description: description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: eventName,
      description: description,
      url: siteUrl,
      images: [{ url: imageUrl, alt: eventName }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: eventName,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function HomePage() {
  const sponsorsData = await getSponsorsData();
  const currentEdition = await getCurrentEdition();
  const previousYear = config.general.edition - 1;
  const previousStats = await getPreviousEditionStats(previousYear);
  const eventCommunities = await getEventCommunities(currentEdition);
  const faqTeaserQuestions = (faqConfig.faq?.items || []).slice(0, 4);
  const siteUrl = config.general.event.website;
  const agendaDateRange = formatAgendaDateRange(agendaConfig.days);
  const agendaDateBounds = getAgendaDateBounds(agendaConfig.days);
  const firstAgendaDate = agendaDateBounds?.startDate;
  const countdownTime = config.hero.countDown?.split('T')[1];
  const heroData = {
    ...config.hero,
    badgeDate: agendaDateRange || config.hero.badgeDate,
    countDown: firstAgendaDate && countdownTime
      ? `${firstAgendaDate}T${countdownTime}`
      : config.hero.countDown,
  };

  const convertToISOWithTimezone = (dateString) => {
    const date = new Date(dateString);
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.abs(offsetMinutes / 60);
    const sign = offsetMinutes > 0 ? '-' : '+';
    const formattedOffset = `${sign}${String(Math.floor(offsetHours)).padStart(2, '0')}:00`;
    return `${date.toISOString().split('Z')[0]}${formattedOffset}`;
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name:
      currentEdition.name ||
      `${config.general.event.name} ${config.general.edition}`,
    startDate: agendaDateBounds?.startDate || currentEdition.date,
    ...(agendaDateBounds && { endDate: agendaDateBounds.endDate }),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: currentEdition.location?.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: currentEdition.location?.street,
        addressLocality: currentEdition.location?.city.split(',')[0],
        addressCountry: 'IT',
      },
    },
    image: [`${siteUrl}${config.hero.image}`],
    description: config.general.event.description,
    organizer: {
      '@type': 'Organization',
      name: config.general.event.name,
      url: siteUrl,
    },
    offers: config.tickets.type.map((ticket) => ({
      '@type': 'Offer',
      url: config.tickets.link,
      price: ticket.price.split('€')[0].trim(),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: convertToISOWithTimezone(ticket.salesStartDate),
      validThrough: convertToISOWithTimezone(ticket.salesEndDate),
    })),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Hero data={heroData} />
      {previousStats && (
        <Metrics
          items={[
            { value: previousStats.attendees, label: `Attendees ${previousYear}`, accent: 'text-brand-yellow' },
            { value: previousStats.speakers, label: 'Speakers', accent: 'text-brand-magenta' },
            { value: previousStats.sponsors, label: 'Sponsors', accent: 'text-brand-blue' },
            { value: previousStats.communitiesAndOs, label: 'Communities & OS Projects', accent: 'text-brand-yellow' },
            { value: previousStats.mediaPartners, label: 'Media Partners', accent: 'text-brand-magenta' },
          ]}
        />
      )}
      <Info data={config.info} />
      <PhotoStrip data={config.info.photoStrip} />
      <ThemeSection data={config.theme} />
      <WhatToExpect data={config.info.extra} />
      <CfpSection data={config.proposal} />
      <AgendaGlance data={config.agendaGlance} />
      <TicketsSection data={config.tickets} />

      <Sponsors
        sponsorsByTier={sponsorsData}
        tiersConfig={config.sponsors.tiers}
        sectionsContent={config.sponsors}
        order={['main', 'platinum', 'gold', 'silver', 'smart', 'workshop', 'techPartner', 'partner']}
        isCurrent={true}
      />

      <Venue data={currentEdition.location} />
      <CommunityStrip partners={eventCommunities} />
      <FaqTeaser questions={faqTeaserQuestions} newsletter={config.newsletter} />
    </>
  );
}
