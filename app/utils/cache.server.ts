import { cachified, lruCacheAdapter } from "cachified";
import type { CreateReporter, CacheMetadata, CacheEntry } from "cachified";
import { LRUCache } from "lru-cache";

import { remember } from "./remember.server";

// Setup an in memory lru-cache for api calls, this will be cleared on server restart.
export const lruCache = remember(
   "lruCache",
   new LRUCache<string, CacheEntry>({
      // max: 250, // maximum number of items to store in the cache
      sizeCalculation: (value) => JSON.stringify(value).length,
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 5 * 60 * 1000, // how long to live in ms
   }),
);

export const cache = lruCacheAdapter(lruCache);

/**
 * Setup a lru-cache for layout data, so we don't have to fetch it every time. Params are based on browser fetch api.
 * @param url - rest api endpoint `https://${siteId}-db.${settings.domain}/api/${collectionId}/${entryId}?depth=1`
 * @param init - browser fetch api init object for headers, body, etc
 * @param ttl - time to live in ms
 * @returns  the result of the fetch or its cached value
 */
export async function fetchWithCache(
   url: string,
   init?: RequestInit,
   ttl?: number,
) {
   //The key could be graphql, in that case we'll use init.body instead. We should also delete any spacing characters
   const key = init?.body
      ? (init.body as string).replace(/\s/g, "").replace(/\n/g, " ")
      : url;

   return await cachified({
      cache,
      key,
      async getFreshValue() {
         const response = await fetch(url, init);
         return response.json();
      },
      ttl: ttl ?? 300_000, // how long to live in ms
      swr: 365 * 24 * 60 * 60 * 1000, // allow stale items to be returned until they are removed
      //checkValue  // implement a type check
      // fallbackToCache: true,
      // staleRefreshTimeout
      reporter: verboseReporter(),
   });
}

/**
 * Use this to cache a function return. Use this only for public api calls, not for private api calls.
 * @param func  await cacheThis(func () => payload.find({...}));
 * @param ttl - time to live in ms
 * @returns  the result of the function or its cached value
 */
export async function cacheThis<T>(func: () => Promise<T>, ttl?: number) {
   //the key is the function stringified
   let key = func.toString().replace(/\s/g, "").replace(/\n/g, " ");

   // if the function is payload api, we'll use the body instead
   key = key.split("(")?.slice(2)?.join("(") ?? key;

   return await cachified({
      cache,
      key,
      async getFreshValue() {
         return await func();
      },
      ttl: ttl ?? 300_000, // how long to live in ms
      swr: 365 * 24 * 60 * 60 * 1000, // allow stale items to be returned until they are removed
      //checkValue  // implement a type check
      // fallbackToCache: true,
      // staleRefreshTimeout
      reporter: verboseReporter(),
   });
}

/**
 * Use this to cache a function return. Use this only for public api calls, not for private api calls.
 * @param func  await cacheThis(func () => payload.find({...}));
 * @param selectFunction - a function that selects the data you want to cache
 * @param selectOptions - options for the select function
 * @param ttl - time to live in ms
 * @returns  the result of the function or its cached value
 */
export async function cacheWithSelect<T>(
   func: () => Promise<T>,
   selectFunction: Function,
   selectOptions: Partial<Record<keyof any, boolean>>,
   ttl?: number,
) {
   //the key is the function stringified
   let key = func.toString().replace(/\s/g, "").replace(/\n/g, " ");

   // if the function is payload api, we'll use the body instead
   key = key.split("(")?.slice(2)?.join("(") ?? key;

   // if selectOptions is passed, we'll add it to the key
   if (selectOptions) {
      key += JSON.stringify(selectOptions);
   }

   return await cachified({
      cache,
      key,
      async getFreshValue() {
         const result = await func();
         return selectFunction(result, selectOptions);
      },
      ttl: ttl ?? 300_000, // how long to live in ms
      swr: 365 * 24 * 60 * 60 * 1000, // allow stale items to be returned until they are removed
      //checkValue  // implement a type check
      // fallbackToCache: true,
      // staleRefreshTimeout
      reporter: verboseReporter(),
   });
}

export function verboseReporter<T>(): CreateReporter<T> {
   return ({ key, fallbackToCache, forceFresh, metadata, cache }) => {
      const cacheName =
         cache.name ||
         cache
            .toString()
            .toString()
            .replace(/^\[object (.*?)]$/, "$1");
      let cached: unknown;
      let freshValue: unknown;
      let getFreshValueStartTs: number;
      let refreshValueStartTS: number;

      return (event) => {
         switch (event.name) {
            case "getCachedValueRead":
               cached = event.entry;
               break;
            case "checkCachedValueError":
               console.warn(
                  `check failed for cached value of ${key}\nReason: ${event.reason}.\nDeleting the cache key and trying to get a fresh value.`,
                  cached,
               );
               break;
            case "getCachedValueError":
               console.error(
                  `error with cache at ${key}. Deleting the cache key and trying to get a fresh value.`,
                  event.error,
               );
               break;
            case "getFreshValueError":
               console.error(
                  `getting a fresh value for ${key} failed`,
                  { fallbackToCache, forceFresh },
                  event.error,
               );
               break;
            case "getFreshValueStart":
               getFreshValueStartTs = performance.now();
               break;
            case "writeFreshValueSuccess": {
               const totalTime = performance.now() - getFreshValueStartTs;
               if (event.written) {
                  console.log(
                     `Fresh cache took ${formatDuration(totalTime)}, `,
                     ` Cache ${Math.ceil(
                        lruCache.calculatedSize / 1024 / 1024,
                     )}MB.`,
                  );
               } else {
                  console.log(
                     `Not updating the cache value for ${key}.`,
                     `Getting a fresh value for this took ${formatDuration(
                        totalTime,
                     )}.`,
                     `Thereby exceeding caching time of ${formatCacheTime(
                        metadata,
                        formatDuration,
                     )}`,
                  );
               }
               break;
            }
            case "writeFreshValueError":
               console.error(`error setting cache: ${key}`, event.error);
               break;
            case "getFreshValueSuccess":
               freshValue = event.value;
               break;
            case "checkFreshValueError":
               console.error(
                  `check failed for fresh value of ${key}\nReason: ${event.reason}.`,
                  freshValue,
               );
               break;
            case "refreshValueStart":
               refreshValueStartTS = performance.now();
               break;
            case "refreshValueSuccess":
               console.log(
                  `Stale cache took ${formatDuration(
                     performance.now() - refreshValueStartTS,
                  )}.`,
                  ` Cache ${Math.ceil(
                     lruCache.calculatedSize / 1024 / 1024,
                  )}MB.`,
               );
               break;
            case "refreshValueError":
               console.log(
                  `Background refresh for ${key} failed.`,
                  event.error,
               );
               break;
         }
      };
   };
}
const formatDuration = (ms: number) => `${Math.round(ms)}ms`;

function formatCacheTime(
   metadata: CacheMetadata,
   formatDuration: (duration: number) => string,
) {
   const swr = staleWhileRevalidate(metadata);
   if (metadata.ttl == null || swr == null) {
      return `forever${
         metadata.ttl != null
            ? ` (revalidation after ${formatDuration(metadata.ttl)})`
            : ""
      }`;
   }

   return `${formatDuration(metadata.ttl)} + ${formatDuration(swr)} stale`;
}

export function staleWhileRevalidate(metadata: CacheMetadata): number | null {
   return (
      (typeof metadata.swr === "undefined" ? metadata.swv : metadata.swr) ||
      null
   );
}
