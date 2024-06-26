import { useState } from "react";

import type { RelicSet, Relic } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
import { Icon } from "~/components/Icon";

export const RelicsInSet = ({
   pageData,
   relicData,
}: {
   pageData: RelicSet;
   relicData: Relic[];
}) => {
   // Artifact Ordering
   const art_order = ["HEAD", "HAND", "BODY", "FOOT", "NECK", "OBJECT"];

   // Get a unique list of each type of relic, in the order of the artifact ordering, since relics have one entry per rarity
   const urelics = art_order
      .map((type) => relicData?.find((r) => r.relic_type == type)?.name)
      .filter((n) => n);

   //    const urelics = relicData
   //       ?.map((r: any) => r.name)
   //       .filter((v: any, i: any, a: any) => a.indexOf(v) == i);

   // Get max rarity for relic set
   const rarities = relicData
      .map((r) => parseInt(r.rarity?.display_number ?? ""))
      .filter((v, i, a) => a.indexOf(v) == i)
      .sort((a, b) => a - b);
   const maxrarity = Math.max(...rarities);

   // Define max level per rarity, gonna do manually for now.
   const maxlevels = [
      { rarity: 2, maxlv: 6 },
      { rarity: 3, maxlv: 9 },
      { rarity: 4, maxlv: 12 },
      { rarity: 5, maxlv: 15 },
   ];

   // Set relic with actively shown data
   const [activeRelic, setActiveRelic] = useState(urelics[0]);
   const [activeRarity, setActiveRarity] = useState(maxrarity);
   const [mainLevel, setMainLevel] = useState(0);
   // const [subLevel, setSubLevel] = useState(1);

   // Get the list of relic data for the actively selected relics of selected rarity
   const activeData = relicData.find(
      (r) =>
         r.name == activeRelic &&
         r.rarity?.display_number == activeRarity.toString(),
   );

   // Sort mainstats
   const mainStatData = activeData?.mainstat_group?.sort((a, b) =>
      a.stattype?.stat_id &&
      b.stattype?.stat_id &&
      a.stattype?.stat_id > b.stattype?.stat_id
         ? 1
         : a.stattype?.stat_id &&
             b.stattype?.stat_id &&
             b.stattype?.stat_id > a.stattype?.stat_id
           ? -1
           : 0,
   );

   // Sort substats
   const subStatData = activeData?.substat_group?.sort((a, b) =>
      a.stattype?.stat_id &&
      b.stattype?.stat_id &&
      a.stattype?.stat_id > b.stattype?.stat_id
         ? 1
         : a.stattype?.stat_id &&
             b.stattype?.stat_id &&
             b.stattype?.stat_id > a.stattype?.stat_id
           ? -1
           : 0,
   );

   // Get currently selected rarity's maxlv
   const maxlv = maxlevels.find((rar) => rar.rarity == activeRarity)?.maxlv;

   return (
      <>
         <H2 text="Relics in Set" />
         <div className="grid grid-cols-2 gap-3 pb-4 laptop:grid-cols-4">
            {urelics?.map((rname) => {
               // Find the relic's entries in the relicData array
               const curr = relicData.filter((r) => r.name == rname);
               const rimg = curr?.[0]?.icon?.url;

               return (
                  <button
                     key={rname}
                     onClick={(e) => {
                        setActiveRelic(rname);
                     }}
                     className={`shadow-1 rounded-xl border p-3 shadow ${
                        activeRelic == rname
                           ? "border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700"
                           : "bg-2-sub border-color"
                     }`}
                  >
                     <Image
                        options="aspect_ratio=1:1&height=120"
                        alt="Active Relic"
                        className="mx-auto h-16 object-contain"
                        url={rimg}
                     />
                     <div
                        className={`pt-1 text-center text-xs ${
                           activeRelic == rname ? "" : "text-1"
                        }`}
                     >
                        {rname}
                     </div>
                  </button>
               );
            })}
         </div>

         {/* Show information for selected Relic */}
         <div className="shadow-1 bg-2-sub border-color-sub mb-3 flex w-full justify-between gap-2 rounded-xl border p-2.5 shadow-sm">
            {rarities.map((r) => (
               <button
                  key={r}
                  className={`flex w-full items-center justify-center gap-1 rounded-lg border border-transparent p-1 font-bold ${
                     activeRarity == r
                        ? "shadow-1 border-zinc-100 bg-white shadow-sm dark:border-zinc-600 dark:bg-zinc-700"
                        : ""
                  }`}
                  onClick={(e) => {
                     setActiveRarity(r);
                     //    If the slider is at a value higher than is possible for the newly selected rarity, bring the slider down to the maximum for that new rarity.
                     if (
                        mainLevel >
                        (maxlevels.find((rar) => rar.rarity == r)?.maxlv ?? 0)
                     ) {
                        setMainLevel(
                           maxlevels.find((rar) => rar.rarity == r)?.maxlv ?? 0,
                        );
                     }
                  }}
               >
                  {r}
                  <Icon name="star" className="text-zinc-500" size={16} />
               </button>
            ))}
         </div>

         <div className="border-color-sub bg-2-sub shadow-1 mb-3 overflow-hidden rounded-lg border shadow-sm">
            <div className="border-color-sub border-b p-3 font-bold">
               Main Stats
            </div>
            {/* Level Slider Section */}
            <div className="flex items-center justify-center gap-2 bg-2-sub px-3 py-2">
               <div className="inline-flex justify-between pr-0.5 align-middle">
                  Lv + {mainLevel}
               </div>
               {/* Level Input Box */}
               <input
                  aria-label="Level Slider"
                  className="h-1 flex-grow appearance-none justify-end
                  rounded bg-zinc-200 align-middle accent-zinc-500 outline-none dark:bg-zinc-700"
                  type="range"
                  min="0"
                  max={maxlv ?? 15}
                  value={mainLevel}
                  onChange={(event) =>
                     setMainLevel(parseInt(event.target.value))
                  }
               ></input>
            </div>

            {/* All tiled possible Main Stats with symbol if available */}
            <div className="divide-color-sub border-color-sub divide-y border-t bg-3-sub">
               {mainStatData?.map((stat) => (
                  <div
                     key={stat.stattype?.name}
                     className="flex justify-between p-3"
                  >
                     <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-500 ">
                           <Image
                              options="aspect_ratio=1:1&height=40&width=40"
                              alt="Stat"
                              url={stat.stattype?.icon?.url}
                           />
                        </div>
                        <div className="text-1 text-sm font-bold">
                           {stat.stattype?.name}
                        </div>
                     </div>
                     <div>
                        {formatStat(
                           (stat?.stats as number[])[mainLevel],
                           stat.stattype,
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Substat Data */}
         <div className="border-color-sub bg-2-sub shadow-1 mb-3 overflow-hidden rounded-lg border shadow-sm">
            <div className="border-color-sub border-b p-3 font-bold">
               Sub Stats
            </div>
            {/* All tiled possible Substats, and their three possible rolls */}
            <div className="divide-color-sub border-color-sub divide-y bg-3-sub">
               {subStatData?.map((stat) => (
                  <div
                     key={stat.stattype?.name}
                     className="flex justify-between p-3 pr-5"
                  >
                     <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-500 align-middle">
                           <Image
                              options="aspect_ratio=1:1&height=40&width=40"
                              alt="Stat"
                              url={stat.stattype?.icon?.url}
                           />
                        </div>
                        <div className="text-1 text-sm font-bold">
                           {stat.stattype?.name}
                        </div>
                     </div>
                     <div className="grid w-44 grid-cols-3 items-center gap-8">
                        {(stat?.stats as number[]).map((val: number) => {
                           return (
                              <span key={val}>
                                 {formatStat(val, stat?.stattype)}
                              </span>
                           );
                        })}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

function formatStat(
   stat: number,
   stattype?: { name?: string; property_classify?: number },
) {
   const classify = stattype?.property_classify;

   if (classify || (stattype?.name && stattype?.name?.indexOf("%") >= 0)) {
      return Math.floor(Math.round(stat * 10000) / 10) / 10 + "%";
   } else {
      return (Math.floor(Math.round(stat * 10000) / 1000) / 10).toString();
   }
}
