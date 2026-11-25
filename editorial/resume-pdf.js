/**
 * ============================================================================
 * PURE VANILLA JS PDF 1.4 RESUME GENERATOR
 * ============================================================================
 * Generates a downloadable A4 PDF resume directly from window.PORTFOLIO_CONFIG
 * with zero external libraries or build tools. Works on file:// and static web
 * hosts, or downloads a custom cvFileUrl PDF when configured.
 * ============================================================================
 */
(function () {
  "use strict";

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN_X = 48;
  const CONTENT_W = PAGE_W - MARGIN_X * 2;
  const TOP_Y = 782;
  const BOTTOM_Y = 56;

  const ACCENT_RGB_MAP = {
    cobalt: "0.10 0.31 0.84",
    matcha: "0.11 0.44 0.29",
    forest: "0.11 0.44 0.29",
    terracotta: "0.66 0.24 0.17",
    crimson: "0.66 0.16 0.20",
    plum: "0.40 0.22 0.58",
    slate: "0.24 0.31 0.40",
  };

  function toPdfAscii(input) {
    return String(input || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2022\u00B7]/g, "-")
      .replace(/[^\x20-\x7E]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapePdfText(text) {
    return toPdfAscii(text)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function wrapLines(text, maxChars) {
    const clean = toPdfAscii(text);
    if (!clean) return [];
    const words = clean.split(" ");
    const lines = [];
    let current = "";

    for (const word of words) {
      if (!current) {
        current = word;
      } else if (current.length + 1 + word.length <= maxChars) {
        current += " " + word;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function safeCustomUrl(raw) {
    if (!raw || typeof raw !== "string") return "";
    const trimmed = raw.trim();
    if (!trimmed || /^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return "";
    if (/^(https?:\/\/|\.\/|\.\.\/|[a-zA-Z0-9_\-]+\/)/i.test(trimmed) || /^[a-zA-Z0-9_\-]+\.[a-z0-9]+$/i.test(trimmed)) {
      return trimmed;
    }
    return "";
  }

  function slugFilename(name, lang) {
    const base = toPdfAscii(name || (lang === "id" ? "Portofolio" : "Portfolio"))
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const suffix = lang === "id" ? "CV.pdf" : "Resume.pdf";
    return `${base || (lang === "id" ? "Portofolio" : "Portfolio")}-${suffix}`;
  }

  function buildResumePdfBytes(rawCfg, lang) {
    const cfg = rawCfg || {};
    const isId = lang === "id";
    const p = cfg.profile || {};
    const c = cfg.contact || {};
    const socials = c.socials || {};

    const labels = isId
      ? {
          summary: "RINGKASAN",
          skills: "KEAHLIAN & ALAT",
          projects: "PROYEK PILIHAN",
          experience: "PENGALAMAN",
          certifications: "SERTIFIKASI",
          footer: "Dibuat otomatis dari konfigurasi portofolio",
          page: "Halaman",
        }
      : {
          summary: "SUMMARY",
          skills: "SKILLS & TOOLS",
          projects: "SELECTED WORK",
          experience: "EXPERIENCE",
          certifications: "CERTIFICATIONS",
          footer: "Generated from portfolio configuration",
          page: "Page",
        };

    const activePreset =
      (typeof document !== "undefined" && document.documentElement?.dataset?.accent) ||
      cfg.theme?.preset ||
      "cobalt";
    const accentRgb = ACCENT_RGB_MAP[activePreset] || ACCENT_RGB_MAP.cobalt;

    const pages = [[]];
    let y = TOP_Y;

    // Subtle studio top accent stripe on page 1
    pages[0].push(`${accentRgb} rg ${MARGIN_X} 806 ${CONTENT_W.toFixed(2)} 3.2 re f`);

    function ensureSpace(needed) {
      if (y - needed < BOTTOM_Y) {
        pages.push([]);
        y = TOP_Y;
      }
    }

    function pushCmd(cmd) {
      pages[pages.length - 1].push(cmd);
    }

    function drawText(text, fontKey, size, x, lineY, rgb) {
      const safe = escapePdfText(text);
      if (!safe) return;
      pushCmd(`BT /${fontKey} ${size} Tf ${rgb} rg ${x.toFixed(2)} ${lineY.toFixed(2)} Td (${safe}) Tj ET`);
    }

    function drawRule(lineY) {
      pushCmd(`0.84 0.86 0.90 RG 0.65 w ${MARGIN_X} ${lineY.toFixed(2)} m ${(PAGE_W - MARGIN_X).toFixed(2)} ${lineY.toFixed(2)} l S`);
    }

    function drawParagraph(text, fontKey, size, lineHeight, maxChars, rgb, indentX) {
      const lines = wrapLines(text, maxChars);
      const x = MARGIN_X + (indentX || 0);
      for (const line of lines) {
        ensureSpace(lineHeight + 2);
        drawText(line, fontKey, size, x, y, rgb);
        y -= lineHeight;
      }
    }

    function drawSectionHeader(title) {
      ensureSpace(34);
      y -= 8;
      drawText(title, "F2", 9.5, MARGIN_X, y, accentRgb);
      y -= 5;
      drawRule(y);
      y -= 13;
    }

    // Header
    const displayName = p.name || p.brandShort || "Creator";
    drawText(displayName, "F2", 20, MARGIN_X, y, "0.07 0.09 0.13");
    y -= 18;

    const place = p.institution || p.city || p.location || "";
    const subtitle = [p.role, place].filter(Boolean).join(" - ");
    if (subtitle) {
      drawParagraph(subtitle, "F1", 10.5, 14, 86, "0.26 0.32 0.39", 0);
      y -= 2;
    }

    const extraLoc = p.city || p.location || "";
    const contactParts = [];
    if (extraLoc && !subtitle.includes(extraLoc)) contactParts.push(extraLoc);
    if (c.email) contactParts.push(c.email);
    if (c.phoneNumber) contactParts.push(c.phoneNumber);
    if (socials.github) contactParts.push(socials.github.replace(/^https?:\/\//i, ""));
    if (socials.website) contactParts.push(socials.website.replace(/^https?:\/\//i, ""));

    if (contactParts.length > 0) {
      drawParagraph(contactParts.join("  |  "), "F1", 9, 13, 98, "0.35 0.41 0.48", 0);
    }

    y -= 4;
    drawRule(y);
    y -= 8;

    // Summary
    const summaryBlocks = [];
    if (p.headline) summaryBlocks.push(p.headline);
    if (p.bio) summaryBlocks.push(p.bio);
    if (Array.isArray(cfg.about?.paragraphs)) {
      for (const para of cfg.about.paragraphs) {
        if (para) summaryBlocks.push(para);
      }
    }
    if (summaryBlocks.length > 0) {
      drawSectionHeader(labels.summary);
      for (const block of summaryBlocks) {
        drawParagraph(block, "F1", 9.8, 13.8, 92, "0.16 0.20 0.26", 0);
        y -= 3;
      }
    }

    // Skills (supports both flat array and grouped editorial skills)
    const flatSkills = Array.isArray(cfg.skills) ? cfg.skills.filter(Boolean) : [];
    const groupedSkills = Array.isArray(cfg.skillGroups) ? cfg.skillGroups.filter((g) => g && g.title) : [];
    if (flatSkills.length > 0 || groupedSkills.length > 0) {
      drawSectionHeader(labels.skills);
      if (flatSkills.length > 0) {
        drawParagraph(flatSkills.join("  -  "), "F1", 9.5, 13.5, 92, "0.16 0.20 0.26", 0);
      }
      for (const grp of groupedSkills) {
        const items = Array.isArray(grp.items) ? grp.items.join(", ") : "";
        drawParagraph(`${grp.title}: ${items}`, "F1", 9.5, 13.5, 92, "0.16 0.20 0.26", 0);
      }
    }

    // Projects
    const projects = Array.isArray(cfg.projects) ? cfg.projects : [];
    if (projects.length > 0) {
      drawSectionHeader(labels.projects);
      for (const proj of projects) {
        ensureSpace(38);
        const meta = [proj.category, proj.year].filter(Boolean).join(" | ");
        const heading = meta ? `${proj.title || ""} (${meta})` : (proj.title || "");
        drawParagraph(heading, "F2", 10, 13.5, 86, "0.08 0.11 0.16", 0);
        if (proj.summary) {
          drawParagraph(proj.summary, "F1", 9.3, 13, 94, "0.22 0.27 0.34", 8);
        }
        if (Array.isArray(proj.tech) && proj.tech.length > 0) {
          drawParagraph(`Stack: ${proj.tech.join(", ")}`, "F1", 8.6, 12, 98, "0.38 0.44 0.52", 8);
        }
        y -= 5;
      }
    }

    // Experience
    const timeline = Array.isArray(cfg.timeline) ? cfg.timeline : [];
    if (timeline.length > 0) {
      drawSectionHeader(labels.experience);
      for (const item of timeline) {
        ensureSpace(34);
        const orgPeriod = [item.organization, item.period].filter(Boolean).join(" | ");
        const lineTitle = orgPeriod ? `${item.title || ""} - ${orgPeriod}` : (item.title || "");
        drawParagraph(lineTitle, "F2", 9.8, 13.5, 86, "0.08 0.11 0.16", 0);
        if (item.description) {
          drawParagraph(item.description, "F1", 9.3, 13, 94, "0.22 0.27 0.34", 8);
        }
        y -= 4;
      }
    }

    // Certifications
    const certs = Array.isArray(cfg.certifications) ? cfg.certifications : [];
    if (certs.length > 0) {
      drawSectionHeader(labels.certifications);
      for (const cert of certs) {
        const detail = [cert.issuer, cert.year].filter(Boolean).join(", ");
        const line = detail ? `- ${cert.title || ""} (${detail})` : `- ${cert.title || ""}`;
        drawParagraph(line, "F1", 9.3, 13, 94, "0.18 0.22 0.28", 0);
      }
    }

    // Add page footers once total page count is known
    const totalPages = pages.length;
    for (let i = 0; i < totalPages; i++) {
      pages[i].push(`BT /F1 8 Tf 0.48 0.53 0.59 rg ${MARGIN_X} 28 Td (${escapePdfText(labels.footer)}) Tj ET`);
      pages[i].push(`BT /F1 8 Tf 0.48 0.53 0.59 rg ${(PAGE_W - MARGIN_X - 62).toFixed(2)} 28 Td (${escapePdfText(`${labels.page} ${i + 1} / ${totalPages}`)}) Tj ET`);
    }

    // Assemble valid ASCII PDF 1.4 document with exact byte xref table
    const objects = [];
    // 1 = Catalog, 2 = Pages, 3 = Helvetica, 4 = Helvetica-Bold
    const pageObjIds = [];
    const nextStartId = 5;

    for (let i = 0; i < totalPages; i++) {
      pageObjIds.push(`${nextStartId + i * 2} 0 R`);
    }

    objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    objects.push(`2 0 obj\n<< /Type /Pages /Kids [ ${pageObjIds.join(" ")} ] /Count ${totalPages} >>\nendobj\n`);
    objects.push("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");
    objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");

    for (let i = 0; i < totalPages; i++) {
      const pageId = nextStartId + i * 2;
      const contentId = pageId + 1;
      const streamData = pages[i].join("\n") + "\n";

      objects.push(
        `${pageId} 0 obj\n` +
          `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
          `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`
      );
      objects.push(
        `${contentId} 0 obj\n<< /Length ${streamData.length} >>\nstream\n${streamData}endstream\nendobj\n`
      );
    }

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    for (const objStr of objects) {
      offsets.push(pdf.length);
      pdf += objStr;
    }

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let i = 1; i < offsets.length; i++) {
      pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

    const bytes = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) {
      bytes[i] = pdf.charCodeAt(i) & 0x7f;
    }
    return bytes;
  }

  function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  window.downloadResumePdf = function (cfg, lang) {
    const isId = lang === "id";
    const p = (cfg && cfg.profile) || {};
    const customUrl = safeCustomUrl(p.cvFileUrl);
    const filename = slugFilename(p.name || p.brandShort, lang);

    if (customUrl) {
      if (/^https?:\/\//i.test(customUrl)) {
        window.open(customUrl, "_blank", "noopener");
      } else {
        triggerDownload(customUrl, customUrl.split("/").pop() || filename);
      }
      return {
        filename: customUrl.split("/").pop() || filename,
        message: isId ? `Mengunduh ${filename}` : `Downloading ${filename}`,
      };
    }

    const pdfBytes = buildResumePdfBytes(cfg || {}, lang);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    triggerDownload(blobUrl, filename);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

    return {
      filename,
      message: isId ? `CV diunduh: ${filename}` : `Downloaded ${filename}`,
    };
  };

  // Expose raw builder for automated verification under Node or browser tests
  window.__buildResumePdfBytes = buildResumePdfBytes;
})();
