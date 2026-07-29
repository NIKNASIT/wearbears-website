const BAG_KEY = "luxe_bag_v1";

function getBag() {
  try {
    return JSON.parse(localStorage.getItem(BAG_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveBag(bag) {
  localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  renderBagCount();
}

function addToBag(productId, size, qty) {
  const bag = getBag();
  const existing = bag.find(function (l) { return l.productId === productId && l.size === size; });
  if (existing) {
    existing.qty += qty;
  } else {
    bag.push({ productId: productId, size: size, qty: qty });
  }
  saveBag(bag);
}

function updateLineQty(index, qty) {
  const bag = getBag();
  if (qty <= 0) {
    bag.splice(index, 1);
  } else {
    bag[index].qty = qty;
  }
  saveBag(bag);
  if (document.querySelector("[data-bag-page]")) renderBagPage();
}

function removeLine(index) {
  updateLineQty(index, 0);
}

function bagItemCount() {
  return getBag().reduce(function (sum, l) { return sum + l.qty; }, 0);
}

function formatPrice(amount) {
  const symbol = (window.SITE_CONFIG && window.SITE_CONFIG.CURRENCY_SYMBOL) || "€";
  return symbol + Number(amount).toFixed(2);
}

function renderBagCount() {
  const count = bagItemCount();
  document.querySelectorAll("[data-bag-count]").forEach(function (el) {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function findProduct(productId) {
  return (window.PRODUCTS || []).find(function (p) { return p.id === productId; });
}

function renderBagPage() {
  const bag = getBag();
  const itemsWrap = document.querySelector("[data-bag-items]");
  const emptyState = document.querySelector("[data-bag-empty]");
  const summary = document.querySelector("[data-bag-summary]");
  if (!itemsWrap) return;

  if (bag.length === 0) {
    itemsWrap.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    if (summary) summary.style.display = "none";
    return;
  }
  if (emptyState) emptyState.style.display = "none";
  if (summary) summary.style.display = "block";

  let subtotal = 0;
  itemsWrap.innerHTML = bag.map(function (line, index) {
    const product = findProduct(line.productId);
    if (!product) return "";
    const lineTotal = product.price * line.qty;
    subtotal += lineTotal;
    return (
      '<div class="bag-line">' +
        '<img src="' + product.image + '" alt="' + product.title + '">' +
        '<div style="flex:1;">' +
          '<p class="bag-line__title">' + product.title + '</p>' +
          '<p class="bag-line__variant">Size: ' + line.size + '</p>' +
          '<div class="quantity-selector" style="margin-bottom:8px;">' +
            '<button type="button" onclick="updateLineQty(' + index + ',' + (line.qty - 1) + ')">&minus;</button>' +
            '<input type="text" readonly value="' + line.qty + '">' +
            '<button type="button" onclick="updateLineQty(' + index + ',' + (line.qty + 1) + ')">+</button>' +
          '</div>' +
          '<p style="font-size:14px;margin-bottom:8px;">' + formatPrice(lineTotal) + '</p>' +
          '<button type="button" class="bag-line__remove" onclick="removeLine(' + index + ')">Remove</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");

  const subtotalEl = document.querySelector("[data-bag-subtotal]");
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);

  const checkoutBtn = document.querySelector("[data-checkout-btn]");
  if (checkoutBtn) {
    checkoutBtn.onclick = function () { goToCheckout(bag); };
  }
}

function goToCheckout(bag) {
  const domain = (window.SITE_CONFIG && window.SITE_CONFIG.STORE_DOMAIN) || "";
  if (!domain || domain.indexOf("your-store") !== -1) {
    alert("Checkout isn't connected yet. Add your Shopify store domain in js/config.js (see README.md) to enable real checkout.");
    return;
  }
  const firstWithLink = bag.map(function (l) { return findProduct(l.productId); }).find(function (p) { return p && p.shopifyUrl; });
  if (firstWithLink) {
    window.location.href = firstWithLink.shopifyUrl;
  } else {
    window.location.href = "https://" + domain + "/cart";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderBagCount();
  if (document.querySelector("[data-bag-page]")) renderBagPage();
});
