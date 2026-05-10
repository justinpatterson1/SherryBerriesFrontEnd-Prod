export default function SectionHero({ title, subtitle }) {
  return (
    <div className='relative bg-gradient-to-r from-brand to-pink-600 py-20 px-4 overflow-hidden'>
      <div className='absolute inset-0 bg-black/10'></div>
      <div className='relative container mx-auto text-center'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
          {title}
        </h1>
        {subtitle && (
          <p className='text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto font-light'>
            {subtitle}
          </p>
        )}
      </div>
      {/* Decorative elements */}
      <div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full'></div>
      <div className='absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full'></div>
      <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full'></div>
    </div>
  );
}
