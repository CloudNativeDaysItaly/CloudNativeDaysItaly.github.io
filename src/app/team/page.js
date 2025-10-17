import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import config from '@/config/website.json';
import TeamList from '@/components/team/team';

export const metadata = {
    title: "Cloud Native Days Italy Team",
    description: "The Cloud Native Days Italy team is a group of passionate volunteers who work together to make the event possible. Come meet them, or apply to join the team!",
};

async function getTeamData() {
    try {
        const currentYear = config.general.edition.toString();
        const editionConfigPath = path.join(process.cwd(), 'src', 'config', 'editions', `${currentYear}.json`);
        const editionConfig = JSON.parse(await fs.readFile(editionConfigPath, 'utf8'));

        const orgIds = editionConfig.team || [];
        const coreIds = editionConfig.coreTeam || [];

        const teamIds = [...orgIds, ...coreIds];

        console.log(teamIds);
        const teamMembers = await Promise.all(
            teamIds.map(async (memberId) => {
                const profilePath = path.join(process.cwd(), 'src', 'config', 'profiles', `${memberId}.md`);
                try {
                    const fileContents = await fs.readFile(profilePath, 'utf8');
                    const { data, content } = matter(fileContents);
                    const memberLevel = coreIds.includes(memberId) ? 'core' : 'organizer';
                    return { ...data, level: memberLevel, bio: content || data.bio };
                } catch (error) {
                    console.error(`Error reading profile for team member: ${memberId}`, error);
                    return null;
                }
            })
        );

        const validMembers = teamMembers.filter(Boolean);
        validMembers.sort((a, b) => a.name.localeCompare(b.name));
        return validMembers;

    } catch (error) {
        console.error("Failed to load team data for the current edition:", error);
        return [];
    }
}

export default async function TeamPage() {
    const team = await getTeamData();

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Cloud Native Days Italy Team",
        "url": "https://cloudnativedaysitaly.org/team",
        "member": team.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": `${member.role} ${member.company && `@ ${member.company}`}`,
            "sameAs": [member.linkedin, member.github, member.website].filter(Boolean)
        }))
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
            <TeamList team={team} />
        </>
    );
}
