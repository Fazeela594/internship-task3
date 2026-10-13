const CATS = [
  { name: "Web Development", icon: "💻" },
  { name: "Graphic Design", icon: "🎨" },
  { name: "Mobile App Development", icon: "📱" },
  { name: "Data Analysis", icon: "📊" },
  { name: "Digital Marketing", icon: "📣" }
];
const FREELANCERS = [
  { name: "Ayesha Khan", title: "React & Flask developer", cat: "Web Development", rate: 18, rating: 4.9, jobs: 112, skills: ["React", "Flask", "REST"], color: "#0E3B3A" },
  { name: "Bilal Ahmed", title: "Brand and logo designer", cat: "Graphic Design", rate: 14, rating: 4.8, jobs: 203, skills: ["Logo", "Figma", "Branding"], color: "#8A5A00" },
  { name: "Sana Malik", title: "Flutter app developer", cat: "Mobile App Development", rate: 22, rating: 4.9, jobs: 87, skills: ["Flutter", "Firebase", "Android"], color: "#2F5D9E" },
  { name: "Usman Tariq", title: "Data analyst, Power BI", cat: "Data Analysis", rate: 20, rating: 4.7, jobs: 64, skills: ["Python", "SQL", "Power BI"], color: "#6B3FA0" },
  { name: "Hira Noor", title: "SEO and content marketer", cat: "Digital Marketing", rate: 12, rating: 4.6, jobs: 141, skills: ["SEO", "Ads", "Copywriting"], color: "#B3402E" },
  { name: "Zain Raza", title: "Full-stack JavaScript developer", cat: "Web Development", rate: 25, rating: 4.8, jobs: 95, skills: ["Node", "React", "MongoDB"], color: "#1F6F4A" },
  { name: "Maryam Iqbal", title: "UI/UX and poster designer", cat: "Graphic Design", rate: 16, rating: 4.9, jobs: 120, skills: ["UI", "Poster", "Illustrator"], color: "#A03F74" },
  { name: "Hamza Ali", title: "Android developer, Java", cat: "Mobile App Development", rate: 19, rating: 4.5, jobs: 58, skills: ["Java", "Android", "SQLite"], color: "#3A4A55" }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const state = { cat: "All", q: "", sort: "rating", favs: new Set(), mode: "services" };

/* toast */
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2200);
}

/* categories + chips */
$("#cats").innerHTML = CATS.map(c => {
  const n = FREELANCERS.filter(f => f.cat === c.name).length;
  return `<button class="cat" data-cat="${c.name}"><i>${c.icon}</i><b>${c.name}</b><small>${n} featured</small></button>`;
}).join("");
$("#chips").innerHTML = ["All", ...CATS.map(c => c.name)]
  .map(n => `<button class="chip${n === "All" ? " on" : ""}" data-cat="${n}">${n}</button>`).join("");

/* render freelancers */
function render() {
  const q = state.q.trim().toLowerCase();
  let list = FREELANCERS.filter(f =>
    (state.cat === "All" || f.cat === state.cat) &&
    (!q || [f.name, f.title, f.cat, ...f.skills].join(" ").toLowerCase().includes(q)));
  list.sort((a, b) => state.sort === "low" ? a.rate - b.rate : state.sort === "high" ? b.rate - a.rate : b.rating - a.rating);

  $("#count").textContent = `${list.length} freelancer${list.length === 1 ? "" : "s"}` +
    (state.cat !== "All" ? ` in ${state.cat}` : "") + (q ? ` matching “${state.q.trim()}”` : "");

  $("#grid").innerHTML = list.length ? list.map(f => {
    const ini = f.name.split(" ").map(w => w[0]).join("");
    const on = state.favs.has(f.name);
    return `<article class="card">
      <button class="fav${on ? " on" : ""}" data-fav="${f.name}" aria-pressed="${on}" aria-label="Save ${f.name}">${on ? "♥" : "♡"}</button>
      <div class="av" style="background:${f.color}">${ini}</div>
      <h3>${f.name}</h3><p class="ti">${f.title}</p>
      <div class="sk">${f.skills.map(s => `<span>${s}</span>`).join("")}</div>
      <div class="meta"><span>★ ${f.rating} (${f.jobs})</span><span><b>$${f.rate}</b>/hr</span></div>
      <button class="btn ghost" data-hire="${f.name}">View profile</button>
    </article>`;
  }).join("") : `<div class="empty"><p>No freelancers match your search. Try a different skill or clear the filters.</p><button class="btn solid" id="reset">Clear filters</button></div>`;
}

function setCat(c) {
  state.cat = c;
  $$(".chip").forEach(x => x.classList.toggle("on", x.dataset.cat === c));
  render();
}

/* events (delegated) */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.matches(".cat")) { setCat(t.dataset.cat); $("#freelancers").scrollIntoView(); }
  else if (t.matches(".chip")) setCat(t.dataset.cat);
  else if (t.dataset.fav) {
    const n = t.dataset.fav;
    state.favs.has(n) ? state.favs.delete(n) : state.favs.add(n);
    toast(state.favs.has(n) ? `${n} saved` : `${n} removed from saved`);
    render();
  }
  else if (t.dataset.hire) toast("Profile pages come in the next version");
  else if (t.id === "reset") { state.q = ""; $("#q").value = ""; setCat("All"); }
  else if (t.dataset.q) { $("#q").value = t.dataset.q; $("#searchForm").requestSubmit(); }
  else if (t.dataset.auth) openModal(t.dataset.auth);
});
$("#sort").addEventListener("change", e => { state.sort = e.target.value; render(); });

/* search */
$$(".tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".tab").forEach(x => x.classList.toggle("on", x === tab));
  state.mode = tab.dataset.mode;
  $("#q").placeholder = state.mode === "services" ? "Try “logo design” or “Flutter app”" : "Try a name or skill, like “Python”";
  $("#q").focus();
}));
$("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  state.q = $("#q").value;
  setCat("All");
  $("#freelancers").scrollIntoView();
});

/* nav: mobile menu, shadow, active link */
const burger = $("#burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => { if (e.target.matches("a")) { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
addEventListener("scroll", () => $("#nav").classList.toggle("stuck", scrollY > 8), { passive: true });
const links = $$(".menu>a");
const spy = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
["home", "freelancers", "jobs", "about"].forEach(id => spy.observe($("#" + id)));

/* stats count-up (runs once) */
const counter = new IntersectionObserver((es, o) => es.forEach(en => {
  if (!en.isIntersecting) return;
  o.unobserve(en.target);
  $$("[data-n]", en.target).forEach(b => {
    const end = +b.dataset.n, d = +(b.dataset.d || 0), t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1200, 1);
      b.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}), { threshold: .4 });
counter.observe($(".stats"));

/* login / register modal */
const modal = $("#modal");
let mode = "login";
function setMode(m) {
  mode = m;
  const reg = m === "register";
  $("#mTitle").textContent = $("#submitBtn").textContent = reg ? "Create account" : "Login";
  $("#nameRow").hidden = !reg;
  $("#swapText").textContent = reg ? "Already have an account?" : "New here?";
  $("#swap").textContent = reg ? "Login" : "Create an account";
  $("#err").textContent = "";
}
function openModal(m) { setMode(m); modal.hidden = false; $("#authForm input:not([hidden])").focus(); }
function closeModal() { modal.hidden = true; }
$("#swap").addEventListener("click", () => setMode(mode === "login" ? "register" : "login"));
$("#close").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
$("#authForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, email = f.email.value.trim();
  if (mode === "register" && !f.name.value.trim()) return $("#err").textContent = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(email)) return $("#err").textContent = "Enter a valid email address.";
  if (f.pw.value.length < 6) return $("#err").textContent = "Password must have at least 6 characters.";
  closeModal(); f.reset();
  toast(mode === "register" ? "Account created" : "Logged in");
});

render();