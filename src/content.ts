export type Problem = { title: string; body: string };

export type Service = {
  id: string;
  name: string;
  price: string;
  unit?: string;
  badge?: string;
  featured?: boolean;
  summary: string;
  includes: string[];
  whatsappMessage: string;
};

export type WorkItem = {
  name: string;
  tagline: string;
  url: string;
  image: string;
  problem: string;
  built: string;
  stack: string[];
  screens?: { src: string; alt: string }[];
};

export type Step = { title: string; body: string };

export type Faq = { question: string; answer: string };

export const site = {
  name: "Mustafa Syahmi",
  url: "https://mustafasyahmi.web.app",
  title: "Mustafa Syahmi | Web Developer for Malaysian Businesses",
  description:
    "Freelance web developer in Malaysia. Business websites from RM2,500, online stores and ordering systems with FPX payment from RM8,000, and custom systems for SMEs.",
  whatsappNumber: "60193934247",
  whatsappDisplay: "+60 19 393 4247",
  email: "mussyahmi31@gmail.com",
  github: "https://github.com/mussyahmi",
  defaultWhatsappMessage: "Hi Mustafa, I saw your website and would like to discuss a project.",
};

export const hero = {
  eyebrow: "Freelance web developer in Malaysia",
  headline: "I build websites and ordering systems for Malaysian businesses.",
  subheadline:
    "I'm Mustafa, a senior software engineer with five and a half years building payment and financial systems. I help business owners stop juggling WhatsApp orders and spreadsheets, and start selling online properly.",
  primaryCta: "WhatsApp me",
  secondaryCta: "See my work",
  photoAlt: "Portrait of Mustafa Syahmi",
};

export const sectionCopy = {
  problems: {
    eyebrow: "Sound familiar?",
    heading: "Running a business is hard enough without fighting your own tools",
  },
  services: {
    eyebrow: "Services",
    heading: "Clear starting prices, no guesswork",
    intro:
      "Every project starts with a free chat and a written proposal with a fixed price. Your final price depends on what you need.",
    note: "Prices are starting points. Third party fees such as hosting, domain and payment gateway charges are paid directly to those providers.",
  },
  work: {
    eyebrow: "Selected work",
    heading: "Apps I have built and shipped",
    intro: "Four products I designed, built and run myself. Open any of them on your phone right now.",
  },
  process: {
    eyebrow: "How it works",
    heading: "From first message to launch",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions owners usually ask",
  },
};

export const problems: Problem[] = [
  {
    title: "Taking orders over WhatsApp is chaos",
    body: "Orders get buried in chats, payments are checked by hand and small mistakes cost you customers. An ordering system keeps every order, payment and receipt in one place.",
  },
  {
    title: "Paying marketplace commission on every sale",
    body: "Platforms take a cut of every order. Your own online store lets customers buy from you directly with FPX payment, and the margin stays with you.",
  },
  {
    title: "Spreadsheets that do not add up",
    body: "When stock, sales and costs live in different files, you never see your real profit. A simple system keeps the numbers together and does the maths for you.",
  },
];

export const services: Service[] = [
  {
    id: "website",
    name: "Business website",
    price: "RM2,500",
    summary: "A professional site that makes your business look trustworthy and sends enquiries to your WhatsApp.",
    includes: [
      "Up to 5 pages",
      "Looks great on mobile",
      "WhatsApp button on every page",
      "Google search basics",
      "Hosting setup and handover",
    ],
    whatsappMessage: "Hi Mustafa, I'm interested in a business website.",
  },
  {
    id: "store",
    name: "Online store or ordering system",
    price: "RM8,000",
    badge: "Best for F&B and retail",
    featured: true,
    summary: "Take orders and payments online without paying commission to a marketplace.",
    includes: [
      "Product or menu catalogue",
      "Cart and checkout",
      "FPX online banking payment",
      "Automatic receipts by email",
      "Admin panel for orders and products",
    ],
    whatsappMessage: "Hi Mustafa, I'm interested in an online store or ordering system.",
  },
  {
    id: "custom",
    name: "Custom web app or system",
    price: "RM15,000",
    summary: "Software shaped around how your business actually runs.",
    includes: [
      "Bookings, agents or staff workflows",
      "Dashboards and reports",
      "Installable app on phones",
      "Built in phases so you can start using it early",
    ],
    whatsappMessage: "Hi Mustafa, I'd like to discuss a custom system for my business.",
  },
  {
    id: "care",
    name: "Monthly care plan",
    price: "RM300",
    unit: "/month",
    summary: "Keep your site or system running smoothly after launch.",
    includes: ["Monitoring and security updates", "Bug fixes", "Small content and design changes each month"],
    whatsappMessage: "Hi Mustafa, I'm interested in a monthly care plan.",
  },
];

export const work: WorkItem[] = [
  {
    name: "KiraPoket",
    tagline: "Personal finance app",
    url: "https://kirapoket.web.app",
    image: "/work/kirapoket.webp",
    problem: "Most budgeting apps assume your month starts on the 1st, but Malaysians get paid on different days.",
    built:
      "An installable expense tracker built around your salary cycle, with needs, wants and savings budgets, debt tracking and daily spending limits.",
    stack: ["Next.js", "Firebase", "PWA"],
    screens: [
      { src: "/work/kirapoket/1.webp", alt: "KiraPoket home screen showing what is left in the salary cycle" },
      { src: "/work/kirapoket/2.webp", alt: "KiraPoket budgets by category, with one category over budget" },
      { src: "/work/kirapoket/3.webp", alt: "KiraPoket new transaction screen showing the balance after the expense" },
    ],
  },
  {
    name: "MariSolat",
    tagline: "Prayer times app",
    url: "https://marisolat.web.app",
    image: "/work/marisolat.webp",
    problem: "Checking prayer times, finding the Qibla and tracking missed prayers usually means three different apps.",
    built:
      "One app that detects your zone automatically, shows the prayer times for it, points to the Qibla on a map and tracks qada prayers.",
    stack: ["Next.js", "Firebase", "Leaflet maps"],
  },
  {
    name: "KadHariLahir",
    tagline: "Digital birthday invitations",
    url: "https://kadharilahir.web.app",
    image: "/work/kadharilahir.webp",
    problem: "Printed invitation cards cost money, and guests still ask for the date and location again.",
    built:
      "Create a birthday invitation with a cover photo and a venue map, share one link, and let guests add the party to their calendar.",
    stack: ["Next.js", "Firebase", "Leaflet maps"],
  },
  {
    name: "LukisLukis",
    tagline: "Multiplayer drawing game",
    url: "https://lukislukis.web.app",
    image: "/work/lukislukis.webp",
    problem: "Party games in English don't always land with Malaysian friends and family.",
    built: "A Pictionary style drawing and guessing game in Bahasa Melayu that friends play together from their own phones.",
    stack: ["Next.js", "Firebase"],
  },
];

export const processSteps: Step[] = [
  {
    title: "Free chat",
    body: "Tell me about your business on WhatsApp. I'll ask a few questions to understand what you really need.",
  },
  {
    title: "Written proposal",
    body: "You get a clear proposal with the scope, timeline and a fixed price for each phase. No surprise charges.",
  },
  {
    title: "Build in phases",
    body: "Pay 30% to start each phase and 70% on delivery. You can start using each phase before the next one begins.",
  },
  {
    title: "Launch and support",
    body: "Every phase comes with 30 days of free bug fixing. After that, a monthly care plan is there if you want one.",
  },
];

export const about = {
  heading: "Hi, I'm Mustafa",
  paragraphs: [
    "By day I'm a senior software engineer at a fintech company, where I've spent five and a half years building payment and financial systems that have to be correct to the last sen.",
    "In the evenings I build products of my own. Four of them are live today, from a budgeting app to a prayer times app.",
    "I take on a small number of freelance projects at a time, so every client gets my full attention and a direct line to the person writing the code.",
  ],
  githubLabel: "See my code on GitHub",
};

export const faqs: Faq[] = [
  {
    question: "Do I own the code and the website?",
    answer:
      "Yes. Once the project is paid in full, the code, domain and accounts are handed over to you. You are never locked in to me.",
  },
  {
    question: "Can you set up FPX online banking payments?",
    answer:
      "Yes, through Malaysian payment gateways such as ToyyibPay, senangPay or CHIP. The gateway has to approve your merchant account first, which usually needs a registered business, so it is worth applying early.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A business website usually takes 2 to 3 weeks. The first phase of an online store or ordering system takes around 4 weeks. Custom systems are planned in phases, and your proposal shows the timeline for each one.",
  },
  {
    question: "What if I need changes after launch?",
    answer:
      "Bugs are fixed for free for 30 days after each phase. New features are quoted before any work starts, and small changes are covered by the monthly care plan.",
  },
  {
    question: "Do you only work with businesses in the Klang Valley?",
    answer: "No. Everything can be done over WhatsApp and video calls, so I work with businesses anywhere in Malaysia.",
  },
  {
    question: "Do you handle hosting and the domain?",
    answer:
      "Yes, I set them up for you. Hosting, domain and payment gateway fees are paid directly to those providers, and your proposal lists the expected amounts.",
  },
];

export const contact = {
  heading: "Let's talk about your business",
  body: "Send me a WhatsApp message with a short description of what you need. I'll reply with a few questions and an honest view of what it would take.",
  emailLabel: "Prefer email?",
};

export const labels = {
  priceFrom: "From",
  serviceCta: "Ask about this",
  workProblem: "The problem:",
  workBuilt: "What I built:",
  workOpen: "Open",
  copyright: "© 2026",
};

export type EstimatorOption = { id: string; label: string };

export type EstimatorQuestion = { id: "need" | "size" | "payment" | "timeline"; label: string; options: EstimatorOption[] };

export const estimator = {
  eyebrow: "Quick estimate",
  heading: "What would your project cost?",
  intro:
    "Four quick questions and you get a range in about 20 seconds. You can send your answers straight to me on WhatsApp.",
  questions: [
    {
      id: "need",
      label: "What do you need?",
      options: [
        { id: "website", label: "Business website" },
        { id: "store", label: "Online store or ordering system" },
        { id: "custom", label: "Custom system for my business" },
        { id: "unsure", label: "Not sure yet" },
      ],
    },
    {
      id: "size",
      label: "Roughly how big is it?",
      options: [
        { id: "small", label: "Up to 10 pages or products" },
        { id: "medium", label: "10 to 50 pages or products" },
        { id: "large", label: "More than 50 pages or products" },
      ],
    },
    {
      id: "payment",
      label: "Do you need to take payments online?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "timeline",
      label: "When do you want it live?",
      options: [
        { id: "asap", label: "As soon as possible" },
        { id: "soon", label: "In the next 1 to 3 months" },
        { id: "exploring", label: "Just exploring for now" },
      ],
    },
  ] as EstimatorQuestion[],
  result: {
    rangeTitle: "Your estimated range",
    tiersTitle: "Here is where my prices start",
    note: "This is an estimate, not a quote. Your real price comes after a free chat and a written proposal.",
    includesLabel: "Closest package",
    cta: "Send my answers on WhatsApp",
    restart: "Start again",
    back: "Back",
  },
  fallbackCta: "Rather just ask? Message me on WhatsApp",
  progressLabel: "Question",
  progressJoiner: "of",
};
