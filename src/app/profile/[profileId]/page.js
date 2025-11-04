import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import config from "@/config/website.json";
import ProfileDetail from '@/components/profiles/ProfileDetail';

export async function generateStaticParams() {
    const profilesDir = path.join(process.cwd(), 'src', 'config', 'profiles');
    try {
        const files = await fs.readdir(profilesDir);
        return files
            .filter(file => file.endsWith('.md'))
            .map(file => ({
                profileId: file.replace('.md', ''),
            }));
    } catch {
        return [];
    }
}

async function getProfileHistory(profileId) {
    const profileFilePath = path.join(process.cwd(), 'src', 'config', 'profiles', `${profileId}.md`);
    let baseProfile;
    try {
        const fileContents = await fs.readFile(profileFilePath, 'utf8');
        const { data, content } = matter(fileContents);
        baseProfile = { ...data, bio: content || data.bio };
    } catch {
        return null;
    }

    const history = [];
    const editionsDir = path.join(process.cwd(), 'src', 'config', 'editions');
    const years = (await fs.readdir(editionsDir)).map(file => file.replace('.json', ''));

    for (const year of years) {
        const yearData = { year, roles: new Set(), talks: [] };
        const editionConfig = JSON.parse(await fs.readFile(path.join(editionsDir, `${year}.json`), 'utf8'));

        yearData.editionName = editionConfig.name || `${config.general.event.name} ${year}`;
        yearData.editionDate = editionConfig.date || `${year}-01-01`;

        if (editionConfig.team?.includes(profileId)) {
            yearData.roles.add('Organizer');
        }

        if (editionConfig.coreTeam?.includes(profileId)) {
            yearData.roles.add('Core Organizer');
        }

        const talksDir = path.join(process.cwd(), 'src', 'config', 'talks', year);
        try {
            const talkFiles = await fs.readdir(talksDir);
            for (const talkFile of talkFiles.filter(f => f.endsWith('.md'))) {
                const talkContent = await fs.readFile(path.join(talksDir, talkFile), 'utf8');
                const { data: talkData, content: talkAbstract } = matter(talkContent);
                if (talkData.speakerIds?.includes(profileId)) {
                    yearData.roles.add('Speaker');
                    yearData.talks.push({
                        id: talkData.id || talkFile.replace('.md', ''),
                        title: talkData.title,
                        abstract: talkAbstract,
                        tags: talkData.tags || [],
                        type: talkData.type || 'talk',
                        video: talkData.video || '',
                        slide: talkData.slide || '',
                        year
                    });
                }
            }
        } catch {}

        if (yearData.roles.size > 0) {
            history.push({ ...yearData, roles: Array.from(yearData.roles) });
        }
    }

    history.sort((a, b) => b.year.localeCompare(a.year));
    return { ...baseProfile, history };
}

export async function generateMetadata({ params }) {
    const { profileId } = await params;
    const profile = await getProfileHistory(profileId);
    if (!profile) {
        return { title: "Profile Not Found" };
    }

    const siteUrl = config.general.event.website;
    const cleanBio = (profile.bio || '').replace(/(\r\n|\n|\r)/gm, " ").substring(0, 160);
    const imageUrl = profile.image.startsWith('http') ? profile.image : `${siteUrl}${profile.image}`;

    return {
        title: `${profile.name} - Cloud Native Days Italy`,
        description: `${cleanBio}...`,
        alternates: {
            canonical: `${siteUrl}/profile/${profile.id}`,
        },
        openGraph: {
            title: `${profile.name} - Cloud Native Days Italy`,
            description: `${cleanBio}...`,
            url: `${siteUrl}/profile/${profile.id}`,
            images: [
                {
                    url: imageUrl,
                    width: 400,
                    height: 400,
                    alt: profile.name,
                },
            ],
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${profile.name} - Cloud Native Days Italy`,
            description: `${cleanBio}...`,
            images: [imageUrl],
        },
    };
}

export default async function ProfilePage({ params }) {
    const { profileId } = await params;
    const profileData = await getProfileHistory(profileId);
    if (!profileData) notFound();

    const siteUrl = config.general.event.website;
    const imageUrl = profileData.image.startsWith('http') ? profileData.image : `${siteUrl}${profileData.image}`;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": profileData.name,
        "jobTitle": profileData.role,
        "image": imageUrl,
        "url": `${siteUrl}/profile/${profileData.id}`,
        "worksFor": profileData.company ? {
            "@type": "Organization",
            "name": profileData.company,
        } : undefined,
        "sameAs": [
            profileData.linkedin,
            profileData.github,
            profileData.website
        ].filter(Boolean),
        "description": (profileData.bio || '').replace(/(\r\n|\n|\r)/gm, " "),
        "performerIn": profileData.history
            .filter(e => e.roles.includes('Speaker'))
            .map(event => ({
                "@type": "Event",
                "name": event.editionName,
                "startDate": event.editionDate,
                "url": `${siteUrl}/${event.year}`
            })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
            <ProfileDetail profile={profileData} />
        </>
    );
}
