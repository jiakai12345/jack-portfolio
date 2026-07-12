(function () {
  const data = window.portfolioData;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  $$("[data-bind]").forEach((node) => {
    const key = node.dataset.bind;
    if (data.person[key]) node.textContent = data.person[key];
  });

  function initHomeExperience() {
    const home = $(".works-home");
    if (!home) return;

    const body = document.body;
    const title = $(".manifest-title", home);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.requestAnimationFrame(() => body.classList.add("is-ready"));
    window.addEventListener("pageshow", () => {
      body.classList.remove("is-leaving");
      body.classList.add("is-ready");
    });

    if (!reduceMotion) {
      let pointerFrame = 0;
      home.addEventListener("pointermove", (event) => {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = window.requestAnimationFrame(() => {
          const xRatio = event.clientX / window.innerWidth - 0.5;
          const yRatio = event.clientY / window.innerHeight - 0.5;
          body.style.setProperty("--home-bg-x", `${xRatio * 8}px`);
          body.style.setProperty("--home-bg-y", `${yRatio * 8}px`);
          title?.style.setProperty("--title-rx", `${yRatio * -2.4}deg`);
          title?.style.setProperty("--title-ry", `${xRatio * 3.2}deg`);
        });
      });

      home.addEventListener("pointerleave", () => {
        body.style.setProperty("--home-bg-x", "0px");
        body.style.setProperty("--home-bg-y", "0px");
        title?.style.setProperty("--title-rx", "0deg");
        title?.style.setProperty("--title-ry", "0deg");
      });

      $$("[data-portal]", home).forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--card-rx", `${y * -5}deg`);
          card.style.setProperty("--card-ry", `${x * 6}deg`);
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--card-rx", "0deg");
          card.style.setProperty("--card-ry", "0deg");
        });
      });
    }

    $$("a[href$='.html']", document).forEach((link) => {
      link.addEventListener("click", (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === "_blank"
        ) {
          return;
        }
        const destination = new URL(link.href, window.location.href);
        if (destination.href === window.location.href) return;
        event.preventDefault();
        if (reduceMotion) {
          window.location.href = destination.href;
          return;
        }
        body.classList.add("is-leaving");
        window.setTimeout(() => {
          window.location.href = destination.href;
        }, 300);
      });
    });
  }

  initHomeExperience();

  const statsList = $("#statsList");
  if (statsList) {
    statsList.innerHTML = data.stats
      .map((stat) => `<div class="stat"><strong>${stat.value}</strong><span>${stat.label}</span></div>`)
      .join("");
  }

  const tagList = $("#tagList");
  if (tagList) {
    tagList.innerHTML = data.person.tags.map((tag) => `<span class="pill">${tag}</span>`).join("");
  }

  const experienceList = $("#experienceList");
  if (experienceList) {
    experienceList.innerHTML = data.experience
      .map(
        (item) => `
          <article class="timeline-item">
            <time>${item.period}</time>
            <h3>${item.title} · ${item.company}</h3>
            <p>${item.body}</p>
          </article>
        `
      )
      .join("");
  }

  const skillList = $("#skillList");
  if (skillList) {
    skillList.innerHTML = data.skills
      .map(
        (group) => `
          <article class="skill-block">
            <strong>${group.group}</strong>
            ${group.items.map((item) => `<span>${item}</span>`).join("")}
          </article>
        `
      )
      .join("");
  }

  const linkList = $("#linkList");
  if (linkList) {
    linkList.innerHTML = data.links
      .map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`)
      .join("");
  }

  const printButton = $("#printResume");
  if (printButton) printButton.addEventListener("click", () => window.print());

  function initResumeExperience() {
    const layout = $(".resume-layout");
    if (!layout) return;

    const body = document.body;
    const progressBar = $("#resumeProgressBar");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animatedItems = [...$$(".timeline-item", layout), ...$$(".skill-block", layout)];

    animatedItems.forEach((item, index) => item.style.setProperty("--item-order", index));
    window.requestAnimationFrame(() => body.classList.add("resume-ready"));

    if (reduceMotion || !("IntersectionObserver" in window)) {
      animatedItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.16 }
      );
      animatedItems.forEach((item) => observer.observe(item));
    }

    function updateResumeProgress() {
      if (!progressBar) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 1;
      progressBar.style.width = `${progress * 100}%`;
    }

    updateResumeProgress();
    window.addEventListener("scroll", updateResumeProgress, { passive: true });
    window.addEventListener("resize", updateResumeProgress);
    window.addEventListener("beforeprint", () => body.classList.add("is-printing"));
    window.addEventListener("afterprint", () => body.classList.remove("is-printing"));
  }

  initResumeExperience();

  const contactFlipCard = $("#contactFlipCard");
  const contactCardFace = $("#contactCardFace");
  const contactCardBack = $("#contactCardBack");
  const contactCardKicker = $("#contactCardKicker");
  const contactCardTitle = $("#contactCardTitle");
  const contactCardBody = $("#contactCardBody");
  const copyEmail = $("#copyEmail");
  const contactCards = data.contactCards || {};
  let activeContactCard = "email";
  let flipSide = false;

  function contactTemplate(cardKey) {
    const card = contactCards[cardKey] || contactCards.email;
    if (cardKey === "email") {
      return `
        <p class="hand-note" id="contactCardKicker">${card.kicker}</p>
        <strong id="contactCardTitle">${card.title}</strong>
        <p id="contactCardBody">${card.body}</p>
        <button class="copy-email" type="button" id="copyEmail">复制邮箱</button>
      `;
    }
    return `
      <p class="hand-note">${card.kicker}</p>
      <strong>${card.title}</strong>
      <div class="qr-placeholder">${card.qr || "QR"}</div>
      <p>${card.body}</p>
    `;
  }

  function bindCopyButton(root = document) {
    const button = $("#copyEmail", root);
    if (!button) return;
    button.addEventListener("click", async () => {
      const email = data.person.email || contactCards.email?.title || "";
      try {
        await navigator.clipboard.writeText(email);
        button.textContent = "已复制";
      } catch (error) {
        button.textContent = email;
      }
      window.setTimeout(() => {
        button.textContent = "复制邮箱";
      }, 1600);
    });
  }

  function showContactCard(cardKey) {
    if (!contactFlipCard || !contactCardFace || !contactCardBack) return;
    if (cardKey === activeContactCard) return;
    activeContactCard = cardKey;
    const target = flipSide ? contactCardFace : contactCardBack;
    target.innerHTML = contactTemplate(cardKey);
    flipSide = !flipSide;
    contactFlipCard.classList.toggle("is-flipped", flipSide);
    bindCopyButton(target);
  }

  if (contactCardTitle && contactCards.email) {
    contactCardTitle.textContent = data.person.email || contactCards.email.title;
  }

  bindCopyButton(document);

  $$("[data-contact-card]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-contact-card]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      showContactCard(button.dataset.contactCard);
    });
  });

  function initAboutCanvas() {
    const area = $("#aboutCanvasArea");
    const transform = $("#aboutCanvasTransform");
    const grid = $("#aboutCanvasGrid");
    const svg = $("#aboutConnectionsSvg");
    const zoomPct = $("#aboutZoomPct");
    const layerPanel = $("#aboutLayerPanel");
    const templatePanel = $("#aboutTemplatePanel");
    const miniMap = $("#aboutMiniMap");
    const miniViewport = $("#aboutMiniViewport");
    if (!area || !transform || !grid || !svg) return;

    const storageKey = "jack-about-canvas-v1";
    let scale = window.innerWidth <= 760 ? 0.48 : 0.78;
    let panX = window.innerWidth <= 760 ? -250 : -30;
    let panY = window.innerWidth <= 760 ? -40 : 0;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let startPanX = 0;
    let startPanY = 0;
    let activeCard = null;
    let cardStartX = 0;
    let cardStartY = 0;
    let cardLeft = 0;
    let cardTop = 0;
    let connectMode = false;
    let connectFrom = null;
    let cardCounter = 0;
    let saveTimer = null;
    let isResetting = false;
    let dragSnapshot = null;
    let miniMapDragging = false;
    let layerDragId = null;
    const undoStack = [];
    const maxUndo = 60;

    let connections = [
      ["about-card-photo", "about-card-profile", "yellow-line"],
      ["about-card-profile", "about-card-timeline", "blue-line"],
      ["about-card-profile", "about-card-story", "yellow-line"],
      ["about-card-story", "about-card-skills", "blue-line"],
      ["about-card-now", "about-card-story", "yellow-line"],
      ["about-card-timeline", "about-card-skills", "blue-line"],
    ];

    const cards = () => $$(".about-card", transform);

    function cardOrder() {
      return cards().map((card) => card.id);
    }

    function setCardOrder(order) {
      order.forEach((id) => {
        const card = document.getElementById(id);
        if (card) transform.appendChild(card);
      });
      renderLayers();
      updateConnections();
      updateMinimap();
      scheduleSave();
    }

    function snapshotCard(card) {
      return {
        id: card.id,
        html: card.outerHTML,
        index: cards().indexOf(card),
        connections: connections.filter(([from, to]) => from === card.id || to === card.id).map((line) => [...line]),
      };
    }

    function restoreCardSnapshot(snapshot) {
      if (!snapshot || document.getElementById(snapshot.id)) return;
      const temp = document.createElement("div");
      temp.innerHTML = snapshot.html.trim();
      const card = temp.firstElementChild;
      const currentCards = cards();
      const before = currentCards[snapshot.index] || null;
      transform.insertBefore(card, before);
      bindCard(card);
      snapshot.connections.forEach((line) => {
        const exists = connections.some(([from, to]) => from === line[0] && to === line[1]);
        if (!exists) connections.push([...line]);
      });
      renderLayers();
      updateConnections();
      focusCard(snapshot.id);
      scheduleSave();
    }

    function pushUndo(action) {
      undoStack.push(action);
      if (undoStack.length > maxUndo) undoStack.shift();
    }

    function undoLastAction() {
      const action = undoStack.pop();
      if (!action) return;

      if (action.type === "create") {
        const card = document.getElementById(action.cardId);
        if (card) card.remove();
        connections = connections.filter(([from, to]) => from !== action.cardId && to !== action.cardId);
      }

      if (action.type === "delete") {
        restoreCardSnapshot(action.snapshot);
        return;
      }

      if (action.type === "move") {
        const card = document.getElementById(action.cardId);
        if (card) {
          card.style.left = `${action.from.left}px`;
          card.style.top = `${action.from.top}px`;
          selectCard(action.cardId);
        }
      }

      if (action.type === "connection-add") {
        connections = connections.filter((_, index) => index !== action.index);
      }

      if (action.type === "connection-delete") {
        connections.splice(Math.min(action.index, connections.length), 0, [...action.connection]);
      }

      if (action.type === "reorder") {
        setCardOrder(action.before);
        return;
      }

      renderLayers();
      updateConnections();
      updateMinimap();
      scheduleSave();
    }

    const templates = {
      text: {
        className: "about-card-text",
        title: "文字卡",
        html: `
          <p class="eyebrow">Note</p>
          <h2 contenteditable="true" spellcheck="false">新的想法</h2>
          <p contenteditable="true" spellcheck="false">在这里写一段你之后想补充的经历、项目、观点或方法。</p>
        `,
      },
      quote: {
        className: "about-card-quote",
        title: "引用卡",
        html: `
          <p class="eyebrow">Quote</p>
          <blockquote contenteditable="true" spellcheck="false">Stay Hungry, Stay Foolish</blockquote>
          <p contenteditable="true" spellcheck="false">这句话为什么对你重要。</p>
        `,
      },
      sticky: {
        className: "about-card-sticky",
        title: "便利贴",
        html: `
          <p class="hand-note" contenteditable="true" spellcheck="false">quick note</p>
          <p contenteditable="true" spellcheck="false">一个短想法，之后可以拖到任何位置。</p>
        `,
      },
      dark: {
        className: "about-card-dark",
        title: "深色卡",
        tape: "blue",
        html: `
          <p class="eyebrow">Focus</p>
          <h2 contenteditable="true" spellcheck="false">重点模块</h2>
          <p contenteditable="true" spellcheck="false">适合放你最想强调的一件事。</p>
        `,
      },
      link: {
        className: "about-card-link",
        title: "链接卡",
        html: `
          <p class="eyebrow">Link</p>
          <h2 contenteditable="true" spellcheck="false">一个入口</h2>
          <p contenteditable="true" spellcheck="false">双击下面链接可以打开，后面把 href 改成真实地址。</p>
          <a href="works.html">Open Link</a>
        `,
      },
      tags: {
        className: "about-card-tags",
        title: "标签卡",
        tape: "blue",
        html: `
          <p class="eyebrow">Tags</p>
          <div class="floating-tags">
            <span contenteditable="true" spellcheck="false">TVC</span>
            <span contenteditable="true" spellcheck="false">AIGC</span>
            <span contenteditable="true" spellcheck="false">个人 IP</span>
            <span contenteditable="true" spellcheck="false">新标签</span>
          </div>
        `,
      },
    };

    function applyCanvasTransform() {
      transform.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      grid.style.backgroundSize = `${28 * scale}px ${28 * scale}px`;
      grid.style.backgroundPosition = `${panX % (28 * scale)}px ${panY % (28 * scale)}px`;
      if (zoomPct) zoomPct.textContent = `${Math.round(scale * 100)}%`;
      updateMinimap();
    }

    function cardCenter(card) {
      const left = parseFloat(card.style.left) || 0;
      const top = parseFloat(card.style.top) || 0;
      return {
        x: left + card.offsetWidth / 2,
        y: top + card.offsetHeight / 2,
      };
    }

    function edgePoint(card, target) {
      const left = parseFloat(card.style.left) || 0;
      const top = parseFloat(card.style.top) || 0;
      const width = card.offsetWidth || 200;
      const height = card.offsetHeight || 120;
      const center = { x: left + width / 2, y: top + height / 2 };
      const dx = target.x - center.x;
      const dy = target.y - center.y;
      const halfW = width / 2;
      const halfH = height / 2;
      if (dx === 0 && dy === 0) return center;
      const scaleToEdge = Math.min(
        Math.abs(dx) > 0 ? halfW / Math.abs(dx) : Infinity,
        Math.abs(dy) > 0 ? halfH / Math.abs(dy) : Infinity
      );
      return {
        x: center.x + dx * scaleToEdge,
        y: center.y + dy * scaleToEdge,
      };
    }

    function updateConnections() {
      svg.innerHTML = connections
        .map(([fromId, toId, lineClass], index) => {
          const from = document.getElementById(fromId);
          const to = document.getElementById(toId);
          if (!from || !to) return "";
          const fromCenter = cardCenter(from);
          const toCenter = cardCenter(to);
          const start = edgePoint(from, toCenter);
          const end = edgePoint(to, fromCenter);
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const curve = Math.min(90, Math.hypot(dx, dy) * 0.24);
          const cp1x = start.x + dx * 0.34 + (dy > 0 ? curve : -curve) * 0.18;
          const cp1y = start.y + dy * 0.34 - (dx > 0 ? curve : -curve) * 0.18;
          const cp2x = end.x - dx * 0.34 - (dy > 0 ? curve : -curve) * 0.18;
          const cp2y = end.y - dy * 0.34 + (dx > 0 ? curve : -curve) * 0.18;
          const d = `M${start.x},${start.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y}`;
          return `
            <g class="connection-group" data-connection-index="${index}">
              <path class="${lineClass}" d="${d}"></path>
              <path class="connection-hit" d="${d}"></path>
            </g>
          `;
        })
        .join("");
      $$("[data-connection-index]", svg).forEach((group) => {
        group.addEventListener("click", (event) => {
          event.stopPropagation();
          deleteConnection(Number(group.dataset.connectionIndex));
        });
      });
    }

    function cardLabel(card) {
      if (card.dataset.cardTitle) return card.dataset.cardTitle;
      const heading = $("h1, h2, strong, blockquote, .hand-note, .eyebrow", card);
      return heading?.textContent?.trim()?.slice(0, 18) || "未命名卡片";
    }

    function selectCard(cardId) {
      $$(".about-card", transform).forEach((card) => card.classList.toggle("is-selected", card.id === cardId));
      $$(".layer-row", document).forEach((row) => {
        row.classList.toggle("is-active", row.dataset.focusCard === cardId);
      });
      updateMinimap(cardId);
    }

    function focusCard(cardId) {
      const card = document.getElementById(cardId);
      if (!card) return;
      const areaRect = area.getBoundingClientRect();
      const center = cardCenter(card);
      panX = areaRect.width / 2 - center.x * scale;
      panY = areaRect.height / 2 - center.y * scale;
      applyCanvasTransform();
      selectCard(cardId);
    }

    function renderLayers() {
      if (!layerPanel) return;
      const activeId = $(".about-card.is-selected", transform)?.id;
      const list = cards();
      layerPanel.innerHTML = `<p class="hand-layer">Layers</p>${list
        .map(
          (card) => `
            <button class="layer-row ${card.id === activeId ? "is-active" : ""}" type="button" draggable="true" data-focus-card="${card.id}">
              <span></span>${cardLabel(card)}<em></em>
            </button>
          `
        )
        .join("")}`;
      $$("[data-focus-card]", layerPanel).forEach((row) => {
        row.addEventListener("click", () => focusCard(row.dataset.focusCard));
        row.addEventListener("dragstart", (event) => {
          layerDragId = row.dataset.focusCard;
          row.classList.add("is-dragging");
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", layerDragId);
        });
        row.addEventListener("dragend", () => {
          row.classList.remove("is-dragging");
          layerDragId = null;
        });
        row.addEventListener("dragover", (event) => {
          event.preventDefault();
          row.classList.add("is-drop-target");
        });
        row.addEventListener("dragleave", () => row.classList.remove("is-drop-target"));
        row.addEventListener("drop", (event) => {
          event.preventDefault();
          row.classList.remove("is-drop-target");
          reorderLayer(layerDragId || event.dataTransfer.getData("text/plain"), row.dataset.focusCard);
        });
      });
    }

    function reorderLayer(sourceId, targetId) {
      if (!sourceId || !targetId || sourceId === targetId) return;
      const source = document.getElementById(sourceId);
      const target = document.getElementById(targetId);
      if (!source || !target) return;
      const before = cardOrder();
      const sourceIndex = before.indexOf(sourceId);
      const targetIndex = before.indexOf(targetId);
      if (sourceIndex < targetIndex) {
        const nextCard = cards()[targetIndex + 1] || null;
        transform.insertBefore(source, nextCard);
      } else {
        transform.insertBefore(source, target);
      }
      const after = cardOrder();
      if (before.join("|") !== after.join("|")) {
        pushUndo({ type: "reorder", before, after });
        renderLayers();
        updateConnections();
        updateMinimap(sourceId);
        scheduleSave();
      }
    }

    function focusCanvasPoint(x, y) {
      const areaRect = area.getBoundingClientRect();
      panX = areaRect.width / 2 - x * scale;
      panY = areaRect.height / 2 - y * scale;
      applyCanvasTransform();
    }

    function miniMapPoint(event) {
      if (!miniMap) return null;
      const rect = miniMap.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      return {
        x: (x / rect.width) * 2400,
        y: (y / rect.height) * 1600,
      };
    }

    function updateMinimap(activeId = null) {
      if (!miniMap) return;
      $$(".minimap-dot-lite", miniMap).forEach((dot) => dot.remove());
      const mapRect = miniMap.getBoundingClientRect();
      const mapW = mapRect.width || 180;
      const mapH = mapRect.height || 96;
      if (miniViewport) {
        const areaRect = area.getBoundingClientRect();
        const viewW = Math.min(2400, areaRect.width / scale);
        const viewH = Math.min(1600, areaRect.height / scale);
        const viewLeft = Math.max(0, Math.min(2400 - viewW, -panX / scale));
        const viewTop = Math.max(0, Math.min(1600 - viewH, -panY / scale));
        miniViewport.style.left = `${(viewLeft / 2400) * mapW}px`;
        miniViewport.style.top = `${(viewTop / 1600) * mapH}px`;
        miniViewport.style.width = `${Math.max(12, (viewW / 2400) * mapW)}px`;
        miniViewport.style.height = `${Math.max(10, (viewH / 1600) * mapH)}px`;
      }
      cards().forEach((card) => {
        const left = parseFloat(card.style.left) || 0;
        const top = parseFloat(card.style.top) || 0;
        const dot = document.createElement("span");
        dot.className = `minimap-dot-lite ${card.id === activeId ? "is-active" : ""}`;
        dot.dataset.miniCard = card.id;
        dot.style.left = `${Math.max(8, Math.min(mapW - 8, (left / 2400) * mapW))}px`;
        dot.style.top = `${Math.max(8, Math.min(mapH - 8, (top / 1600) * mapH))}px`;
        dot.addEventListener("click", (event) => {
          event.stopPropagation();
          focusCard(card.id);
        });
        miniMap.appendChild(dot);
      });
    }

    function cardShell(id, title, className, tape, left, top, html) {
      return `
        <article class="about-card ${className}" id="${id}" data-card-title="${title}" style="left: ${left}px; top: ${top}px">
          <div class="card-tape ${tape || "yellow"}"></div>
          <div class="card-controls"><span>⋮⋮</span><button type="button" data-delete-card aria-label="删除卡片">×</button></div>
          ${html}
        </article>
      `;
    }

    function viewportCenterInCanvas() {
      const rect = area.getBoundingClientRect();
      return {
        x: (rect.width / 2 - panX) / scale,
        y: (rect.height / 2 - panY) / scale,
      };
    }

    function createCard(templateKey) {
      const template = templates[templateKey] || templates.text;
      const center = viewportCenterInCanvas();
      const id = `about-card-custom-${Date.now()}-${cardCounter++}`;
      const temp = document.createElement("div");
      temp.innerHTML = cardShell(
        id,
        template.title,
        template.className,
        template.tape || "yellow",
        Math.round(center.x - 150 + cardCounter * 16),
        Math.round(center.y - 80 + cardCounter * 12),
        template.html
      );
      const card = temp.firstElementChild;
      transform.appendChild(card);
      bindCard(card);
      pushUndo({ type: "create", cardId: id });
      renderLayers();
      updateConnections();
      focusCard(id);
      templatePanel?.classList.remove("is-open");
      scheduleSave();
    }

    function deleteCard(cardId) {
      const card = document.getElementById(cardId);
      if (!card) return;
      const snapshot = snapshotCard(card);
      card.remove();
      connections = connections.filter(([from, to]) => from !== cardId && to !== cardId);
      pushUndo({ type: "delete", snapshot });
      renderLayers();
      updateConnections();
      updateMinimap();
      scheduleSave();
    }

    function toggleConnection(fromId, toId) {
      if (!fromId || !toId || fromId === toId) return;
      const index = connections.findIndex(
        ([from, to]) => (from === fromId && to === toId) || (from === toId && to === fromId)
      );
      if (index >= 0) {
        const [removed] = connections.splice(index, 1);
        pushUndo({ type: "connection-delete", connection: removed, index });
      } else {
        const line = [fromId, toId, connections.length % 2 ? "blue-line" : "yellow-line"];
        connections.push(line);
        pushUndo({ type: "connection-add", connection: line, index: connections.length - 1 });
      }
      updateConnections();
      scheduleSave();
    }

    function deleteConnection(index) {
      if (!Number.isInteger(index) || !connections[index]) return;
      const [removed] = connections.splice(index, 1);
      pushUndo({ type: "connection-delete", connection: removed, index });
      updateConnections();
      scheduleSave();
    }

    function saveCanvas(showFeedback = false) {
      const cards = $$(".about-card", transform).map((card) => card.outerHTML);
      const payload = {
        cards,
        connections,
        cardCounter,
        view: { scale, panX, panY },
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      if (showFeedback) {
        const button = $("#aboutSaveCanvas");
        if (!button) return;
        const old = button.textContent;
        button.textContent = "已保存";
        window.setTimeout(() => {
          button.textContent = old;
        }, 1200);
      }
    }

    function scheduleSave() {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => saveCanvas(false), 400);
    }

    function restoreCanvas() {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return false;
      try {
        const payload = JSON.parse(raw);
        if (!Array.isArray(payload.cards)) return false;
        $$(".about-card", transform).forEach((card) => card.remove());
        transform.insertAdjacentHTML("beforeend", payload.cards.join(""));
        connections = Array.isArray(payload.connections) ? payload.connections : connections;
        cardCounter = Number(payload.cardCounter) || payload.cards.length;
        if (payload.view) {
          scale = Number(payload.view.scale) || scale;
          panX = Number(payload.view.panX) || panX;
          panY = Number(payload.view.panY) || panY;
        }
        return true;
      } catch (error) {
        return false;
      }
    }

    function bindCard(card) {
      card.addEventListener("mousedown", (event) => {
        if (event.button !== 0 || event.target.closest("a, button, [contenteditable='true']")) return;
        event.preventDefault();
        event.stopPropagation();

        if (connectMode) {
          if (!connectFrom) {
            connectFrom = card;
            card.classList.add("is-connect-source");
          } else {
            toggleConnection(connectFrom.id, card.id);
            connectFrom.classList.remove("is-connect-source");
            connectFrom = null;
          }
          selectCard(card.id);
          return;
        }

        activeCard = card;
        card.classList.add("is-dragging");
        cardStartX = event.clientX;
        cardStartY = event.clientY;
        cardLeft = parseFloat(card.style.left) || 0;
        cardTop = parseFloat(card.style.top) || 0;
        dragSnapshot = { cardId: card.id, left: cardLeft, top: cardTop };
        selectCard(card.id);
      });

      $$("[data-delete-card]", card).forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          deleteCard(card.id);
        });
      });

      $$("[contenteditable='true']", card).forEach((editable) => {
        editable.addEventListener("input", () => {
          card.dataset.cardTitle = cardLabel(card);
          renderLayers();
          scheduleSave();
        });
      });
    }

    area.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const rect = area.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const oldScale = scale;
        const direction = event.deltaY > 0 ? 0.9 : 1.1;
        scale = Math.min(1.8, Math.max(0.32, scale * direction));
        panX = mouseX - ((mouseX - panX) * scale) / oldScale;
        panY = mouseY - ((mouseY - panY) * scale) / oldScale;
        applyCanvasTransform();
      },
      { passive: false }
    );

    area.addEventListener("mousedown", (event) => {
      if (event.button !== 0 || event.target.closest(".about-card, [data-connection-index]")) return;
      isPanning = true;
      area.classList.add("is-panning");
      panStartX = event.clientX;
      panStartY = event.clientY;
      startPanX = panX;
      startPanY = panY;
    });

    miniMap?.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      miniMapDragging = true;
      const point = miniMapPoint(event);
      if (point) focusCanvasPoint(point.x, point.y);
    });

    document.addEventListener("mousemove", (event) => {
      if (activeCard) {
        const nextLeft = cardLeft + (event.clientX - cardStartX) / scale;
        const nextTop = cardTop + (event.clientY - cardStartY) / scale;
        activeCard.style.left = `${nextLeft}px`;
        activeCard.style.top = `${nextTop}px`;
        updateConnections();
        return;
      }

      if (!isPanning) return;
      panX = startPanX + event.clientX - panStartX;
      panY = startPanY + event.clientY - panStartY;
      applyCanvasTransform();
    });

    document.addEventListener("mousemove", (event) => {
      if (!miniMapDragging) return;
      const point = miniMapPoint(event);
      if (point) focusCanvasPoint(point.x, point.y);
    });

    document.addEventListener("mouseup", () => {
      if (activeCard) {
        const nextLeft = parseFloat(activeCard.style.left) || 0;
        const nextTop = parseFloat(activeCard.style.top) || 0;
        if (
          dragSnapshot &&
          (Math.abs(nextLeft - dragSnapshot.left) > 0.5 || Math.abs(nextTop - dragSnapshot.top) > 0.5)
        ) {
          pushUndo({
            type: "move",
            cardId: activeCard.id,
            from: { left: dragSnapshot.left, top: dragSnapshot.top },
            to: { left: nextLeft, top: nextTop },
          });
        }
        activeCard.classList.remove("is-dragging");
        scheduleSave();
        activeCard = null;
        dragSnapshot = null;
      }
      if (isPanning) {
        isPanning = false;
        area.classList.remove("is-panning");
      }
      miniMapDragging = false;
    });

    $("#aboutAddCard")?.addEventListener("click", () => {
      templatePanel?.classList.toggle("is-open");
    });

    $$("[data-card-template]").forEach((button) => {
      button.addEventListener("click", () => createCard(button.dataset.cardTemplate));
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !event.shiftKey && !isEditing) {
        event.preventDefault();
        undoLastAction();
      }
    });

    $("#aboutConnectMode")?.addEventListener("click", () => {
      connectMode = !connectMode;
      $("#aboutConnectMode")?.classList.toggle("is-active", connectMode);
      area.classList.toggle("connect-mode", connectMode);
      if (!connectMode && connectFrom) {
        connectFrom.classList.remove("is-connect-source");
        connectFrom = null;
      }
    });

    $("#aboutSaveCanvas")?.addEventListener("click", () => saveCanvas(true));

    $("#aboutClearCanvas")?.addEventListener("click", () => {
      isResetting = true;
      localStorage.removeItem(storageKey);
      window.location.reload();
    });

    window.addEventListener("beforeunload", () => {
      if (!isResetting) saveCanvas(false);
    });

    $("#aboutZoomIn")?.addEventListener("click", () => {
      scale = Math.min(1.8, scale * 1.12);
      applyCanvasTransform();
    });
    $("#aboutZoomOut")?.addEventListener("click", () => {
      scale = Math.max(0.32, scale * 0.88);
      applyCanvasTransform();
    });
    $("#aboutResetView")?.addEventListener("click", () => {
      scale = window.innerWidth <= 760 ? 0.48 : 0.78;
      panX = window.innerWidth <= 760 ? -250 : -30;
      panY = window.innerWidth <= 760 ? -40 : 0;
      applyCanvasTransform();
    });

    restoreCanvas();
    $$(".about-card", transform).forEach((card) => bindCard(card));
    renderLayers();
    applyCanvasTransform();
    updateConnections();
    updateMinimap();
  }

  initAboutCanvas();

  const projectGrid = $("#projectGrid");
  const filterTabs = $("#filterTabs");
  const modal = $("#projectModal");

  function renderProjects(category = "全部") {
    if (!projectGrid) return;
    const projects =
      category === "全部" ? data.projects : data.projects.filter((project) => project.category === category);

    projectGrid.innerHTML = projects
      .map(
        (project) => `
          <button class="project-card ${project.color}" type="button" data-id="${project.id}" data-year="${project.year}">
            <span class="category">${project.category}</span>
            <h2>${project.title}</h2>
            <p>${project.summary}</p>
            <div class="tool-row">
              ${project.tools.map((tool) => `<span class="tool-pill">${tool}</span>`).join("")}
            </div>
          </button>
        `
      )
      .join("");

    $$(".project-card", projectGrid).forEach((card) => {
      card.addEventListener("click", () => openProject(card.dataset.id));
    });
  }

  function renderFilters() {
    if (!filterTabs) return;
    const categories = ["全部", ...new Set(data.projects.map((project) => project.category))];
    filterTabs.innerHTML = categories
      .map((category, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button">${category}</button>`)
      .join("");

    $$("button", filterTabs).forEach((button) => {
      button.addEventListener("click", () => {
        $$("button", filterTabs).forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        renderProjects(button.textContent);
      });
    });
  }

  function openProject(id) {
    if (!modal) return;
    const project = data.projects.find((item) => item.id === id);
    if (!project) return;

    $("#modalCategory").textContent = `${project.category} / ${project.year}`;
    $("#modalTitle").textContent = project.title;
    $("#modalSummary").textContent = project.summary;
    $("#modalImpact").textContent = project.impact;
    $("#modalRole").textContent = project.role;
    $("#modalTools").textContent = project.tools.join(" · ");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  if (modal) {
    $$("[data-close-modal]", modal).forEach((node) => {
      node.addEventListener("click", () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    $$(".follow-widget.is-open").forEach((widget) => {
      widget.classList.remove("is-open");
      const card = $(".follow-card", widget);
      if (card) card.setAttribute("aria-pressed", "false");
    });
  });

  renderFilters();
  renderProjects();
})();
