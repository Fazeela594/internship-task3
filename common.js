const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const CATS = ["Web Development", "Graphic Design", "Mobile App Development", "Data Analysis", "Digital Marketing"];

/* Sample data. Add "img" (a photo URL) to any freelancer to replace the generated avatar. */
const F = [
  { id: 1, name: "Ayesha Khan", title: "I will build your React and Flask web app", cat: CATS[0], price: 40, rating: 4.9, reviews: 112, city: "Lahore", days: 5, skills: ["React", "Flask", "REST API"], about: "Full-stack developer who turns ideas into fast, clean web apps and keeps you updated at every step.", color: "#0E3B3A" },
  { id: 2, name: "Zain Raza", title: "I will create a full-stack JavaScript website", cat: CATS[0], price: 55, rating: 4.8, reviews: 95, city: "Karachi", days: 7, skills: ["Node.js", "React", "MongoDB"], about: "I build complete websites with secure back ends, from simple business sites to custom dashboards.", color: "#1F6F4A" },
  { id: 3, name: "Bilal Ahmed", title: "I will design a professional logo and brand identity", cat: CATS[1], price: 15, rating: 4.8, reviews: 203, city: "Faisalabad", days: 3, skills: ["Logo", "Branding", "Figma"], about: "Brand designer with 200+ happy clients. You get clean, memorable logos with all source files.", color: "#8A5A00" },
  { id: 4, name: "Maryam Iqbal", title: "I will design modern UI/UX screens and posters", cat: CATS[1], price: 25, rating: 4.9, reviews: 120, city: "Islamabad", days: 4, skills: ["UI/UX", "Poster", "Illustrator"], about: "I design app screens and print-ready posters that look polished and are easy to use.", color: "#A03F74" },
  { id: 5, name: "Sana Malik", title: "I will develop your Flutter mobile app", cat: CATS[2], price: 50, rating: 4.9, reviews: 87, city: "Multan", days: 10, skills: ["Flutter", "Firebase", "Android"], about: "Flutter developer building smooth Android and iOS apps with clean, maintainable code.", color: "#2F5D9E" },
  { id: 6, name: "Hamza Ali", title: "I will build an Android app using Java", cat: CATS[2], price: 35, rating: 4.5, reviews: 58, city: "Layyah", days: 8, skills: ["Java", "Android Studio", "SQLite"], about: "I create reliable native Android apps for small businesses, students and startups.", color: "#3A4A55" },
  { id: 7, name: "Usman Tariq", title: "I will create Power BI dashboards from your data", cat: CATS[3], price: 30, rating: 4.7, reviews: 64, city: "Lahore", days: 4, skills: ["Power BI", "SQL", "Python"], about: "Data analyst who turns messy numbers into clear dashboards that help you decide faster.", color: "#6B3FA0" },
  { id: 8, name: "Noor Fatima", title: "I will clean and analyze your data in Excel and Python", cat: CATS[3], price: 20, rating: 4.6, reviews: 77, city: "Rawalpindi", days: 3, skills: ["Excel", "Python", "Pandas"], about: "I clean, organise and analyse datasets, and explain the findings in simple language.", color: "#B0612B" },
  { id: 9, name: "Hira Noor", title: "I will do SEO and content marketing for your website", cat: CATS[4], price: 20, rating: 4.6, reviews: 141, city: "Sialkot", days: 6, skills: ["SEO", "Content", "Copywriting"], about: "I help small websites rank higher with practical SEO and content that people want to read.", color: "#B3402E" },
  { id: 10, name: "Daniyal Shah", title: "I will manage your social media ad campaigns", cat: CATS[4], price: 12, rating: 4.4, reviews: 49, city: "Peshawar", days: 2, skills: ["Meta Ads", "Social Media", "Analytics"], about: "I plan and run social media ads on a small budget and report the results every week.", color: "#2D6A8A" }
];
const POOL = [["Ali R.", "Delivered earlier than promised and the quality was excellent."], ["Sara M.", "Very professional. Understood my requirements right away."], ["Omar K.", "Great communication and a fair price. Would hire again."], ["Hina T.", "Patient with my revisions and the final result looked perfect."], ["Daniel P.", "Exactly what I asked for, done neatly."]];
const reviewsOf = f => [0, 1, 2].map(i => ({ who: POOL[(f.id + i) % 5][0], text: POOL[(f.id + i) % 5][1], stars: f.rating >= 4.7 ? 5 : 4 }));

function avatar(f) {
  if (f.img) return f.img;
  const ini = f.name.split(" ").map(w => w[0]).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${f.color}"/><stop offset="1" stop-color="#0E3B3A"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="50%" y="52%" font-family="Arial,sans-serif" font-size="110" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">${ini}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* saved freelancers (kept in this browser) */
const favs = {
  get() { try { return new Set(JSON.parse(localStorage.getItem("hunar_favs") || "[]")); } catch { return new Set(); } },
  toggle(id) {
    id = +id; const s = this.get(); s.has(id) ? s.delete(id) : s.add(id);
    try { localStorage.setItem("hunar_favs", JSON.stringify([...s])); } catch {}
    return s.has(id);
  }
};

/* reusable freelancer card */
function card(f) {
  const on = favs.get().has(f.id), url = "profile.html?id=" + f.id;
  return `<article class="fcard">
    <a href="${url}" class="ph"><img src="${avatar(f)}" alt="${f.name}" loading="lazy"></a>
    <button class="fav${on ? " on" : ""}" data-fav="${f.id}" aria-pressed="${on}" aria-label="Save ${f.name}">${on ? "♥" : "♡"}</button>
    <div class="fb">
      <div class="who"><b>${f.name}</b><span>${f.city}</span></div>
      <h3><a href="${url}">${f.title}</a></h3>
      <span class="cat-tag">${f.cat}</span>
      <div class="meta"><span>★ ${f.rating} <small>(${f.reviews})</small></span><span>From <b>$${f.price}</b></span></div>
      <a class="btn solid full" href="${url}">View Profile</a>
    </div></article>`;
}

/* toast */
let tt;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200);
}

/* shared behaviour: save button, nav */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-fav]");
  if (b) {
    const on = favs.toggle(b.dataset.fav);
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
    b.textContent = b.classList.contains("fav") ? (on ? "♥" : "♡") : (on ? "♥ Saved" : "♡ Save");
    toast(on ? "Saved to your list" : "Removed from your list");
  }
  if (e.target.closest("[data-soon]")) toast("Login and Register are on the Home page for now");
});
const burger = $("#burger"), menu = $("#menu");
burger.addEventListener("click", () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
addEventListener("scroll", () => $("#nav").classList.toggle("stuck", scrollY > 8), { passive: true });
