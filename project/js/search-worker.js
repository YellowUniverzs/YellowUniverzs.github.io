/* =========================
   SEARCH WEB WORKER
========================= */

let searchIndex = {};

/* Terima data dari main thread */
self.onmessage = function (e) {
  const { type, payload } = e.data;

  /* Init index */
  if (type === "INIT_DATA") {
    searchIndex = payload;
    return;
  }

  /* Proses search */
  if (type === "SEARCH") {
    const { category, query } = payload;

    let list = (searchIndex[category] || []).slice();

    // sort terbaru
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (query) {
      list = list.filter(a => a._searchText.includes(query));
    }

    // kirim hasil ke main thread
    self.postMessage({
      type: "RESULT",
      data: list
    });
  }
};

