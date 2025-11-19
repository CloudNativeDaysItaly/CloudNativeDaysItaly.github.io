'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';

const CountdownUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter tabular-nums">
            {value.toString().padStart(2, '0')}
        </p>
        <span className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest mt-1">
            {label}
        </span>
    </div>
);

const Hero = ({ data }) => {
    if (!data) {
        return null;
    }

    const targetDate = data.countDown ? new Date(`${data.countDown}+02:00`).getTime() : null;

    const calculateTimeLeft = () => {
        if (!targetDate) return null;
        const difference = targetDate - new Date().getTime();
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!targetDate) return;
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const isCountdownActive = targetDate && timeLeft && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0);

    return (
        <section className="relative bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-transparent to-purple-900/50"></div>
            <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="font-extrabold tracking-tighter text-[clamp(2.25rem,1.5rem+3vw,2.75rem)] leading-[1.1]">
                            {data.title}
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mt-4 mb-2 tracking-tight">
                            {data.badgeDate} - {data.city}
                        </h2>
                        {isCountdownActive && timeLeft ? (
                            <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                <h2 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-4">The Next Edition Starts In</h2>
                                <div className="flex justify-center gap-4 sm:gap-8">
                                    <CountdownUnit value={timeLeft.days} label="Days" />
                                    <CountdownUnit value={timeLeft.hours} label="Hours" />
                                    <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                                    <CountdownUnit value={timeLeft.seconds} label="Seconds" />
                                </div>
                            </div>
                        ) : (
                            data.badgeDate && (
                                <span className="inline-block bg-blue-500/10 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                                    {data.badgeDate}
                                </span>
                            )
                        )}
                        <p className="mt-6 text-white/80 max-w-xl mx-auto lg:mx-0 text-[clamp(1rem,0.9rem+0.5vw,1.125rem)] leading-relaxed">
                            {data.description}
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link href={data.CTA.tickets.url} className="w-full sm:w-auto inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-transform duration-300 hover:scale-105">
                                {data.CTA.tickets.label}
                            </Link>
                            <Link href={data.CTA.sponsor.url} className="w-full sm:w-auto inline-block text-center bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                                {data.CTA.sponsor.label}
                            </Link>
                        </div>
                    </div>
                    <div className="mt-12 lg:mt-0">
                        <Image
                            src={data.image}
                            alt="Cloud Native Days Italy Team"
                            width={600}
                            height={600}
                            priority
                            className="rounded-2xl shadow-2xl shadow-blue-900/50"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
