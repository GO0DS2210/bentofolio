/**
 * ============================================================================
 * BENTOFOLIO — SINGLE-FILE PORTFOLIO CONFIGURATION
 * ============================================================================
 * Edit ONLY this file to customize your name, bio, photo, video backdrop,
 * projects, theme preset, and contact details. Zero build tools required.
 * ============================================================================
 */

window.BENTO_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. THEME & APPEARANCE
  // --------------------------------------------------------------------------
  theme: {
    // High-contrast studio accents (WCAG AA/AAA): "cobalt" | "matcha" | "terracotta" | "plum"
    preset: "cobalt",

    // Initial color scheme: "light" or "dark"
    defaultMode: "light",

    // Browser tab title
    pageTitle: "GO0DS2210 — Portfolio",
  },

  // --------------------------------------------------------------------------
  // 2. PROFILE & SCENIC CARD
  // --------------------------------------------------------------------------
  profile: {
    name: "GO0DS2210",
    handle: "@GO0DS2210",

    headline: "Hi, I'm GO0DS2210. I design clean websites and practical digital products.",
    bio: "Focused on fast, readable web interfaces and lightweight automation tools that simplify everyday workflows. Open to remote collaborations, internships, and freelance work.",

    role: "Web & Digital Creator",
    city: "Indonesia",

    // Live clock IANA timezone (e.g. "America/New_York", "Europe/London", "Asia/Jakarta")
    timezone: "Asia/Jakarta",
    timezoneLabel: "WIB",

    availability: "Open for collaborations & new projects",

    // Profile portrait inside assets/ (e.g. "assets/my-photo.jpg")
    avatar: "assets/avatar-go0ds.svg",

    // Scenic profile card background:
    // 1) Bundled looping Indonesian highlands video ("assets/bg-indonesia.mp4")
    // 2) Set to "" to display only the static poster image below
    profileBgVideo: "assets/bg-indonesia.mp4",
    profileBgImage: "assets/bg-indonesia.jpg",

    // Optional path to your own PDF resume (e.g. "assets/Resume.pdf").
    // Leave "" for one-click automatic PDF resume download built from this config.
    cvFileUrl: "",
  },

  // --------------------------------------------------------------------------
  // 3. SKILLS & TOOLS
  // --------------------------------------------------------------------------
  skills: [
    "HTML5 & CSS3",
    "JavaScript (ES6+)",
    "Responsive Design",
    "UI/UX Prototyping",
    "Workflow Automation",
    "Git & GitHub",
    "Figma",
    "AI-Assisted Dev",
  ],

  // --------------------------------------------------------------------------
  // 4. SELECTED WORK (Filter tabs are generated automatically from "category")
  // --------------------------------------------------------------------------
  projects: [
    {
      title: "Roast & Craft — Cafe Menu & Quick Order",
      category: "Web",
      year: "2026",
      // "wide" spans 7 columns, "compact" spans 5 columns on desktop
      size: "wide",
      summary: "Mobile-first specialty coffee menu with instant category filtering and one-tap structured order summary.",
      image: "assets/mockup-roastcraft.svg",
      tech: ["HTML5", "CSS3", "JavaScript", "Web API"],
      problem: "Guests struggled to read static menu photos sent in chat threads and frequently asked about pricing and add-ons.",
      solution: "Built a lightweight static menu catalog with a browser-persisted tray that compiles structured customer orders in one tap.",
      features: [
        "Instant category filtering (Coffee, Matcha, Pastry)",
        "Zero-login local cart summary",
        "One-tap structured order checkout",
      ],
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/GO0DS2210",
    },
    {
      title: "LedgerSheet — Small Business Cashflow Tracker",
      category: "Automation",
      year: "2026",
      size: "compact",
      summary: "Automated income and expense ledger built in Google Sheets with one-click PDF invoice generation.",
      image: "assets/mockup-ledgersheet.svg",
      tech: ["Google Sheets", "Apps Script", "PDF Automation"],
      problem: "Paper receipts and scattered spreadsheets made weekly profit tracking slow and error-prone for small teams.",
      solution: "Designed a clean entry sheet paired with Apps Script formulas to summarize revenue trends and export PDF receipts.",
      features: [
        "Automated revenue, expense, and net margin totals",
        "One-click PDF receipt export saved to Google Drive",
        "Works seamlessly across mobile and desktop",
      ],
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/GO0DS2210",
    },
    {
      title: "TaskFlow — Offline Task & Milestone Board",
      category: "Web",
      year: "2025",
      size: "compact",
      summary: "Offline-first browser workspace to organize weekly priorities, deadlines, and portable JSON backups.",
      image: "assets/mockup-taskflow.svg",
      tech: ["JavaScript", "CSS Grid", "LocalStorage"],
      problem: "Project deadlines scattered across chat channels caused missed handoffs and fragmented personal planning.",
      solution: "Created a distraction-free board running locally in the browser with zero sign-up friction.",
      features: [
        "Active vs completed milestone grouping",
        "One-click JSON export and restore",
        "Works reliably without an internet connection",
      ],
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/GO0DS2210",
    },
    {
      title: "BookVault — Mobile Library Catalog Redesign",
      category: "Design",
      year: "2025",
      size: "wide",
      summary: "UI/UX case study streamlining mobile book search and live shelf availability for faster checkouts.",
      image: "assets/mockup-bookvault.svg",
      tech: ["Figma", "Design Systems", "Prototyping"],
      problem: "Legacy catalog search required multiple screen transitions on mobile just to verify shelf availability.",
      solution: "Consolidated discovery into instant search cards displaying live shelf status and one-tap reservation.",
      features: [
        "Consistent typographic scale and accessible contrast",
        "Interactive clickable prototype tested with 10 users",
        "Cut average title lookup steps in half",
      ],
      demoUrl: "https://example.com",
      repoUrl: "",
    },
  ],

  // --------------------------------------------------------------------------
  // 5. EXPERIENCE
  // --------------------------------------------------------------------------
  timeline: [
    {
      period: "2025 — Present",
      title: "Independent Web & Digital Product Creator",
      organization: "Self-Directed Studio",
      description: "Designing reusable web templates, lightweight business landing pages, and small-team productivity scripts.",
    },
    {
      period: "2024 — Present",
      title: "Web & Interface Contributor",
      organization: "Community & Student Initiatives",
      description: "Built event microsites, registration workflows, and accessible documentation hubs for local teams.",
    },
  ],

  // --------------------------------------------------------------------------
  // 6. CERTIFICATIONS
  // --------------------------------------------------------------------------
  certifications: [
    {
      title: "Web Development Fundamentals",
      issuer: "Online Certification",
      year: "2025",
      url: "",
    },
    {
      title: "Responsive Web Design",
      issuer: "Independent Credential",
      year: "2025",
      url: "",
    },
    {
      title: "JavaScript & Interactive Interfaces",
      issuer: "Independent Credential",
      year: "2026",
      url: "",
    },
  ],

  // --------------------------------------------------------------------------
  // 7. CONTACT & SOCIAL LINKS
  // --------------------------------------------------------------------------
  contact: {
    heading: "Have a project in mind or want to connect?",
    subheading: "Reach out by phone or email anytime. I usually respond within one business day.",
    email: "hello@go0ds2210.dev",

    // Replace xxxxxxx with your real phone number (or leave "" to hide the phone button)
    phoneNumber: "+xx xxxxxxx",

    socials: {
      github: "https://github.com/GO0DS2210",
      linkedin: "https://linkedin.com/in/username",
      instagram: "https://instagram.com/username",
      website: "",
    },
  },
};
