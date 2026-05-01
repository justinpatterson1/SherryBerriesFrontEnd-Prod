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

export default async function Home() {
  const homepage = await getHomepage();


  if (!homepage) return <Loader />;
  
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
        <FeaturedProducts featured={homepage?.data?.featured} />
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
        <Blogs blog={homepage?.data?.Blogs} />
      </FadeInSection>
    </main>
  );
}
