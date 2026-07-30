const Stripe = require("stripe");
const { getStore } = require("@netlify/blobs");

function generateOrderNumber() {
  const time = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return "WB" + time + rand;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const signature = event.headers["stripe-signature"];
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return { statusCode: 500, body: "Stripe is not configured." };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: "Webhook signature verification failed: " + err.message };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    let items = [];
    try {
      items = JSON.parse(session.metadata.order_items || "[]");
    } catch (e) {
      items = [];
    }

    const shipping = session.shipping_details || {};
    const shippingAddress = shipping.address || {};

    const order = {
      orderNumber: generateOrderNumber(),
      stripeSessionId: session.id,
      email: (session.customer_details && session.customer_details.email) || "",
      customerName: (session.customer_details && session.customer_details.name) || shipping.name || "",
      phone: (session.customer_details && session.customer_details.phone) || "",
      shippingAddress: {
        line1: shippingAddress.line1 || "",
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postal_code || "",
        country: shippingAddress.country || ""
      },
      items: items,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: "Order Received",
      trackingCarrier: "",
      trackingNumber: "",
      trackingUrl: "",
      createdAt: new Date().toISOString()
    };

    const store = getStore("orders");
    await store.setJSON("order-" + order.orderNumber, order);
    await store.set("session-" + session.id, order.orderNumber);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
