import { useState } from "react";
import type { FormEvent } from "react";
import { CONTACT_EMAIL } from "../../contact";

export default function Contact() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const reason = String(data.get("reason") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `Contact AFPN — ${reason}`;
    const body = `${message}\r\n\r\nPrénom : ${firstName}\r\nNom : ${lastName}\r\nE-mail de contact : ${email}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice("Confirmez l’envoi dans votre messagerie. Si elle ne s’ouvre pas, vous pouvez copier votre message et l’envoyer à l’adresse ci-contre.");
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="vitrine-section relative overflow-hidden bg-sky-50">
      <h2 id="contact-heading" className="vitrine-heading">Contactez-nous</h2>
      <div className="vitrine-content relative py-6 md:py-12">
        <img src="/images/logo-couleur.png" alt="" aria-hidden="true" loading="lazy" className="vitrine-watermark min-w-200" />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-14">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="sr-only">Prénom</span><input className="contact-input" name="firstName" autoComplete="given-name" placeholder="Prénom" required /></label>
              <label className="block"><span className="sr-only">Nom</span><input className="contact-input" name="lastName" autoComplete="family-name" placeholder="Nom" required /></label>
            </div>
            <label className="block"><span className="sr-only">E-mail</span><input className="contact-input" type="email" name="email" autoComplete="email" placeholder="E-mail" required /></label>
            <label className="block"><span className="sr-only">Raison du contact</span>
              <select className="contact-input" name="reason" defaultValue="" required>
                <option value="" disabled>Sélectionnez votre raison de contact</option>
                <option>Rejoindre l’association</option><option>Cours de langue</option><option>Événements</option><option>Autre demande</option>
              </select>
            </label>
            <label className="block"><span className="sr-only">Message</span><textarea className="contact-input min-h-44 resize-y" name="message" placeholder="Message" required /></label>
            <div className="flex justify-end"><button type="submit" className="rounded bg-[#249d08] px-6 py-2 font-semibold text-white transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">Ouvrir ma messagerie</button></div>
            <p className="text-sm text-slate-600" role="status">{notice || "Ce formulaire prépare un e-mail. Votre messagerie s’ouvrira pour vous permettre de l’envoyer."}</p>
          </form>
          <div className="space-y-5 text-base leading-relaxed text-gray-800">
            <p>Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#0077bd] underline underline-offset-4">{CONTACT_EMAIL}</a>.</p>
            <p><strong>Rejoignez notre association</strong><br />Vous souhaitez participer à nos activités, prendre part à nos rencontres et causeries, partager vos idées ou simplement soutenir notre association ?</p>
            <p><strong>L’Association d’Amitié Franco-Persane de Nice</strong> est ouverte à toutes les personnes souhaitant contribuer, selon leurs possibilités, au développement des échanges culturels, sociaux et amicaux franco-persans.</p>
            <p>Devenez membre, participez à nos événements ou soutenez nos projets à votre manière. Chaque participation contribue à faire vivre notre association.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
