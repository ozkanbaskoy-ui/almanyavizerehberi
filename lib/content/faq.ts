import fs from 'node:fs';
import path from 'node:path';

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_PATH = path.join(process.cwd(), 'content', 'faq', 'faq.json');

export function getAllFaq(): FAQItem[] {
  const raw = fs.readFileSync(FAQ_PATH, 'utf8');
  return JSON.parse(raw) as FAQItem[];
}

export function saveAllFaq(items: FAQItem[]) {
  fs.writeFileSync(FAQ_PATH, JSON.stringify(items, null, 2), 'utf8');
}

export function buildFaqSchemaOrg(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

