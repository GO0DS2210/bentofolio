/**
 * ============================================================================
 * FOLIOPRO — EDITORIAL PORTFOLIO ENGINE
 * Reads config.js and renders an interactive, printable monograph portfolio.
 * ============================================================================
 */

(function () {
  "use strict";

  const cfg = window.PORTFOLIO_CONFIG;
  if (!cfg) {
    console.error("PORTFOLIO_CONFIG not found. Make sure config.js loads before app.js.");
    return;
  }

  const STORAGE_THEME = "foliopro_en_theme";
  const STORAGE_PRESET = "foliopro_en_preset";
  const VALID_PRESETS = ["cobalt", "forest", "crimson", "slate"];

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

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
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
    document.querySelectorAll(".swatch").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.setPreset === valid);
    });
    try { localStorage.setItem(STORAGE_PRESET, valid); } catch (_) {}
  }

  function initTheme() {
    let savedTheme = null;
    let savedPreset = null;
    try {
      savedTheme = localStorage.getItem(STORAGE_THEME);
      savedPreset = localStorage.getItem(STORAGE_PRESET);
    } catch (_) {}

    applyTheme(savedTheme || cfg.theme?.defaultMode || "light");
    applyPreset(savedPreset || cfg.theme?.preset || "cobalt");

    if (cfg.theme?.pageTitle) {
      document.title = cfg.theme.pageTitle;
    }

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }

    document.querySelectorAll(".swatch").forEach((btn) => {
      btn.addEventListener("click", () => applyPreset(btn.dataset.setPreset));
    });
  }

  // --------------------------------------------------------------------------
  // 2. Opening Monograph
  // --------------------------------------------------------------------------
  function renderOpening() {
    const p = cfg.profile || {};
    document.getElementById("nav-brand").textContent = p.brandShort || p.name || "Portfolio";
    document.getElementById("hero-headline").textContent = p.headline || p.bio || "";

    const metaParts = [p.role, p.institution].filter(Boolean);
    document.getElementById("hero-institution").textContent = metaParts.join(", ");
    document.getElementById("hero-location").textContent = p.location || "";

    const availEl = document.getElementById("availability-note");
    if (p.availability && p.availability.show && p.availability.text) {
      availEl.textContent = p.availability.text;
      availEl.hidden = false;
    } else {
      availEl.hidden = true;
    }

    const avatarImg = document.getElementById("hero-avatar");
    avatarImg.src = safeUrl(p.avatar) || "assets/avatar-placeholder.svg";
    avatarImg.alt = `Portrait of ${p.name || "Creator"}`;

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
  }

  // --------------------------------------------------------------------------
  // 3. Selected Work — Expandable Editorial Index
  // --------------------------------------------------------------------------
  let activeCategory = "All";
  let expandedIndex = 0;

  function renderProjectsList() {
    const projects = Array.isArray(cfg.projects) ? cfg.projects : [];
    const listEl = document.getElementById("projects-list");

    const filtered = projects
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => activeCategory === "All" || item.category === activeCategory);

    listEl.innerHTML = filtered
      .map(({ item, idx }) => {
        const isOpen = expandedIndex === idx;
        const imgUrl = safeUrl(item.image);
        const demoLink = safeUrl(item.demoUrl);
        const repoLink = safeUrl(item.repoUrl);
        const techText = (item.tech || []).join(", ");
        const features = Array.isArray(item.features) ? item.features : [];

        return `
        <article class="work-item">
          <button
            type="button"
            class="work-trigger"
            data-toggle-project="${idx}"
            aria-expanded="${isOpen}"
            aria-controls="work-panel-${idx}"
          >
            <span class="work-year">${escapeHtml(item.year || "")}</span>
            <div class="work-title-wrap">
              <h3 class="work-title">${escapeHtml(item.title)}</h3>
              <p class="work-short">${escapeHtml(item.summary)}</p>
            </div>
            <span class="work-category">${escapeHtml(item.category || "")}</span>
            <span class="work-toggle-label">${isOpen ? "Close" : "View details"}</span>
          </button>

          <div class="work-detail" id="work-panel-${idx}" ${isOpen ? "" : "hidden"}>
            <div class="work-detail-inner">
              ${
                imgUrl
                  ? `<div class="work-screenshot"><img src="${escapeHtml(imgUrl)}" alt="Preview of ${escapeHtml(item.title)}" loading="lazy" /></div>`
                  : ""
              }
              <div class="case-grid">
                ${
                  item.problem
                    ? `<div class="case-block"><h4>Challenge</h4><p>${escapeHtml(item.problem)}</p></div>`
                    : ""
                }
                ${
                  item.solution
                    ? `<div class="case-block"><h4>Approach</h4><p>${escapeHtml(item.solution)}</p></div>`
                    : ""
                }
              </div>
              ${
                features.length
                  ? `<ul class="feature-list">${features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>`
                  : ""
              }
              ${techText ? `<p class="tech-line"><strong>Technologies:</strong> ${escapeHtml(techText)}</p>` : ""}
              <div class="work-links">
                ${demoLink ? `<a href="${escapeHtml(demoLink)}" target="_blank" rel="noopener" class="btn-solid">Open live demo</a>` : ""}
                ${repoLink ? `<a href="${escapeHtml(repoLink)}" target="_blank" rel="noopener" class="btn-outline">View code on GitHub</a>` : ""}
              </div>
            </div>
          </div>
        </article>`;
      })
      .join("");

    listEl.querySelectorAll("[data-toggle-project]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const clicked = Number(btn.dataset.toggleProject);
        expandedIndex = expandedIndex === clicked ? -1 : clicked;
        renderProjectsList();
      });
    });
  }

  function renderProjects() {
    const projects = Array.isArray(cfg.projects) ? cfg.projects : [];
    const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
    const filterBar = document.getElementById("project-filters");

    filterBar.innerHTML = categories
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

    filterBar.querySelectorAll(".filter-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.filter;
        const firstMatch = projects.findIndex(
          (p) => activeCategory === "All" || p.category === activeCategory
        );
        expandedIndex = firstMatch;
        filterBar.querySelectorAll(".filter-tab").forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-selected", String(isActive));
        });
        renderProjectsList();
      });
    });

    renderProjectsList();
  }

  // --------------------------------------------------------------------------
  // 4. Experience, About, Certifications & Contact
  // --------------------------------------------------------------------------
  function renderTimeline() {
    const items = Array.isArray(cfg.timeline) ? cfg.timeline : [];
    document.getElementById("timeline-list").innerHTML = items
      .map(
        (item) => `
        <article class="timeline-entry">
          <div class="timeline-period">${escapeHtml(item.period)}</div>
          <div>
            <h3 class="timeline-role">${escapeHtml(item.title)}</h3>
            <p class="timeline-org">${escapeHtml(item.organization)}${item.type ? ` (${escapeHtml(item.type)})` : ""}</p>
            <p class="timeline-desc">${escapeHtml(item.description)}</p>
          </div>
        </article>`
      )
      .join("");
  }

  function renderAboutAndSkills() {
    const paragraphs = Array.isArray(cfg.about?.paragraphs) ? cfg.about.paragraphs : [];
    document.getElementById("about-paragraphs").innerHTML = paragraphs
      .map((text) => `<p>${escapeHtml(text)}</p>`)
      .join("");

    const groups = Array.isArray(cfg.skillGroups) ? cfg.skillGroups : [];
    document.getElementById("skills-container").innerHTML = groups
      .map(
        (group) => `
        <div class="capability-col">
          <h3>${escapeHtml(group.title)}</h3>
          <ul>
            ${(group.items || []).map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}
          </ul>
        </div>`
      )
      .join("");
  }

  function renderCertifications() {
    const certs = Array.isArray(cfg.certifications) ? cfg.certifications : [];
    document.getElementById("cert-list").innerHTML = certs
      .map((cert) => {
        const link = safeUrl(cert.url);
        return `
        <li class="cert-row">
          <span class="cert-year">${escapeHtml(cert.year || "")}</span>
          <div>
            <span class="cert-name">${escapeHtml(cert.title)}</span>
            <span class="cert-issuer">${escapeHtml(cert.issuer)}</span>
          </div>
          ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener" class="cert-verify">Verify</a>` : ""}
        </li>`;
      })
      .join("");
  }

  function renderContactAndFooter() {
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
          `<a href="tel:${escapeHtml(telDigits)}" class="btn-solid">Phone: ${escapeHtml(rawPhone)}</a>`
        );
      } else {
        actions.push(
          `<button type="button" class="btn-solid" id="copy-phone-btn">Phone: ${escapeHtml(rawPhone)}</button>`
        );
      }
    }
    if (c.email) {
      actions.push(
        `<a href="mailto:${escapeHtml(c.email)}" class="btn-outline">${escapeHtml(c.email)}</a>`
      );
    }
    document.getElementById("contact-actions").innerHTML = actions.join("");

    const copyPhoneBtn = document.getElementById("copy-phone-btn");
    if (copyPhoneBtn && rawPhone) {
      copyPhoneBtn.addEventListener("click", () => showToast(`Phone: ${rawPhone}`));
    }

    const labels = {
      github: "GitHub",
      linkedin: "LinkedIn",
      instagram: "Instagram",
      website: "Website",
    };
    const socials = c.socials || {};
    document.getElementById("social-row").innerHTML = Object.entries(labels)
      .map(([key, label]) => {
        const url = safeUrl(socials[key]);
        return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>` : "";
      })
      .filter(Boolean)
      .join("");

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
  renderOpening();
  renderProjects();
  renderTimeline();
  renderAboutAndSkills();
  renderCertifications();
  renderContactAndFooter();
  initMobileNav();
})();
