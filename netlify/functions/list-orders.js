const { getStore } = require("@netlify/blobs");

exports.handler = async function (event, context) {
  if (!context.clientContext || !context.clientContext.user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Sign in required." }) };
  }

  const store = getStore("orders");
  const { blobs } = await store.list({ prefix: "order-" });

  const orders = await Promise.all(
    blobs.map(function (b) { return store.get(b.key, { type: "json" }); })
  );

  orders.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return { statusCode: 200, body: JSON.stringify({ orders: orders }) };
};
