import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import DecorLayer from '@/components/decor/DecorLayer';
import config from '@/config/website.json';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BecomeSponsorBox from '@/components/sponsor/BecomeSponsorBox';

const SPONSOR_SIZE_CLASSES = {
  lg: {
    wrapper: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-4',
    card: 'h-40 p-6',
  },
  md: {
    wrapper: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-4',
    card: 'h-28 p-4',
  },
  sm: {
    wrapper: 'basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 p-4',
    card: 'h-20 p-3',
  },
};

const SponsorCard = ({ sponsor, size = 'lg' }) => {
  const { wrapper, card } =
    SPONSOR_SIZE_CLASSES[size] || SPONSOR_SIZE_CLASSES.lg;
  return (
    <div className={`flex-grow-0 flex-shrink-0 ${wrapper}`}>
      <a
        href={sponsor.url}
        target='_blank'
        rel='noopener noreferrer'
        className='block group'
      >
        <div
          className={`flex items-center justify-center bg-white ${card} border-pop border-ink transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop`}
        >
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className='max-h-full max-w-full object-contain transition-all duration-300'
          />
        </div>
      </a>
    </div>
  );
};

const SponsorTierSection = ({ tier, sponsors }) => {
  if (!sponsors || sponsors.length === 0) return null;

  const tierConfig = config.sponsors.tiers[tier];
  const size = tierConfig?.logoSize || 'lg';

  return (
    <div className='mb-16'>
      <h2 className='font-display text-2xl uppercase text-ink border-b-2 border-ink pb-4 mb-8'>
        {tierConfig?.title || tier}
      </h2>
      <div className='flex flex-wrap justify-center items-center -m-4'>
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} size={size} />
        ))}
      </div>
    </div>
  );
};

async function getSponsorsData() {
  try {
    const currentYear = config.general.edition.toString();
    const editionConfigPath = path.join(
      process.cwd(),
      'src',
      'config',
      'editions',
      `${currentYear}.json`,
    );
    const editionConfig = JSON.parse(
      await fs.readFile(editionConfigPath, 'utf8'),
    );

    const sponsorsByIds = editionConfig.sponsors || {};
    const hydratedSponsors = {};

    for (const tier in sponsorsByIds) {
      const sponsorIds = sponsorsByIds[tier];
      let sponsorDetails = await Promise.all(
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
            return null;
          }
        }),
      );

      sponsorDetails = sponsorDetails.filter(Boolean);
      sponsorDetails.sort((a, b) => a.name.localeCompare(b.name));
      hydratedSponsors[tier] = sponsorDetails;
    }
    return hydratedSponsors;
  } catch (error) {
    return {};
  }
}

export const metadata = {
  title: `Sponsors - ${config.general.event.name}`,
  description: `The companies and communities that make ${config.general.event.name} possible.`,
};

export default async function SponsorsPage() {
  const sponsorsByTier = await getSponsorsData();
  const displayOrder = [
    'main',
    'platinum',
    'gold',
    'silver',
    'smart',
    'workshop',
    'techPartner',
    'partner',
  ];

  return (
    <div className='relative overflow-hidden bg-white'>
      <DecorLayer
        items={[
          { pattern: 'cluster-c', position: 'top-right', size: 'lg' },
          { pattern: 'halftone', position: 'top-left', size: 'lg', className: 'opacity-25' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24'>
        <div className='max-w-3xl'>
          <span className='stamp'>They make it possible</span>
          <h1 className='section-heading mt-6'>
            Thank You to Our Sponsors
          </h1>
          <p className='mt-4 text-lg text-ink-muted'>
            {config.sponsors.active.description}
          </p>
          <div className='mt-8'>
            {config.sponsors.become?.active ? (
              <Link
                href={config.sponsors.prospectus.url}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-pop btn-pop-primary group inline-flex items-center justify-center'
              >
                Become a Sponsor{' '}
                <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
              </Link>
            ) : (
              <a
                href={`mailto:${config.sponsors.contactEmail}`}
                className='btn-pop btn-pop-primary group inline-flex items-center justify-center'
              >
                Contact Us{' '}
                <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
              </a>
            )}
          </div>
        </div>

        <div className='mt-20'>
          {displayOrder.map((tier) => (
            <SponsorTierSection
              key={tier}
              tier={tier}
              sponsors={sponsorsByTier[tier]}
            />
          ))}
        </div>

        <BecomeSponsorBox
          content={config.sponsors}
          contactEmail={config.sponsors.contactEmail}
          className='mt-16'
        />

        {config.sponsors.transparencyNote && (
          // Card a griglia: bianca, tutta cliccabile, si solleva in hover
          // (regola del brand kit). Più stretta e staccata dalla card gialla.
          <Link
            href={config.sponsors.transparencyNote.url}
            className='card-pop group mx-auto mt-16 flex max-w-3xl flex-col items-start gap-4 bg-white p-8 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop sm:flex-row sm:items-center sm:justify-between'
          >
            <span className='font-display text-2xl uppercase text-ink'>
              {config.sponsors.transparencyNote.text}
            </span>
            <span className='inline-flex items-center whitespace-nowrap text-sm font-bold uppercase tracking-wide text-ink group-hover:text-brand-magenta'>
              {config.sponsors.transparencyNote.label}
              <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
