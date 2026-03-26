'use client';

import Link from "next/link";
import { Linkedin, Globe, Github, Award, Mic, FileText, ArrowRight } from "lucide-react";
import config from '@/config/website.json';
import C4P_Card from '@/components/actions/C4P_Card';
import TicketsCard from '@/components/actions/TicketsCard';

const SpeakerCard = ({ speaker }) => (
    <div className="group relative text-center bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
        <div className="p-8 flex-grow flex flex-col items-center">
            <div className="relative">
                <img
                    src={speaker.image || "/images/team/profile.webp"}
                    alt={speaker.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-white shadow-lg"
                />
                {speaker.isMC && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-purple-600 text-white h-10 w-10 flex items-center justify-center rounded-full shadow-md border-2 border-white" title={`Master of Ceremony for ${speaker.mcDay}`}>
                        <Mic size={20} />
                    </div>
                )}
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">{speaker.name}</h3>
            <p className="text-blue-600 font-medium mt-1 text-sm">{speaker.role}</p>

            {speaker.communityRole && (
                <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                        <Award className="h-4 w-4"/> {speaker.communityRole}
                    </span>
                </div>
            )}

            <div className="mt-auto pt-6 flex justify-center gap-5">
                {speaker.linkedin && <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>}
                {speaker.github && <a href={speaker.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="GitHub"><Github size={20} /></a>}
                {speaker.website && <a href={speaker.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="Website"><Globe size={20} /></a>}
            </div>
        </div>
        <div className="border-t border-gray-100 p-4">
            <Link href={`/profile/${speaker.id}`} className="block w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                View Profile
            </Link>
        </div>
    </div>
);

const SpeakersComingSoon = () => (
    <div className="mt-16">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800">Our First Speakers Will Be Announced Soon!</h2>
            <p className="mt-4 text-lg text-gray-600">
                The Call for Papers is currently in progress, and we are curating a diverse and inspiring lineup from the amazing submissions. Stay tuned as we begin to reveal the brilliant minds joining us for this edition.
            </p>
        </div>
        <div className="mt-12 container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <C4P_Card data={config.proposal} />
                <TicketsCard data={config.tickets} />
            </div>
        </div>
    </div>
);

export default function SpeakersList({ speakers }) {
    if (!speakers) return null;

    const displaySpeakers = speakers.filter((speaker) => speaker.name && !speaker.name.includes("TBA"));

    return (
        <div className="bg-gray-50 py-16 lg:py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter">
                        Meet the Experts
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        A group of passionate leaders, innovators, and experts from the cloud native world, ready to share their knowledge and inspire the community.
                    </p>
                </div>

                {displaySpeakers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16">
                        {displaySpeakers.map((speaker) => (
                            <SpeakerCard key={speaker.id} speaker={speaker} />
                        ))}
                    </div>
                ) : (
                    <SpeakersComingSoon />
                )}
            </div>
        </div>
    );
}
