'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, Mic, Linkedin, Github, Globe, ArrowRight, Link as LinkIcon, ChevronDown, ChevronUp, Wrench, Youtube, FileText } from 'lucide-react';

const TalkTimelineCard = ({ talk }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const typeDetails = {
        talk: {
            icon: <Mic className="h-4 w-4" />,
            label: 'Talk',
            style: 'bg-green-100 text-green-800',
        },
        workshop: {
            icon: <Wrench className="h-4 w-4" />,
            label: 'Workshop',
            style: 'bg-purple-100 text-purple-800',
        },
    };

    const currentType = typeDetails[talk.type] || typeDetails.talk;

    const tagColorMap = {
        'ENG': 'bg-blue-100 text-blue-800',
        'ITA': 'bg-green-100 text-green-800',
        'SPONSORED': 'bg-yellow-100 text-yellow-800',
        'default': 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${currentType.style}`}>
                    {currentType.icon}
                    {currentType.label}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    {talk.tags?.map(tag => (
                        <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColorMap[tag] || tagColorMap.default}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <h4 className="font-semibold text-lg text-gray-800">{talk.title}</h4>

            <p className={`text-sm text-gray-600 mt-2 transition-all duration-300 whitespace-pre-line ${!isExpanded && 'line-clamp-3'}`}>
                {talk.abstract}
            </p>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 font-semibold hover:text-gray-800"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <Link href={`/talk/${talk.id}`} className="flex items-center gap-3 sm:gap-4 text-sm text-blue-600 font-semibold group">
                    {talk.video && (
                        <Youtube className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" title="Video available" />
                    )}
                    {talk.slide && (
                        <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" title="Slides available" />
                    )}
                    <span className="inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Session <ArrowRight className="h-4 w-4" />
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default function ProfileDetail({ profile }) {
    const roleColors = {
        'Core Organizer': 'bg-red-600 text-white',
        'Organizer': 'bg-blue-100 text-blue-800',
        'Speaker': 'bg-green-100 text-green-800',
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-7xl px-4 py-12 lg:py-20">
                <div className="lg:flex lg:gap-12">
                    <aside className="lg:w-1/3 lg:sticky lg:top-24 self-start mb-12 lg:mb-0">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-6 ring-4 ring-blue-100 object-cover"
                            />
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                            <p className="text-base sm:text-lg text-blue-600 font-medium mt-1">{profile.role} @{profile.company}</p>
                            {profile.communityRole && (
                                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                                    <p className="text-sm font-medium">{profile.communityRole}</p>
                                </div>
                            )}
                            <div className="flex justify-center gap-5 mt-6">
                                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin /></a>}
                                {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Github /></a>}
                                {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><Globe /></a>}
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 mt-6 pt-6 border-t border-gray-100 text-left whitespace-pre-line">{profile.bio}</p>
                        </div>
                    </aside>

                    <main className="lg:w-2/3">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Community Contributions</h2>
                        {profile.history.length > 0 ? (
                            <div className="space-y-12">
                                {profile.history.map((yearEntry) => (
                                    <div key={yearEntry.year} className="relative pl-6 sm:pl-8 border-l-2 border-gray-200">
                                        <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                                        <Link href={`/${yearEntry.year}`} className="group inline-flex items-center gap-2">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Edition {yearEntry.year}</h3>
                                            <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </Link>
                                        <div className="flex flex-wrap gap-2 my-4">
                                            {yearEntry.roles.map(role => (
                                                <span key={role} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${roleColors[role]}`}>
                                                    <Award className="h-4 w-4"/> {role}
                                                </span>
                                            ))}
                                        </div>
                                        {yearEntry.talks.length > 0 && (
                                            <div className="space-y-4 mt-6">
                                                {yearEntry.talks.map(talk => (
                                                    <TalkTimelineCard key={talk.id} talk={talk} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                                <p className="text-gray-600">No community contributions found for this person yet.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
