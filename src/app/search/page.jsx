import SearchClient from './SearchClient';

export const metadata = {
  title: 'Search'
};

export default async function SearchPage({ searchParams }) {
  const params = (await searchParams) || {};
  const q = typeof params.q === 'string' ? params.q : '';
  return <SearchClient initialQuery={q} />;
}
