// This public site token only accepts analytics; it grants no dashboard access.
export function initWebAnalytics() {
  if (
    !import.meta.env.PROD ||
    !["unhaine.com", "www.unhaine.com"].includes(window.location.hostname)
  ) return;

  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.dataset.cfBeacon = JSON.stringify({
    token: "e5b017e65d1f4b278f2f03e706b33a18",
  });
  document.body.appendChild(script);
}
