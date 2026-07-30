/*
  PRODUCT CATALOG
  ---------------
  This is the only file you need to edit to add/change products.

  This file is used by BOTH the website pages and the checkout backend (it works
  in the browser and in Netlify Functions), so the price a customer is charged
  always matches what's shown here - editing a price here changes it everywhere.

  For each product:
  - "image" / "images" point to a photo in the /images/women or /images/men folder.
    Placeholders are named 1.svg, 2.svg... Add your own photo (e.g. 1.jpg) into the
    same folder, then change the path below from "1.svg" to "1.jpg".
  - "price" is in EUR, numbers only (no symbol).
*/

var PRODUCTS = [
  {
    id: "women-1",
    title: "Tailored Wool Coat",
    category: "women",
    price: 295,
    sizes: ["XS", "S", "M", "L"],
    image: "images/women/1.svg",
    images: ["images/women/1.svg"],
    description: "A considered silhouette cut from fine Italian wool, finished with horn buttons and a hand-stitched hem."
  },
  {
    id: "women-2",
    title: "Silk Slip Dress",
    category: "women",
    price: 185,
    sizes: ["XS", "S", "M", "L"],
    image: "images/women/2.svg",
    images: ["images/women/2.svg"],
    description: "Cut on the bias from mulberry silk for a fluid, weightless drape."
  },
  {
    id: "women-3",
    title: "Cashmere Roll Neck",
    category: "women",
    price: 220,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "images/women/3.svg",
    images: ["images/women/3.svg"],
    description: "Pure cashmere knitwear designed to soften and improve with every wear."
  },
  {
    id: "women-4",
    title: "Wide Leg Trousers",
    category: "women",
    price: 165,
    sizes: ["XS", "S", "M", "L"],
    image: "images/women/4.svg",
    images: ["images/women/4.svg"],
    description: "High-waisted tailoring in a fluid drape fabric, finished with a clean, sharp crease."
  },
  {
    id: "women-5",
    title: "Leather Ankle Boot",
    category: "women",
    price: 245,
    sizes: ["37", "38", "39", "40"],
    image: "images/women/5.svg",
    images: ["images/women/5.svg"],
    description: "Full-grain leather boots, built on a hand-finished last for lasting comfort."
  },
  {
    id: "women-6",
    title: "Structured Tote",
    category: "women",
    price: 310,
    sizes: ["One Size"],
    image: "images/women/6.svg",
    images: ["images/women/6.svg"],
    description: "A quietly structured tote in vegetable-tanned leather, made to age beautifully."
  },
  {
    id: "men-1",
    title: "Merino Crew Jumper",
    category: "men",
    price: 175,
    sizes: ["S", "M", "L", "XL"],
    image: "images/men/1.svg",
    images: ["images/men/1.svg"],
    description: "Fine-gauge merino wool, knitted for warmth without bulk."
  },
  {
    id: "men-2",
    title: "Tailored Blazer",
    category: "men",
    price: 385,
    sizes: ["S", "M", "L", "XL"],
    image: "images/men/2.svg",
    images: ["images/men/2.svg"],
    description: "A soft-shoulder blazer built on a half-canvas construction for a lasting shape."
  },
  {
    id: "men-3",
    title: "Oxford Cotton Shirt",
    category: "men",
    price: 125,
    sizes: ["S", "M", "L", "XL"],
    image: "images/men/3.svg",
    images: ["images/men/3.svg"],
    description: "Long-staple cotton, cut for a clean, considered fit."
  },
  {
    id: "men-4",
    title: "Straight Fit Trouser",
    category: "men",
    price: 155,
    sizes: ["30", "32", "34", "36"],
    image: "images/men/4.svg",
    images: ["images/men/4.svg"],
    description: "A precise, straight-leg tailored trouser in a fine Italian wool blend."
  },
  {
    id: "men-5",
    title: "Leather Derby Shoe",
    category: "men",
    price: 265,
    sizes: ["41", "42", "43", "44", "45"],
    image: "images/men/5.svg",
    images: ["images/men/5.svg"],
    description: "Goodyear-welted leather shoes, resoleable and built to last a lifetime."
  },
  {
    id: "men-6",
    title: "Full-Grain Belt",
    category: "men",
    price: 95,
    sizes: ["S", "M", "L"],
    image: "images/men/6.svg",
    images: ["images/men/6.svg"],
    description: "A single-strap belt in vegetable-tanned leather with a solid brass buckle."
  }
];

if (typeof window !== "undefined") { window.PRODUCTS = PRODUCTS; }
if (typeof module !== "undefined" && module.exports) { module.exports = PRODUCTS; }
