import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import communityConfig from '@/config/community.json';
import generalConfig from '@/config/website.json';

const CommunityCard = ({ partner }) => {
  return (
    <div className='flex-grow-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-3'>
      <a
        href={partner.url}
        target='_blank'
        rel='noopener noreferrer'
        className='block group'
      >
        <div className='flex items-center justify-center bg-white h-28 p-4 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
          <img
            src={partner.logo}
            alt={partner.name}
            className='max-h-full max-w-full object-contain transition-all duration-300'
          />
        </div>
      </a>
    </div>
  );
};

const CommunityTierSection = ({
  tier,
  partners,
  config,
  uppercase = false,
  label,
  extraTopMargin = false,
}) => {
  if (!partners || partners.length === 0) return null;

  return (
    <div className={`mb-16 ${extraTopMargin ? 'mt-20' : ''}`}>
      {label && (
        <div className='text-center mb-2'>
          <span className='text-sm font-bold text-blue-600 uppercase tracking-wider'>
            {label}
          </span>
        </div>
      )}
      <h2
        className={`text-2xl font-bold text-center text-gray-800 border-b pb-4 mb-6 ${uppercase ? 'uppercase' : 'capitalize'}`}
      >
        {config.title}
      </h2>
      {config.description && (
        <p className='text-center text-gray-600 mb-8 max-w-2xl mx-auto'>
          {config.description}
        </p>
      )}
      <div className='flex flex-wrap justify-center items-center -m-3'>
        {partners.map((partner, index) => (
          <CommunityCard key={`${tier}-${index}`} partner={partner} />
        ))}
      </div>
    </div>
  );
};

async function getCommunityData() {
  try {
    const currentYear = generalConfig.general.edition.toString();
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

    const communitiesByIds = editionConfig.communities || {};
    const hydratedCommunities = {};

    for (const tier in communitiesByIds) {
      const partnerIds = communitiesByIds[tier];
      let partnerDetails = await Promise.all(
        partnerIds.map(async (partnerId) => {
          const partnerPath = path.join(
            process.cwd(),
            'src',
            'config',
            'communities',
            `${partnerId}.md`,
          );
          try {
            const fileContents = await fs.readFile(partnerPath, 'utf8');
            return matter(fileContents).data;
          } catch (error) {
            return null;
          }
        }),
      );

      partnerDetails = partnerDetails.filter(Boolean);
      hydratedCommunities[tier] = partnerDetails;
    }
    return hydratedCommunities;
  } catch (error) {
    return {};
  }
}

export const metadata = {
  title: `Partners - ${generalConfig.general.event.name}`,
  description: communityConfig.page.description,
};

export default async function PartnersPage() {
  const communitiesByTier = await getCommunityData();
  const displayOrder = ['community', 'opensource', 'media'];

  return (
    <div className='bg-gray-50'>
      <div className='container mx-auto max-w-7xl px-4 py-16 lg:py-24'>
        <div className='text-center max-w-3xl mx-auto'>
          <span className='text-sm font-bold text-blue-600 uppercase tracking-wider'>
            {communityConfig.page.label}
          </span>
          <h1 className='mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter'>
            {communityConfig.page.title}
          </h1>
          {Array.isArray(communityConfig.page.description) ? (
            communityConfig.page.description.map((p, i, arr) =>
              i === arr.length - 1 ? (
                <p key={i} className='mt-4 text-lg text-gray-600 font-semibold'>
                  {p}
                </p>
              ) : (
                <p key={i} className='mt-4 text-lg text-gray-600'>
                  {p}
                </p>
              ),
            )
          ) : (
            <p className='mt-4 text-lg text-gray-600'>
              {communityConfig.page.description}
            </p>
          )}
        </div>

        <div className='mt-20'>
          {displayOrder.map((tier, i) => (
            <CommunityTierSection
              key={tier}
              tier={tier}
              partners={communitiesByTier[tier]}
              config={communityConfig.tiers[tier]}
              uppercase={i < displayOrder.length - 1}
              label={
                tier === 'community'
                  ? 'Connect, live at the event!'
                  : tier === 'opensource'
                    ? 'Discover, live at the event!'
                    : tier === 'media'
                      ? 'Also supporting us'
                      : null
              }
              extraTopMargin={tier === 'media'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
