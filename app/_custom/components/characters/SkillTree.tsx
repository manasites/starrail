import { useState } from "react";

export const SkillTree = ({ pageData, skillTreeData }: any) => {
   // UseState variable settings
   const [treeNode, setTreeNode] = useState(0);
   const [skillLevel, setSkillLevel] = useState(1);

   var pathkey = pageData?.path?.data_key;
   var treelist = skillTreeData; // pageData?.attributes?.tree; //skillTreeData;
   var traces = pageData?.traces;

   // Need to sort skill nodes in order from Point01 - 18
   treelist.sort((a: any, b: any) =>
      a.anchor > b.anchor ? 1 : b.anchor > a.anchor ? -1 : 0
   );

   const connectorcount = {
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

   // Used by display for individual nodes when clicked.
   const activeNode = treelist[treeNode - 1];

   return (
      <>
         <div className="bg-2 shadow-1 rounded-lg p-6 text-center shadow-sm">
            <div className="canvas bg-5 mx-auto flex items-center justify-center rounded-2xl bg-zinc-700">
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
                  return (
                     <>
                        <div
                           className={`point cursor-pointer point-${
                              i + 1
                           }-${pathkey} ${treeNode == i + 1 ? "invert" : ""}`}
                           style={{
                              backgroundImage: "url(" + node?.icon?.url + ")",
                           }}
                           onClick={() => {
                              setTreeNode(i + 1);
                              setSkillLevel(1);
                           }}
                        ></div>
                     </>
                  );
               })}
            </div>
         </div>
         <div className="text-center">
            {treeNode > 0 ? (
               <div className="bg-2 -mt-2 inline-block w-full rounded-b-md p-3">
                  {/* Node Name */}
                  <div className="text-lg font-bold underline">
                     {activeNode.name}
                  </div>

                  {/* Level Slider and Materials IF Skill Has Levels greater than 1*/}
                  {activeNode.affected_skill[0]?.description_per_level?.length >
                  1 ? (
                     <>
                        {/* Slider */}
                        <div className="my-2 flex items-center gap-2 px-10">
                           <div className="mr-2 inline-flex align-middle">
                              Lv {skillLevel}
                           </div>
                           <input
                              className="h-1 flex-grow appearance-none justify-end
                              rounded bg-zinc-200 align-middle accent-yellow-500 outline-none dark:bg-zinc-700"
                              type="range"
                              min="1"
                              max={
                                 activeNode.affected_skill[0]
                                    ?.description_per_level?.length
                              }
                              value={skillLevel}
                              onChange={(event) =>
                                 setSkillLevel(parseInt(event.target.value))
                              }
                           ></input>
                        </div>
                     </>
                  ) : null}

                  {/* Node Description */}
                  <div
                     className="pt-2 text-sm"
                     dangerouslySetInnerHTML={{
                        __html:
                           activeNode.description +
                           (activeNode.affected_skill?.[0]
                              ?.description_per_level?.[skillLevel - 1]
                              ?.description ?? ""),
                     }}
                  ></div>

                  {activeNode.level_up_cost?.length > 0 ? (
                     <>
                        {/* Material Upgrade List if applicable */}
                        <div className="space-x-2 p-3">
                           {activeNode.level_up_cost[
                              skillLevel - 1
                           ]?.material_qty?.map((matqty: any) => {
                              return <ItemQtyFrame mat={matqty} />;
                           })}
                        </div>
                     </>
                  ) : null}

                  <div className="p-3 text-sm">
                     {activeNode.req_ascension ? (
                        <div>Req Asc. {activeNode.req_ascension}</div>
                     ) : null}

                     {activeNode.req_level ? (
                        <div>Req Lv. {activeNode.req_level}</div>
                     ) : null}
                  </div>
               </div>
            ) : null}
         </div>
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
const ItemQtyFrame = ({ mat }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative inline-block text-center" key={mat?.id}>
         <a href={`/starrail/collections/materials/${mat.materials?.id}/c`}>
            <div className="relative mr-0.5 mt-0.5 inline-block h-11 w-11 align-middle text-xs">
               <img
                  src={mat.materials?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     mat.materials?.rarity?.display_number ?? "1"
                  } material-frame`}
                  alt={mat.materials?.name}
               />
            </div>
            <div className="relative mr-0.5 w-11 border-b border-gray-700 bg-black align-middle text-xs text-white">
               {mat?.qty}
            </div>
         </a>
      </div>
   );
};
