document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector("[data-product-detail]");
  if (!root) return;

  const id = getQueryParam("id");
  const product = (window.PRODUCTS || []).find(function (p) { return p.id === id; });

  if (!product) {
    root.innerHTML = "<p>Product not found. <a href='shop.html' style='text-decoration:underline;'>Return to shop</a>.</p>";
    return;
  }

  document.title = product.title + " — " + document.title;

  let selectedSize = product.sizes[0];

  function render() {
    root.innerHTML =
      '<div class="product">' +
        '<div>' +
          '<div class="product__gallery-main"><img src="' + product.images[0] + '" alt="' + product.title + '"></div>' +
          (product.images.length > 1 ? '<div class="product__thumbs">' + product.images.map(function (img, i) {
            return '<img src="' + img + '" class="' + (i === 0 ? "is-active" : "") + '" data-thumb data-src="' + img + '">';
          }).join("") + '</div>' : '') +
        '</div>' +
        '<div class="product__info">' +
          '<h1>' + product.title + '</h1>' +
          '<div class="product__price">' + formatPrice(product.price) + '</div>' +
          '<p>' + product.description + '</p>' +
          '<div>' +
            '<label>Size</label>' +
            '<div class="size-list" data-size-list>' +
              product.sizes.map(function (s) {
                return '<button type="button" data-size="' + s + '" class="' + (s === selectedSize ? "is-selected" : "") + '">' + s + '</button>';
              }).join("") +
            '</div>' +
          '</div>' +
          '<div>' +
            '<label>Quantity</label>' +
            '<div class="quantity-selector">' +
              '<button type="button" data-qty-minus>&minus;</button>' +
              '<input type="text" data-qty-input readonly value="1">' +
              '<button type="button" data-qty-plus>+</button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="btn btn--full" data-add-to-bag style="margin-bottom:12px;">Add to Bag</button>' +
          '<button type="button" class="btn btn--outline btn--full" data-buy-now>Buy Now — Secure Checkout</button>' +
          '<div class="trust-badges">' +
            '<span>Insured shipping across Ireland &amp; EU</span>' +
            '<span>Secure checkout with Stripe</span>' +
            '<span>30-day returns</span>' +
          '</div>' +
          '<div class="product__accordion">' +
            '<details class="accordion-item" open><summary>Shipping &amp; Delivery</summary><div class="accordion-item__content">Dispatched within 1-2 business days. Ireland: 2-4 business days. EU: 3-7 business days.</div></details>' +
            '<details class="accordion-item"><summary>Returns &amp; Exchanges</summary><div class="accordion-item__content">Return unworn items within 30 days for a full refund.</div></details>' +
          '</div>' +
        '</div>' +
      '</div>';

    root.querySelectorAll("[data-thumb]").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        root.querySelector(".product__gallery-main img").src = thumb.getAttribute("data-src");
        root.querySelectorAll("[data-thumb]").forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
      });
    });

    root.querySelectorAll("[data-size-list] button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedSize = btn.getAttribute("data-size");
        root.querySelectorAll("[data-size-list] button").forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
      });
    });

    const qtyInput = root.querySelector("[data-qty-input]");
    root.querySelector("[data-qty-minus]").addEventListener("click", function () {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
    });
    root.querySelector("[data-qty-plus]").addEventListener("click", function () {
      qtyInput.value = parseInt(qtyInput.value, 10) + 1;
    });

    root.querySelector("[data-add-to-bag]").addEventListener("click", function () {
      addToBag(product.id, selectedSize, parseInt(qtyInput.value, 10));
      const btn = root.querySelector("[data-add-to-bag]");
      const original = btn.textContent;
      btn.textContent = "Added to Bag";
      setTimeout(function () { btn.textContent = original; }, 1500);
    });

    root.querySelector("[data-buy-now]").addEventListener("click", function (e) {
      startCheckout([{ productId: product.id, size: selectedSize, qty: parseInt(qtyInput.value, 10) }], e.currentTarget);
    });
  }

  render();
});
