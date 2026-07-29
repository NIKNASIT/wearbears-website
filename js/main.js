document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const navClose = document.querySelector("[data-nav-close]");
  const overlay = document.querySelector("[data-overlay]");

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    if (overlay) overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }
  if (navToggle) navToggle.addEventListener("click", openNav);
  if (navClose) navClose.addEventListener("click", closeNav);
  if (overlay) overlay.addEventListener("click", closeNav);

  // highlight active nav link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a, .mobile-nav a").forEach(function (a) {
    if (a.getAttribute("href") === path) a.classList.add("is-active");
  });
});
