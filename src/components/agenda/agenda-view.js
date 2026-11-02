'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Link from 'next/link';
import clsx from 'clsx';
import { Clock, MapPin, Coffee, Utensils, Mic, Users, Wrench, Star, Zap, Gem, Rocket, Sunset, Pizza } from 'lucide-react';
import DecorLayer from '@/components/decor/DecorLayer';
import { formatAgendaDateRange } from '@/lib/agendaDate';

const PlaceholderCard = () => (
    <div className="min-h-[150px] border-2 border-dashed border-ink/20 h-full" />
);

import { SESSION_TYPE_STYLES, SESSION_TYPE_ICONS } from './sessionTypes';
import { speakerMetaText } from '@/lib/speakerMeta';

const SessionCard = ({ session, tracks }) => {
    if (session.type === 'break') {
        const BREAK_ICONS = [
            [/coffee/, Coffee],
            [/lunch/, Utensils],
            [/networking/, Users],
            [/welcome/, Rocket],
            [/aperitivo/, Pizza],
            [/closing/, Sunset],
            [/sponsor keynote|platinum/, Gem],
        ];
        const Icon = (BREAK_ICONS.find(([re]) => re.test(session.title?.toLowerCase() || '')) || [null, Clock])[1];
        return (
            <div className="bg-cream border-pop border-ink p-4 text-center h-full flex items-center justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Icon className="h-5 w-5 text-brand-magenta" />
                    <h3 className="font-display text-lg uppercase text-ink">{session.title}</h3>
                </div>
            </div>
        );
    }
    if (!session.details) return null;
    const track = tracks.find(t => t.id === session.trackId);
    const TypeIcon = SESSION_TYPE_ICONS[session.details.type] || Mic;
    return (
        <Link href={`/talk/${session.details.id}`} className="card-pop block p-4 sm:p-6 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop h-full flex flex-col">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                <span className={clsx("inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 border border-ink uppercase", SESSION_TYPE_STYLES[session.details.type] || SESSION_TYPE_STYLES.talk)}>
                    <TypeIcon size={12}/> {session.details.type || 'talk'}
                </span>
                <div className="flex items-center gap-2">
                    {session.details.tags?.map(tag => <span key={tag} className="text-xs font-bold px-2 py-1 border border-ink bg-white text-ink">{tag}</span>)}
                </div>
            </div>
            <h3 className="font-bold text-ink flex-grow">{session.details.title}</h3>
            <div className="block md:hidden text-sm text-ink-muted mt-2 flex items-center gap-2"><MapPin size={14}/> {track?.room || 'Main Stage'}</div>
            <div className="mt-4 pt-4 border-t border-ink/20 flex flex-col gap-3">
                {session.details.speakers.map(speaker => (
                    <div key={speaker.id} className="flex items-center gap-3 group">
                        <img src={speaker.image} alt={speaker.name} className="w-8 h-8 rounded-full object-cover border border-ink" />
                        <div>
                            <p className="font-semibold text-sm text-ink group-hover:text-brand-blue">{speaker.name}</p>
                            <p className="text-xs text-ink-muted">{speakerMetaText(speaker, { max: 2 })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Link>
    );
};

export default function AgendaView({ agenda }) {
    const [selectedDayId, setSelectedDayId] = useState(agenda.days[0].id);
    const agendaDateRange = formatAgendaDateRange(agenda.days);

    const schedule = agenda.schedule[selectedDayId] || [];
    const allTracks = agenda.tracks || [];

    const usedTrackIds = new Set(schedule.flatMap(slot => slot.sessions.map(s => s.trackId)).filter(Boolean));
    const dayTracks = allTracks.filter(t => usedTrackIds.has(t.id));
    const numDayTracks = dayTracks.length;

    const getGridColsClass = (count) => {
        const classMap = {
            1: 'grid-cols-[100px_1fr]',
            2: 'grid-cols-[100px_1fr_1fr]',
            3: 'grid-cols-[100px_1fr_1fr_1fr]',
            4: 'grid-cols-[100px_1fr_1fr_1fr_1fr]',
        };
        return classMap[count] || `grid-cols-[100px_repeat(${count},_1fr)]`;
    };

    const gridClass = getGridColsClass(numDayTracks);

    return (
        <div className="relative overflow-hidden bg-white">
            <DecorLayer
                items={[
                    { pattern: 'cluster-duo', position: 'top-right', size: 'md' },
                    { pattern: 'cluster-a', position: 'bottom-left', size: 'md' },
                    { pattern: 'halftone-b', position: 'top-left', size: 'lg', className: 'opacity-25' },
                ]}
            />
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
                <div className="max-w-3xl">
                    {agendaDateRange && <span className="stamp">{agendaDateRange}</span>}
                    <h1 className="section-heading mt-6">Agenda</h1>
                    <p className="mt-4 text-lg text-ink-muted">
                        Explore our schedule of talks, workshops, and networking opportunities. Select a day to view the detailed timeline.
                    </p>
                </div>

                <div className="mt-12 flex gap-2 sm:gap-4 bg-white py-2 max-w-md sticky top-20 z-20">
                    {agenda.days.map(day => (
                        <button key={day.id} onClick={() => setSelectedDayId(day.id)} className={clsx("w-full text-center px-4 py-2.5 border-pop border-ink font-bold uppercase transition-colors duration-100", selectedDayId === day.id ? 'bg-brand-yellow text-ink shadow-pop-sm' : 'bg-white text-ink-muted hover:bg-brand-yellow-light')}>
                            <span className="block text-base">{day.name}</span>
                            <span className="block text-xs font-normal">{format(parseISO(day.date), 'MMMM do', { locale: enUS })}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-16">
                    {numDayTracks > 1 && (
                        <div className={clsx("hidden md:grid gap-6 mb-4 sticky top-40 z-10 bg-white/80 backdrop-blur-sm py-4", gridClass)}>
                            <div/>
                            {dayTracks.map(track => (
                                <div key={track.id} className="text-center">
                                    <h3 className="font-display text-lg uppercase text-ink">{track.name}</h3>
                                    <p className="text-sm text-ink-muted flex items-center justify-center gap-2"><MapPin size={14}/> {track.room}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-8">
                        {schedule.map(slot => {
                            const session = slot.sessions[0];
                            const isFullSpan = slot.sessions.length === 1 && (session.type === 'break' || !session.trackId || session.details?.isPlenary === true);
                            const alignedSessions = dayTracks.map(track => slot.sessions.find(s => s.trackId === track.id) || null);

                            return (
                                <div key={slot.time}>
                                    <div className="md:hidden">
                                        <div className="flex items-center font-bold text-ink mb-4">
                                            <Clock size={16} className="mr-2 text-brand-magenta" />
                                            {slot.time}
                                        </div>
                                        <div className="space-y-4">
                                            {slot.sessions.map(s => <SessionCard key={s.talkId || s.title} session={s} tracks={allTracks} />)}
                                        </div>
                                    </div>

                                    <div className={clsx("hidden md:grid items-stretch gap-6", isFullSpan || numDayTracks <= 1 ? 'grid-cols-[100px_1fr]' : gridClass)}>
                                        <div className="pt-6 font-bold text-ink flex items-start">
                                            <Clock size={16} className="mr-2 text-brand-magenta mt-1" />
                                            {slot.time}
                                        </div>

                                        {isFullSpan || numDayTracks <= 1 ? (
                                            <div className="space-y-4">
                                                {slot.sessions.map(s => <SessionCard key={s.talkId || s.title} session={s} tracks={allTracks}/>)}
                                            </div>
                                        ) : (
                                            <>
                                                {alignedSessions.map((s, index) =>
                                                    s
                                                        ? <SessionCard key={s.talkId} session={s} tracks={allTracks} />
                                                        : <PlaceholderCard key={`placeholder-${index}`} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
