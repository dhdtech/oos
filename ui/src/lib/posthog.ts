import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

/** Strip URL fragment (#key) from any string that looks like a URL. */
function stripFragment(value: unknown): unknown {
  if (typeof value === "string" && value.includes("#")) {
    return value.split("#")[0];
  }
  return value;
}

/** Properties that may contain the encryption key in the URL fragment. */
const URL_PROPS = [
  "$current_url",
  "$pathname",
  "$referrer",
  "$initial_current_url",
  "$initial_referrer",
  "$pageview_id",
];

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    sanitize_properties(properties, _event) {
      for (const key of URL_PROPS) {
        if (key in properties) {
          properties[key] = stripFragment(properties[key]);
        }
      }
      // Also strip from any property containing a URL with a fragment
      for (const [key, value] of Object.entries(properties)) {
        if (typeof value === "string" && value.includes("#") && value.includes("/s/")) {
          properties[key] = stripFragment(value);
        }
      }
      return properties;
    },
  });
}

export default posthog;
