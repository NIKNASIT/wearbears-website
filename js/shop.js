function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function productCardHTML(product) {
  return (
    '<a href="product.html?id=' + encodeURIComponent(product.id) + '" class="product-card">' +
      '<div class="product-card__media"><img src="' + product.image + '" alt="' + product.title + '" loading="lazy"></div>' +
      '<p class="product-card__title">' + product.title + '</p>' +
      '<p class="product-card__price">' + formatPrice(product.price) + '</p>' +
    '</a>'
  );
}

function renderProductGrid(category) {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  const limit = parseInt(grid.getAttribute("data-limit") || "0", 10);
  let list = window.PRODUCTS || [];
  if (category && category !== "all") {
    list = list.filter(function (p) { return p.category === category; });
  }
  if (limit > 0) list = list.slice(0, limit);
  grid.innerHTML = list.map(productCardHTML).join("") || "<p>No products found.</p>";
}

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  const forcedCategory = grid.getAttribute("data-category");
  let currentCategory = forcedCategory || getQueryParam("category") || "all";

  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  filterButtons.forEach(function (btn) {
    if (btn.getAttribute("data-filter-btn") === currentCategory) btn.classList.add("is-active");
    btn.addEventListener("click", function () {
      currentCategory = btn.getAttribute("data-filter-btn");
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      renderProductGrid(currentCategory);
    });
  });

  renderProductGrid(currentCategory);
});
