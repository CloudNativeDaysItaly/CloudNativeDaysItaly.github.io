import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import DecorLayer from '@/components/decor/DecorLayer';
import config from "@/config/website.json";
import AgendaView from "@/components/agenda/agenda-view";
import { CalendarClock, ArrowLeft, FileText, Lightbulb, CheckCircle, Clock, Mic, Users, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import { formatAgendaDateRange } from '@/lib/agendaDate';

async function getPastTalksPreview() {
    try {
        const editionsDir = path.join(process.cwd(), 'src', 'config', 'editions');
        const years = (await fs.readdir(editionsDir)).map(file => file.replace('.json', '')).sort((a,b) => b.localeCompare(a));
        const currentYear = config.general.edition.toString();
        const pastYear = years.find(y => y < currentYear);

        if (!pastYear) return [];

        const talksDir = path.join(process.cwd(), 'src', 'config', 'talks', pastYear);
        const talkFiles = await fs.readdir(talksDir);

        const talks = await Promise.all(
            talkFiles.filter(f => f.endsWith('.md')).slice(0, 3).map(async (file) => {
                const content = await fs.readFile(path.join(talksDir, file), 'utf8');
                const { data } = matter(content);
                return { ...data, year: pastYear };
            })
        );
        return talks;
    } catch {
        return [];
    }
}

async function getAgendaData() {
    const agendaConfigPath = path.join(process.cwd(), 'src', 'config', 'agenda.json');
    const agendaConfig = JSON.parse(await fs.readFile(agendaConfigPath, 'utf8'));

    if (!agendaConfig.isPublished) {
        return { isReady: false, agenda: agendaConfig };
    }

    const currentYear = config.general.edition.toString();

    const profilesDir = path.join(process.cwd(), 'src', 'config', 'profiles');
    const speakersMap = new Map();
    try {
        const profileFiles = await fs.readdir(profilesDir);
        for (const file of profileFiles.filter(f => f.endsWith('.md'))) {
            const content = await fs.readFile(path.join(profilesDir, file), 'utf8');
            const { data } = matter(content);
            speakersMap.set(data.id, data);
        }
    } catch {}

    const talksDir = path.join(process.cwd(), 'src', 'config', 'talks', currentYear);
    const talksMap = new Map();
    try {
        const talkFiles = await fs.readdir(talksDir);
        for (const file of talkFiles.filter(f => f.endsWith('.md'))) {
            const content = await fs.readFile(path.join(talksDir, file), 'utf8');
            const { data, content: abstract } = matter(content);
            const talkId = data.id || file.replace('.md', '');
            talksMap.set(talkId, { ...data, id: talkId, abstract });
        }
    } catch {
        return { isReady: false, agenda: agendaConfig };
    }

    for (const dayId in agendaConfig.schedule) {
        for (const slot of agendaConfig.schedule[dayId]) {
            for (const session of slot.sessions) {
                if (session.talkId) {
                    const talkDetails = talksMap.get(session.talkId);
                    if (talkDetails) {
                        session.details = talkDetails;
                        session.details.speakers = (talkDetails.speakerIds || []).map(id => speakersMap.get(id)).filter(Boolean);
                    }
                }
            }
        }
    }

    return { isReady: true, agenda: agendaConfig };
}

const EVENT = `${config.general.event.name} ${config.general.edition}`;

export const metadata = {
    title: `${EVENT} - Agenda`,
    description: `Talks, workshops and breaks of ${EVENT}: the full schedule, day by day.`,
};

const ComingSoonAgenda = ({ agenda, proposalConfig, infoConfig, pastTalks }) => {
    const now = new Date();
    const startDate = parseISO(proposalConfig.startDate);
    const endDate = parseISO(proposalConfig.endDate);
    const agendaDateRange = formatAgendaDateRange(agenda?.days);

    let c4pStatus = 'closed';
    if (isBefore(now, startDate)) c4pStatus = 'comingsoon';
    if (isAfter(now, startDate) && isBefore(now, endDate)) c4pStatus = 'open';
    // Senza link di submission la call resta "coming soon" (vedi C4P_Card).
    if (!proposalConfig.url) c4pStatus = 'comingsoon';

    return (
        <div className="relative overflow-hidden bg-white">
            <DecorLayer
                items={[
                    { pattern: 'cluster-a', position: 'top-right', size: 'lg' },
                    { pattern: 'halftone-d', position: 'bottom-left', size: 'lg', className: 'opacity-25' },
                ]}
            />
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
                <div className="max-w-3xl">
                    {agendaDateRange && <span className="stamp">{agendaDateRange}</span>}
                    <h1 className="section-heading mt-6">
                        Agenda Coming Soon
                    </h1>
                    <p className="mt-4 text-lg text-ink-muted">
                        Our team is finalizing an exciting lineup. The full schedule will be announced as soon as the Call for Papers is closed and all talks are selected.
                    </p>
                </div>

                <div className="mt-16 max-w-4xl">
                    <div className="card-pop bg-brand-yellow-light p-8 shadow-pop-lg">
                        <div>
                            {c4pStatus === 'open' && <span className="inline-flex items-center gap-2 text-sm font-bold px-4 py-1.5 border border-ink bg-brand-yellow text-ink uppercase"><Lightbulb className="h-4 w-4" /> Call for Papers is Open!</span>}
                            {c4pStatus === 'closed' && <span className="inline-flex items-center gap-2 text-sm font-bold px-4 py-1.5 border border-ink bg-gray-200 text-ink-muted uppercase"><CheckCircle className="h-4 w-4" /> Submissions are Closed</span>}
                            {c4pStatus === 'comingsoon' && <span className="inline-flex items-center gap-2 text-sm font-bold px-4 py-1.5 border border-ink bg-white text-brand-blue uppercase"><Clock className="h-4 w-4" /> C4P Opens Soon</span>}

                            <h2 className="section-heading mt-4">Become a Speaker</h2>
                            <p className="mt-3 text-ink-soft max-w-2xl">{proposalConfig.rollingSelectionText}</p>
                        </div>
                        {proposalConfig.url ? (
                            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 bg-white border border-ink p-4">
                                <p className="font-semibold text-ink-soft">Opens: <span className="font-normal text-ink-muted">{format(startDate, 'MMM d, yyyy')}</span></p>
                                <p className="font-semibold text-ink-soft">Closes: <span className="font-normal text-ink-muted">{format(endDate, 'MMM d, yyyy')}</span></p>
                            </div>
                        ) : (
                            <div className="mt-6 bg-white border border-ink p-4">
                                <p className="text-ink-soft">The Call for Papers is not open yet. Dates and submission link will be announced here and on our channels.</p>
                            </div>
                        )}
                        {c4pStatus === 'open' && (
                            <div className="mt-6">
                                <Link href={proposalConfig.url} target="_blank" className="btn-pop btn-pop-primary group w-full sm:w-auto inline-flex items-center justify-center">
                                    Submit Your Talk <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-16">
                    {/* Stesso occhiello della sezione in home (da config) */}
                    <span className="eyebrow text-brand-magenta">{infoConfig.extra.eyebrow}</span>
                    <h2 className="section-heading mt-2">{infoConfig.extra.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-5xl">
                        <div className="card-pop p-6"><h3 className="font-bold text-lg flex items-center gap-2"><Mic size={20} className="text-brand-blue" /> {infoConfig.extra.boxes.talks.title}</h3><p className="text-ink-muted text-sm mt-2">{infoConfig.extra.boxes.talks.description}</p></div>
                        <div className="card-pop p-6"><h3 className="font-bold text-lg flex items-center gap-2"><Users size={20} className="text-brand-blue" /> {infoConfig.extra.boxes.networking.title}</h3><p className="text-ink-muted text-sm mt-2">{infoConfig.extra.boxes.networking.description}</p></div>
                        <div className="card-pop p-6"><h3 className="font-bold text-lg flex items-center gap-2"><Wrench size={20} className="text-brand-blue" /> {infoConfig.extra.boxes.workshop.title}</h3><p className="text-ink-muted text-sm mt-2">{infoConfig.extra.boxes.workshop.description}</p></div>
                    </div>
                </div>

                {pastTalks.length > 0 && (
                    <div className="mt-16">
                        <h2 className="section-heading">From the Archives</h2>
                        <p className="mt-3 text-lg text-ink-muted">Curious about our sessions? Here&apos;s a taste from our past editions.</p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                            {pastTalks.map(talk => (
                                <Link key={talk.id} href={`/talk/${talk.id}`} className="card-pop block p-4 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold px-2 py-0.5 border border-ink bg-brand-blue text-white">{talk.year}</span>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">{talk.tags?.[0]}</span>
                                    </div>
                                    <p className="font-semibold text-ink mt-3">{talk.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default async function AgendaPage() {
    const { isReady, agenda } = await getAgendaData();

    if (!isReady) {
        const pastTalks = await getPastTalksPreview();
        return <ComingSoonAgenda agenda={agenda} proposalConfig={config.proposal} infoConfig={config.info} pastTalks={pastTalks} />;
    }

    return (
        <AgendaView agenda={agenda} />
    );
}
