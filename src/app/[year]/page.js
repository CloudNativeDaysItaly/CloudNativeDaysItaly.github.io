import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import config from '@/config/website.json';
import PastEditionComponent from './PastEditionComponent';

async function getEventData(year) {
    try {
        const editionConfigPath = path.join(process.cwd(), 'src', 'config', 'editions', `${year}.json`);
        const editionConfig = JSON.parse(await fs.readFile(editionConfigPath, 'utf8'));

        const readMarkdownFile = async (filePath) => {
            try {
                const fileContents = await fs.readFile(filePath, 'utf8');
                const { data, content } = matter(fileContents);
                return { ...data, bio: content || data.bio };
            } catch {
                return null;
            }
        };

        const [speakers, coreTeam, team, talks] = await Promise.all([
            Promise.all(
                (editionConfig.speakers || []).map(id => readMarkdownFile(path.join(process.cwd(), 'src', 'config', 'profiles', `${id}.md`)))
            ),
            Promise.all(
                (editionConfig.coreTeam || []).map(id => readMarkdownFile(path.join(process.cwd(), 'src', 'config', 'profiles', `${id}.md`)))
            ),
            Promise.all(
                (editionConfig.team || []).map(id => readMarkdownFile(path.join(process.cwd(), 'src', 'config', 'profiles', `${id}.md`)))
            ),
            (async () => {
                try {
                    const talksDir = path.join(process.cwd(), 'src', 'config', 'talks', year);
                    const talkFiles = await fs.readdir(talksDir);
                    return Promise.all(
                        talkFiles.filter(f => f.endsWith('.md')).map(file => readMarkdownFile(path.join(talksDir, file)))
                    );
                } catch {
                    return [];
                }
            })()
        ]);

        const validSpeakers = speakers.filter(Boolean);
        const validTeam = team.filter(Boolean).map(m => ({...m, level: 'organizer' }));
        const validCoreTeam = coreTeam.filter(Boolean).map(m => ({...m, level: 'core' }));
        const validTalks = talks.filter(Boolean);


        const hydratedSponsors = {};
        const sponsorsByIds = editionConfig.sponsors || {};
        for (const tier in sponsorsByIds) {
            hydratedSponsors[tier] = (await Promise.all(
                sponsorsByIds[tier].map(id => readMarkdownFile(path.join(process.cwd(), 'src', 'config', 'sponsors', `${id}.md`)))
            )).filter(Boolean);
        }

        const hydratedTalks = validTalks.map(talk => {
            const speakerDetails = (talk.speakerIds || []).map(id =>
                validSpeakers.find(s => s.id === id)
            ).filter(Boolean);
            return { ...talk, speakers: speakerDetails };
        });

        return {
            ...editionConfig,
            speakers: validSpeakers,
            team: [...validTeam, ...validCoreTeam],
            sponsors: hydratedSponsors,
            talks: hydratedTalks,
            editionData: editionConfig
        };

    } catch (error) {
        console.error(`Error reading event data for year ${year}:`, error);
        return null;
    }
}

export async function generateStaticParams() {
    const yearsDirectory = path.join(process.cwd(), 'src', 'config', 'editions');
    try {
        const files = await fs.readdir(yearsDirectory);
        return files.map(file => ({ year: file.replace('.json', '') }));
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { year } = await params;
    const eventData = await getEventData(year);
    if (!eventData) return { title: "Edition Not Found" };

    const siteUrl = config.general.event.website;
    const title = eventData.name || `${config.general.event.name} ${year}`;
    const description = eventData.description || config.general.event.description;
    const imageUrl = `${siteUrl}${config.hero.image}`;

    return {
        title,
        description,
        alternates: { canonical: `${siteUrl}/${year}` },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/${year}`,
            images: [{ url: imageUrl, alt: title }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function YearPage({ params }) {
    const { year } = await params;
    const eventData = await getEventData(year);

    if (!eventData) {
        notFound();
    }

    const siteUrl = config.general.event.website;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": eventData.name,
        "startDate": eventData.editionData.date,
        "endDate": eventData.editionData.endDate || eventData.editionData.date,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
            "@type": "Place",
            "name": eventData.location.name,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": eventData.location.street,
                "addressLocality": eventData.location.city.split(',')[0].trim(),
                "addressCountry": "IT"
            }
        },
        "image": [`${siteUrl}${config.hero.image}`],
        "description": eventData.description,
        "organizer": {
            "@type": "Organization",
            "name": config.general.event.name,
            "url": siteUrl
        },
        "performer": eventData.speakers.map(speaker => ({
            "@type": "Person",
            "name": speaker.name,
            "url": `${siteUrl}/profile/${speaker.id}`
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <PastEditionComponent year={year} initialEventData={eventData} />
        </>
    );
}
