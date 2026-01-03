/* =========================
   MINI FUSE ENGINE
========================= */

function normalizeText(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

function scoreMatch(text, query) {
  let score = 0;
  let lastIndex = -1;

  for (const char of query) {
    const idx = text.indexOf(char, lastIndex + 1);
    if (idx === -1) return Infinity;
    score += idx - lastIndex;
    lastIndex = idx;
  }

  return score;
}

/* =========================
   CREATE FUSE (EXPORT)
========================= */
export function CreateFuse(list = [], options = {}) {
  const { keys = [], limit = 500 } = options;

  const index = list.map(item => ({
    item,
    text: keys.map(k => normalizeText(item[k] || "")).join(" ")
  }));

  return {
    search(query = "") {
      const q = normalizeText(query);
      if (!q) return list;

      return index
        .map(e => ({
          item: e.item,
          score: scoreMatch(e.text, q)
        }))
        .filter(r => r.score !== Infinity)
        .sort((a, b) => a.score - b.score)
        .slice(0, limit)
        .map(r => r.item);
    }
  };
}