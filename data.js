/* =====================================================================
   data.js : TOUT LE CONTENU DU SITE EST ICI
   ---------------------------------------------------------------------
   Tu modifies ce fichier, le site se met à jour tout seul.
   - Un texte entre crochets [comme ça] est un trou à compléter :
     il s’affiche en pointillés sur le site tant que tu ne l’as pas remplacé.
   - Pour ajouter un élément (expérience, projet, veille…), copie un bloc
     { ... }, colle-le à la suite (n’oublie pas la virgule) et modifie-le.
   - Pour supprimer un élément, efface son bloc { ... }.
   - Un lien dont href est "" n’est pas affiché.
   - Pour cacher les pointillés des trous : highlightTodos: false
   ===================================================================== */

const ICON = {
  site: "fa-solid fa-arrow-up-right-from-square",
  code: "fa-brands fa-github",
  doc: "fa-solid fa-file-lines",
};

const SITE = {
  highlightTodos: true,

  /* ---------- Identité (accueil) ---------- */
  name: "Gabriel Da Silva",
  handle: "gabriel", // affiché dans la barre du haut et au centre du schéma
  role: "Étudiant BTS SIO option SISR",
  status: "en alternance chez Saint-Gobain",
  pitch:
    "Je me forme à l’administration des systèmes et des réseaux : maintenir, sécuriser et faire évoluer une infrastructure informatique fiable.",
  photo: "./src/photoporto.png",
  photoAlt: "Portrait de Gabriel Da Silva",
  buttons: [
    { label: "Voir mes projets", href: "#projets", style: "solid" },
    { label: "Me contacter", href: "#contact", style: "outline" },
  ],
  // Lignes tapées dans le terminal de l’accueil (ok: true = affiché en vert)
  terminal: [
    { cmd: "whoami", out: "gabriel_da_silva" },
    { cmd: "cat formation.txt", out: "bts_sio, option sisr" },
    { cmd: "uptime", out: "alternance chez saint-gobain", ok: true },
  ],

  // Libellés du menu (le menu se construit selon les sections présentes dans index.html)
  nav: {
    presentation: "presentation",
    experience: "experience",
    projets: "projets",
    veille: "veille",
    contact: "contact",
  },

  /* ---------- Présentation ---------- */
  presentation: {
    title: "Présentation",
    paragraphs: [
      "Étudiant en BTS SIO option SISR (Solutions d’Infrastructure, Systèmes et Réseaux), je prépare mon diplôme en alternance chez Saint-Gobain.",
      "[À compléter : ce qui t’a amené vers les systèmes et réseaux, ce que tu aimes dans ce métier]",
      "[À compléter : ton objectif après le BTS (poursuite d’études, poste visé…)]",
    ],
    diagramCaption: "Mes domaines, en réseau.",
    // Parcours de formation
    formation: [
      {
        period: "2026 – 2028",
        title: "BTS SIO option SISR",
        place: "IRIS: Ecole d'informatique & numérique, Paris",
      },
      {
        period: "2020",
        title: "Bac Scientifique",
        place: "Lycée les Pierres Vives, Carrières-sur-Seine",
      },
    ],
    // Chaque groupe devient un nœud du schéma (6 à 8 groupes max pour rester lisible)
    skills: [
      {
        name: "Systèmes",
        items: ["Windows","Linux","Active Directory"],
      },
      { name: "Réseaux", items: ["[TCP/IP, VLAN, routage…]"] },
      { name: "Virtualisation", items: ["Virtualbox"] },
      { name: "Sécurité", items: ["Sauvegardes", "droits d’accès"] },
      { name: "Supervision", items: ["ServiceNow"] },
    ],
  },

  /* ---------- Expérience ---------- */
  experience: {
    title: "Expérience",
    intro:
      "Mon alternance, où j’applique en entreprise ce que j’apprends en cours.",
    items: [
      {
        period: "Août 2026 – présent",
        role: "Support IT de proximité",
        company: "Saint-Gobain",
        place: "Tour Saint-Gobain, Courbevoie",
        summary:
          "Assurer le support informatique de proximité auprès des utilisateurs en diagnostiquant et résolvant les incidents matériels et logiciels. Participer à la maintenance du parc informatique, à la configuration des postes de travail et à l'accompagnement des utilisateurs dans leur environnement numérique.",
        missions: [
          "Gestion des comptes Active Directory",
          "Support utilisateurs et traitement de tickets",
          "Déploiement et maintenance de postes",
        ],
        tools: ["ServiceNow", "Active Directory", "Microsoft 365"],
      },
      /* Pour ajouter un stage ou un autre poste, copie le bloc ci-dessus. */
    ],
  },

  /* ---------- Projets ---------- */
  projets: {
    title: "Projets",
    intro:
      "Projets du BTS et projets personnels, du réseau au développement web.",
    allLabel: "Tous",
    items: [
      // category sert de filtre : un texte ("BTS SIO") ou plusieurs, en liste (["BTS SIO", "Développement"]).
      // image: "" affiche une icône à la place d’une capture.
      {
        slug: "infrastructure-ad",
        category: "BTS SIO",
        title: "[Titre du projet SISR]",
        description:
          "[À compléter : contexte, ce que tu as mis en place, résultat obtenu]",
        image: "",
        imageAlt: "",
        tags: ["[Technologie 1]", "[Technologie 2]"],
        links: [
          { type: "doc", label: "Documentation", href: "" },
          { type: "code", label: "Code", href: "" },
        ],
      },
      {
        slug: "projet-reseau",
        category: ["BTS SIO", "Reseau"],
        title: "[Titre d’un second projet]",
        description: "[À compléter]",
        image: "",
        imageAlt: "",
        tags: ["[Technologie 1]"],
        links: [{ type: "doc", label: "Documentation", href: "" }],
      },
      {
        slug: "adminboard",
        category: "Développement",
        title: "Adminboard",
        description:
          "Maquette d’un réseau social fictif : structure, interface et choix d’ergonomie mis en avant.",
        image: "./src/adminboard.png",
        imageAlt: "Capture du tableau de bord Adminboard",
        tags: ["HTML", "CSS", "Grid"],
        links: [
          {
            type: "site",
            label: "Voir le site",
            href: "https://neo-glam.github.io/adminboard/",
          },
          {
            type: "code",
            label: "Code",
            href: "https://github.com/Neo-Glam/adminboard",
          },
        ],
      },
      {
        slug: "meteo",
        category: "Développement",
        title: "Application météo",
        description:
          "Intégration et gestion de données issues d’une API externe, affichées selon le lieu recherché.",
        image: "./src/meteteho.png",
        imageAlt: "Capture de l’application météo MeTeTeHo",
        tags: ["JavaScript", "API"],
        links: [
          {
            type: "site",
            label: "Voir le site",
            href: "https://neo-glam.github.io/Weather-app/",
          },
          {
            type: "code",
            label: "Code",
            href: "https://github.com/Neo-Glam/Weather-app",
          },
        ],
      },
      {
        slug: "etch-a-sketch",
        category: "Développement",
        title: "Etch A Sketch",
        description:
          "Une grille à dessiner pour maîtriser les fondamentaux de JavaScript et les interactions utilisateur.",
        image: "./src/etchasketch.png",
        imageAlt: "Capture de l’application Etch A Sketch",
        tags: ["JavaScript", "DOM"],
        links: [
          {
            type: "site",
            label: "Voir le site",
            href: "https://neo-glam.github.io/Etch-a-Sketch/",
          },
          {
            type: "code",
            label: "Code",
            href: "https://github.com/Neo-Glam/Etch-a-Sketch",
          },
        ],
      },
      {
        slug: "restaurant",
        category: "Développement",
        title: "Menu de restaurant",
        description:
          "Site multipage pour un bar, avec contenu et informations modifiés dynamiquement en JavaScript.",
        image: "./src/restaurant_page.png",
        imageAlt: "Capture du site de restaurant VA-11 HALL-A",
        tags: ["JavaScript", "Modules"],
        links: [
          {
            type: "site",
            label: "Voir le site",
            href: "https://neo-glam.github.io/RestaurantPage/",
          },
          {
            type: "code",
            label: "Code",
            href: "https://github.com/Neo-Glam/RestaurantPage",
          },
        ],
      },
      {
        slug: "to-do-it",
        category: "Développement",
        title: "To Do It!",
        description:
          "Application de tâches et de notes qui conserve les données de l’utilisateur grâce à la mémoire locale.",
        image: "./src/to_do_it.png",
        imageAlt: "Capture de l’application To Do It!",
        tags: ["JavaScript", "localStorage"],
        links: [
          {
            type: "site",
            label: "Voir le site",
            href: "https://neo-glam.github.io/todo-list/",
          },
          {
            type: "code",
            label: "Code",
            href: "https://github.com/Neo-Glam/todo-list",
          },
        ],
      },
      {
        slug: "chemin-du-cavalier",
        category: "Développement",
        title: "Le chemin du cavalier",
        description:
          "Algorithme de plus court chemin pour un cavalier sur un échiquier : graphes, parcours en largeur et structures de données.",
        image: "./src/chess.jpg",
        imageAlt: "Échiquier en bois avec des pièces noires et blanches",
        tags: ["JavaScript", "Algorithmes"],
        links: [
          { type: "code", label: "Code", href: "https://github.com/Neo-Glam" },
        ],
      },
    ],
  },

  /* ---------- Veille technologique ---------- */
  veille: {
    title: "Veille technologique",
    intro:
      "",
    subjectLabel: "Sujet suivi",
    subject: "Les véhicules autonomes",
    why: "Un véhicule autonome n'est pas simplement une voiture équipée de capteurs : c'est un véritable système informatique mobile qui doit communiquer, traiter des données et échanger des informations en permanence.",
    toolsTitle: "Outils de veille",
    tools: [
      { name: "Feedly", url: "" },
      { name: "alertes Google", url: "" },
    ],
    sourcesTitle: "Sources suivies",
    sources: [
      { name: "ADAS & autonomous Vehicle", url: "" },
      { name: "Automotive World", url: "" },
    ],
    entriesTitle: "",

    /* --- Flux automatiques (RSS) ---
       Colle ici l’adresse RSS des sites que tu suis. Une tâche GitHub les lit
       chaque jour et le site affiche les derniers articles tout seul.
       (Sur un site : cherche l’icône RSS, ou ajoute /feed ou /rss à l’adresse.) */
    autoTitle: "Dernières publications",
    autoCount: 4, // nombre d’articles affichés
    feedsFile: "./veille.json",
    feeds: [
      {
        name: "The Guardian",
        url: "https://www.theguardian.com/technology/self-driving-cars/rss",
      }, // à vérifier
      {
        name: "ADAS & autonomous Vehicle",
        url: "https://www.autonomousvehicleinternational.com/feed",
      },
      {
        name: "Automotive World",
        url: "https://www.automotiveworld.com/feed/",
      },
    ],
    entries: [
      // {
      //   date: "[JJ/MM/AAAA]",
      //   title: "[Titre de l’article ou de l’actualité]",
      //   source: "[Source]",
      //   url: "",
      //   summary: "[À compléter : ce que tu en retiens, en deux phrases]",
      // },
      // {
      //   date: "[JJ/MM/AAAA]",
      //   title: "[Titre de l’article ou de l’actualité]",
      //   source: "[Source]",
      //   url: "",
      //   summary: "[À compléter]",
      // },
    ],
  },

  /* ---------- Contact ---------- */
  contact: {
    title: "Établir la connexion.",
    intro: "Une question, une opportunité, une collaboration ? Écrivez-moi.",
    terminalTitle: "ssh gabriel@contact",
    links: [
      {
        icon: "fa-solid fa-envelope",
        label: "dasilvaf.gabriel@gmail.com",
        href: "mailto:dasilvaf.gabriel@gmail.com",
      },
      {
        icon: "fa-solid fa-phone",
        label: "06 76 78 14 37",
        href: "tel:+33676781437",
      },
      {
        icon: "fa-brands fa-github",
        label: "github.com/Gabriel-DSF",
        href: "https://github.com/Gabriel-DSF",
      },
      { icon: "fa-brands fa-linkedin", label: "LinkedIn", href: "" }, // colle ton lien pour l’afficher
    ],
  },

  footer: "© 2026 Gabriel Da Silva",
};
