import { useState } from "react";

const navigation = [
  {
    label: "Événements",
    href: "#events",
  },
  {
    label: "Qui sommes-nous",
    href: "#about",
  },
  {
    label: "Cours de Langue",
    href: "#courses",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function SidebarNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="fixed left-5 top-5 z-50 md:left-12 md:top-16">

      {/* MENU FERMÉ */}
      {!menuOpen && (
        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen(true)}
          className="
            flex h-12 w-12
            items-center justify-center
            rounded-full
            border border-gray-300
            bg-white/5
            backdrop-blur-sm
            transition-all duration-2500
            hover:bg-white/15
            md:h-14 md:w-14
          "
        >
          <img
            src="/images/icons8-menu.svg"
            alt="Menu"
            className="h-16 w-16 object-contain md:h-9 md:w-9 "
          />
        </button>
      )}

      {/* MENU OUVERT */}
      {menuOpen && (
        <nav
          className="
            flex
            py-5
            h-[430px]
            w-[115px]
            flex-col
            items-center
            overflow-hidden
            rounded-[58px]
            border border-gray-300/60
            bg-white/5
            text-gray-300
            shadow-lg
            backdrop-blur-sm
            transition-all duration-2500

            md:h-[450px]
            md:w-[84px]
          "
        >

          {/* FLÈCHE POUR FERMER */}
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="
              flex
              h-[90px]
              w-full
              shrink-0
              items-center
              justify-center
              border-b border-white/10
              text-4xl
              font-light
              transition
              hover:bg-white/10
            "
          >
            ^
          </button>

          {/* LIENS */}
          <div
            className="
              flex
              flex-1
              flex-col
              items-center
              justify-evenly
              px-4
              py-3
            "
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="
                  text-center
                  text-base
                  font-light
                  leading-tight
                  text-gray-300
                  transition-all
                  duration-400
                  hover:scale-105
                  hover:text-sky-200
                  md:text-xs
                  
                "
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}