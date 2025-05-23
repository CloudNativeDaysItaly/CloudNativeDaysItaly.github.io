import Navbar from "@/components/navbar/navbar";
import Team from "@/components/team/team";
import Footer from "@/components/footer/footer";
import config from '@/config/website.json';


export const metadata = {
    title: "Cloud Native Days Italy Team",
    description: "The Cloud Native Days Italy team is a group of passionate volunteers who work together to make the event possible. Come meet them, or apply to join the team!",
}

export default function TeamPage() {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Cloud Native Days Italy Team",
        "url": "https://cloudnativedaysitaly.org/team",
        "member": config.team.members.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": `${member.position} ${member.company} ${member.communityRole}`,
            "sameAs": [member.linkedin, member.github, member.website].filter(Boolean)
        }))


    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(schemaData)}}
            />
            <Navbar
                data={config}
                additionalClassName="!bg-white"
                homepage="/"
            />

            <Team data={config}/>
            <Footer data={config}/>
        </>
    )
}
