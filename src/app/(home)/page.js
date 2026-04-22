import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Hero from '@/components/hero/hero';
import Info from '@/components/info/info';
import ActionsSection from '@/components/actions/ActionsSection';
import Sponsors from '@/components/sponsor/sponsor';
import config from '@/config/website.json';
import Venue from '@/components/venue/venue';

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
  const siteUrl = config.general.event.website;

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
    startDate: currentEdition.date,
    endDate: currentEdition.endDate || currentEdition.date,
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
      <Hero data={config.hero} />
      <Info data={config.info} />
      <ActionsSection
        data={{ c4p: config.proposal, tickets: config.tickets }}
      />

      <Sponsors
        sponsorsByTier={sponsorsData}
        tiersConfig={config.sponsors.tiers}
        sectionsContent={config.sponsors}
        order={['main', 'gold', 'silver', 'smart', 'workshop', 'partner']}
        isCurrent={true}
      />

      <Venue data={currentEdition.location} />
    </>
  );
}
