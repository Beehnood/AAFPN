function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="bg-sky-50">
      <img
        src="/images/couche-soleil-vue-la-ville.jpeg"
        alt="La ville illuminée au bord de la mer à la tombée du jour"
        loading="lazy"
        className="h-40 w-full object-cover object-center sm:h-56 lg:h-72"
      />
      <div className="vitrine-section relative overflow-hidden">
        <h2 id="about-heading" className="vitrine-heading">Qui Sommes-Nous ?</h2>
        <div className="vitrine-content ">
          <img src="/images/logo-couleur.png" alt="" aria-hidden="true" className="vitrine-watermark min-w-200 " loading="lazy" />
          <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <img
              src="/images/logo-couleur.png"
              alt="Association d’Amitié Franco-Persane de Nice"
              loading="lazy"
              className="mx-auto w-full min-w-150 md:max-w-md"
            />
            <div className="space-y-6 text-base leading-relaxed text-gray-800 lg:text-lg">
              <p><strong>L’Association d’Amitié Franco-Persane de Nice</strong> a pour objectif de renforcer les liens d’amitié et les échanges entre les communautés française et iranienne à Nice. Elle favorise les rencontres, l’intégration et le partage autour d’initiatives sociales, culturelles, éducatives et économiques, tout en proposant un accompagnement et des conseils à ses membres.</p>
              <p>L’association organise et soutient également des événements, rencontres et projets franco-persans afin de promouvoir la culture, le dialogue interculturel et la coopération locale. Elle se veut un espace d’échange ouvert, favorisant les relations humaines et professionnelles entre la France et l’Iran.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
