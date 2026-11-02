import config from '@/config/website.json';
import agendaConfig from '@/config/agenda.json';
import { formatAgendaDateRange } from '@/lib/agendaDate';

// Dati dell'evento usati dalle card (footer, banda data, venue, caption).
// Tutto dalla config del sito: cambiando edizione cambiano le card.
const CITY = config.hero.city.split(',')[0].trim();
const LINKEDIN = (config.footer.icons.find((icon) => icon.iconName === 'linkedin') || {}).url || '';
const DATE = formatAgendaDateRange(agendaConfig.days) || config.hero.badgeDate;

export const EVENT = {
  name: config.general.event.name,
  year: config.general.edition,
  date: DATE,
  dayMonth: DATE.replace(/,?\s+\d{4}$/, ''),
  city: CITY,
  venue: [config.hero.venue, CITY].filter(Boolean).join(', '),
  // "cloudnativedaysitaly.org", senza protocollo: sulle card si legge meglio
  website: config.general.event.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  // "@cloudnativedaysitaly", dall'url della pagina LinkedIn in config
  social: LINKEDIN ? `@${LINKEDIN.replace(/\/$/, '').split('/').pop()}` : '',
};
