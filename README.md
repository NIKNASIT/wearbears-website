# Maison — Luxury Clothing Website

A standalone HTML/CSS/JS website (no build tools, no framework — open the files
directly or upload as-is to any web host). Below is exactly what to edit.

## 1. Add your clothing photos (the only "must do")

Photos live in the `images` folder:
- `images/women/1.svg` ... `6.svg` — replace with your own photos (e.g. `1.jpg`)
- `images/men/1.svg` ... `6.svg` — same idea
- `images/hero/home.svg` — homepage banner image
- `images/hero/women-cat.svg`, `images/hero/men-cat.svg` — the two homepage category tiles
- `images/brand/story.svg` — "Our Story" section/page image

**Important:** after adding a photo, open `js/products.js` and update that product's
`image` (and `images`) path to match your new filename. Example — if you add
`images/women/1.jpg`, change:
```js
image: "images/women/1.svg",
images: ["images/women/1.svg"],
```
to:
```js
image: "images/women/1.jpg",
images: ["images/women/1.jpg"],
```
Do this for every product. You can also add more products by copying one of the
existing entries in `products.js` and giving it a unique `id`.

## 2. Edit product names, prices, descriptions, sizes

All in `js/products.js` — one plain-English array, no coding knowledge needed
beyond editing text between quotes.

## 3. Making the "Checkout" and payment buttons actually work

This site is a real, custom-designed storefront for browsing — but taking real
money securely (card + Revolut) requires a payment backend, which a plain static
site cannot safely do on its own. Since you already have Shopify, this site is
wired to hand off to your **real Shopify checkout** for the actual payment step:

1. In `js/config.js`, set `STORE_DOMAIN` to your Shopify store's `.myshopify.com`
   address (Admin → Settings → Domains).
2. For each product, once it also exists in your Shopify store, open it in Shopify
   admin, click **View**, and paste that URL into the product's `shopifyUrl` field
   in `products.js`. Now that product's "Buy Now" button takes the customer to the
   real, secure Shopify checkout page for that item.
3. Set up card payments (Shopify Payments) and Revolut Pay in your Shopify store
   exactly as described in the `SETUP_GUIDE.md` from the Shopify theme package I
   sent earlier — that part doesn't change.

Until you fill in `shopifyUrl` / `STORE_DOMAIN`, the Checkout button will show a
reminder message instead of charging anyone — this is intentional, so nothing
looks "live" before it actually is.

## 4. Order tracking

Real tracking happens through Shopify (order confirmation emails with tracking
links, and account order history), since that's where the real order and payment
exist. The `track-order.html` page explains this to customers and links to
Shopify's account sign-in once `STORE_DOMAIN` is set.

## 5. Viewing the site

Just open `index.html` in a browser to preview. To publish it, upload the whole
folder to any static web host (or your domain's file hosting) exactly as-is.

## Structure
```
index.html          Homepage
shop.html            Full catalog with Men/Women/All filter
product.html         Single product detail (?id=... from products.js)
bag.html             Shopping bag (saved in the browser)
track-order.html     Order tracking info
contact.html         Contact form (opens the customer's email app)
about.html           Brand story
css/style.css        All styling
js/products.js       ← Edit this for products/photos/prices
js/config.js         ← Edit this to connect real Shopify checkout
js/cart.js           Bag logic (don't need to touch)
js/shop.js           Product grid/filter logic (don't need to touch)
js/product-detail.js Product page logic (don't need to touch)
js/main.js           Menu/navigation logic (don't need to touch)
```
