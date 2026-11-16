import {
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaThreads,
  FaBluesky,
  FaLinkedinIn,
  FaMastodon,
} from 'react-icons/fa6';
import { BiLogoTelegram } from 'react-icons/bi';
import config from '@/config/website.json';

/*
 * Icone social dell'evento, da `website.json → footer.icons`: una sola lista
 * per footer e pagine (la 404 le usa sotto "Follow us"). Aggiungere un canale
 * si fa in config, non qui.
 *
 * Il colore cambia col fondo: sulla banda ink del footer grigio con hover
 * giallo, su fondo bianco grigio con hover blu, come le icone delle card
 * speaker. Vedi docs/design-system.md, sezione Colore nei componenti.
 */
const ICONS = {
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  instagram: FaInstagram,
  x: FaXTwitter,
  telegram: BiLogoTelegram,
  threads: FaThreads,
  bluesky: FaBluesky,
  mastodon: FaMastodon,
};

export default function SocialIcons({
  items = config.footer.icons,
  className = 'flex flex-wrap gap-4',
  linkClassName = 'text-ink-muted hover:text-brand-blue transition-colors',
  iconClassName = 'w-6 h-6',
}) {
  const active = (items || []).filter((item) => item.active);
  if (active.length === 0) return null;

  return (
    <div className={className}>
      {active.map(({ iconName, url, alt }) => {
        const Icon = ICONS[iconName];
        if (!Icon) return null;
        return (
          <a
            key={iconName}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={alt}
            className={linkClassName}
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
}
