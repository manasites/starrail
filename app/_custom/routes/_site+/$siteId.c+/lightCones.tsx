import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
// import { characters } from "./characters";
import { Search, SortDesc } from "lucide-react";

import { settings } from "mana-config";
import { Image } from "~/components";
import { List } from "~/routes/_site+/$siteId.c_+/src/components";
import { customListMeta } from "~/routes/_site+/$siteId.c_+/src/functions";
import { fetchWithCache } from "~/utils/cache.server";

export { customListMeta as meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderFunctionArgs) {
   const { data, errors } = await fetchWithCache(
      `https://${settings.siteId}-db.${settings.domain}/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: QUERY_LIGHTCONES,
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ lightCones: data.lightcones.docs });
}

export default function HomePage() {
   const { lightCones } = useLoaderData<typeof loader>();

   return <LightConeList chars={lightCones} />;
}

type FilterTypes = {
   id: string;
   name: string;
   field: string;
};

type FilterOptionType = {
   name: string;
   id: string;
   icon?: string;
};

const LightConeList = ({ chars }: any) => {
   const [filters, setFilters] = useState<FilterTypes[]>([]);
   const [sort, setSort] = useState("lightcone_id");
   const [search, setSearch] = useState("");
   const [showDesc, setShowDesc] = useState(false);

   const sortOptions = [
      { name: "ID", field: "lightcone_id" },
      { name: "Name", field: "name" },
   ];

   // All Filter Options listed individually atm to control order filter options appear in
   const rarities = [
      {
         id: "Rare",
         name: "3",
      },
      {
         id: "VeryRare",
         name: "4",
      },
      {
         id: "SuperRare",
         name: "5",
      },
   ] as FilterOptionType[];
   const paths = [
      {
         id: "Warlock",
         name: "Nihility",
         icon: chars.find((c: any) => c.path?.id == "Warlock")?.path.icon?.url,
      },
      {
         id: "Mage",
         name: "Erudition",
         icon: chars.find((c: any) => c.path?.id == "Mage")?.path.icon?.url,
      },
      {
         id: "Priest",
         name: "Abundance",
         icon: chars.find((c: any) => c.path?.id == "Priest")?.path.icon?.url,
      },
      {
         id: "Knight",
         name: "Preservation",
         icon: chars.find((c: any) => c.path?.id == "Knight")?.path.icon?.url,
      },
      {
         id: "Rogue",
         name: "Hunt",
         icon: chars.find((c: any) => c.path?.id == "Rogue")?.path.icon?.url,
      },
      {
         id: "Shaman",
         name: "Harmony",
         icon: chars.find((c: any) => c.path?.id == "Shaman")?.path.icon?.url,
      },
      {
         id: "Warrior",
         name: "Destruction",
         icon: chars.find((c: any) => c.path?.id == "Warrior")?.path.icon?.url,
      },
   ] as FilterOptionType[];

   // const camps = chars.map((c) => {
   //    return c?.camp;
   // }).filter((v,i,a) => a.indexOf(v) === i);

   // sort((a,b) => {
   // return campsort.findIndex((x) => x.id == a) - campsort.findIndex((x) => x.id == b)})

   const filterOptions = [
      {
         name: "Rarity",
         field: "rarity",
         options: rarities,
      },
      { name: "Path", field: "path", options: paths },
   ];

   // var pathlist = filterUnique(chars.map((c: any) => c.path));

   // Sort entries
   var csorted = [...chars];
   csorted.sort((a, b) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0));

   // Filter entries
   // Filter out by each active filter option selected, if matches filter then output 0; if sum of all filters is 0 then show entry.
   let cfiltered = csorted.filter((char) => {
      var showEntry = filters
         .map((filt) => {
            var matches = 0;
            if (char[filt.field]?.id) {
               matches = char[filt.field]?.id == filt.id ? 0 : 1;
            } else {
               matches = char[filt.field] == filt.id ? 0 : 1;
            }
            return matches;
         })
         .reduce((p, a) => p + a, 0);

      return showEntry == 0;
   });

   // Filter search by name
   cfiltered = cfiltered.filter((char) => {
      return char.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
   });

   return (
      <List>
         <div className="divide-color-sub bg-2-sub border-color-sub divide-y rounded-md border">
            {filterOptions.map((cat) => (
               <div
                  className="cursor-pointer items-center justify-between gap-3 p-3 laptop:flex"
                  key={cat.name}
               >
                  <div className="text-1 flex items-center gap-2.5 text-sm font-bold max-laptop:pb-3">
                     {cat.name}
                  </div>
                  <div className="items-center justify-between gap-3 max-laptop:grid max-laptop:grid-cols-4 laptop:flex">
                     {cat.options.map((opt) => (
                        <div
                           key={opt.id}
                           className={`bg-3 shadow-1 border-color rounded-lg border px-2.5 py-1 shadow-sm ${
                              filters.find((a) => a.id == opt.id)
                                 ? `bg-zinc-50 dark:bg-zinc-500/10`
                                 : ``
                           }`}
                           onClick={(event) => {
                              if (filters.find((a) => a.id == opt.id)) {
                                 setFilters(
                                    filters.filter((a) => a.id != opt.id),
                                 );
                              } else {
                                 setFilters([
                                    // Allows only one filter per category
                                    ...filters.filter(
                                       (a) => a.field != cat.field,
                                    ),
                                    { ...opt, field: cat.field },
                                 ]);
                              }
                           }}
                        >
                           {opt?.icon && (
                              <div className="mx-auto h-9 w-9 rounded-full bg-zinc-800 bg-opacity-50">
                                 <Image
                                    className="mx-auto"
                                    alt="Icon"
                                    options="height=60"
                                    url={opt.icon}
                                 />
                              </div>
                           )}
                           <div className="text-1 truncate pt-0.5 text-center text-xs">
                              {opt.name}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
         {/* Search Text Box */}
         <div
            className="border-color-sub bg-2-sub shadow-1 mb-2 mt-3 flex h-12 items-center
                     justify-between gap-3 rounded-lg border px-3 shadow-sm"
         >
            <Search className="text-zinc-500" size={20} />
            <input
               className="h-10 w-full flex-grow border-0 bg-transparent focus:outline-none"
               placeholder="Search..."
               value={search}
               onChange={(event) => {
                  setSearch(event.target.value);
               }}
            />
            <div className="text-1 flex items-center gap-1.5 pr-1 text-sm italic">
               <span>{cfiltered.length}</span> <span>entries</span>
            </div>
         </div>

         {/* Sort Options */}
         <div className="flex items-center justify-between py-3">
            <div className="text-1 flex items-center gap-2 text-sm font-bold">
               <SortDesc size={16} className="text-zinc-500" />
               Sort
            </div>
            <div className="flex items-center gap-2">
               {sortOptions.map((opt) => (
                  <div
                     key={opt.name}
                     className={`border-color text-1 shadow-1 relative cursor-pointer rounded-full 
                        border px-4 py-1 text-center text-sm font-bold shadow ${
                           sort == opt.field
                              ? `bg-zinc-50 dark:bg-zinc-500/10`
                              : ``
                        }`}
                     onClick={(event) => {
                        setSort(opt.field);
                     }}
                  >
                     {opt.name}
                  </div>
               ))}
            </div>
         </div>

         {/* Toggle Show Description */}
         <button
            type="button"
            className={`border-color-sub shadow-1 mb-3 block w-full rounded-full border-2 p-2.5 text-sm 
               font-bold underline decoration-zinc-500 underline-offset-2 shadow-sm ${
                  showDesc ? "bg-3-sub bg-zinc-50" : "bg-2-sub"
               }`}
            onClick={() => setShowDesc(!showDesc)}
         >
            Click to toggle full descriptions
         </button>

         {/* List with applied sorting */}
         <div
            className={` ${
               showDesc
                  ? ""
                  : "grid grid-cols-3 gap-2 text-center laptop:grid-cols-5"
            }`}
         >
            {cfiltered?.map((char) =>
               showDesc ? (
                  <EntryWithDescription char={char} key={char.id} />
               ) : (
                  <EntryIconOnly char={char} key={char.id} />
               ),
            )}
         </div>
      </List>
   );
};

// function filterUnique(input: any) {
//    var output: any = [];
//    for (var i = 0; i < input.length; i++) {
//       if (!output.find((a: any) => a.id == input[i].id)) {
//          output.push({
//             id: input[i].id,
//             name: input[i].name,
//             icon: input[i].icon?.url,
//          });
//       }
//    }

//    return output;
// }

const EntryWithDescription = ({ char }: any) => {
   const pathsmall = char?.path?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.display_number;
   const cid = char?.slug ?? char?.id;
   const skillinfo = char?.skill_data[char?.skill_data?.length - 1]?.desc;

   return (
      <>
         <Link
            className="bg-2-sub border-color-sub shadow-1 relative mb-2.5 flex rounded-lg border shadow-sm"
            prefetch="intent"
            to={`/starrail/c/characters/${cid}`}
         >
            <div className="relative rounded-md p-3">
               {/* Icon */}
               <div className="relative inline-block h-24 w-24">
                  {/* Path + Path Name ? */}
                  <div className="absolute -left-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                     <Image
                        alt="Icon"
                        className="relative inline-block object-contain"
                        url={pathsmall}
                     />
                  </div>

                  {/* Rarity */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
                     <Image
                        alt={raritynum}
                        className={`z-20 h-4 w-28 rounded-full object-contain color-rarity-${
                           raritynum ?? "1"
                        } bg-opacity-10`}
                        url={rarityurl}
                     />
                  </div>

                  <Image
                     className="object-contain"
                     url={char.icon?.url}
                     alt={char?.name}
                  />
               </div>
               {/* Name */}
               <div className="mt-3 text-center text-xs ">{char.name}</div>
            </div>
            <div
               className="relative p-3 align-middle text-sm"
               dangerouslySetInnerHTML={{ __html: skillinfo }}
            ></div>
         </Link>
      </>
   );
};

const EntryIconOnly = ({ char }: any) => {
   const pathsmall = char?.path?.icon?.url;
   const rarityurl = char?.rarity?.icon?.url;
   const raritynum = char?.rarity?.display_number;
   const cid = char?.id;

   return (
      <>
         <Link
            prefetch="intent"
            className="shadow-1 bg-2-sub border-color-sub rounded-lg border p-1 shadow-sm"
            to={`/starrail/c/lightCones/${cid}`}
         >
            {/* Icon */}
            <div className="relative inline-block h-28 w-28">
               {/* Path + Path Name ? */}
               <div className="absolute -right-1 top-0 z-20 h-7 w-7 rounded-full bg-gray-800 bg-opacity-50">
                  <Image
                     alt="Icon"
                     className="relative inline-block object-contain"
                     url={pathsmall}
                  />
               </div>

               {/* Rarity */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
                  <Image
                     options="fit=crop,height=20"
                     alt={raritynum}
                     className={`z-20 h-4 w-28 rounded-full object-contain color-rarity-${
                        raritynum ?? "1"
                     } bg-opacity-10`}
                     url={rarityurl}
                  />
               </div>

               <Image
                  options="height=150"
                  className="object-contain"
                  url={char.icon?.url}
                  alt={char?.name}
               />
            </div>
            {/* Name */}
            <div className="pt-1 text-center text-xs font-bold ">
               {char.name}
            </div>
         </Link>
      </>
   );
};

const QUERY_LIGHTCONES = `
query {
   lightcones: LightCones(limit: 100) {
     docs {
       lightcone_id
       name
       rarity {
         id
         icon {
           url
         }
         display_number
       }
       path {
         id
       }
       id
       path {
         icon {
           url
         }
       }
       skill_data {
         desc
       }
       icon {
         url
       }
     }
   }
 }
`;
