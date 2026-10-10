let L = localStorage.lang === "ar" ? "ar" : "en", D = window.FALLBACK || { categories: [], products: [] }, io;
const TXT = { en: { title: "menu", ing: "Ingredients", btn: "arabic", cur: "EGP" }, ar: { title: "المنيو", ing: "المكونات", btn: "English", cur: "ج.م" } };
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const main = document.getElementById("main"), language = document.querySelector("#language");
const menuTitle = document.querySelector("nav h1"), menuBtn = document.querySelector(".menu-btn"), menuLinks = document.querySelector(".menu-links");

function render() {
    const t = TXT[L];
    document.documentElement.lang = L;
    menuTitle.textContent = t.title;
    language.textContent = t.btn;
    const cats = D.categories.filter(c => D.products.some(p => p.category === c.id));
    menuLinks.querySelectorAll(":scope > a").forEach(a => a.remove());
    menuLinks.insertAdjacentHTML("afterbegin", cats.map(c => `<a href="#cat-${esc(c.id)}">${esc(c["name_" + L])}</a>`).join(""));
    main.innerHTML = cats.map(c => `<section class="menu-container" id="cat-${esc(c.id)}">` +
        D.products.filter(p => p.category === c.id).map(p => {
            const name = p["name_" + L] || p.name_en || p.name_ar, ing = p["ing_" + L];
            return `<div class="card menu-item reveal"><img src="${esc(p.image)}" alt=""><h2>${esc(name)}</h2>` +
                (p.price > 0 ? `<p class="price">${p.price} ${t.cur}</p>` : "") +
                (p.available === false ? `<p class="price" style="color:#c0392b">${L === "ar" ? "غير متاح" : "Sold out"}</p>` : "") +
                (ing ? `<div class="ingredients"><h3>${t.ing}</h3><p>${esc(ing)}</p></div>` : "") + `</div>`;
        }).join("") + `</section>`).join("");
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)), { threshold: 0.15 });
    main.querySelectorAll(".menu-item").forEach(c => io.observe(c));
}

// tap a card to show / hide its ingredients
main.addEventListener("click", e => {
    const ing = e.target.closest(".menu-item")?.querySelector(".ingredients");
    if (ing) ing.style.opacity = ing.style.opacity === "1" ? "0" : "1";
});

language.addEventListener("click", () => { L = L === "en" ? "ar" : "en"; localStorage.lang = L; render(); });

function closeSideMenu() { menuLinks.classList.remove("open"); menuBtn.classList.remove("open"); }
menuBtn.addEventListener("click", e => { e.stopPropagation(); menuLinks.classList.toggle("open"); menuBtn.classList.toggle("open"); });
menuLinks.addEventListener("click", e => { if (e.target.closest("a")) closeSideMenu(); });
document.addEventListener("click", e => {
    if (menuLinks.classList.contains("open") && !menuLinks.contains(e.target) && !menuBtn.contains(e.target)) closeSideMenu();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSideMenu(); });

if (window.SB && !SB.key.startsWith("PASTE")) {
    const H = { apikey: SB.key };
    Promise.all([
        fetch(SB.url + "/rest/v1/categories?select=*&order=sort", { headers: H }),
        fetch(SB.url + "/rest/v1/products?select=*&order=created_at,id", { headers: H })
    ]).then(rs => Promise.all(rs.map(r => r.json()))).then(([c, p]) => {
        if (Array.isArray(c) && Array.isArray(p)) { D = { categories: c, products: p }; render(); }
    }).catch(() => {});
}
render();
