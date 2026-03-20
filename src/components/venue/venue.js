'use client';

import { MapPin } from 'lucide-react';
import Image from 'next/image';
import OpenStreetMapEmbed from '@/components/maps/OpenStreetMapEmbed';

const Venue = ({ data }) => {
    if (!data) return null;

    return (
        <section className="relative bg-gray-900 text-white py-20 lg:py-32">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="container mx-auto max-w-7xl px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                            Location
                        </span>
                        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tighter leading-tight">
                            {data.name}
                        </h2>
                        <div className="mt-6 flex items-start gap-4">
                            <MapPin className="h-8 w-8 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xl text-white/90 font-semibold">{data.street}</p>
                                <p className="text-lg text-white/70">{data.city}</p>
                            </div>
                        </div>

                        <OpenStreetMapEmbed
                            mapLink={data.mapLink}
                            mapDirectionsUrl={data.mapDirectionsUrl}
                            rootClassName="mt-8"
                        />
                    </div>

                    <div className="relative h-[500px] hidden lg:block">
                        <Image
                            src={data.image}
                            alt={data.name}
                            fill
                            className="object-cover rounded-2xl shadow-2xl shadow-blue-900/50 transform transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Venue;
