# WearBears — Luxury Clothing Website

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

## 3. Making checkout, orders, and tracking actually work (Stripe + your own backend)

This site no longer depends on Shopify or any other e-commerce platform. Checkout,
order storage, and order tracking are all custom-built, running on **Netlify
Functions** (serverless code, included free with your Netlify hosting) plus
**Stripe** for actually processing card payments. Nothing here charges real money
until you complete the one-time setup below.

**Important honesty note:** Stripe does not support "Revolut Pay" as a payment
method — it's a competing wallet, not something Stripe offers. This setup gives
you real Visa/Mastercard/Amex card payments plus Apple Pay/Google Pay
automatically. If you want actual Revolut Pay later, that's a separate, additional
integration on top of this.

### One-time setup (you need to do this yourself — I can't create accounts or handle secret keys for you)

**A. Create a Stripe account**
1. Go to stripe.com → sign up (free, no monthly cost — Stripe takes a small % + fee per transaction, same as any card processor).
2. Once in, make sure you're in **Test mode** first (toggle top-right) to try everything safely before going live.

**B. Get your Stripe secret key into Netlify**
1. Stripe Dashboard → **Developers → API keys** → copy the **Secret key** (starts `sk_test_...` in test mode).
2. Netlify → your site → **Project configuration → Environment variables** → **Add a variable**:
   - Key: `STRIPE_SECRET_KEY`
   - Value: paste the secret key
3. Save.

**C. Set up the Stripe webhook (this is what actually records orders)**
1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://wearbears.com/.netlify/functions/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Save, then click into the new endpoint and copy the **Signing secret** (starts `whsec_...`).
5. Back in Netlify → Environment variables → add another:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: paste the signing secret

**D. Redeploy** so the new environment variables take effect: Netlify → Deploys → Trigger deploy → Deploy site.

**E. Test it**
1. Add something to your bag on the live site and check out.
2. Use Stripe's test card: `4242 4242 4242 4242`, any future expiry date, any CVC, any postcode.
3. You should land on the Order Confirmed page with a real order number, and see the order appear in your Admin panel (see section 5) within a few seconds.

**F. Go live**
1. Flip Stripe out of Test mode (top-right toggle) — this requires completing Stripe's business verification (bank details, business info).
2. Repeat steps B and C using your **live** keys (they start `sk_live_...` / the live webhook's `whsec_...`), replacing the test values in Netlify's environment variables.
3. Redeploy again.

## 4. Order tracking

Customers track orders themselves at `track-order.html` — they enter their order
number (shown on the confirmation page and emailed via Stripe's receipt) and the
email they checked out with, and it looks up live status/tracking directly from
your order database. No account or third-party sign-in needed.

## 5. Admin panel — viewing orders and messages yourself

**Orders:** go to `wearbears.com/admin.html`. The first time, you need to enable
and invite yourself:
1. Netlify → your site → **Project configuration → Identity** → **Enable Identity**.
2. Under **Registration**, set it to **Invite only** (important — otherwise
   strangers could sign themselves up to your admin panel).
3. Click **Invite users** → enter your own email → send. You'll get an email to
   set a password.
4. Now go to `wearbears.com/admin.html`, click **Sign In**, and log in with that
   email/password. You'll see every order, its status, and can add tracking
   details (carrier, tracking number, link) — customers see this instantly on
   the Track Order page.

**Messages:** Netlify → your site → **Forms** → **contact**. Every Contact page
submission appears there (see previous section for email notifications).

**To get an email the moment someone submits a message:** Netlify → Forms →
**Settings and usage** → **Add notification** → **Email notification** → enter
your email address. No code needed — this is a one-time click.

## 6. Viewing the site

Just open `index.html` in a browser to preview the design (the bag/checkout/
tracking backend only works once deployed on Netlify with Stripe configured,
since it needs the live serverless functions). To publish changes, push to the
connected GitHub repo and Netlify redeploys automatically.

## Structure
```
index.html                  Homepage
shop.html                   Full catalog with Men/Women/All filter
product.html                Single product detail (?id=... from products.js)
bag.html                    Shopping bag (saved in the browser) + checkout
success.html                Post-payment order confirmation
track-order.html            Customer order tracking (order number + email)
contact.html                Contact form (submits to Netlify Forms)
about.html                  Brand story
admin.html                  Password-protected order/admin panel (Netlify Identity)
css/style.css               All styling
js/products.js              ← Edit this for products/photos/prices (also read by the backend)
js/config.js                Site-wide constants (currency symbol)
js/cart.js                  Bag logic + checkout trigger
js/shop.js                  Product grid/filter logic
js/product-detail.js        Product page logic + Buy Now
js/admin.js                 Admin panel login + orders table
js/main.js                  Menu/navigation logic
netlify/functions/
  create-checkout-session.js  Starts a Stripe Checkout session (validates prices server-side)
  stripe-webhook.js           Records paid orders (triggered by Stripe)
  get-order.js                Customer order lookup (order number + email)
  get-order-by-session.js     Powers the success page's order number display
  list-orders.js              Admin: list all orders (requires login)
  update-order.js             Admin: update status/tracking (requires login)
package.json                 Lists backend dependencies (stripe, @netlify/blobs)
netlify.toml                 Tells Netlify where the functions live
```
