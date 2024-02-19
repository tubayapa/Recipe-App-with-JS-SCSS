import Search from "./scripts/search.js";
import Recipe from "./scripts/recipe.js";
import { ele, notify, renderLoader, renderResults } from "./scripts/ui.js";
import { categories } from "./scripts/constant.js";

// uuid kutuphanesinden id olusturma methodu import etme

import { v4 } from "https://jspm.dev//uuid";

// class ornegi olusturma

const search = new Search();
// console.log(search);

const recipe = new Recipe();

//! eventler

// sayfa yuklenmeisni izle
document.addEventListener("DOMContentLoaded", () => {
  // rastgele tarif getir
  const index = Math.floor(Math.random() * categories.length);
  getResults(categories[index]);
});

// Form takip et
ele.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target[0].value;
  getResults(query);
});

// Sayfa yuklenme olayini izle

window.addEventListener("DOMContentLoaded", () => {
  controlUrl();
  renderBasketItems();
});

// url'deki idnin degisme olayini izle

window.addEventListener("hashchange", controlUrl);

// tarif alanindaki tiklanmalari izle

ele.recipe_area.addEventListener("click", handleClick);

// !fonksiyonlar
// arama sonuclarini alip ekrana basar

async function getResults(query) {
  // arama terimi var mı kontrol et
  if (!query.trim()) {
    return notify("Enter your search!");
  }

  // loader basar
  renderLoader(ele.result_list);

  try {
    // apiden verileri al
    await search.fetchResults(query.trim());

    // veri hatali geldiyse uyari ver
    if (search.results.error) {
      notify("Couldn't find recipe with that name");

      // loader'i  kaldir
      ele.search.result_list.innerHTML = "";
    } else {
      // sonuclari ekrana bas
      renderResults(search.results.recipes);
    }
  } catch (err) {
    // hata olursa bildirim ver
    notify("There is a problem");
    // loader'i  kaldir
    ele.result_list.innerHTML = "";
  }
}

// detay verilerini alir ekrana basar

async function controlUrl() {
  // detay gosterilecek urunun id'sine eris
  const id = location.hash.slice(1);

  if (id) {
    // loader basar
    renderLoader(ele.recipe_area);

    // apiden verileri al
    await recipe.getRecipe(id);

    // ekrana bas
    recipe.renderRecipe(recipe.info);
  }
}

// tarif alanindaki tiklamalarda calisir

//! sepet alani

let basket = JSON.parse(localStorage.getItem("basket")) || [];

function handleClick(e) {
  if (e.target.id === "add-to-cart") {
    // butun malzemeleri sepete ekle

    recipe.info.ingredients.forEach((title) => {
      // herbir tarif icin yeni bir obje olustur ve id ekle
      const newItem = {
        id: v4(),
        title,
      };
      basket.push(newItem);
    });
  }
  // local guncelle
  localStorage.setItem("basket", JSON.stringify(basket));
  // seper arayuzunu guncelle

  renderBasketItems();
}

// tarif verilerini ekrana basar

function renderBasketItems() {
  ele.basket_list.innerHTML = basket
    .map(
      (i) =>
        `<li data-id="${i.id}">
    <i id="delete-item" class="bi bi-trash"></i>
    <span>${i.title}</span>
    </li>
  `
    )
    .join("");
}

// sile butonunu izle

ele.clear_btn.addEventListener("click", () => {
  const res = confirm("Are you sure?");
  if (res) {
    // sepeti sifirla
    basket = [];
    // locali temizle
    localStorage.removeItem("basket");

    //arayuzu temizle

    ele.basket_list.innerHTML = "";
  }
});

// tek tek silme islemi

ele.basket_list.addEventListener("click", (e) => {
  if (e.target.id === "delete-item") {
    const id = e.target.parentElement.dataset.id;
    basket = basket.filter((i) => i.id !== id);
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketItems();
  }
});
