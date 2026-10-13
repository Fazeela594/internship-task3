const id = +new URLSearchParams(location.search).get("id");
const f = F.find(x => x.id === id);
const view = $("#view");
const PK = [
  { n: "Basic", m: 1, d: 0, f: ["1 revision", "Final files delivered"] },
  { n: "Standard", m: 2, d: 2, f: ["3 revisions", "Source files included", "Priority replies"] },
  { n: "Premium", m: 3.5, d: 4, f: ["Unlimited revisions", "Source files included", "Priority replies", "7 days of support"] }
];
let sel = 0;

/* state 1: loading */
view.innerHTML = `<div class="pgrid"><div><div class="skel s-line" style="height:96px"></div><div class="skel s-line" style="height:220px"></div></div><div class="skel s-line" style="height:330px"></div></div>`;
setTimeout(f ? show : notFound, 500);

/* state 2: not found */
function notFound() {
  document.title = "Not found – Hunar";
  view.innerHTML = `<div class="empty"><p>This freelancer could not be found.</p><a class="btn solid" href="freelancers.html">Browse freelancers</a></div>`;
}

/* state 3: profile */
function show() {
  document.title = f.name + " – Hunar";
  view.innerHTML = `<div class="pgrid"><div>
      <div class="phd"><img class="pav" src="${avatar(f)}" alt="${f.name}"><div><h1>${f.name}</h1><p>${f.title}</p><p>★ ${f.rating} (${f.reviews} reviews) · ${f.city} · ${f.cat}</p></div></div>
      <div class="ptabs" role="tablist"><button class="ptab on" data-t="about">About</button><button class="ptab" data-t="reviews">Reviews (${f.reviews})</button></div>
      <div class="pbody" id="tb"></div></div>
    <aside class="order" id="order"></aside></div>
    <div class="rel"><h2>You may also like</h2><div class="mgrid" id="rel"></div></div>`;
  tab("about"); order();
  const more = [...F.filter(x => x.cat === f.cat), ...F.filter(x => x.cat !== f.cat)].filter(x => x.id !== f.id).slice(0, 4);
  $("#rel").innerHTML = more.map(card).join("");
}

function tab(t) {
  $$(".ptab").forEach(b => b.classList.toggle("on", b.dataset.t === t));
  $("#tb").innerHTML = t === "about"
    ? `<h3>About this freelancer</h3><p>${f.about}</p><h3>Skills</h3><div class="sk">${f.skills.map(s => `<span>${s}</span>`).join("")}</div><h3>Quick facts</h3><p>Based in ${f.city}. Starts at $${f.price}. Usually delivers in about ${f.days} days.</p>`
    : `<p><b>${f.rating}</b> average from ${f.reviews} reviews. Latest reviews:</p><br>` + reviewsOf(f).map(r => `<div class="rv"><b>${r.who}</b><span class="st">${"★".repeat(r.stars)}</span><p>${r.text}</p></div>`).join("");
}

function order() {
  const k = PK[sel], price = Math.round(f.price * k.m), on = favs.get().has(f.id);
  $("#order").innerHTML = `<div class="pk">${PK.map((x, i) => `<button class="pkb${i === sel ? " on" : ""}" data-i="${i}">${x.n}</button>`).join("")}</div>
    <p class="pp">$${price}</p><p>Delivery in ${f.days + k.d} days</p>
    <ul>${k.f.map(x => `<li>${x}</li>`).join("")}</ul>
    <button class="btn solid full" id="go">Continue ($${price})</button>
    <button class="btn ghost full savebtn${on ? " on" : ""}" data-fav="${f.id}">${on ? "♥ Saved" : "♡ Save"}</button>`;
}

view.addEventListener("click", e => {
  const t = e.target.closest(".ptab"), k = e.target.closest(".pkb"), go = e.target.closest("#go");
  if (t) tab(t.dataset.t);
  if (k) { sel = +k.dataset.i; order(); }
  if (go) {
    /* state 4: sending, then state 5: success */
    go.disabled = true; go.textContent = "Sending request…";
    setTimeout(() => {
      $("#order").innerHTML = `<div class="ok"><i>✓</i><h3>Request sent</h3><p>${f.name.split(" ")[0]} will reply soon with the next steps.</p><a class="btn solid full" href="freelancers.html" style="margin-top:1rem">Back to freelancers</a></div>`;
    }, 1100);
  }
});
