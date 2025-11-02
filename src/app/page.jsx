'use server';

import Hero from './components/homepage/Hero';
import PopularCategories from './components/homepage/PopularCategories';
import FeaturedProducts from './components/homepage/FeaturedProducts';
import Advert from './components/homepage/Advert';
import Greeting from './components/homepage/Greeting';
import Reviews from './components/homepage/Reviews';
import Blogs from './components/homepage/Blogs';
import FadeInSection from './components/FadeInSection';
import Loader from './components/Loader';

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/homepage?populate[0]=Popular_Categories.Image&populate[1]=Hero.image&populate[2]=featured.jewelries.image&populate[3]=Advert.image&populate[4]=Greeting.Video&populate[5]=Reviews.reviews.Image&populate[6]=Blogs.blogs.image`
  );
  const homepage = await res.json();

  console.log(homepage);

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
