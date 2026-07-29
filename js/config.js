/*
  SITE CONFIG
  -----------
  STORE_DOMAIN: your Shopify store's default domain, e.g. "your-store.myshopify.com"
  (Admin -> Settings -> Domains, it's listed as the ".myshopify.com" address even if
  you also have a custom domain connected). Used so the "Checkout" button can hand
  customers off to your real, secure Shopify checkout (card + Revolut Pay) - see README.md.
*/
window.SITE_CONFIG = {
  STORE_DOMAIN: "your-store.myshopify.com",
  CURRENCY_SYMBOL: "€"
};
