import { CONTACT_EMAIL } from "../../contact";

export default function Footer() {
  return (
    <footer className="bg-[#0077bd] px-6 py-10 md:px-12 md:py-14">
      <a href="#home" aria-label="Retour à l’accueil" className="inline-block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        <img src="/images/logo-blanc.png" alt="Association d’Amitié Franco-Persane de Nice" loading="lazy" className="h-28 w-28 object-contain md:h-40 md:w-40" />
      </a>
      <p className="mt-4 text-white"><a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a></p>
    </footer>
  );
}
