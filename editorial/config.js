/**
 * ============================================================================
 * FOLIOPRO — EDITORIAL PORTFOLIO CONFIGURATION (BONUS EDITION)
 * ============================================================================
 * Edit ONLY this file to update all content, colors, projects, and links.
 * ============================================================================
 */

window.PORTFOLIO_CONFIG = {
  theme: {
    // High-contrast studio accents: "cobalt" | "forest" | "crimson" | "slate"
    preset: "cobalt",
    defaultMode: "light",
    pageTitle: "GO0DS2210 — Editorial Portfolio",
  },

  profile: {
    name: "GO0DS2210",
    brandShort: "GO0DS2210",
    headline: "Building fast, clean, and maintainable web applications.",
    role: "Web & Digital Creator",
    institution: "Indonesia",
    location: "Indonesia",

    availability: {
      show: true,
      text: "Open for collaborations & new opportunities",
    },

    avatar: "assets/avatar-placeholder.svg",
    // Leave "" for one-click auto-downloaded PDF resume, or set "assets/Resume.pdf"
    cvFileUrl: "",
  },

  projects: [
    {
      title: "Roast & Craft — Menu Catalog & Quick Order",
      category: "Web",
      year: "2026",
      summary: "Mobile-first coffee shop menu with instant category filters and structured online ordering.",
      image: "",
      tech: ["HTML5", "CSS3", "JavaScript", "Web API"],
      problem: "Guests struggled to read static menu photos sent in chats and frequently asked for updated pricing.",
      solution: "Designed a static, login-free catalog allowing customers to pick items and compile structured orders in one tap.",
      features: [
        "Instant category filtering",
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
      summary: "Daily transaction ledger in Google Sheets with automated monthly summaries and PDF receipt export.",
      image: "",
      tech: ["Google Sheets", "Apps Script", "JavaScript"],
      problem: "Small teams struggled to calculate net margins weekly when receipts were scattered on paper.",
      solution: "Built a structured entry sheet paired with Apps Script automation to compile trends and export PDF invoices.",
      features: [
        "Automated revenue, expense, and net margin totals",
        "One-click PDF invoice export to Google Drive",
        "Accessible on both mobile and desktop",
      ],
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/GO0DS2210",
    },
    {
      title: "TaskFlow — Offline Task & Milestone Board",
      category: "Web",
      year: "2025",
      summary: "Offline-first browser workspace to organize weekly priorities, deadlines, and JSON backups.",
      image: "",
      tech: ["JavaScript", "CSS Grid", "LocalStorage"],
      problem: "Scattered deadlines across chat groups caused missed handoffs and fragmented planning.",
      solution: "Created a lightweight browser board with priority grouping and zero sign-up friction.",
      features: [
        "Active vs completed task grouping",
        "Export and restore portable JSON backups",
        "Compact printable weekly summary",
      ],
      demoUrl: "https://example.com",
      repoUrl: "",
    },
    {
      title: "BookVault — Mobile Library Catalog Redesign",
      category: "Design",
      year: "2025",
      summary: "UI/UX case study simplifying mobile catalog search and live shelf availability indicators.",
      image: "",
      tech: ["Figma", "Design Systems", "Prototyping"],
      problem: "Searching books on mobile previously took too many page transitions before showing availability.",
      solution: "Streamlined discovery into instant search cards displaying live shelf status directly in results.",
      features: [
        "Consistent typographic scale and color contrast",
        "Interactive prototype tested with 10 users",
        "Significantly reduced average lookup steps",
      ],
      demoUrl: "https://example.com",
      repoUrl: "",
    },
  ],

  timeline: [
    {
      period: "2025 — Present",
      type: "Independent",
      title: "Web & Digital Product Creator",
      organization: "Self-Directed Studio",
      description: "Designing reusable web templates, lightweight business landing pages, and small-team productivity scripts.",
    },
    {
      period: "2024 — Present",
      type: "Community",
      title: "Web & Interface Contributor",
      organization: "Community Initiatives",
      description: "Built event microsites, registration workflows, and accessible documentation hubs for local teams.",
    },
  ],

  about: {
    paragraphs: [
      "Focused on building clean, fast, and accessible web pages that simplify everyday workflows and digital projects.",
      "Open to collaborative web projects, remote internships, and crafting lightweight digital tools ready for immediate use.",
    ],
  },

  skillGroups: [
    {
      title: "Frontend Web",
      items: ["Semantic HTML5", "CSS3 & Grid Layout", "JavaScript", "Responsive Design"],
    },
    {
      title: "Data & Automation",
      items: ["Google Sheets", "Google Apps Script", "SQL Basics", "REST APIs"],
    },
    {
      title: "Workflow Tools",
      items: ["Git & GitHub", "Figma", "Netlify / GitHub Pages", "AI-Assisted Dev"],
    },
  ],

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

  contact: {
    heading: "Have a project in mind or want to connect?",
    subheading: "Reach out by phone or email anytime. I typically reply within one business day.",
    email: "hello@go0ds2210.dev",
    phoneNumber: "+xx xxxxxxx",
    socials: {
      github: "https://github.com/GO0DS2210",
      linkedin: "https://linkedin.com/in/username",
      instagram: "https://instagram.com/username",
      website: "",
    },
  },
};
