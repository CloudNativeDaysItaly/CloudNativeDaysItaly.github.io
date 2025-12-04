'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaThreads,
  FaBluesky,
  FaLinkedinIn,
} from 'react-icons/fa6';
import { BiLogoTelegram } from 'react-icons/bi';

const iconMap = {
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  instagram: FaInstagram,
  x: FaXTwitter,
  telegram: BiLogoTelegram,
  threads: FaThreads,
  bluesky: FaBluesky,
};

export default function Footer({ data, editions = [] }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (!data) return null;

  const { footer, general } = data;
  const currentEdition = general.edition.toString();
  const pastEditions = editions
    .filter((e) => e !== currentEdition)
    .sort((a, b) => b.localeCompare(a));
  const navLinks = data.navbar.links.header;

  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent' />

        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
            <div className='lg:col-span-1'>
              <Image src={footer.image} alt='Logo' width={225} height={60} />
              <p className='mt-4 text-gray-400 text-sm'>
                {general.event.description}
              </p>
            </div>

            <div className='md:col-start-2'>
              <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
                Navigation
              </h3>
              <ul className='mt-4 space-y-3'>
                {navLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.to}
                      className='text-gray-400 hover:text-white transition-colors'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
                Past Editions
              </h3>
              <ul className='mt-4 space-y-3'>
                {pastEditions.map((year) => (
                  <li key={year}>
                    <Link
                      href={`/${year}`}
                      className='text-gray-400 hover:text-white transition-colors'
                    >
                      Edition {year}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
                Connect
              </h3>
              <ul className='mt-4 space-y-3'>
                <li>
                  <a
                    href={`mailto:${general.contact.email}`}
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link
                    href='/sponsors'
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    Sponsorship
                  </Link>
                </li>
                <li>
                  <Link
                    href='/code-of-conduct'
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    Code of Conduct
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <p className='text-sm text-gray-500 text-center sm:text-left'>
              &copy; {currentYear} {general.event.name}. All rights reserved.
            </p>
            <div className='flex justify-center gap-4 flex-wrap'>
              {footer.icons
                .filter((i) => i.active)
                .map(({ iconName, url, alt }) => {
                  const Icon = iconMap[iconName];
                  if (!Icon) return null;
                  return (
                    <a
                      key={iconName}
                      href={url}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={alt}
                      className='text-gray-500 hover:text-white transition-colors'
                    >
                      <Icon className='w-6 h-6' />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
