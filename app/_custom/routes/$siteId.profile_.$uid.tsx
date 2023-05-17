import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Image } from "~/components";
// import html2canvas from "html2canvas";
import { zx } from "zodix";
import { z } from "zod";

// Sample data, will import via API for real case
// import { showcaseSample } from "./showcaseSample";

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const { uid } = zx.parseParams(params, {
      uid: z.string(),
   });

   var url = `https://starrail-profiles-prod-fwq2wjp57a-uc.a.run.app/profile/${uid}`;
   const showcaseData = await (await fetch(url)).json();

   var relics = null;
   var characters = null;
   var lightCones = null;
   var skillTrees = null;
   var statTypes = null;
   var playerIcon = null;
   var result = null;

   if (!uid) {
   } else if (
      showcaseData?.detail_info?.detail == "Improperly formatted uid." ||
      !showcaseData?.detail_info?.assist_avatar
   ) {
      result = "bad_uid";
   } else {
      result = "success";
      var showcaseSample = showcaseData;

      var charids = [
         showcaseSample?.detail_info?.assist_avatar?.avatar_id,
         ...showcaseSample?.detail_info?.avatar_detail_list?.map(
            (a: any) => a.avatar_id
         ),
      ];
      var lcids = [
         showcaseSample?.detail_info?.assist_avatar?.equipment?.tid,
         ...showcaseSample?.detail_info?.avatar_detail_list?.map(
            (a: any) => a.equipment?.tid
         ),
      ];
      var rids = [
         ...showcaseSample?.detail_info?.assist_avatar?.relic_list?.map(
            (a: any) => a.tid
         ),
      ];
      var piid = showcaseSample?.detail_info?.head_icon;

      showcaseSample?.detail_info?.avatar_detail_list?.map((a: any) => {
         a.relic_list?.map((b: any) => {
            rids.push(b.tid);
         });
      });

      var url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/relics?depth=3&limit=502&where[id][in]=${rids.toString()}`;
      const relicRaw = await (await fetch(url)).json();
      var relics = relicRaw.docs;

      url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/characters?limit=100&where[id][in]=${charids.toString()}`;
      const characterRaw = await (await fetch(url)).json();
      var characters = characterRaw.docs;

      url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/lightCones?limit=100&where[id][in]=${lcids.toString()}`;
      const lightConeRaw = await (await fetch(url)).json();
      var lightCones = lightConeRaw.docs;

      url = `https://${
         process.env.PAYLOAD_PUBLIC_SITE_ID
      }-db.mana.wiki/api/skillTrees?limit=500&where[character][in]=${charids.toString()}`;
      const skillTreeRaw = await (await fetch(url)).json();
      var skillTrees = skillTreeRaw.docs;

      url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/_statTypes?limit=100`;
      const statTypesRaw = await (await fetch(url)).json();
      var statTypes = statTypesRaw.docs;

      url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/playerIcons/${piid}`;
      var playerIcon = await (await fetch(url)).json();
   }

   return json({
      relics,
      characters,
      lightCones,
      skillTrees,
      statTypes,
      playerIcon,
      showcaseData,
      result,
   });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Character Showcase - Honkai: Star Rail",
      },
      {
         name: "description",
         content: "Build Better Wikis",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export default function Showcase() {
   const {
      relics,
      characters,
      lightCones,
      skillTrees,
      statTypes,
      playerIcon,
      showcaseData,
      result,
   } = useLoaderData<typeof loader>();
   // result:
   // null = No argument or UID provided, ask for UID input
   // bad_uid = UID provided but does not provide result
   // success = successful.

   const pdata = showcaseData;

   if (result == "bad_uid") {
      return (
         <>
            <div className="mt-10"></div>
            <InputUIDNote />
            <BadUIDNote />
         </>
      );
   } else if (!result) {
      return (
         <>
            <div className="mt-10"></div>
            <InputUIDNote />
         </>
      );
   }

   return (
      <>
         <div className="mt-10"></div>
         <DisplayPlayerInfo
            relics={relics}
            characters={characters}
            lightCones={lightCones}
            skillTrees={skillTrees}
            statTypes={statTypes}
            playerIcon={playerIcon}
            pdata={pdata}
         />

         <InputUIDNote />
      </>
   );
}

const DisplayPlayerInfo = ({
   relics,
   characters,
   lightCones,
   skillTrees,
   statTypes,
   playerIcon,
   pdata,
}: any) => {
   const [displayChar, setDisplayChar] = useState(-1);

   return (
      <>
         <div className="mx-auto mb-8 max-w-[960px] max-desktop:px-3">
            {/* 1) Header with main information for Profile */}
            <PlayerHeader data={pdata} playerIcon={playerIcon} />

            {/* 2) Character selector for available characters in data */}
            <CharacterSelector
               data={pdata}
               characters={characters}
               displayChar={displayChar}
               setDisplayChar={(e: any) => setDisplayChar(e)}
            />

            {/* 3) Primary Character display section */}
            <CharacterInfo
               data={pdata}
               characters={characters}
               lightCones={lightCones}
               relics={relics}
               skillTrees={skillTrees}
               statTypes={statTypes}
               displayChar={displayChar}
            />
         </div>
      </>
   );
};

const PlayerHeader = ({ data, playerIcon }: any) => {
   const dataClass =
      "rounded-md border border-color px-2 m-1 py-1 inline-block text-sm";

   return (
      <>
         <div className="my-2 rounded-md border border-color p-2 flex justify-left">
            {/* ICON - Pending */}
            <div className="h-auto w-24 inline-flex items-center">
               <Image
                  alt="Icon"
                  url={playerIcon?.icon?.url}
                  className="object-contain"
               />
            </div>

            <div className="inline-flex items-center">
               <div className="inline-block">
                  {/* Nickname */}
                  <div className="text-2xl font-bold">
                     {data?.detail_info?.nickname}
                  </div>
                  {/* UID */}
                  <div className={`${dataClass}`}>{data?.detail_info?.uid}</div>
                  {/* Level (Trailblaze Level) */}
                  <div className={`${dataClass}`}>
                     TL: {data?.detail_info?.level}
                  </div>
                  {/* World Level (Equilibrium Level) */}
                  <div className={`${dataClass}`}>
                     EL: {data?.detail_info?.world_level}
                  </div>
                  {/* Achievements */}
                  <div className={`${dataClass}`}>
                     Total Achievements:{" "}
                     {data?.detail_info?.record_info?.achievement_count}
                  </div>
                  {/* Total Characters */}
                  <div className={`${dataClass}`}>
                     Characters Owned:{" "}
                     {data?.detail_info?.record_info?.avatar_count}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

const CharacterSelector = ({
   data,
   characters,
   displayChar,
   setDisplayChar,
}: any) => {
   // Get full list of character IDs, including the assist avatar and all characters in avatar_detail_list
   var charids = [
      data?.detail_info?.assist_avatar?.avatar_id,
      ...data?.detail_info?.avatar_detail_list?.map((a: any) => a.avatar_id),
   ];

   return (
      <>
         <div className="my-3 text-center">
            {charids.map((c: any, i: any) => {
               const cdata = characters.find((a: any) => a.character_id == c);

               // Make sure to only show the selector if that character is different from the assist_avatar
               return (
                  <>
                     {i == 0 || (charids[0] != c && i > 0) ? (
                        <>
                           <div
                              className={`inline-block cursor-pointer`}
                              onClick={() => {
                                 setDisplayChar(i - 1);
                              }}
                              key={c + "-" + i}
                           >
                              {/* NOTE: Passing style in as a parameter in case we want to format the actively selected character differently! */}
                              <ItemFrameRound
                                 mat={cdata}
                                 style={`${
                                    displayChar == i - 1
                                       ? "drop-shadow-md drop-shadow-[0px_0px_8px_rgba(100,100,0,1)] dark:drop-shadow-[0px_0px_4px_rgba(255,255,255,1)]"
                                       : ""
                                 }`}
                              />
                           </div>
                        </>
                     ) : null}
                  </>
               );
            })}
         </div>
      </>
   );
};

const ItemFrameRound = ({ mat, style }: any) => {
   // ========================
   // Generic Item / Character Circle Frame
   // ========================

   return (
      <div
         className={`relative mx-1 inline-block h-20 w-20 text-center align-middle align-middle ${style}`}
         key={mat?.id}
      >
         <Image
            url={mat?.icon?.url ?? "no_image_42df124128"}
            className={`h-20 w-20 object-contain color-rarity-${
               mat?.rarity?.display_number ?? "1"
            } rounded-full`}
            alt={mat?.name}
         />
      </div>
   );
};

const CharacterInfo = ({
   data,
   characters,
   lightCones,
   relics,
   skillTrees,
   statTypes,
   displayChar,
}: any) => {
   // State Variables:
   // hoverStat = Current mouse-over'd state.
   const [hoverStat, setHoverStat] = useState<string[]>([]);
   console.log(hoverStat);

   // Character Data Loading
   // If the displayChar variable is set to -1, show the assist_avatar; otherwise for 0, 1, 2, show the avatar_detail_list for the corresponding index.
   const chardata =
      displayChar == -1
         ? data?.detail_info?.assist_avatar
         : data?.detail_info?.avatar_detail_list[displayChar];
   const charid = chardata?.avatar_id;

   const charbase = characters.find((a: any) => a.character_id == charid);

   // Character Showcase Canvas!
   const bg_url =
      "https://static.mana.wiki/file/mana-prod/starrail/UI_Star_Bg.png";

   // Light Cone data loading
   const lcid = chardata?.equipment?.tid;
   const lcbase = lightCones.find((a: any) => a.lightcone_id == lcid);
   const superimp = ["0", "I", "II", "III", "IV", "V"];

   // Light Cone Stat Calculation
   const wlv = chardata?.equipment?.level;
   const wrank = chardata?.equipment?.rank;
   var wsuffix = "";
   // Ascension Check, add "A" if ascended:
   if (
      (wlv == 20 && wrank == 1) ||
      (wlv == 30 && wrank == 2) ||
      (wlv == 40 && wrank == 3) ||
      (wlv == 50 && wrank == 4) ||
      (wlv == 60 && wrank == 5) ||
      (wlv == 70 && wrank == 6)
   ) {
      wsuffix = "A";
   }

   const wi = lcbase.stats[0].data?.findIndex((a: any) => a == wlv + wsuffix);
   var wstats = [
      { name: "HP", base: lcbase.stats[1].data[wi] },
      { name: "ATK", base: lcbase.stats[2].data[wi] },
      { name: "DEF", base: lcbase.stats[3].data[wi] },
   ];

   // Relic data loading
   const rid = chardata?.relic_list?.map((a: any) => a.tid);
   const rbase = rid?.map((r: any) => relics.find((a: any) => a.relic_id == r));

   const rchar = chardata.relic_list?.map((r: any, i: any) => {
      // Relic level
      const rlv = r.level ?? 0;

      // For each relic, need to pull the main stat, and all sub stats
      // Main Stat:
      // - Get Main Stat Icon / Affix ID / Name
      // - Get Value of Main Stat at level
      const mainstat = rbase[i]?.mainstat_group?.find(
         (a: any) => a.affix_id == r.main_affix_id
      );

      // Main stats
      const mainobj = {
         id: mainstat?.stattype?.id,
         name: mainstat?.stattype?.name,
         icon: {
            url: mainstat?.stattype?.icon?.url,
         },
         affix_id: mainstat?.affix_id,
         value: mainstat?.stats[rlv],
      };

      // Sub stats
      const subobj = r.sub_affix_list?.map((s: any) => {
         const ss = rbase[i]?.substat_group?.find(
            (a: any) => a.affix_id == s.affix_id
         );
         const scnt = s.cnt ?? 0;
         const sbase = ss.base_val;
         const sstep = s.step ?? 0;
         const sstepval = ss.level_add;

         var stepdist: any = []; // Has an array of [1, 2, 1, 1, 2, 1 ...] equal in size to scnt, where total sum of elements = sstep.

         // number of '2' rolls is equal to step - cnt;
         for (var d = 0; d < scnt; d++) {
            if (d < sstep - scnt) {
               stepdist[d] = 2;
            } else if (!sstep) {
               stepdist[d] = 0;
            } else {
               stepdist[d] = 1;
            }
         }

         return {
            id: ss?.stattype?.id,
            name: ss?.stattype?.name,
            icon: {
               url: ss?.stattype?.icon?.url,
            },
            affix_id: ss?.affix_id,
            property_classify: ss?.stattype?.property_classify,
            stepDistribution: stepdist,
            value: scnt * sbase + sstepval * sstep, // Value = count * base + (step_value * step)
         };
      });

      // Set name/icon

      return { ...r, mainobj, subobj, set: rbase[i]?.relicset_id };
   });

   // Relic Sets
   // =================
   // Put all relic set data into an object with Relic Set + their corresponding bonuses
   // const rset = [{
   //    id: "102",
   //    name: "Musketeer of Wild Wheat",
   //    num: 2, // Number of artifacts in set
   //    bonuses: [{ stattype: "AttackAddedRatio", value: 0.1199999 }], // Total bonuses from this set, lists all of them for set number requirements less than or equal to amount in set.
   // }];
   const setlist = rbase.map((r: any) => r.relicset_id);
   const rsetids = rchar.map((r: any) => r.set?.id);
   const rset = rsetids
      .filter((v: any, i: any, a: any) => a.indexOf(v) === i)
      .map((r: any) => {
         const currset = setlist.find((s: any) => s.relicset_id == r);
         const numInSet = rsetids.filter((a: any) => a == r)?.length;

         // For each bonus effect in the set, check if the number of artifacts in set is at least equal to the required number:
         var bonuses: any = [];
         var effect_desc: any = [];
         for (var ei = 0; ei < currset?.set_effect?.length; ei++) {
            const eff = currset?.set_effect[ei];

            // If number equipped is at least the required number, return the stat bonuses in property_list
            if (numInSet >= eff?.req_no) {
               eff?.property_list.map((p: any) => {
                  bonuses.push(p);
               });
               effect_desc.push(eff?.description);
            }
         }

         return {
            id: r,
            name: currset?.name,
            num: numInSet,
            bonuses: bonuses,
            effect_desc: effect_desc,
         };
      });

   // Total all relic-sourced bonuses:
   // ============================
   // [ "HPDelta" // FLAT, "HPAddedRatio" // PERCENT]
   var relicbonuses: any = [];

   for (var rb = 0; rb < rchar.length; rb++) {
      const curr = rchar[rb];
      relicbonuses.push(curr.mainobj);

      curr.subobj?.map((a: any) => {
         relicbonuses.push(a);
      });
   }

   for (var sb = 0; sb < rset.length; sb++) {
      const curr = rset[sb];

      curr.bonuses?.map((a: any) => {
         const tempbonus = {
            id: a?.stattype?.id,
            icon: {
               url: a?.stattype?.icon?.url,
            },
            name: a?.stattype?.name,
            property_classify: a?.stattype?.property_classify,
            value: a.value,
         };
         relicbonuses.push(tempbonus);
      });
   }

   // Total all skill tree-sourced bonuses, same format as relic bonuses:
   // ============================
   var skilltreebonuses: any = [];

   for (var sk = 0; sk < chardata?.skilltree_list?.length; sk++) {
      const currpoint = chardata?.skilltree_list[sk];
      var treepoint = skillTrees.find(
         (a: any) => a.point_id == currpoint.point_id
      );

      treepoint.stat_added?.map((a: any) => {
         const tempbonus = {
            id: a?.stat_type?.id,
            icon: {
               url: a?.stat_type?.icon?.url,
            },
            name: a?.stat_type?.name,
            property_classify: a?.stat_type?.property_classify,
            value: a.value,
            point_id: treepoint?.point_id,
         };
         skilltreebonuses.push(tempbonus);
      });
   }

   // ============================
   // ============================

   // Character Base Stat Calculation
   const lv = chardata.level;
   const rank = chardata.rank;
   var suffix = "";
   // Ascension Check, add "A" if ascended:
   if (
      (lv == 20 && rank == 1) ||
      (lv == 30 && rank == 2) ||
      (lv == 40 && rank == 3) ||
      (lv == 50 && rank == 4) ||
      (lv == 60 && rank == 5) ||
      (lv == 70 && rank == 6)
   ) {
      suffix = "A";
   }

   const li = charbase.stats[0].data.findIndex((a: any) => a == lv + suffix);

   const defaultStats = [
      "HP",
      "ATK",
      "DEF",
      "SPD",
      "CRIT Rate",
      "CRIT DMG",
      //   "Aggro",
   ];
   var statVal = defaultStats.map((stat: any, i: any) => {
      // Final Modifier is calculated as follows:
      // ============================
      // Stat = BASE + MODIFIER
      // ---
      // BASE (statbase) = BaseATK + WATK
      // BaseATK = Character's base atk @ LV
      // WATK = Light cone base atk
      // ---
      // MODIFIER (statmod) = RelicATK + BASE*(RelicATK% + Tree% + SetATK%)
      // RelicATK = All relic Flat ATK bonuses
      // RelicATK% = All relic ATK % bonuses
      // SetATK% = All relic set ATK % bonuses
      // Tree% = All tree ATK% bonuses
      const statbase =
         parseFloat(charbase.stats[i + 1].data[li]) +
         (wstats[i]?.base ? parseFloat(wstats[i]?.base) : 0);

      // Flat bonuses =
      const relicflat = relicbonuses
         .filter((a: any) => a.name == stat)
         ?.map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      // Percent Bonuses =
      // - relicperc // Contains both relic and set bonuses
      // - treeperc // Contains all Skill Tree bonuses.
      const relicperc = relicbonuses
         .filter((a: any) => a.name == stat + "%")
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const treeperc = skilltreebonuses
         .filter((a: any) => a.name == stat + "%")
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const statmod = relicflat + statbase * (relicperc + treeperc);

      return {
         name: stat,
         base: statbase,
         mod: statmod,
      };
   });

   const additionalStats = [
      "Break Effect%",
      "Outgoing Healing Boost%",
      "Max Energy",
      "Energy Regeneration Rate%",
      "Effect Hit Rate",
      "Effect RES",
      "Physical DMG Boost%",
      "Fire DMG Boost%",
      "Ice DMG Boost%",
      "Lightning DMG Boost%",
      "Wind DMG Boost%",
      "Quantum DMG Boost%",
      "Imaginary DMG Boost%",
      "Physical RES Boost",
      "Fire RES Boost",
      "Ice RES Boost",
      "Lightning RES Boost",
      "Wind RES Boost",
      "Quantum RES Boost",
      "Imaginary RES Boost",
   ];

   additionalStats.map((stat) => {
      // Percent Bonuses =
      // - relicperc // Contains both relic and set bonuses
      // - treeperc // Contains all Skill Tree bonuses.
      const relicperc = relicbonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const treeperc = skilltreebonuses
         .filter((a: any) => a.name == stat)
         .map((a: any) => a.value)
         ?.reduce((ps: any, a: any) => ps + a, 0);

      const statmod = relicperc + treeperc;

      if (statmod > 0) {
         statVal.push({
            name: stat,
            base: 0,
            mod: statmod,
         });
      }
   });

   return (
      <>
         <div id="hsr-char-summary">
            <div className="relative my-3 rounded-md w-full h-[32rem] text-center ">
               {/* Background-Div */}
               <div className="relative inline-block w-[960px] h-[32rem] rounded-lg overflow-hidden">
                  <img
                     src={bg_url}
                     className="w-full object-fill"
                     alt="background"
                  />
               </div>

               {/* ================================= */}
               {/* First Column */}
               {/* ================================= */}

               {/* Character Splash Image Left */}
               <a href={`/starrail/collections/characters/${charbase?.id}`}>
                  <div className="absolute -left-0 -top-0 h-[30rem] w-[30rem] opacity-80">
                     <Image
                        url={charbase?.image_draw?.url}
                        alt={charbase?.name}
                        className="hsr-showcase-character object-contain"
                     />
                  </div>
               </a>

               {/* Character Name Top Left */}

               <a href={`/starrail/collections/characters/${charbase?.id}`}>
                  <div className="absolute left-2 top-1 text-white font-bold text-2xl">
                     {charbase?.name}
                  </div>
               </a>

               {/* Character Level Second Line */}
               <div className="absolute left-2 top-8 text-white">Lv.{lv}</div>

               {/* Eidolon Levels; if not unlocked, show 🔒 */}
               <div className="absolute left-2 top-14">
                  {charbase?.eidolons?.map((e: any, i: any) => {
                     const elv = chardata?.promotion ?? 0;

                     return (
                        <>
                           {elv > i ? (
                              <>
                                 <div className="relative my-1 block h-10 w-10 rounded-full bg-gray-900 drop-shadow-[0px_0px_4px_rgba(255,255,255,1)] drop-shadow-md">
                                    <Image
                                       alt={"Eidolon Lv." + i + 1}
                                       url={e.icon?.url}
                                       className="absolute object-contain"
                                    />
                                    <NameToolTip
                                       text={e?.name}
                                       tooltip={e?.description}
                                       style="absolute"
                                    />
                                 </div>
                              </>
                           ) : (
                              <div className="relative my-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-900">
                                 <Image
                                    alt={"Eidolon Lv." + i + 1}
                                    url={e.icon?.url}
                                    className="absolute object-contain opacity-30"
                                 />
                                 <Image
                                    alt="Lock"
                                    url={
                                       "https://wiki-cdn.nalu.wiki/neuralcloud/Algorithm_Lock_Icon_ce5b2d3623.png"
                                    }
                                    className="absolute h-5 w-5 object-contain"
                                 />
                                 <NameToolTip
                                    text={e?.name}
                                    tooltip={e?.description}
                                 />
                              </div>
                           )}
                        </>
                     );
                  })}
               </div>

               {/* Skill Tree ? */}
               <div className="absolute -left-20 top-44">
                  <SkillTreeDisplay
                     data={chardata}
                     skillTrees={skillTrees}
                     path={charbase?.path?.data_key}
                     hoverStat={hoverStat}
                     setHoverStat={setHoverStat}
                  />
               </div>

               {/* ================================= */}
               {/* Second Column */}
               {/* ================================= */}

               <div className="absolute left-[23rem] top-3 ">
                  {/* Light Cone Display  */}
                  <div className="mb-1 w-64">
                     {/* Light Cone Image + Rarity */}
                     <a href={`/starrail/collections/lightCones/${lcbase?.id}`}>
                        <div className="relative inline-block align-top w-16">
                           <Image
                              alt={lcbase.name}
                              url={lcbase.image_full?.url}
                              className="h-16 w-16 object-contain"
                           />
                           <div className="absolute -bottom-4 h-4 w-16 text-center">
                              <Image
                                 alt="Rarity"
                                 url={lcbase.rarity?.icon?.url}
                                 className="inline-block h-4 object-contain align-top"
                              />
                           </div>
                        </div>
                     </a>

                     {/* Level + Superimposition Levels */}
                     <div className="relative inline-block w-48 align-top text-left">
                        <div className="relative block text-white text-sm font-bold">
                           {lcbase.name}
                           <NameToolTip
                              text={lcbase?.name}
                              tooltip={
                                 lcbase?.skill_data[
                                    chardata?.equipment?.promotion - 1
                                 ]?.desc
                              }
                              style="absolute top-0 left-0"
                           />
                        </div>

                        <div className="relative inline-block px-2 py-0.5 mx-1 bg-black bg-opacity-90 rounded-md text-xs text-white">
                           Lv.{chardata?.equipment?.level}
                        </div>
                        <div className="relative mx-1 inline-block w-6 rounded-full bg-yellow-900 p-0.5 text-center text-xs text-yellow-100">
                           {superimp[chardata?.equipment?.promotion]}
                        </div>

                        {/* Light Cone Stat Values */}
                        <div>
                           {wstats?.map((s: any) => {
                              const stattype = statTypes.find(
                                 (a: any) => a.name == s.name
                              );
                              const lcstatname = s.name?.replace("%", "");

                              return (
                                 <>
                                    <div
                                       className={`mx-0.5 my-[1px] inline-block rounded-sm  ${
                                          hoverStat.indexOf(lcstatname) > -1
                                             ? "bg-white bg-opacity-20"
                                             : hoverStat.length > 0
                                             ? "bg-black bg-opacity-80 opacity-50"
                                             : "bg-black bg-opacity-80"
                                       }`}
                                       onMouseOver={() =>
                                          setHoverStat([lcstatname])
                                       }
                                       onMouseOut={() => setHoverStat([])}
                                       onClick={() =>
                                          setHoverStat(
                                             hoverStat.length > 0
                                                ? []
                                                : [lcstatname]
                                          )
                                       }
                                    >
                                       <div className="inline-block h-5 w-5 align-middle">
                                          <Image
                                             alt="StatIcon"
                                             url={stattype?.icon?.url}
                                             className="object-fit"
                                          />
                                       </div>
                                       <div className="inline-block pr-1 align-middle text-xs text-white">
                                          +{formatStat(stattype?.name, s?.base)}
                                       </div>
                                    </div>
                                 </>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Stat Display */}
                  <div className="relative w-64 text-white mt-2">
                     {statVal.map((s: any) => {
                        const stattype = statTypes.find(
                           (a: any) => a.name == s.name
                        );

                        const statname = s.name?.replace("%", "");
                        return (
                           <>
                              <div
                                 className={`flex h-9 items-center px-2 rounded-sm cursor-default ${
                                    hoverStat.indexOf(statname) > -1
                                       ? "bg-white bg-opacity-20"
                                       : hoverStat.length > 0
                                       ? "opacity-50"
                                       : ""
                                 }`}
                                 onMouseOver={() => setHoverStat([statname])}
                                 onMouseOut={() => setHoverStat([])}
                                 onClick={() =>
                                    setHoverStat(
                                       hoverStat.length > 0 ? [] : [statname]
                                    )
                                 }
                              >
                                 <div className="flex flex-grow items-center space-x-2">
                                    <div>
                                       {stattype?.icon?.url ? (
                                          <div
                                             className="relative inline-flex h-6 w-6 items-center 
                               justify-center rounded-full align-middle"
                                          >
                                             <Image
                                                alt={"StatIcon"}
                                                url={
                                                   stattype?.icon?.url ??
                                                   "no_image_42df124128"
                                                }
                                                className="h-full w-full object-contain"
                                             />
                                          </div>
                                       ) : null}
                                    </div>

                                    <div className="text-left font-bold leading-none">
                                       {s.name}
                                    </div>
                                 </div>
                                 {/* Stat Value With Modifier */}
                                 <div className="text-right leading-none">
                                    <div className="font-bold">
                                       {formatStat(s.name, s.base + s.mod)}
                                    </div>
                                    <div className="text-[8pt]">
                                       {s.base > 0 ? (
                                          <div className="inline-block">
                                             {formatStat(s.name, s.base)}
                                          </div>
                                       ) : null}

                                       {s.mod ? (
                                          <div className="inline-block text-green-400">
                                             +{formatStat(s.name, s.mod)}
                                          </div>
                                       ) : null}
                                    </div>
                                 </div>
                              </div>
                           </>
                        );
                     })}
                  </div>
               </div>

               {/* ================================= */}
               {/* Third Column */}
               {/* ================================= */}

               <div className="absolute left-[39.5rem] top-2 w-80">
                  {/* Individual Relics */}
                  {rbase?.map((r: any, i: any) => {
                     const rdata = rchar[i];
                     const rlv = rdata.level ?? 0;

                     const mainstat = rdata.mainobj;

                     const mainstatname = mainstat?.name?.replace("%", "");

                     return (
                        <>
                           <div className="relative my-1 h-14 w-80 bg-gray-900 bg-opacity-30 text-left">
                              {/* Relic Image */}
                              <ItemFrameSquare
                                 mat={r}
                                 style=""
                                 lv={"+" + rlv}
                              />

                              {/* Relic Main Stat and Level */}

                              <div
                                 className={`inline-block w-20 text-right text-white align-middle ml-1 mr-3 px-1 cursor-default ${
                                    hoverStat.indexOf(mainstatname) > -1
                                       ? "bg-white bg-opacity-20"
                                       : hoverStat.length > 0
                                       ? "opacity-50"
                                       : "bg-gray-900 bg-opacity-70"
                                 }`}
                                 onMouseOver={() =>
                                    setHoverStat([mainstatname])
                                 }
                                 onMouseOut={() => setHoverStat([])}
                                 onClick={() =>
                                    setHoverStat(
                                       hoverStat.length > 0
                                          ? []
                                          : [mainstatname]
                                    )
                                 }
                              >
                                 <div className="inline-block align-middle h-6 w-6 ">
                                    <Image
                                       alt="StatIcon"
                                       url={mainstat?.icon?.url}
                                    />
                                 </div>
                                 <div className="align-middle text-md font-bold ">
                                    {formatStat(
                                       mainstat?.name,
                                       mainstat?.value
                                    )}
                                 </div>
                              </div>

                              {/* Relic Substats */}
                              <div className="inline-block w-40 align-middle">
                                 <div className="grid grid-cols-2 gap-1 leading-none text-white text-center">
                                    {rdata.subobj?.map((sub: any) => {
                                       const steptext =
                                          sub?.stepDistribution?.map(
                                             (step: any) =>
                                                step == 0
                                                   ? "."
                                                   : step == 1
                                                   ? ".."
                                                   : "..."
                                          );
                                       const statname = sub.name?.replace(
                                          "%",
                                          ""
                                       );
                                       return (
                                          <>
                                             <div
                                                className={`inline-block rounded-sm w-full cursor-default ${
                                                   hoverStat.indexOf(statname) >
                                                   -1
                                                      ? "bg-white bg-opacity-20"
                                                      : hoverStat.length > 0
                                                      ? "opacity-50"
                                                      : "bg-gray-900 bg-opacity-70"
                                                }`}
                                                onMouseOver={() =>
                                                   setHoverStat([statname])
                                                }
                                                onMouseOut={() =>
                                                   setHoverStat([])
                                                }
                                                onClick={() =>
                                                   setHoverStat(
                                                      hoverStat.length > 0
                                                         ? []
                                                         : [statname]
                                                   )
                                                }
                                             >
                                                <div className="inline-block h-5 w-5 align-middle">
                                                   <Image
                                                      alt="StatIcon"
                                                      url={sub?.icon?.url}
                                                      className="object-fit"
                                                   />
                                                </div>
                                                <div className="inline-block align-middle text-xs">
                                                   +
                                                   {formatStat(
                                                      sub?.name,
                                                      sub?.value
                                                   )}
                                                </div>
                                                <div className="flex w-full">
                                                   {steptext?.map((st: any) => {
                                                      return (
                                                         <>
                                                            <div
                                                               className={`inline-flex mx-1 -mt-2.5 w-full border-b border-gray-500 border-opacity-70 text-white text-sm text-center leading-none justify-center ${
                                                                  st == "="
                                                                     ? "text-opacity-0"
                                                                     : ""
                                                               }`}
                                                            >
                                                               {st}
                                                            </div>
                                                         </>
                                                      );
                                                   })}
                                                </div>
                                             </div>
                                          </>
                                       );
                                    })}
                                 </div>
                              </div>
                           </div>
                        </>
                     );
                  })}

                  {/* Relic Set Bonuses */}
                  <div className="mt-2 w-full">
                     {rset?.map((set: any) => {
                        var setdesc = "";

                        set.effect_desc.map((e: any, i: any) => {
                           setdesc +=
                              e +
                              (i < set.effect_desc.length - 1
                                 ? "<br><br>"
                                 : "");
                        });

                        // Check if any of the stat bonuses in the set apply to the currently highlighted stat.
                        const sbonuses = set.bonuses?.map((b: any) =>
                           b.stattype?.name?.replace("%", "")
                        );

                        const highlightStyle =
                           intersect(sbonuses, hoverStat)?.length > 0
                              ? "bg-white bg-opacity-20"
                              : hoverStat.length > 0
                              ? "opacity-50"
                              : "";

                        // Check if any of the set bonuses also include the currently highlighted stat

                        return (
                           <>
                              <div
                                 className={`my-1 p-0.5 text-sm ${highlightStyle}`}
                                 onMouseOver={() => setHoverStat(sbonuses)}
                                 onMouseOut={() => setHoverStat([])}
                                 onClick={() =>
                                    setHoverStat(
                                       hoverStat?.length > 0 ? [] : sbonuses
                                    )
                                 }
                              >
                                 <div className="relative inline-block w-3/4 rounded-md px-2 text-white">
                                    {set.name}
                                    <NameToolTip
                                       text={set?.name}
                                       tooltip={setdesc}
                                       style="absolute top-0 left-0"
                                    />
                                 </div>
                                 <div className="relative inline-block rounded-md bg-black bg-opacity-40 px-2 text-green-400">
                                    {set.num}
                                 </div>
                              </div>
                           </>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>

         {/* <ScreenshotButton /> */}
      </>
   );
};

const ItemFrameSquare = ({ mat, style, lv }: any) => {
   // ========================
   // Generic Item / Character Circle Frame - Light Cone
   // ========================

   return (
      <a href={`/starrail/collections/relicSets/${mat?.relicset_id?.id}`}>
         <div
            className={`relative inline-block h-14 w-14 text-center align-middle align-middle ${style}`}
            key={mat?.id}
         >
            <Image
               url={mat?.icon?.url ?? "no_image_42df124128"}
               className={`h-14 w-14 object-contain color-rarity-${
                  mat?.rarity?.display_number ?? "1"
               } rounded-md`}
               alt={mat?.name}
            />
            <div className="text-white font-bold absolute right-0 bottom-0 rounded-full bg-neutral-900 bg-opacity-70 text-xs px-1 py-0.5">
               {lv}
            </div>
         </div>
      </a>
   );
};

function formatStat(type: any, stat: any) {
   // =====================================
   // Performs Rounding for Stats as Integers or as Percentages as necessary
   // =====================================
   // These are stats that should be formatted as an Integer.
   var intlist = ["HP", "ATK", "DEF", "SPD", "Aggro"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      stat = "" + Math.floor(Math.round(stat * 100) / 100);
   } else {
      stat =
         (Math.floor(Math.round(stat * 100000) / 100) / 10).toFixed(1) + "%";
   }
   return stat;
}

const SkillTreeDisplay = ({
   data,
   skillTrees,
   path,
   hoverStat,
   setHoverStat,
}: any) => {
   var pathkey = path;
   var treelist = skillTrees.filter(
      (a: any) => a.character?.character_id == data?.avatar_id
   ); // pageData?.attributes?.tree; //skillTreeData;

   // Need to sort skill nodes in order from Point01 - 18
   treelist.sort((a: any, b: any) =>
      a.anchor > b.anchor ? 1 : b.anchor > a.anchor ? -1 : 0
   );

   const connectorcount: any = {
      Knight: 8,
      Warrior: 8,
      Rogue: 8,
      Priest: 9,
      Mage: 6,
      Shaman: 8,
      Warlock: 7,
   };
   // Initialize an array of form [1, 2, 3, ... n], where n is the number of connectors for the character's Path (from connectorcount)
   const connectorlist = Array.from(
      { length: connectorcount[pathkey] },
      (v, k) => k + 1
   );

   return (
      <>
         <div className="canvas mx-auto flex scale-[0.5] items-center justify-center">
            <div className={`canvas-${pathkey}`}></div>

            {connectorlist?.map((con: any) => {
               return (
                  <>
                     <div
                        className={`connector connector-${con}-${pathkey}`}
                     ></div>
                  </>
               );
            })}

            {treelist?.map((node: any, i: any) => {
               const nodelv = data.skilltree_list?.find(
                  (a: any) => a.point_id == node.point_id
               )?.level;

               // Populate node description tooltip text
               var detail_desc = "";
               if (nodelv) {
                  detail_desc =
                     node.affected_skill?.[0]?.description_per_level?.[
                        nodelv - 1
                     ]?.description ?? "";
               }

               const node_desc = node?.description + detail_desc;

               // Check if any of the node's stat_added equal the current highlighted hoverStat

               const skillstats =
                  node?.stat_added?.map((s: any) =>
                     s.stat_type?.name?.replace("%", "")
                  ) ?? [];

               const treeHighlight =
                  intersect(skillstats, hoverStat)?.length > 0 ? "invert" : "";

               return (
                  <>
                     <div
                        className={`point point-${
                           i + 1
                        }-${pathkey} ${treeHighlight}`}
                        // style={{
                        //    backgroundImage: "url(" + node?.icon?.url + ")",
                        // }}
                     >
                        <Image
                           alt="Icon"
                           url={node?.icon?.url}
                           className={`object-contain opacity-20 `}
                        />

                        {nodelv ? (
                           <div className="absolute top-1 w-9 text-center text-2xl font-bold text-white drop-shadow-[0_0_2px_rgba(250,0,0,0.8)]">
                              {nodelv}
                           </div>
                        ) : null}
                     </div>
                     <div
                        className={`absolute origin-top-left w-[20px] h-[20px] scale-[2.0] z-30 point-${
                           i + 1
                        }-${pathkey}`}
                        onMouseOver={() => setHoverStat(skillstats)}
                        onMouseOut={() => setHoverStat([])}
                        onClick={() =>
                           setHoverStat(hoverStat.length > 0 ? [] : skillstats)
                        }
                     >
                        <NameToolTip
                           text={node?.name}
                           tooltip={node_desc}
                           style={``}
                        />
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
};

const InputUIDNote = () => {
   const [inputUID, setInputUID] = useState("");

   return (
      <>
         {" "}
         <div className="mx-auto mb-8 max-w-[960px] text-center max-desktop:px-3">
            <div className="border-color my-2 w-full rounded-md border p-3 text-center text-2xl font-bold">
               Input a UID to load:
            </div>

            <input
               className="border-color my-2 rounded-full border px-3 py-1 text-neutral-800"
               value={inputUID}
               onChange={(e) => setInputUID(e.target.value)}
            ></input>
            <a href={`/starrail/profile/${inputUID}`}>
               <div className="mx-auto my-1 w-fit cursor-pointer rounded-md border px-3 py-1 hover:bg-gray-400 hover:bg-opacity-20 active:bg-gray-400 active:bg-opacity-40 dark:border-gray-700">
                  Submit
               </div>
            </a>
         </div>
      </>
   );
};

const BadUIDNote = () => {
   return (
      <div className="mx-auto mb-8 max-w-[960px] max-desktop:px-3">
         <div className="border-color rounded-md border p-3 text-xl">
            <div>UID data not found.</div>
            <div className="text-md italic">
               * Note CN Server support is not yet available.
            </div>
         </div>
      </div>
   );
};

const NameToolTip = ({ text, tooltip, style = "" }: any) => {
   const [ttip, setTtip] = useState(false);
   return (
      <>
         <div
            className={`w-full h-full z-30 ${style}`}
            onMouseOver={() => setTtip(true)}
            onMouseOut={() => setTtip(false)}
            onClick={() => setTtip(!ttip)}
         >
            {/* {text} */}

            <div
               className={`absolute z-40 top-6 left-6 rounded-md border w-64 bg-gray-900 bg-opacity-90 py-1 px-2 text-xs text-gray-50 border-gray-700 ${
                  ttip ? "block" : "hidden"
               }`}
            >
               <div className="text-sm font-bold text-blue-400 dark:text-blue-600">
                  {text}
               </div>
               <div
                  className="italic"
                  dangerouslySetInnerHTML={{ __html: tooltip }}
               ></div>
            </div>
         </div>
      </>
   );
};

function intersect(a: any, b: any) {
   var result = a?.filter(function (n: any) {
      return b?.indexOf(n) > -1;
   });

   return result;
}

// function getScreenshotOfElement(element, posX, posY, width, height, callback) {
//    html2canvas(element, {
//       // width: width,
//       // height: height,
//       useCORS: true,
//       allowTaint: true,
//       logging: false,
//       // scrollX: 0,
//       // scrollY: 0,
//       // windowWidth: window.innerWidth,
//       // windowHeight: window.innerHeight,
//    }).then(function (canvas) {
//       // var context = canvas.getContext("2d");
//       // var imageData = context.getImageData(posX, posY, width, height).data;
//       // var outputCanvas = document.createElement("canvas");
//       // var outputContext = outputCanvas.getContext("2d");
//       // outputCanvas.width = width;
//       // outputCanvas.height = height;

//       // var idata = outputContext.createImageData(width, height);
//       // idata.data.set(imageData);
//       // outputContext.putImageData(idata, 0, 0);
//       // callback(outputCanvas.toDataURL("image/png"));
//       callback(canvas.toDataURL("image/png"));
//    });
// }

// const ScreenshotButton = () => {
//    return (
//       <div
//          className=""
//          onClick={() => {
//             const summ = document.getElementById("hsr-char-summary");
//             getScreenshotOfElement(summ, 0, 0, 960, 512, function (data) {
//                // in the data variable there is the base64 image
//                // exmaple for displaying the image in an <img>
//             });
//          }}
//       >
//          Screenshot Test
//       </div>
//    );
// };