export default function Courses() {
  return (
    <section id="courses" aria-labelledby="courses-heading" className="vitrine-section relative overflow-hidden bg-white">
      <h2 id="courses-heading" className="vitrine-heading">Cours de Langue</h2>
      <div className="vitrine-content relative min-h-80 md:min-h-[480px]">
        <img src="/images/logo-couleur.png" alt="" aria-hidden="true" loading="lazy" className="vitrine-watermark min-w-200" />
        <div className="relative grid gap-10 py-6 md:grid-cols-2 md:gap-14 md:py-12">
          <article lang="fa" dir="rtl" className="space-y-5 text-lg leading-loose text-gray-800">
            <h3 className="text-xl font-semibold text-[#0077c8]">آموزش زبان فرانسه و آشنایی با فرهنگ فرانسوی</h3>
            <p>
              انجمن دوستی فرانسه و ایران در نیس، برای ایرانیان علاقه‌مند به یادگیری زبان فرانسه و آشنایی با فرهنگ و زندگی در فرانسه، کلاس‌های زبان برگزار می‌کند. این کلاس‌ها فرصتی برای یادگیری، گفت‌وگو و آشنایی با یکدیگر در فضایی صمیمی هستند.
            </p>
            <p>
              همچنین، انجمن برای آشنایی با مراحل و پیگیری امور اداری در فرانسه، راهنمایی و مشاوره ارائه می‌دهد و در این مسیر همراه شماست.
            </p>
            <p>
              این خدمات با هزینه‌ای مناسب و مقرون‌به‌صرفه ارائه می‌شوند. مبلغ دریافتی صرفاً برای حمایت از انجمن و تداوم فعالیت‌های آن است.
            </p>
          </article>
          <article lang="fr" className="space-y-5 text-base leading-relaxed text-gray-800 lg:text-lg">
            <h3 className="text-xl font-semibold text-[#0077c8]">Apprendre le persan et découvrir la culture iranienne</h3>
            <p>
              Vous souhaitez apprendre le persan (farsi) et découvrir la culture iranienne ? L’Association d’Amitié Franco-Persane de Nice propose des cours de persan dans un cadre convivial, propice à l’apprentissage, à la rencontre et aux échanges culturels.
            </p>
            <p>
              Venez découvrir une langue, ses expressions et les traditions qui l’accompagnent, tout en tissant des liens entre les cultures française et iranienne.
            </p>
            <p>
              Les cours sont proposés à un tarif accessible. Votre participation sert uniquement à soutenir l’association et à faire vivre ses activités.
            </p>
          </article>
        </div>
        <div className="relative mt-6 text-center">
          <a href="#contact" className="inline-block rounded border border-[#0077c8] px-6 py-3 font-semibold text-[#0077c8] transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077c8]">
            <span lang="fr">Nous contacter</span>
            <span aria-hidden="true"> · </span>
            <span lang="fa" dir="rtl">تماس با ما</span>
          </a>
        </div>
      </div>
    </section>
  );
}
