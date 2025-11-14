import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import config from "@/config/website.json";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SponsorCard = ({ sponsor }) => {
    return (
        <div className="flex-grow-0 flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-4">
            <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center justify-center bg-white h-40 p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain transition-all duration-300"
                    />
                </div>
            </a>
        </div>
    );
};

const SponsorTierSection = ({ tier, sponsors }) => {
    if (!sponsors || sponsors.length === 0) return null;

    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 capitalize border-b pb-4 mb-8">
                {config.sponsors.tiers[tier]?.title || tier}
            </h2>
            <div className="flex flex-wrap justify-center items-center -m-4">
                {sponsors.map(sponsor => (
                    <SponsorCard key={sponsor.name} sponsor={sponsor} />
                ))}
            </div>
        </div>
    );
};

async function getSponsorsData() {
    try {
        const currentYear = config.general.edition.toString();
        const editionConfigPath = path.join(process.cwd(), 'src', 'config', 'editions', `${currentYear}.json`);
        const editionConfig = JSON.parse(await fs.readFile(editionConfigPath, 'utf8'));

        const sponsorsByIds = editionConfig.sponsors || {};
        const hydratedSponsors = {};

        for (const tier in sponsorsByIds) {
            const sponsorIds = sponsorsByIds[tier];
            let sponsorDetails = await Promise.all(
                sponsorIds.map(async (sponsorId) => {
                    const sponsorPath = path.join(process.cwd(), 'src', 'config', 'sponsors', `${sponsorId}.md`);
                    try {
                        const fileContents = await fs.readFile(sponsorPath, 'utf8');
                        return matter(fileContents).data;
                    } catch (error) {
                        return null;
                    }
                })
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
    const displayOrder = ['main', 'gold', 'silver', 'partner'];

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto max-w-7xl px-4 py-16 lg:py-24">
                <div className="text-center max-w-3xl mx-auto">
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                        Our Partners
                    </span>
                    <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter">
                        Thank You to Our Sponsors
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {config.sponsors.active.description}
                    </p>
                    <div className="mt-8">
                        <Link
                            href={config.sponsors.prospectus.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Become a Sponsor <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                <div className="mt-20">
                    {displayOrder.map(tier => (
                        <SponsorTierSection key={tier} tier={tier} sponsors={sponsorsByTier[tier]} />
                    ))}
                </div>

                <div id="become-a-sponsor" className="mt-16 bg-white p-8 lg:p-12 rounded-2xl shadow-lg border border-gray-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">{config.sponsors.become.title}</h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{config.sponsors.become.description}</p>
                        <div className="mt-8">
                            <a
                                href={config.sponsors.prospectus.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center justify-center text-center bg-gray-800 hover:bg-black text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                                {config.sponsors.prospectus.label}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
