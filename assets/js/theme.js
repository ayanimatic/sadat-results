/**
 * theme.js
 * Automatically follows the device/browser color scheme (light/dark).
 * No manual toggle — updates live if the user changes their system theme.
 */
const Theme = (() => {
  function get() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
  }

  function init() {
    apply(get());
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => apply(e.matches ? "dark" : "light");
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else if (mql.addListener) mql.addListener(onChange); // older Safari
  }

  return { init, get };
})();

document.addEventListener("DOMContentLoaded", Theme.init);
