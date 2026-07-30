const { getStore } = require("@netlify/blobs");

// Looks up an order using the Stripe Checkout session ID from the success page
// URL - safe because that ID is only known to the customer who just paid (it's
// long, random, and Stripe treats it the same way for their own success pages).
exports.handler = async function (event) {
  const sessionId = event.queryStringParameters && event.queryStringParameters.session_id;
  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing session_id." }) };
  }

  const store = getStore("orders");
  const orderNumber = await store.get("session-" + sessionId);

  if (!orderNumber) {
    return { statusCode: 202, body: JSON.stringify({ pending: true }) };
  }

  const order = await store.get("order-" + orderNumber, { type: "json" });
  if (!order) {
    return { statusCode: 404, body: JSON.stringify({ error: "Order not found." }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      orderNumber: order.orderNumber,
      email: order.email,
      items: order.items,
      amountTotal: order.amountTotal,
      currency: order.currency
    })
  };
};
