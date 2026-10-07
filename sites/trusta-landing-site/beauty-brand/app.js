/* ============================================================
   TRUSTA — /beauty-brand  interactions
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 네비게이션 ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var gnb = document.getElementById("gnb");

  function onScrollNav() {
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (burger && gnb) {
    burger.addEventListener("click", function () {
      var open = gnb.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    gnb.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        gnb.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 스크롤 리빌 ---------- */
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function markOn(el) {
    el.classList.add("on");
    var idx = pending.indexOf(el);
    if (idx > -1) pending.splice(idx, 1);
  }
  if ("IntersectionObserver" in window && !prefersReduced) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          markOn(entry.target);
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -4% 0px" });
    pending.forEach(function (el) { revealIO.observe(el); });

    /* 빠른 스크롤/앵커 점프로 지나친 요소는 즉시 표시 */
    var sweeping = false;
    function sweepMissed() {
      sweeping = false;
      for (var i = pending.length - 1; i >= 0; i--) {
        var el = pending[i];
        if (el.getBoundingClientRect().bottom < 40) {
          el.classList.add("on");
          revealIO.unobserve(el);
          pending.splice(i, 1);
        }
      }
    }
    window.addEventListener("scroll", function () {
      if (!sweeping) { sweeping = true; requestAnimationFrame(sweepMissed); }
    }, { passive: true });
  } else {
    pending.forEach(function (el) { el.classList.add("on"); });
  }

  /* ---------- 숫자 카운터 ---------- */
  function fmtMan(n) {
    if (n < 10000) return n.toLocaleString("ko-KR");
    var man = Math.floor(n / 10000);
    var rest = n % 10000;
    return man.toLocaleString("ko-KR") + "만" + (rest > 0 ? " " + rest.toLocaleString("ko-KR") : "");
  }
  function fmtJo(nEok) {
    var jo = Math.floor(nEok / 10000);
    var eok = nEok % 10000;
    if (jo > 0) return jo.toLocaleString("ko-KR") + "조 " + eok.toLocaleString("ko-KR") + "억";
    return eok.toLocaleString("ko-KR") + "억";
  }
  function formatNum(n, fmt) {
    if (fmt === "man") return fmtMan(n);
    if (fmt === "jo") return fmtJo(n);
    return n.toLocaleString("ko-KR");
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseInt(el.dataset.count, 10);
    var fmt = el.dataset.fmt || "comma";
    if (prefersReduced || !window.requestAnimationFrame) {
      el.textContent = formatNum(target, fmt);
      return;
    }
    var dur = 1700;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = Math.round(target * easeOutCubic(p));
      el.textContent = formatNum(val, fmt);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(target, fmt);
    }
    requestAnimationFrame(tick);
  }

  var numEls = document.querySelectorAll(".num[data-count]");
  if ("IntersectionObserver" in window) {
    var numIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          numIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    numEls.forEach(function (el) { numIO.observe(el); });
  } else {
    numEls.forEach(runCounter);
  }

  /* ---------- 23개 로직 궤도 점 ---------- */
  var orbit = document.getElementById("orbit23");
  if (orbit) {
    for (var i = 0; i < 23; i++) {
      var dot = document.createElement("span");
      dot.style.setProperty("--a", (i * (360 / 23)).toFixed(2) + "deg");
      orbit.appendChild(dot);
    }
  }

  /* ---------- SNS 템플릿 슬라이더 ---------- */
  var track = document.getElementById("tplTrack");
  var dotsWrap = document.getElementById("tplDots");
  if (track && dotsWrap) {
    var slides = track.querySelectorAll(".tpl-slide");
    slides.forEach(function (_, idx) {
      var d = document.createElement("span");
      d.className = "dot" + (idx === 0 ? " active" : "");
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll(".dot");

    function slideStep() {
      if (!slides.length) return 0;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
      return slides[0].getBoundingClientRect().width + gap;
    }
    function currentIndex() {
      var step = slideStep();
      if (!step) return 0;
      return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step)));
    }
    function syncDots() {
      var idx = currentIndex();
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    }
    var scrollTimer;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(syncDots, 80);
    }, { passive: true });

    var prevBtn = document.querySelector(".tpl-prev");
    var nextBtn = document.querySelector(".tpl-next");
    function go(dir) {
      track.scrollBy({ left: dir * slideStep(), behavior: prefersReduced ? "auto" : "smooth" });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
  }

  /* ---------- 하단 고정 바 ---------- */
  var dock = document.getElementById("dock");
  var applySec = document.getElementById("apply");
  var applyVisible = false;
  if (dock) {
    if (applySec && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        applyVisible = entries[0].isIntersecting;
        updateDock();
      }, { threshold: 0.12 }).observe(applySec);
    }
    var updateDock = function () {
      var show = window.scrollY > 640 && !applyVisible;
      dock.classList.toggle("show", show);
    };
    window.addEventListener("scroll", updateDock, { passive: true });
    updateDock();
  }

  /* ---------- 결과물 선택 카드 → 폼 라디오 연동 ---------- */
  var pickMap = { report: "pick-report", toon: "pick-toon", video: "pick-video" };
  document.querySelectorAll(".pick-btn[data-pick]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var radio = document.getElementById(pickMap[btn.dataset.pick]);
      if (radio) radio.checked = true;
      var target = document.getElementById("apply");
      if (target) target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- 신청 폼 ---------- */
  var form = document.getElementById("applyForm");
  var phone = document.getElementById("phone");
  var phoneErr = document.getElementById("phoneErr");
  var pickErr = document.getElementById("pickErr");
  var privacyConsent = document.getElementById("privacyConsent");
  var caseConsent = document.getElementById("caseConsent");
  var consentErr = document.getElementById("consentErr");
  var doneBox = document.getElementById("applyDone");
  var submitButton = document.getElementById("submitButton");
  var formError = document.getElementById("formError");
  var receipt = document.getElementById("receipt");

  if (form) {
    var query = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(function (name) {
      var field = form.elements[name];
      if (field) field.value = query.get(name) || "";
    });
    if (form.elements.referrer) form.elements.referrer.value = document.referrer || "";
  }

  if (phone) {
    phone.addEventListener("input", function () {
      var v = phone.value.replace(/\D/g, "").slice(0, 11);
      var out;
      if (v.length < 4) out = v;
      else if (v.length < 7) out = v.slice(0, 3) + "-" + v.slice(3);
      else if (v.length < 11) out = v.slice(0, 3) + "-" + v.slice(3, 6) + "-" + v.slice(6);
      else out = v.slice(0, 3) + "-" + v.slice(3, 7) + "-" + v.slice(7);
      phone.value = out;
    });
  }

  function validPhone(v) {
    var digits = (v || "").replace(/\D/g, "");
    return /^01[016789]\d{7,8}$/.test(digits);
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var ok = true;
      formError.hidden = true;

      var phoneOk = validPhone(phone.value);
      phoneErr.hidden = phoneOk;
      phone.closest(".field").classList.toggle("invalid", !phoneOk);
      if (!phoneOk) ok = false;

      var picked = form.querySelector('input[name="deliverable"]:checked');
      pickErr.hidden = !!picked;
      if (!picked) ok = false;

      var consentOk = privacyConsent.checked;
      consentErr.hidden = consentOk;
      if (!consentOk) ok = false;

      if (!ok) {
        var firstErr = form.querySelector(".err:not([hidden])");
        if (firstErr) firstErr.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
        return;
      }

      var payload = {
        phone: phone.value,
        deliverable: picked.value,
        privacy_consent: true,
        case_consent: caseConsent.checked,
        website: form.elements.website.value,
        utm_source: form.elements.utm_source.value,
        utm_medium: form.elements.utm_medium.value,
        utm_campaign: form.elements.utm_campaign.value,
        utm_content: form.elements.utm_content.value,
        referrer: form.elements.referrer.value
      };

      submitButton.disabled = true;
      submitButton.textContent = "신청 접수 중...";

      try {
        var response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        var result = await response.json().catch(function () { return null; });
        if (!response.ok || !result || !result.ok) throw new Error("request_failed");

        form.hidden = true;
        doneBox.hidden = false;
        if (result.receipt_id) {
          receipt.textContent = "접수번호: " + result.receipt_id.slice(0, 8).toUpperCase();
          receipt.hidden = false;
        }
        doneBox.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      } catch (error) {
        formError.hidden = false;
        submitButton.disabled = false;
        submitButton.textContent = "무료 진단 신청하기";
      }
    });
  }
})();
