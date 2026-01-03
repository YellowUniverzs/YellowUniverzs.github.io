/* =========================
   IMPORT SEARCH ENGINE
========================= */
import { CreateFuse } from "./fuse.js";

/* =========================
   PRELOADER + ANTI FOUC
========================= */
window.addEventListener("load", () => {
  document.documentElement.classList.remove("preload");
  document.getElementById("preloader")?.classList.add("hidden");
});

/* =========================
   REFS DOM
========================= */
const aurora = document.querySelector(".aurora");
const starsContainer = document.querySelector(".stars");
const articlesContainer = document.getElementById("articlesContainer");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const pageJumpWrap = document.getElementById("pageJumpWrap");
const pageJumpSelect = document.getElementById("pageJumpSelect");
const modeToggle = document.getElementById("modeToggle");

/* =========================
   DROPDOWN TOGGLE
========================= */
document.querySelectorAll("nav .dropdown > button").forEach(button => {
  button.addEventListener("click", e => {
    e.stopPropagation();
    const dropdown = button.parentElement;
    const content = dropdown.querySelector(".dropdown-content");

    document.querySelectorAll("nav .dropdown-content.show").forEach(el => {
      if (el !== content) el.classList.remove("show");
    });

    content.classList.toggle("show");
  });
});

document.addEventListener("click", () => {
  document
    .querySelectorAll("nav .dropdown-content.show")
    .forEach(el => el.classList.remove("show"));
});

/* =========================
   IMPORT DATA ARTIKEL
========================= */
import { koreaArticles } from "../js/article/korea.js";
import { chinaArticles } from "../js/article/china.js";
import { japanArticles } from "../js/article/japan.js";
import { thailandArticles } from "../js/article/thailand.js";

import { rekomendasiDramaKoreaArticles } from "../js/recommended/rekomendasi-drama-korea.js";
import { rekomendasiDramaChinaArticles } from "../js/recommended/rekomendasi-drama-china.js";
import { rekomendasiDramaJapanArticles } from "../js/recommended/rekomendasi-drama-japan.js";
import { rekomendasiDramaThailandArticles } from "../js/recommended/rekomendasi-drama-thailand.js";
import { rekomendasiAnimeArticles } from "../js/recommended/rekomendasi-anime.js";

import { varietyKoreaArticles } from "../js/article/variety-korea.js";

/* =========================
   DATA ARTIKEL
========================= */
const articlesData = {
  all: [
    ...koreaArticles,
    ...chinaArticles,
    ...japanArticles,
    ...thailandArticles,
    ...rekomendasiDramaKoreaArticles,
    ...rekomendasiDramaChinaArticles,
    ...rekomendasiDramaJapanArticles,
    ...rekomendasiDramaThailandArticles,
    ...rekomendasiAnimeArticles,
    ...varietyKoreaArticles
  ],
  korea: koreaArticles,
  china: chinaArticles,
  japan: japanArticles,
  thailand: thailandArticles,
  rekomendasiDramaKorea: rekomendasiDramaKoreaArticles,
  rekomendasiDramaChina: rekomendasiDramaChinaArticles,
  rekomendasiDramaJapan: rekomendasiDramaJapanArticles,
  rekomendasiDramaThailand: rekomendasiDramaThailandArticles,
  rekomendasiAnime: rekomendasiAnimeArticles,
  varietyKorea: varietyKoreaArticles
};

/* =========================
   STATE
========================= */
let currentCategory = "all";
let currentPage = 1;
const perPage = 12;
let searchQuery = "";
let fuseEngine = null;

/* =========================
   SEARCH ENGINE
========================= */
function updateSearchEngine() {
  fuseEngine = CreateFuse(
    articlesData[currentCategory] || [],
    {
      keys: ["title", "desc"],
      limit: 500
    }
  );
}

/* =========================
   SEARCH CACHE
========================= */
const searchCache = new Map();

/* =========================
   FILTER DATA
========================= */
function getFilteredData() {
  const key = `${currentCategory}__${searchQuery.toLowerCase()}`;
  if (searchCache.has(key)) return searchCache.get(key);

  let list = [...(articlesData[currentCategory] || [])];
  list.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (searchQuery.trim()) {
    if (!fuseEngine) updateSearchEngine();
    list = fuseEngine.search(searchQuery);
  }

  searchCache.set(key, list);
  return list;
}

/* =========================
   SKELETON
========================= */
function renderSkeleton(count = perPage) {
  articlesContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "article skeleton-card";
    div.innerHTML = `
      <div class="skeleton skeleton-thumb"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width:90%"></div>
    `;
    articlesContainer.appendChild(div);
  }
}

/* =========================
   LAZY IMAGE
========================= */
const imageObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;
    img.onload = () => img.classList.add("loaded");
    obs.unobserve(img);
  });
}, { rootMargin: "120px" });

/* =========================
   RENDER ARTIKEL
========================= */
function renderArticles() {
  articlesContainer.classList.add("fade-out");
  renderSkeleton();

  setTimeout(() => {
    articlesContainer.innerHTML = "";

    const data = getFilteredData();
    const totalPages = Math.max(1, Math.ceil(data.length / perPage));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * perPage;
    const articles = data.slice(start, start + perPage);

    if (!articles.length) {
      articlesContainer.innerHTML = `
        <div class="no-articles">
          <img src="project/picture/asset/icons/search-white.png">
          <div>Tidak ada artikel untuk ditampilkan.</div>
        </div>
      `;
    } else {
      articles.forEach(a => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `
          <a href="${a.link}" style="text-decoration:none;color:inherit">
            <img data-src="${a.img}" class="thumb lazy-img" alt="${a.title}">
            <div>
              <h2>${a.title}</h2>
              <small>${a.date}</small>
              <p>${a.desc}</p>
            </div>
          </a>
        `;
        articlesContainer.appendChild(div);
      });

      document.querySelectorAll(".lazy-img").forEach(img => {
        imageObserver.observe(img);
      });
    }

    renderPagination(totalPages);
    renderPageJump(totalPages);

    articlesContainer.classList.remove("fade-out");
    articlesContainer.classList.add("fade-in");
    setTimeout(() => articlesContainer.classList.remove("fade-in"), 350);
  }, 300);
}

/* =========================
   PAGINATION
========================= */
function renderPagination(totalPages) {
  paginationContainer.innerHTML = "";
  if (totalPages <= 1) {
    pageJumpWrap.style.display = "none";
    return;
  }

  const prev = document.createElement("button");
  prev.textContent = "« Prev";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    renderArticles();
  };
  paginationContainer.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderArticles();
    };
    paginationContainer.appendChild(btn);
  }

  const next = document.createElement("button");
  next.textContent = "Next »";
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    renderArticles();
  };
  paginationContainer.appendChild(next);
}

function renderPageJump(totalPages) {
  pageJumpSelect.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Halaman ${i}`;
    if (i === currentPage) opt.selected = true;
    pageJumpSelect.appendChild(opt);
  }
  pageJumpWrap.style.display = totalPages > 1 ? "flex" : "none";
}

pageJumpSelect.onchange = () => {
  currentPage = Number(pageJumpSelect.value);
  renderArticles();
};

/* =========================
   CATEGORY & SEARCH
========================= */
document.querySelectorAll("[data-category]").forEach(el => {
  el.onclick = e => {
    e.preventDefault();
    currentCategory = el.dataset.category;
    currentPage = 1;
    searchCache.clear();
    updateSearchEngine();
    renderArticles();
  };
});

let searchTimer = null;
searchInput.addEventListener("input", e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = e.target.value || "";
    currentPage = 1;
    renderArticles();
  }, 250);
});

/* =========================
   INIT
========================= */
updateSearchEngine();
renderArticles();