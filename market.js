const p = new URLSearchParams(location.search);
const st = { q: p.get("q") || "", cat: CATS.includes(p.get("cat")) ? p.get("cat") : "All", max: 60, min: 0, sort: "rating" };
$("#q").value = st.q;
$("#chips").innerHTML = ["All", ...CATS].map(n => `<button class="chip${n === st.cat ? " on" : ""}" data-cat="${n}">${n}</button>`).join("");

function results() {
  const words = st.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return F.filter(f => {
    const hay = [f.name, f.title, f.cat, ...f.skills].join(" ").toLowerCase();
    return (st.cat === "All" || f.cat === st.cat) && f.price <= st.max && f.rating >= st.min && words.every(w => hay.includes(w));
  }).sort((a, b) => st.sort === "low" ? a.price - b.price : st.sort === "high" ? b.price - a.price : st.sort === "reviews" ? b.reviews - a.reviews : b.rating - a.rating);
}

function render() {
  const list = results();
  $("#count").textContent = `${list.length} freelancer${list.length === 1 ? "" : "s"} found` + (st.cat !== "All" ? ` in ${st.cat}` : "");
  $("#grid").innerHTML = list.length ? list.map(card).join("")
    : `<div class="empty"><p>No freelancers match these filters. Try a different keyword, a higher price limit or a lower rating.</p><button class="btn solid" id="clear2">Clear filters</button></div>`;
}

/* loading state, then results */
$("#grid").innerHTML = Array(8).fill('<div class="skel s-card"></div>').join("");
setTimeout(render, 500);

$("#searchForm").addEventListener("submit", e => { e.preventDefault(); st.q = $("#q").value; render(); });
$("#q").addEventListener("input", e => { st.q = e.target.value; render(); });
$("#chips").addEventListener("click", e => {
  const c = e.target.closest(".chip"); if (!c) return;
  st.cat = c.dataset.cat;
  $$(".chip").forEach(x => x.classList.toggle("on", x === c));
  render();
});
$("#price").addEventListener("input", e => { st.max = +e.target.value; $("#pv").textContent = "$" + st.max; render(); });
$("#rating").addEventListener("change", e => { st.min = +e.target.value; render(); });
$("#sort").addEventListener("change", e => { st.sort = e.target.value; render(); });
function clearAll() {
  Object.assign(st, { q: "", cat: "All", max: 60, min: 0, sort: "rating" });
  $("#q").value = ""; $("#price").value = 60; $("#pv").textContent = "$60"; $("#rating").value = 0; $("#sort").value = "rating";
  $$(".chip").forEach(x => x.classList.toggle("on", x.dataset.cat === "All"));
  render();
}
$("#clear").addEventListener("click", clearAll);
document.addEventListener("click", e => { if (e.target.id === "clear2") clearAll(); });
