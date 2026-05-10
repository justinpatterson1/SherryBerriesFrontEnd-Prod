import Hero from './components/homepage/Hero';
import PopularCategories from './components/homepage/PopularCategories';
import FeaturedProducts from './components/homepage/FeaturedProducts';
import Advert from './components/homepage/Advert';
import Greeting from './components/homepage/Greeting';
import Reviews from './components/homepage/Reviews';
import Blogs from './components/homepage/Blogs';
import FadeInSection from './components/FadeInSection';
import Loader from './components/Loader';
import { getHomepage } from '@/lib/api/content';
import { getBlogList } from '@/lib/api/blogs';
import { getFeaturedJewelries } from '@/lib/api/products';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [homepage, blogList, featuredList] = await Promise.all([
    getHomepage(),
    getBlogList({ page: 1, pageSize: 6 }).catch(() => ({ data: [] })),
    getFeaturedJewelries({ page: 1, pageSize: 8 }).catch(() => ({ data: [] }))
  ]);

  if (!homepage) return <Loader />;

  const blogProp = homepage?.data?.Blogs
    ? { ...homepage.data.Blogs, blogs: blogList?.data ?? [] }
    : { Title: 'Latest Blogs', description: '', blogs: blogList?.data ?? [] };

  const featuredProp = {
    ...(homepage?.data?.featured ?? {}),
    jewelries: featuredList?.data ?? []
  };

  return (
    <main role="main">
      <FadeInSection>
        <Hero img={homepage?.data?.Hero?.image?.url} />
      </FadeInSection>

      <FadeInSection>
        <PopularCategories
          popular_category={homepage?.data?.Popular_Categories}
          description={homepage?.data?.Category_Description}
        />
      </FadeInSection>

      <FadeInSection>
        <FeaturedProducts featured={featuredProp} />
      </FadeInSection>

      <FadeInSection>
        <Advert advert={homepage?.data?.Advert} />
      </FadeInSection>

      <FadeInSection>
        <Greeting greeting={homepage?.data?.Greeting} />
      </FadeInSection>

      <FadeInSection>
        <Reviews reviews={homepage?.data?.Reviews} />
      </FadeInSection>

      <FadeInSection>
        <Blogs blog={blogProp} />
      </FadeInSection>

      <FadeInSection>
        <section className='py-16 px-4'>
          <div className='container mx-auto'>
            <iframe
              src='https://widgets.sociablekit.com/tiktok-feed/iframe/25678407'
              frameBorder='0'
              width='100%'
              height='1000px'
              title='TikTok feed'
            />
          </div>
        </section>
      </FadeInSection>
    </main>
  );
}
