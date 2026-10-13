const sid = new URLSearchParams(location.search).get("id");
const s = getServices().find(x => x.id === sid);
const view = $("#view");
view.innerHTML = '<div class="pgrid"><div><div class="skel s-line" style="height:300px"></div><div class="skel s-line" style="height:120px"></div></div><div class="skel s-line" style="height:280px"></div></div>';
setTimeout(() => s ? show() : notFound(), 500);

function notFound() {
  document.title = "Service not found – Hunar";
  view.innerHTML = '<div class="empty"><p>This service could not be found. It may have been deleted.</p><a class="btn solid" href="dashboard.html#services">Go to My Services</a></div>';
}
function show() {
  const u = getUser();
  document.title = s.title + " – Hunar";
  view.innerHTML = `<div class="pgrid"><div>
    <img class="shero" src="${simg(s)}" alt="${esc(s.title)}">
    <span class="cat-tag">${esc(s.cat)}</span>
    <h1 class="stitle">${esc(s.title)}</h1>
    <div class="owner"><img class="pav sm" src="${photo(u)}" alt=""><div><b>${esc(u.name)}</b><p>${esc(u.title)} · ★ ${u.rating} (${u.reviews})</p></div><a href="dashboard.html#profile">View profile</a></div>
    <div class="pbody"><h3>About this service</h3><p class="sdesc">${esc(s.desc)}</p><h3>Skills and tags</h3><div class="sk">${s.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div></div>
  </div>
  <aside class="order"><p class="pp">$${esc(s.price)}</p><p>Delivery in ${s.days} day${s.days > 1 ? "s" : ""}</p>
    <ul><li>Category: ${esc(s.cat)}</li><li>Delivery: ${s.days} day${s.days > 1 ? "s" : ""}</li><li>Seller: ${esc(u.name)}</li></ul>
    <button class="btn solid full" id="msg">Contact seller</button>
    <a class="btn ghost full" href="dashboard.html#create/${s.id}">Edit service</a>
    <a class="btn ghost full" href="dashboard.html#services">Back to My Services</a></aside></div>`;
  $("#msg").addEventListener("click", () => toast("Messaging will be added in a later week"));
}
