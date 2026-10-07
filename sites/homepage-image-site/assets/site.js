const screens = [
  { n: 1, width: 1366, height: 910 },
  { n: 2, width: 1366, height: 480 },
  { n: 3, width: 1366, height: 370 },
  { n: 4, width: 1366, height: 161 },
  { n: 5, width: 1366, height: 434 },
  { n: 6, width: 1366, height: 1064 },
  { n: 7, width: 1366, height: 331 },
  { n: 8, width: 1366, height: 712 },
  { n: 9, width: 1366, height: 575 },
  { n: 10, width: 1366, height: 893 },
  { n: 11, width: 1366, height: 727 },
  { n: 12, width: 1366, height: 951 },
  { n: 13, width: 1366, height: 810 },
  { n: 14, width: 1366, height: 810 },
  { n: 15, width: 1366, height: 210 },
  { n: 16, width: 1366, height: 643 },
  { n: 17, width: 1366, height: 210 },
  { n: 18, width: 1366, height: 1763 },
  { n: 19, width: 1366, height: 1108 },
  { n: 20, width: 1366, height: 153 },
  { n: 21, width: 1366, height: 131 },
  { n: 22, width: 1366, height: 1217 },
  { n: 23, width: 1366, height: 311 },
  { n: 24, width: 1366, height: 1049 },
  { n: 25, width: 1366, height: 272 },
  { n: 26, width: 1366, height: 574 },
  { n: 27, width: 1366, height: 703 },
  { n: 28, width: 1366, height: 703 },
  { n: 29, width: 1366, height: 703 },
  { n: 30, width: 1366, height: 768 },
  { n: 31, width: 1366, height: 731 },
  { n: 32, width: 1366, height: 752 },
  { n: 33, width: 1366, height: 771 },
  { n: 34, width: 1366, height: 136 },
  { n: 35, width: 1366, height: 153 },
  { n: 36, width: 1366, height: 84 },
  { n: 37, width: 1366, height: 718 },
  { n: 38, width: 1366, height: 387 },
  { n: 39, width: 1366, height: 1524 },
  { n: 40, width: 1366, height: 1761 },
  { n: 41, width: 1366, height: 1463 },
];

const sectionLabels = [
  "Hero",
  "Intro",
  "Signal",
  "Divider",
  "Positioning",
  "Framework",
  "Proof",
  "Method",
  "Analysis",
  "Feature",
  "Context",
  "System",
  "Strategy",
  "Strategy",
  "Break",
  "Insight",
  "Break",
  "Deep Dive",
  "Workflow",
  "Marker",
  "Marker",
  "Long Form",
  "Summary",
  "Evidence",
  "Prompt",
  "Panel",
  "Panel",
  "Panel",
  "Panel",
  "Gallery",
  "Gallery",
  "Gallery",
  "Gallery",
  "Divider",
  "Divider",
  "Divider",
  "Detail",
  "Close",
  "Extended",
  "Extended",
  "Final",
];

function renderStack(target) {
  const fragment = document.createDocumentFragment();

  screens.forEach((screen, index) => {
    const img = document.createElement("img");
    img.src = `assets/screens/${screen.n}.png`;
    img.alt = `WISIK homepage capture ${screen.n}`;
    img.width = screen.width;
    img.height = screen.height;
    img.loading = index < 2 ? "eager" : "lazy";
    img.decoding = "async";
    img.id = `screen-${screen.n}`;
    fragment.appendChild(img);
  });

  target.appendChild(fragment);
}

function renderRemake(target) {
  const fragment = document.createDocumentFragment();

  screens.forEach((screen, index) => {
    const section = document.createElement("article");
    section.className = "remake-section";
    section.id = `screen-${screen.n}`;

    const meta = document.createElement("div");
    meta.className = "section-meta";
    meta.innerHTML = `<span>${String(screen.n).padStart(2, "0")}</span><strong>${
      sectionLabels[index]
    }</strong>`;

    const imageWrap = document.createElement("div");
    imageWrap.className = "image-frame";
    imageWrap.style.setProperty("--ratio", `${screen.width} / ${screen.height}`);

    const img = document.createElement("img");
    img.src = `assets/screens/${screen.n}.png`;
    img.alt = `WISIK responsive section ${screen.n}`;
    img.width = screen.width;
    img.height = screen.height;
    img.loading = index < 2 ? "eager" : "lazy";
    img.decoding = "async";

    imageWrap.appendChild(img);
    section.append(meta, imageWrap);
    fragment.appendChild(section);
  });

  target.appendChild(fragment);
}

const target =
  document.querySelector("[data-render-mode='stack']") ||
  document.querySelector("[data-render-mode='remake']");

if (target?.dataset.renderMode === "stack") {
  renderStack(target);
}

if (target?.dataset.renderMode === "remake") {
  renderRemake(target);
}
