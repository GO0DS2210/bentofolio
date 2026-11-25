/**
 * ============================================================================
 * BENTOFOLIO — INTERACTIVE RENDER ENGINE
 * Reads config.js and powers theme switching, live clock, subtle tilt,
 * project category filtering, inline case studies, and PDF resume export.
 * ============================================================================
 */

(function () {
  "use strict";

  const cfg = window.BENTO_CONFIG;
  if (!cfg) {
    console.error("BENTO_CONFIG not found. Make sure config.js loads before app.js.");
    return;
  }

  const STORAGE_THEME = "bentofolio_en_theme_mode";
  const STORAGE_PRESET = "bentofolio_en_theme_preset";
  const VALID_PRESETS = ["cobalt", "matcha", "terracotta", "plum"];

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(url) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (
      trimmed.startsWith("https://") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("assets/") ||
      trimmed.startsWith("./") ||
      trimmed.startsWith("#")
    ) {
      return trimmed;
    }
    return "";
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  // --------------------------------------------------------------------------
  // 1. Theme & Accent Presets
  // --------------------------------------------------------------------------
  function applyTheme(mode) {
    const valid = mode === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", valid);
    try { localStorage.setItem(STORAGE_THEME, valid); } catch (_) {}
  }

  function applyPreset(preset) {
    const valid = VALID_PRESETS.includes(preset) ? preset : "cobalt";
    document.documentElement.setAttribute("data-preset", valid);
    document.querySelectorAll(".swatch-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.setPreset === valid);
    });
    try { localStorage.setItem(STORAGE_PRESET, valid); } catch (_) {}
  }

  function initTheme() {
    let savedMode = null;
    let savedPreset = null;
    try {
      savedMode = localStorage.getItem(STORAGE_THEME);
      savedPreset = localStorage.getItem(STORAGE_PRESET);
    } catch (_) {}

    applyTheme(savedMode || cfg.theme?.defaultMode || "light");
    applyPreset(savedPreset || cfg.theme?.preset || "cobalt");

    if (cfg.theme?.pageTitle) {
      document.title = cfg.theme.pageTitle;
    }

    document.getElementById("theme-toggle").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });

    document.querySelectorAll(".swatch-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyPreset(btn.dataset.setPreset));
    });
  }

  // --------------------------------------------------------------------------
  // 2. Profile, Scenic Media, Live Clock & Subtle Tilt
  // --------------------------------------------------------------------------
  const SOCIAL_ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
    website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  };

  function renderProfile() {
    const p = cfg.profile || {};
    document.getElementById("nav-brand").textContent = p.name || "Portfolio";
    document.getElementById("hero-availability").textContent = p.availability || "Available";
    document.getElementById("hero-headline").textContent = p.headline || "";
    document.getElementById("hero-bio").textContent = p.bio || "";

    document.getElementById("profile-name").textContent = p.name || "";
    document.getElementById("profile-handle").textContent = p.handle || "";
    document.getElementById("profile-role").textContent = p.role || "";
    document.getElementById("profile-city").textContent = p.city || "";

    const avatar = document.getElementById("hero-avatar");
    avatar.src = safeUrl(p.avatar) || "assets/avatar-go0ds.svg";
    avatar.alt = `Portrait of ${p.name || "Creator"}`;

    const mediaBox = document.getElementById("profile-media");
    if (mediaBox) {
      const videoUrl = safeUrl(p.profileBgVideo);
      const imgUrl = safeUrl(p.profileBgImage) || "assets/bg-indonesia.jpg";
      const prefersReduced =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (videoUrl && !prefersReduced) {
        const videoEl = document.createElement("video");
        videoEl.src = videoUrl;
        videoEl.poster = imgUrl;
        videoEl.autoplay = true;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.setAttribute("muted", "");
        videoEl.setAttribute("playsinline", "");
        mediaBox.innerHTML = "";
        mediaBox.appendChild(videoEl);
      } else {
        mediaBox.innerHTML = `<img src="${escapeHtml(imgUrl)}" alt="" />`;
      }
    }

    const cvBtn = document.getElementById("cv-action-btn");
    const cvLabel = document.getElementById("cv-action-label");
    cvLabel.textContent = "Download Resume (PDF)";
    cvBtn.addEventListener("click", () => {
      if (window.downloadResumePdf) {
        const result = window.downloadResumePdf(cfg, "en");
        showToast(result?.message || "Downloading Resume (PDF)...");
        return;
      }
      const cvUrl = safeUrl(p.cvFileUrl);
      if (cvUrl) window.open(cvUrl, "_blank", "noopener");
    });

    const copyBtn = document.getElementById("copy-email-btn");
    const email = cfg.contact?.email || "";
    if (!email) {
      copyBtn.hidden = true;
    } else {
      copyBtn.addEventListener("click", async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(email);
          } else {
            const ta = document.createElement("textarea");
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
          }
          showToast(`Email copied: ${email}`);
        } catch (_) {
          showToast(`Email: ${email}`);
        }
      });
    }

    const socials = cfg.contact?.socials || {};
    const names = { github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram", website: "Website" };
    document.getElementById("hero-socials").innerHTML = Object.entries(names)
      .map(([key, label]) => {
        const url = safeUrl(socials[key]);
        if (!url) return "";
        return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="social-btn">${SOCIAL_ICONS[key]}<span>${label}</span></a>`;
      })
      .filter(Boolean)
      .join("");

    const skills = Array.isArray(cfg.skills) ? cfg.skills : [];
    document.getElementById("skills-track").innerHTML = skills
      .map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`)
      .join("");
  }

  function initLiveClock() {
    const el = document.getElementById("live-clock");
    if (!el) return;
    const tz = cfg.profile?.timezone || "Asia/Jakarta";
    const tzLabel = cfg.profile?.timezoneLabel || "WIB";

    function tick() {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        el.textContent = `${formatted} ${tzLabel}`;
      } catch (_) {
        el.textContent = tzLabel;
      }
    }
    tick();
    setInterval(tick, 15000);
  }

  function initProfileTilt() {
    const card = document.getElementById("profile-card");
    if (!card) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 6;
      const rotateX = (0.5 - y) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  }

  // --------------------------------------------------------------------------
  // 3. Projects & Filtering
  // --------------------------------------------------------------------------
  let activeCategory = "All";
  const openProjects = new Set();

  function renderProjectGrid() {
    const projects = Array.isArray(cfg.projects) ? cfg.projects : [];
    const grid = document.getElementById("projects-grid");

    const filtered = projects
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => activeCategory === "All" || item.category === activeCategory);

    grid.innerHTML = filtered
      .map(({ item, idx }) => {
        const isExpanded = openProjects.has(idx);
        const sizeClass = item.size === "wide" ? "size-wide" : item.size === "compact" ? "size-compact" : "";
        const img = safeUrl(item.image);
        const demoUrl = safeUrl(item.demoUrl);
        const repoUrl = safeUrl(item.repoUrl);
        const techList = (item.tech || []).join(" · ");
        const features = Array.isArray(item.features) ? item.features : [];

        return `
        <article class="tile project-tile ${sizeClass}">
          ${img ? `<div class="project-visual"><img src="${escapeHtml(img)}" alt="Preview of ${escapeHtml(item.title)}" loading="lazy" /></div>` : ""}
          <div class="project-content">
            <div class="project-meta">
              <span class="project-cat">${escapeHtml(item.category || "Work")}</span>
              <span class="project-year">${escapeHtml(item.year || "")}</span>
            </div>
            <h3 class="project-title">${escapeHtml(item.title)}</h3>
            <p class="project-summary">${escapeHtml(item.summary)}</p>
            ${techList ? `<p class="project-tech-line">${escapeHtml(techList)}</p>` : ""}

            <div class="project-actions">
              <button
                type="button"
                class="btn-primary"
                data-toggle-case="${idx}"
                aria-expanded="${isExpanded}"
                aria-controls="case-panel-${idx}"
              >${isExpanded ? "Hide details" : "View details"}</button>
              ${demoUrl ? `<a href="${escapeHtml(demoUrl)}" target="_blank" rel="noopener" class="btn-secondary">Live demo</a>` : ""}
              ${repoUrl ? `<a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener" class="btn-ghost">GitHub</a>` : ""}
            </div>

            <div class="project-case" id="case-panel-${idx}" ${isExpanded ? "" : "hidden"}>
              ${item.problem ? `<h4 class="case-heading">Problem</h4><p>${escapeHtml(item.problem)}</p>` : ""}
              ${item.solution ? `<h4 class="case-heading">Solution</h4><p>${escapeHtml(item.solution)}</p>` : ""}
              ${features.length ? `<h4 class="case-heading">Key features</h4><ul>${features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}
            </div>
          </div>
        </article>`;
      })
      .join("");

    grid.querySelectorAll("[data-toggle-case]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.toggleCase);
        if (openProjects.has(id)) openProjects.delete(id);
        else openProjects.add(id);
        renderProjectGrid();
      });
    });
  }

  function renderProjects() {
    const projects = Array.isArray(cfg.projects) ? cfg.projects : [];
    const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
    const filterEl = document.getElementById("project-filters");

    filterEl.innerHTML = categories
      .map(
        (cat) => `
        <button
          type="button"
          class="filter-tab ${cat === activeCategory ? "active" : ""}"
          role="tab"
          aria-selected="${cat === activeCategory}"
          data-filter="${escapeHtml(cat)}"
        >${escapeHtml(cat)}</button>`
      )
      .join("");

    filterEl.querySelectorAll(".filter-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.filter;
        filterEl.querySelectorAll(".filter-tab").forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        renderProjectGrid();
      });
    });

    renderProjectGrid();
  }

  // --------------------------------------------------------------------------
  // 4. Experience, Certifications, Contact & Footer
  // --------------------------------------------------------------------------
  function renderJourneyAndContact() {
    const timeline = Array.isArray(cfg.timeline) ? cfg.timeline : [];
    document.getElementById("timeline-list").innerHTML = timeline
      .map(
        (item) => `
        <article class="timeline-item">
          <span class="timeline-period">${escapeHtml(item.period)}</span>
          <h3 class="timeline-title">${escapeHtml(item.title)}</h3>
          <p class="timeline-org">${escapeHtml(item.organization)}</p>
          <p class="timeline-desc">${escapeHtml(item.description)}</p>
        </article>`
      )
      .join("");

    const certs = Array.isArray(cfg.certifications) ? cfg.certifications : [];
    document.getElementById("cert-list").innerHTML = certs
      .map((cert) => {
        const link = safeUrl(cert.url);
        return `
        <li class="cert-item">
          <div>
            <span class="cert-name">${escapeHtml(cert.title)}</span>
            <span class="cert-issuer">${escapeHtml(cert.issuer)}${cert.year ? ` (${escapeHtml(cert.year)})` : ""}</span>
          </div>
          ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener" class="cert-link">Verify</a>` : ""}
        </li>`;
      })
      .join("");

    const c = cfg.contact || {};
    document.getElementById("contact-heading").textContent = c.heading || "Let's connect.";
    document.getElementById("contact-sub").textContent = c.subheading || "";

    const actions = [];
    const rawPhone = String(c.phoneNumber || "").trim();
    if (rawPhone) {
      const hasMask = /[xX]/.test(rawPhone);
      const telDigits = rawPhone.replace(/[^0-9+]/g, "");
      if (!hasMask && telDigits) {
        actions.push(
          `<a href="tel:${escapeHtml(telDigits)}" class="btn-primary">Phone: ${escapeHtml(rawPhone)}</a>`
        );
      } else {
        actions.push(
          `<button type="button" class="btn-primary" id="copy-phone-btn">Phone: ${escapeHtml(rawPhone)}</button>`
        );
      }
    }
    if (c.email) {
      actions.push(`<a href="mailto:${escapeHtml(c.email)}" class="btn-secondary">${escapeHtml(c.email)}</a>`);
    }
    document.getElementById("contact-actions").innerHTML = actions.join("");

    const copyPhoneBtn = document.getElementById("copy-phone-btn");
    if (copyPhoneBtn && rawPhone) {
      copyPhoneBtn.addEventListener("click", () => {
        showToast(`Phone: ${rawPhone}`);
      });
    }

    const year = new Date().getFullYear();
    const owner = cfg.profile?.name || "Portfolio";
    document.getElementById("footer-copy").textContent = `© ${year} ${owner}`;
  }

  function initMobileNav() {
    const btn = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-nav");
    if (!btn || !drawer) return;

    btn.addEventListener("click", () => {
      const isOpen = !drawer.hidden;
      drawer.hidden = isOpen;
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        drawer.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  initTheme();
  renderProfile();
  initLiveClock();
  initProfileTilt();
  renderProjects();
  renderJourneyAndContact();
  initMobileNav();
})();
