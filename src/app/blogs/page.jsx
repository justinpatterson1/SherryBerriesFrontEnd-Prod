import { getBlogList } from '@/lib/api/blogs';
import BlogsClient from './BlogsClient';

export default async function BlogsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const initialPage = Number(params.page ?? 1) || 1;
  const initialOrder = params.order === 'ASC' ? 'ASC' : 'DESC';

  let initialBlogs = [];
  try {
    const json = await getBlogList({
      page: initialPage,
      pageSize: 12,
      sortOrder: initialOrder
    });
    initialBlogs = json?.data ?? [];
  } catch {
    initialBlogs = [];
  }

  return (
    <BlogsClient
      initialBlogs={initialBlogs}
      initialPage={initialPage}
      initialOrder={initialOrder}
    />
  );
}
