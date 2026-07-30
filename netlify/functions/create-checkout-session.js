const Stripe = require("stripe");
const PRODUCTS = require("../../js/products.js");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Stripe is not configured yet (missing STRIPE_SECRET_KEY)." }) };
  }

  let items;
  try {
    items = JSON.parse(event.body).items;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Your bag is empty." }) };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.URL || "http://localhost:8888";

  const lineItems = [];
  const orderItems = [];

  for (const line of items) {
    const product = PRODUCTS.find(function (p) { return p.id === line.productId; });
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: "Unknown product in bag: " + line.productId }) };
    }
    const quantity = Math.max(1, parseInt(line.qty, 10) || 1);

    lineItems.push({
      quantity: quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.title + (line.size ? " (Size: " + line.size + ")" : ""),
          images: []
        }
      }
    });

    orderItems.push({
      productId: product.id,
      title: product.title,
      size: line.size || "",
      quantity: quantity,
      unitPrice: product.price
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["IE", "GB", "FR", "DE", "ES", "IT", "NL", "BE", "PT", "AT"] },
      phone_number_collection: { enabled: true },
      success_url: siteUrl + "/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: siteUrl + "/bag.html",
      metadata: {
        order_items: JSON.stringify(orderItems)
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
