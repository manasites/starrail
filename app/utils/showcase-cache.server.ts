import { LRUCache } from "lru-cache";
import { remember } from "./remember.server";
import {
   cachified,
   type CacheEntry,
   lruCacheAdapter,
   verboseReporter,
} from "cachified";

// Setup an in memory lru-cache for api calls, this will be cleared on server restart.
export const lruCache = remember(
   "lruCache",
   new LRUCache<string, CacheEntry>({
      max: 100, // maximum number of items to store in the cache
      // ttl: 10 * 60 * 1000, // how long to live in ms
      // allowStale: true, // allow stale items to be returned until they are removed
   })
);

export const cache = lruCacheAdapter(lruCache);

/**
 * Setup a lru-cache for layout data, so we don't have to fetch it every time. Params are based on browser fetch api.
 * @param url - rest api endpoint `https://${settings.siteId}-db.${settings.domain}/api/${collectionId}/${entryId}?depth=1`
 * @param init - browser fetch api init object for headers, body, etc
 * @returns  the result of the fetch or its cached value
 */
export async function fetchShowcase(url: string, init?: RequestInit) {
   //The key could be graphql, in that case we'll use init.body instead. We should also delete any spacing characters
   const key = url.split("/").pop() ?? url;

   return await cachified({
      cache,
      key,
      async getFreshValue() {
         const response = await fetch(url, init);

         return response.json();
      },
      ttl: 60_000, // how long to live in ms
      swr: 365 * 24 * 60 * 60 * 1000, // allow stale items to be returned until they are removed
      //checkValue  // implement a type check
      // fallbackToCache: true,
      // staleRefreshTimeout
      reporter: verboseReporter(),
   });
}

// //clear cache and refetch data
// export async function refetchShowcase(url: string, init?: RequestInit) {
//    //The key could be graphql, in that case we'll use init.body instead. We should also delete any spacing characters
//    const key = url.split("/").pop();

//    // fetch, update cache if return, if error, return the error
//    return fetch(url, init)
//       .then((res) => {
//          const response = res.json();

//          // update or set cache
//          if (lruCache.get(key)) {
//             console.log(`Showcase uid ${key} updated.`);
//             lruCache.set(key, response);
//          } else {
//             //log cache size, trim length to terminal width
//             console.log(`Showcase uid ${key} cached`);
//             lruCache.set(key, response);
//          }

//          return response;
//       })
//       .catch((err) => {
//          console.log(`Showcase uid ${key} failed to update.`);
//          return err;
//       });
// }
