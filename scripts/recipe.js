import { ele } from "./ui.js";

export default class Recipe {
  constructor() {
    this.info = {};

    // likelanana tarifler

    this.likes = JSON.parse(localStorage.getItem("likes")) || [];

    // like listesini ekrana basar
    this.renderLikeList();
  }

  //api'den tarif bilgilerini alan method

  async getRecipe(id) {
    // id'ye gore tarif detayi al
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/get?rId=${id}`
    );

    // verileri isle
    const data = await res.json();

    // bilgileri classa tanimla
    this.info = data.recipe;
  }

  // tarif bilgilerini ekrana basan method

  renderRecipe(r) {
    // ekrana basar
    ele.recipe_area.innerHTML = `
  
     <figure>
      <img
        src="${r.image_url}"
      />
      <h1>${r.title}</h1>

      <div class="like-area">
      <i id="like-btn" class="bi ${
        this.isRecipeLiked() ? "bi-heart-fill" : "bi-heart"
      }"></i>
      </div>
    </figure>

    <div class="ing">
      <ul>
       ${this.createIngredient()}
      </ul>

      <button id="add-to-cart" class="CartBtn">
        <span class="IconContainer"> 
          <i class="cart bi bi-cart-fill"></i>
        </span>
        <p class="text">Add to Cart</p>
      </button>

    </div>



    <div class="direction">
      <h3>How to Cook</h3>
      <p><span>${r.publisher}</span> </p>
      <a href="${r.publisher_url}" target="_blank">Instruction</a>
    </div>
    `;

    // like event i izle

    document
      .querySelector("#like-btn")
      .addEventListener("click", () => this.controlLike());
  }

  // herbir malzeme bilgisi icin liste elemani olustursun

  createIngredient() {
    return this.info.ingredients
      .map(
        (i) =>
          `<li>
      <i class="bi bi-check-circle"></i>
      <p>${i}</p>
    </li>`
      )
      .join(" ");
  }

  // eleman likelanmissa like kaldir

  controlLike() {
    //likelanan elemanin  bilgilerini al

    const newItem = {
      id: this.info.recipe_id,
      img: this.info.image_url,
      title: this.info.title,
    };

    if (this.isRecipeLiked()) {
      // diziden kaldir
      this.likes = this.likes.filter((i) => i.id !== newItem.id);
    } else {
      // diziye ekle
      this.likes.push(newItem);
    }

    // likes dizisini locale aktar
    localStorage.setItem("likes", JSON.stringify(this.likes));

    // detay arayuuz guncelle

    this.renderRecipe(this.info);

    // like listesinn arayuzunu guncelle
    this.renderLikeList();
  }

  // ekranda detayi goruntulenana tarif likelanmis mi kontro eder

  isRecipeLiked() {
    // egerki tarifi bulursa dondurecek bulumazsa undefined olacak
    return this.likes.find((i) => i.id === this.info.recipe_id);
  }

  renderLikeList() {
    ele.like_list.innerHTML = this.likes
      .map(
        (i) =>
          `<a href="#${i.id}">
      <img
        src="${i.img}"
        alt=""
      />
      <span>${i.title}</span>
    </a>`
      )
      .join("");
  }
}
