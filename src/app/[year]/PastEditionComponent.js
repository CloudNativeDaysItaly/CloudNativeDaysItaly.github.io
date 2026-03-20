'use client';

import { MapPin, Mic, Search } from 'lucide-react';
import Metrics from "@/components/metrics/metrics";
import config from '@/config/website.json';
import PersonCard from '@/components/people/PersonCard';
import Sponsors from '@/components/sponsor/sponsor';
import ContentHub from '@/components/ContentHub/ContentHub';
import OpenStreetMapEmbed from '@/components/maps/OpenStreetMapEmbed';

export default function PastEditionComponent({ year, initialEventData }) {

    const speakersCount = initialEventData.speakers.length;
    const sponsorsCount = Object.values(initialEventData.sponsors).flat().length;
    const teamCount = initialEventData.team.length;
    const isCurrentEvent = false;

    return (
        <>
            <main className="bg-gray-50">
                <section className="relative bg-blue-600 text-white py-12 md:py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-down">{initialEventData.name}</h1>
                                <p className="text-lg sm:text-xl lg:text-2xl opacity-80 animate-fade-in-up">{initialEventData.description}</p>
                            </div>
                            {initialEventData.headerVideo && (
                                <div className="animate-fade-in-up">
                                    <iframe
                                        className="w-full aspect-video rounded-lg shadow-2xl"
                                        src={initialEventData.headerVideo}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <Metrics data={initialEventData.metrics} teamCount={teamCount} speakersCount={speakersCount} sponsorsCount={sponsorsCount} />

                <ContentHub
                    talks={initialEventData.talks}
                    title={`${year} Talks`}
                    description="Explore our schedule of talks, workshops, and networking opportunities."
                    limit={3}
                    showPagination={false}
                />

                <section id="speakers" className="bg-white py-12 lg:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">{year} Speakers</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {initialEventData.speakers
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((speaker, index) => (
                                    <PersonCard key={index} person={speaker} link={`/profile/${speaker.id}`} />
                                ))}
                        </div>
                    </div>
                </section>

                <section id="team" className="py-12 lg:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">{year} Team</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {initialEventData.team
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((member, index) => (
                                    <PersonCard key={index} person={member} link={`/profile/${member.id}`} />
                                ))}
                        </div>
                    </div>
                </section>

                <Sponsors
                    sponsorsByTier={initialEventData.sponsors}
                    tiersConfig={config.sponsors.tiers}
                    sectionsContent={config.sponsors}
                    order={['main', 'gold', 'silver', 'partner']}
                    isCurrent={isCurrentEvent}
                />

                <section className="bg-gray-800 text-white py-12 lg:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Event Location</h2>
                        <p className="text-xl sm:text-2xl">{initialEventData.location.name}, {initialEventData.location.city}</p>
                        {initialEventData.location.street && (
                            <p className="text-lg text-gray-300 mt-3">{initialEventData.location.street}</p>
                        )}
                        {initialEventData.location.image && (
                            <img src={initialEventData.location.image} alt={initialEventData.location.name} className="mt-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto" />
                        )}
                        <OpenStreetMapEmbed
                            mapLink={initialEventData.location.mapLink}
                            mapDirectionsUrl={initialEventData.location.mapDirectionsUrl}
                            rootClassName="mt-8 max-w-4xl mx-auto w-full"
                            iframeTitle={`Map — ${initialEventData.location.name} (OpenStreetMap)`}
                        />
                    </div>
                </section>

                {initialEventData.thankyou && (
                    <section className="py-12 bg-blue-50">
                        <div className="container mx-auto px-4 text-center">
                            <p className="text-xl sm:text-2xl text-gray-600 italic">
                                {initialEventData.thankyou}
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
