const { getStore } = require("@netlify/blobs");

const VALID_STATUSES = ["Order Received", "Processing", "Shipped", "Delivered", "Cancelled"];

exports.handler = async function (event, context) {
  if (!context.clientContext || !context.clientContext.user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Sign in required." }) };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
  }

  const { orderNumber, status, trackingCarrier, trackingNumber, trackingUrl } = body;
  if (!orderNumber) {
    return { statusCode: 400, body: JSON.stringify({ error: "orderNumber is required." }) };
  }
  if (status && VALID_STATUSES.indexOf(status) === -1) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid status value." }) };
  }

  const store = getStore("orders");
  const key = "order-" + orderNumber.toUpperCase().replace(/^#/, "");
  const order = await store.get(key, { type: "json" });
  if (!order) {
    return { statusCode: 404, body: JSON.stringify({ error: "Order not found." }) };
  }

  if (status) order.status = status;
  if (typeof trackingCarrier === "string") order.trackingCarrier = trackingCarrier;
  if (typeof trackingNumber === "string") order.trackingNumber = trackingNumber;
  if (typeof trackingUrl === "string") order.trackingUrl = trackingUrl;

  await store.setJSON(key, order);

  return { statusCode: 200, body: JSON.stringify({ order: order }) };
};
