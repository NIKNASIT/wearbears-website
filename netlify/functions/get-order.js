const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let orderNumber, email;
  try {
    const body = JSON.parse(event.body);
    orderNumber = (body.orderNumber || "").trim().toUpperCase().replace(/^#/, "");
    email = (body.email || "").trim().toLowerCase();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
  }

  if (!orderNumber || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Order number and email are required." }) };
  }

  const store = getStore("orders");
  const order = await store.get("order-" + orderNumber, { type: "json" });

  if (!order || order.email.toLowerCase() !== email) {
    return { statusCode: 404, body: JSON.stringify({ error: "We couldn't find an order matching that order number and email." }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items,
      amountTotal: order.amountTotal,
      currency: order.currency,
      createdAt: order.createdAt,
      trackingCarrier: order.trackingCarrier,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl
    })
  };
};
