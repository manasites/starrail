import { settings } from "mana-config";
import type { Site } from "~/db/payload-types";

export function gqlEndpoint({
   siteSlug,
   domain,
}: {
   siteSlug: Site["slug"];
   domain?: string;
}) {
   return `https://${siteSlug}-db.${domain ?? settings?.domain}/api/graphql`;
}
export function swrRestFetcher(...args: any) {
   return fetch(args).then((res) => res.json());
}