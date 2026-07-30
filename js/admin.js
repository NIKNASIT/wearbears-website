const STATUS_OPTIONS = ["Order Received", "Processing", "Shipped", "Delivered", "Cancelled"];

function formatMoney(cents, currency) {
  const symbol = (currency || "eur").toUpperCase() === "EUR" ? "€" : (currency || "").toUpperCase() + " ";
  return symbol + (cents / 100).toFixed(2);
}

function showLoggedIn(user) {
  document.getElementById("AdminGate").style.display = "none";
  document.getElementById("AdminContent").style.display = "block";
  document.getElementById("AdminUserInfo").innerHTML =
    "<span>" + (user.email || "") + "</span>" +
    '<button type="button" class="btn btn--light" id="LogoutBtn" style="padding:8px 16px;">Sign Out</button>';
  document.getElementById("LogoutBtn").addEventListener("click", function () {
    netlifyIdentity.logout();
  });
  loadOrders();
}

function showLoggedOut() {
  document.getElementById("AdminGate").style.display = "block";
  document.getElementById("AdminContent").style.display = "none";
  document.getElementById("AdminUserInfo").innerHTML = "";
}

function authHeader() {
  const user = netlifyIdentity.currentUser();
  if (!user) return Promise.resolve({});
  return user.jwt().then(function (token) {
    return { Authorization: "Bearer " + token };
  });
}

function orderRowHTML(order) {
  const itemsSummary = (order.items || []).map(function (i) {
    return i.quantity + "&times; " + i.title + (i.size ? " (" + i.size + ")" : "");
  }).join("<br>");

  const statusOptions = STATUS_OPTIONS.map(function (s) {
    return '<option value="' + s + '"' + (s === order.status ? " selected" : "") + ">" + s + "</option>";
  }).join("");

  return (
    '<tr data-order="' + order.orderNumber + '">' +
      "<td><strong>" + order.orderNumber + "</strong><br><span style=\"color:#888;\">" + new Date(order.createdAt).toLocaleDateString() + "</span></td>" +
      "<td>" + (order.customerName || "") + "<br>" + order.email + "<br>" + (order.phone || "") + "</td>" +
      "<td>" + itemsSummary + "</td>" +
      "<td>" + formatMoney(order.amountTotal, order.currency) + "</td>" +
      '<td><select data-field="status">' + statusOptions + "</select></td>" +
      '<td><input type="text" data-field="trackingCarrier" value="' + (order.trackingCarrier || "") + '" placeholder="Carrier"></td>' +
      '<td><input type="text" data-field="trackingNumber" value="' + (order.trackingNumber || "") + '" placeholder="Tracking #"></td>' +
      '<td><input type="text" data-field="trackingUrl" value="' + (order.trackingUrl || "") + '" placeholder="https://..."></td>' +
      '<td><button type="button" class="btn save-btn" data-save>Save</button><span data-saved style="display:none;color:var(--color-accent);font-size:11px;margin-left:6px;">Saved</span></td>' +
    "</tr>"
  );
}

function loadOrders() {
  const wrap = document.getElementById("OrdersWrap");
  wrap.innerHTML = '<p class="admin-empty">Loading orders…</p>';

  authHeader().then(function (headers) {
    fetch("/api/list-orders", { headers: headers })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        const orders = data.orders || [];
        if (orders.length === 0) {
          wrap.innerHTML = '<p class="admin-empty">No orders yet.</p>';
          return;
        }
        wrap.innerHTML =
          '<table class="orders-table"><thead><tr>' +
            "<th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Carrier</th><th>Tracking #</th><th>Tracking URL</th><th></th>" +
          "</tr></thead><tbody>" +
          orders.map(orderRowHTML).join("") +
          "</tbody></table>";

        wrap.querySelectorAll("[data-save]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            saveOrder(btn.closest("tr"));
          });
        });
      })
      .catch(function () {
        wrap.innerHTML = '<p class="admin-empty">Could not load orders. Try refreshing.</p>';
      });
  });
}

function saveOrder(row) {
  const orderNumber = row.getAttribute("data-order");
  const payload = { orderNumber: orderNumber };
  row.querySelectorAll("[data-field]").forEach(function (field) {
    payload[field.getAttribute("data-field")] = field.value;
  });

  const savedLabel = row.querySelector("[data-saved]");
  const saveBtn = row.querySelector("[data-save]");
  saveBtn.disabled = true;

  authHeader().then(function (headers) {
    fetch("/api/update-order", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("Save failed");
        savedLabel.style.display = "inline";
        setTimeout(function () { savedLabel.style.display = "none"; }, 2000);
      })
      .catch(function () {
        alert("Could not save changes. Please try again.");
      })
      .finally(function () {
        saveBtn.disabled = false;
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  netlifyIdentity.on("init", function (user) {
    if (user) showLoggedIn(user); else showLoggedOut();
  });
  netlifyIdentity.on("login", function (user) {
    showLoggedIn(user);
    netlifyIdentity.close();
  });
  netlifyIdentity.on("logout", showLoggedOut);

  document.getElementById("LoginBtn").addEventListener("click", function () {
    netlifyIdentity.open();
  });
  document.getElementById("RefreshBtn").addEventListener("click", loadOrders);

  netlifyIdentity.init();
});
