const main = $("#main");
const views = { profile: viewProfile, edit: viewEdit, services: viewServices, create: viewCreate };

/* ---------- helpers: validation, tags, image upload ---------- */
function setErr(id, m) { const f = $("#" + id).closest(".fld"); f.classList.toggle("bad", !!m); f.querySelector(".err").textContent = m || ""; return !m; }
function bind(form, rules) {
  form.addEventListener("focusout", e => { const r = rules[e.target.id]; if (r) setErr(e.target.id, r(e.target.value.trim())); });
  form.addEventListener("input", e => { const r = rules[e.target.id]; if (r && e.target.closest(".fld").classList.contains("bad")) setErr(e.target.id, r(e.target.value.trim())); });
}
const check = rules => Object.keys(rules).map(k => setErr(k, rules[k]($("#" + k).value.trim()))).every(Boolean);

function readImage(file, max, cb) {
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL("image/jpeg", 0.82));
    };
    im.onerror = () => cb(null); im.src = r.result;
  };
  r.onerror = () => cb(null); r.readAsDataURL(file);
}
function makeDrop(el, max, label, init, onChange) {
  let img = init || "";
  const draw = () => {
    el.innerHTML = '<input type="file" accept="image/*" hidden>' + (img
      ? `<img class="pre" src="${img}" alt="Preview"><div class="dacts"><button type="button" class="btn ghost" data-a="pick">Change</button><button type="button" class="btn ghost" data-a="rm">Remove</button></div>`
      : `<div class="dtxt"><b>📷 ${label}</b><span>Click or drag an image here. JPG or PNG, up to 3 MB.</span></div>`);
  };
  const take = f => {
    if (!f) return;
    if (!/^image\//.test(f.type)) return setErr(el.id, "Please choose an image file.");
    if (f.size > 3145728) return setErr(el.id, "This image is larger than 3 MB.");
    setErr(el.id, ""); el.classList.add("busy");
    readImage(f, max, d => {
      el.classList.remove("busy");
      if (!d) return setErr(el.id, "This image could not be read.");
      img = d; draw(); onChange(img);
    });
  };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]");
    if (a && a.dataset.a === "rm") { img = ""; draw(); onChange(""); return; }
    if (e.target.type !== "file") el.querySelector("input").click();
  });
  el.addEventListener("change", e => take(e.target.files[0]));
  el.addEventListener("dragover", e => { e.preventDefault(); el.classList.add("over"); });
  el.addEventListener("dragleave", () => el.classList.remove("over"));
  el.addEventListener("drop", e => { e.preventDefault(); el.classList.remove("over"); take(e.dataTransfer.files[0]); });
  el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.querySelector("input").click(); } });
  draw();
}
function tagBox(box, list, max) {
  const draw = () => {
    box.innerHTML = list.map((t, i) => `<span class="tg">${esc(t)}<button type="button" data-i="${i}" aria-label="Remove ${esc(t)}">×</button></span>`).join("") + '<input aria-label="Add a tag" placeholder="Type and press Enter">';
  };
  const add = (v, focus) => {
    v = v.trim().replace(/,$/, "").trim().slice(0, 24);
    if (!v) return;
    if (list.length >= max) return toast(`You can add up to ${max}`);
    if (!list.some(x => x.toLowerCase() === v.toLowerCase())) list.push(v);
    draw(); if (focus) box.querySelector("input").focus();
    box.dispatchEvent(new Event("change", { bubbles: true }));
  };
  box.addEventListener("keydown", e => {
    if (e.target.tagName !== "INPUT") return;
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(e.target.value, true); }
    else if (e.key === "Backspace" && !e.target.value && list.length) { list.pop(); draw(); box.querySelector("input").focus(); box.dispatchEvent(new Event("change", { bubbles: true })); }
  });
  box.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (b) { list.splice(+b.dataset.i, 1); draw(); box.dispatchEvent(new Event("change", { bubbles: true })); }
    box.querySelector("input").focus();
  });
  box.addEventListener("focusout", e => { if (e.target.tagName === "INPUT" && e.target.value.trim()) add(e.target.value, false); });
  draw();
}

/* service card (used in profile, My Services and live preview) */
const scard = (s, act) => `<article class="fcard">
  <a href="service.html?id=${s.id}" class="ph"><img src="${simg(s)}" alt=""></a>
  <div class="fb"><span class="cat-tag">${esc(s.cat) || "Category"}</span>
  <h3><a href="service.html?id=${s.id}">${esc(s.title)}</a></h3>
  <div class="meta"><span>${s.days} day${s.days > 1 ? "s" : ""}</span><span>From <b>$${esc(s.price)}</b></span></div>
  ${act ? `<div class="acts"><a class="btn ghost" href="service.html?id=${s.id}">View</a><a class="btn ghost" href="#create/${s.id}">Edit</a><button class="btn ghost del" data-del="${s.id}">Delete</button></div>` : ""}
  </div></article>`;

/* ---------- view 1: profile (freelancer profile layout) ---------- */
function viewProfile() {
  const u = getUser(), sv = getServices(), from = sv.length ? Math.min(...sv.map(s => s.price)) : null;
  main.innerHTML = `
  <section class="pcard"><img class="pav" src="${photo(u)}" alt="${esc(u.name)}">
    <div class="pinfo"><h1>${esc(u.name)}</h1><p class="pt">${esc(u.title)}</p><p class="pm">★ ${u.rating} (${u.reviews} sample reviews) · ${esc(u.city)}</p></div>
    <div class="pact"><a class="btn ghost" href="#edit">Edit Profile</a><a class="btn accent" href="#create">+ Create Service</a></div></section>
  <div class="stats3"><div><b>${sv.length}</b><span>Services</span></div><div><b>${u.rating}</b><span>Rating</span></div><div><b>${from !== null ? "$" + from : "–"}</b><span>Starting price</span></div></div>
  <div class="dcard"><h3>About</h3><p>${esc(u.bio)}</p></div>
  <div class="dcard"><h3>Skills</h3>${u.skills.length ? `<div class="sk">${u.skills.map(s => `<span>${esc(s)}</span>`).join("")}</div>` : '<p>No skills added yet.</p>'}</div>
  <div class="dcard"><h3>Experience</h3>${u.exp.length ? u.exp.map(x => `<div class="exp"><b>${esc(x.role)}</b><span>${esc(x.company)}${x.years ? " · " + esc(x.years) : ""}</span></div>`).join("") : '<p>No experience added yet.</p>'}</div>
  <div class="dcard"><div class="row-h"><h3>Services</h3><a href="#services">Manage</a></div>${sv.length ? `<div class="sgrid">${sv.map(s => scard(s)).join("")}</div>` : '<p>No services yet. <a href="#create"><b>Create one</b></a>.</p>'}</div>`;
}

/* ---------- view 2: edit profile ---------- */
function viewEdit() {
  const u = getUser(), skills = [...u.skills], exp = u.exp.map(x => ({ ...x }));
  let photoData = u.photo || "";
  main.innerHTML = `<h1 class="vt">Edit Profile</h1>
  <form id="pf" class="dform" novalidate>
    <div class="fld"><label>Profile picture</label><div class="drop sm" id="dropP" tabindex="0" role="button" aria-label="Upload profile picture"></div><small class="err"></small></div>
    <div class="fgrid">
      <div class="fld"><label for="name">Full name</label><input id="name" maxlength="40" autocomplete="name" value="${esc(u.name)}"><small class="err"></small></div>
      <div class="fld"><label for="title">Professional title</label><input id="title" maxlength="60" value="${esc(u.title)}"><small class="err"></small></div>
      <div class="fld"><label for="email">Email</label><input id="email" type="email" value="${esc(u.email)}"><small class="err"></small></div>
      <div class="fld"><label for="city">City</label><input id="city" maxlength="40" value="${esc(u.city)}"><small class="err"></small></div>
    </div>
    <div class="fld"><label for="bio">About / Bio</label><textarea id="bio" rows="5" maxlength="400">${esc(u.bio)}</textarea><small class="hint" id="bioN"></small><small class="err"></small></div>
    <div class="fld"><label>Skills (up to 10)</label><div class="tagbox" id="skills"></div><small class="err"></small></div>
    <div class="fld"><label>Experience (up to 5)</label><div id="exps"></div><button type="button" class="btn ghost" id="addExp">+ Add experience</button><small class="err"></small></div>
    <div class="dact"><button class="btn solid" type="submit">Save changes</button><a class="btn ghost" href="#profile">Cancel</a></div>
  </form>`;
  makeDrop($("#dropP"), 400, "Upload a profile picture", photoData, d => photoData = d);
  tagBox($("#skills"), skills, 10);
  const draw = () => $("#exps").innerHTML = exp.map((x, i) => `<div class="erow" data-i="${i}">
    <input data-k="role" placeholder="Role" aria-label="Role" maxlength="50" value="${esc(x.role)}">
    <input data-k="company" placeholder="Company" aria-label="Company" maxlength="50" value="${esc(x.company)}">
    <input data-k="years" placeholder="Years, e.g. 2025" aria-label="Years" maxlength="20" value="${esc(x.years)}">
    <button type="button" data-rx="${i}">Remove</button></div>`).join("");
  draw();
  $("#exps").addEventListener("input", e => { const r = e.target.closest(".erow"); if (r) exp[+r.dataset.i][e.target.dataset.k] = e.target.value; });
  $("#exps").addEventListener("click", e => { const b = e.target.closest("[data-rx]"); if (b) { exp.splice(+b.dataset.rx, 1); draw(); } });
  $("#addExp").addEventListener("click", () => exp.length < 5 ? (exp.push({ role: "", company: "", years: "" }), draw()) : toast("You can add up to 5 experiences"));

  const rules = {
    name: v => v.length < 3 ? "Enter your full name (at least 3 characters)." : /\d/.test(v) ? "Name cannot contain numbers." : "",
    title: v => v.length < 3 ? "Enter your professional title." : "",
    email: v => /^\S+@\S+\.\S+$/.test(v) ? "" : "Enter a valid email address.",
    city: v => v ? "" : "Enter your city.",
    bio: v => v.length < 30 ? `Write at least 30 characters (${v.length}/30).` : ""
  };
  bind($("#pf"), rules);
  const cnt = () => $("#bioN").textContent = $("#bio").value.length + "/400";
  cnt(); $("#bio").addEventListener("input", cnt);
  $("#pf").addEventListener("submit", e => {
    e.preventDefault();
    const rows = exp.filter(x => x.role.trim() || x.company.trim() || x.years.trim());
    const ok = [check(rules),
      setErr("skills", skills.length ? "" : "Add at least one skill."),
      setErr("exps", rows.some(x => !x.role.trim() || !x.company.trim()) ? "Each experience needs a role and a company. Fill it in or remove the row." : "")
    ].every(Boolean);
    if (!ok) { toast("Please fix the highlighted fields"); const f = $(".fld.bad"); if (f) f.querySelector("input,textarea")?.focus(); return; }
    const v = id => $("#" + id).value.trim();
    const saved = store.set("user", { ...u, name: v("name"), title: v("title"), email: v("email"), city: v("city"), bio: v("bio"), skills, photo: photoData,
      exp: rows.map(x => ({ role: x.role.trim(), company: x.company.trim(), years: x.years.trim() })) });
    if (!saved) return toast("Could not save. Try a smaller picture.");
    toast("Profile updated"); location.hash = "#profile";
  });
}

/* ---------- view 3: my services ---------- */
function viewServices() {
  const sv = getServices();
  main.innerHTML = `<div class="row-h"><h1 class="vt">My Services</h1><a class="btn solid" href="#create">+ Create Service</a></div>` +
    (sv.length ? `<p class="count">${sv.length} service${sv.length > 1 ? "s" : ""}</p><div class="sgrid">${sv.map(s => scard(s, true)).join("")}</div>`
      : `<div class="empty"><p>You have not created any services yet.</p><a class="btn solid" href="#create">Create your first service</a></div>`);
}

/* ---------- view 4: create / edit service ---------- */
function viewCreate(id) {
  const all = getServices(), old = id ? all.find(s => s.id === id) : null;
  if (id && !old) { main.innerHTML = '<div class="empty"><p>This service could not be found.</p><a class="btn solid" href="#services">Back to My Services</a></div>'; return; }
  const tags = [...(old ? old.tags : [])]; let img = old ? old.img : "";
  main.innerHTML = `<h1 class="vt">${old ? "Edit Service" : "Create a Service"}</h1>
  <div class="cgrid"><form id="sf" class="dform" novalidate>
    <div class="fld"><label>Service image (optional)</label><div class="drop" id="dropS" tabindex="0" role="button" aria-label="Upload service image"></div><small class="err"></small></div>
    <div class="fld"><label for="stitle">Service title</label><input id="stitle" maxlength="80" placeholder="I will build a responsive website for you" value="${esc(old?.title)}"><small class="hint" id="tN"></small><small class="err"></small></div>
    <div class="fgrid">
      <div class="fld"><label for="cat">Category</label><select id="cat"><option value="">Choose a category</option>${CATS.map(c => `<option${old?.cat === c ? " selected" : ""}>${c}</option>`).join("")}</select><small class="err"></small></div>
      <div class="fld"><label for="days">Delivery time</label><select id="days">${[1, 2, 3, 5, 7, 10, 14, 21, 30].map(d => `<option value="${d}"${(old?.days || 5) === d ? " selected" : ""}>${d} day${d > 1 ? "s" : ""}</option>`).join("")}</select><small class="err"></small></div>
      <div class="fld"><label for="price">Price (USD)</label><input id="price" type="number" min="5" max="1000" step="1" placeholder="e.g. 25" value="${old?.price ?? ""}"><small class="err"></small></div>
    </div>
    <div class="fld"><label for="desc">Description</label><textarea id="desc" rows="6" maxlength="600" placeholder="Explain what you will deliver and how you work.">${esc(old?.desc)}</textarea><small class="hint" id="dN"></small><small class="err"></small></div>
    <div class="fld"><label>Skills / tags (up to 8)</label><div class="tagbox" id="tags"></div><small class="err"></small></div>
    <div class="dact"><button class="btn solid" id="sub" type="submit">${old ? "Save service" : "Publish service"}</button><a class="btn ghost" href="#services">Cancel</a></div>
  </form><aside class="prev"><h4>Live preview</h4><div id="prev"></div></aside></div>`;
  const v = k => $("#" + k).value.trim();
  const preview = () => {
    $("#tN").textContent = $("#stitle").value.length + "/80"; $("#dN").textContent = $("#desc").value.length + "/600";
    $("#prev").innerHTML = scard({ id: "preview", title: v("stitle") || "Your service title will appear here", cat: v("cat"), price: v("price") || "0", days: +v("days"), img });
  };
  makeDrop($("#dropS"), 800, "Upload a service image", img, d => { img = d; preview(); });
  tagBox($("#tags"), tags, 8);
  const rules = {
    stitle: s => s.length < 15 ? `Title needs at least 15 characters (${s.length}/15).` : "",
    cat: s => s ? "" : "Choose a category.",
    price: s => /^\d+$/.test(s) && s >= 5 && s <= 1000 ? "" : "Enter a whole number between 5 and 1000.",
    desc: s => s.length < 50 ? `Description needs at least 50 characters (${s.length}/50).` : ""
  };
  bind($("#sf"), rules);
  $("#sf").addEventListener("input", preview); $("#sf").addEventListener("change", preview); preview();
  $("#sf").addEventListener("submit", e => {
    e.preventDefault();
    const ok = [check(rules), setErr("tags", tags.length ? "" : "Add at least one skill or tag.")].every(Boolean);
    if (!ok) { toast("Please fix the highlighted fields"); const f = $(".fld.bad"); if (f) f.querySelector("input,textarea,select")?.focus(); return; }
    const data = { title: v("stitle"), cat: v("cat"), desc: v("desc"), price: +v("price"), days: +v("days"), tags, img };
    $("#sub").disabled = true; $("#sub").textContent = "Saving…";
    setTimeout(() => {
      const list = getServices();
      if (old) list[list.findIndex(s => s.id === old.id)] = { ...old, ...data }; else list.unshift({ id: "s" + Date.now(), ...data });
      if (!saveServices(list)) { $("#sub").disabled = false; $("#sub").textContent = "Try again"; return toast("Could not save. Try a smaller image."); }
      toast(old ? "Service updated" : "Service published"); location.hash = "#services";
    }, 700);
  });
}

/* ---------- delete confirmation ---------- */
let delId = null; const cm = $("#cm");
document.addEventListener("click", e => {
  const d = e.target.closest("[data-del]");
  if (d) { delId = d.dataset.del; const s = getServices().find(x => x.id === delId); $("#cmt").textContent = `"${s ? s.title : "This service"}" will be removed permanently.`; cm.hidden = false; $("#cmNo").focus(); }
  else if (e.target === cm || e.target.id === "cmNo") cm.hidden = true;
  else if (e.target.id === "cmYes") { saveServices(getServices().filter(x => x.id !== delId)); cm.hidden = true; toast("Service deleted"); route(); }
});
addEventListener("keydown", e => { if (e.key === "Escape") cm.hidden = true; });

/* ---------- router ---------- */
function route() {
  const [name, arg] = (location.hash.slice(1) || "profile").split("/");
  const v = views[name] ? name : "profile", u = getUser();
  $$(".snav a").forEach(a => a.classList.toggle("on", a.dataset.v === v));
  $("#me").innerHTML = `<img src="${photo(u)}" alt=""><div><b>${esc(u.name)}</b><small>${esc(u.title)}</small></div>`;
  views[v](arg); scrollTo(0, 0);
}
main.innerHTML = '<div class="skel s-line" style="height:150px"></div><div class="skel s-line" style="height:90px"></div><div class="skel s-line" style="height:220px"></div>';
setTimeout(() => { route(); addEventListener("hashchange", route); }, 400);
