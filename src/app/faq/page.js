import faqData from '@/config/faq.json';
import config from '@/config/website.json';
import FaqPage from '@/components/faq/FaqPage';

export const metadata = {
  title: `FAQ - ${config.general.event.name}`,
  description:
    'Frequently asked questions and practical information for Cloud Native Days Italy 2026.',
};

export default function Page() {
  return <FaqPage data={faqData} />;
}
