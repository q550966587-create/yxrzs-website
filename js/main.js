/* ============================================================
   Z&D 臻邸国际设计  |  main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 导航滚动状态 ---------- */
  var nav = document.querySelector(".nav");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        links.classList.remove("open");
      });
    });
  }

  /* ---------- Hero 轮播 ---------- */
  function initHero() {
    var slides = document.querySelectorAll(".hero-slide");
    var pager = document.querySelector(".hero-pager");
    if (!slides.length) return;
    var cur = 0;
    var timer = null;
    function go(i) {
      slides[cur].classList.remove("on");
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add("on");
      if (pager) {
        Array.prototype.forEach.call(pager.children, function (s, idx) {
          s.classList.toggle("on", idx === cur);
        });
      }
    }
    function play() { timer = setInterval(function () { go(cur + 1); }, 6000); }
    function stop() { if (timer) clearInterval(timer); }
    if (pager) {
      Array.prototype.forEach.call(pager.children, function (s, idx) {
        s.addEventListener("click", function () { stop(); go(idx); play(); });
      });
    }
    slides[0].classList.add("on");
    if (slides.length > 1) play();
  }
  initHero();

  /* ---------- 滚动显现 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("on"); });
  }

  /* ---------- 数字统计 ---------- */
  function animateCount() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var once = false;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || once) return;
        once = true;
        nums.forEach(function (el) {
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var dec = (target % 1 !== 0) ? 1 : 0;
          var start = null, dur = 1800;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(dec) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
        cio.disconnect();
      });
    }, { threshold: 0.4 });
    cio.observe(document.querySelector(".stats") || nums[0]);
  }
  animateCount();

  /* ---------- 案例筛选 ---------- */
  var filterBtns = document.querySelectorAll(".filter-bar button");
  var cases = document.querySelectorAll(".case-grid .case");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var type = btn.getAttribute("data-filter");
      cases.forEach(function (c) {
        var match = type === "all" || c.getAttribute("data-type") === type;
        c.classList.toggle("hide", !match);
      });
    });
  });

  /* ---------- 联系表单（静态演示） ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = document.getElementById("formSuccess");
      if (ok) ok.style.display = "block";
      form.reset();
      setTimeout(function () { if (ok) ok.style.display = "none"; }, 6000);
    });
  }

  /* ---------- 返回顶部 ---------- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
