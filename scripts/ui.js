export const ele = {
  form: document.querySelector("form"),
  result_list: document.querySelector("#results"),
  recipe_area: document.querySelector('#recipe'),
  like_list: document.querySelector('.dropdown'),
  basket_list: document.querySelector('#basket'),
  clear_btn: document.querySelector('#clear'),

};

export const notify = (text) => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #fbda61, #ff5acd)",
    },
  }).showToast();
};

export const renderLoader = (outlet) => {
  outlet.innerHTML = `<div class="wrapper">
  <div class="three-body">
  <div class="three-body__dot"></div>
  <div class="three-body__dot"></div>
  <div class="three-body__dot"></div>
  </div>
  </div>`;
};

// arama sonuc;larini ekrana bas

export const renderResults = (results) => {
  console.log(results)
  // tarif dizisi icindeki herbir tarif icin bir link olustur
  // result list icie bu htmlleri gonder
  ele.result_list.innerHTML = results
    .map(
      (recipe) => `
  
  <a href="#${recipe.recipe_id}">
  <div class="image-wrapper">
    <img
      src="${recipe.image_url}"
     
    />
  </div>
  <div class="info">
    <h4>${recipe.title}</h4>
    <p>${recipe.publisher}</p>
  </div>
</a>`
    )
    .join('');
};
