

import SidebarNav from '../layout/SidebarNav'

function Hero() {
  return (
    <section
    id="home"
    className='relative min-h-screen  w-full overflow-hidden'
    >
    {/* photo de Nice */}

    <img src="/images/bleus-chaises.jpeg" alt="promenade des anglais à Nice"
    className='
    absolute inset-0
    h-full w-full 
    object-cover
    object-center
    '
    />

    {/* filtre Bleu */}

    <div className='absolute inset-0 bg-[#0077c8]/55' />

    <SidebarNav/>

    {/* cintenu central */}

    <div
      className='
      relative z-10 flex min-h-screen
      items-center justify-center
      px-5
      '
    >
   <div className="flex w-full max-w-4xl flex-col items-center">
          {/* LOGO */}
          <img
            src="/images/logo-blanc.png"
            alt="Association d'Amitié Franco-Persane de Nice"
            className="
              mb-3
              w-32
              object-contain
              md:w-40
              lg:w-44
            "
          />

          {/* TITRE FRANÇAIS + PERSAN */}
          <img
            src="/images/text-hero.png"
            alt="Association d'Amitié Franco-Persane de Nice"
            className="
              w-[92%]
              max-w-195
              object-contain
              md:w-[70%]
            "
          />
        </div>

    </div>
        
    </section>
  )
}

export default Hero
