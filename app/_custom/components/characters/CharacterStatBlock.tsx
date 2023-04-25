import { Disclosure, Popover, Tab } from "@headlessui/react";
import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Image } from "~/components";
import { BarChart2, Binary, ChevronDown } from "lucide-react";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

export const CharacterStatBlock = ({ pageData }) => {
   // Usestate Variable Settings
   const [levelSliderValue, setLevelSliderValue] = useState(80);
   const [levelAscensionCheck, setLevelAscensionCheck] = useState(true);
   const [graphStat, setGraphStat] = useState("HP");

   const bgurl = pageData.image_full_bg?.url;
   const fronturl = pageData.image_full_front?.url;
   const mainurl = pageData.image_full?.url;
   const elemurl = pageData.element?.icon?.url;
   const pathurl = pageData.path?.icon?.url;
   const pathsmall = pageData.path?.icon_small?.url;
   const rarityurl = pageData.rarity?.icon?.url;
   const pathname = pageData.path?.name;

   var statlist = [
      "HP",
      "ATK",
      "DEF",
      "Speed",
      "CritRate",
      "CritDMG",
      "BaseAggro",
   ];
   // =====================================
   // PREPROCESSING STEPS
   // Create an object that can be iterated through to generate data rows of stat data
   let statobj = [];
   for (let i = 0; i < statlist.length; i++) {
      statobj[i] = {};
      statobj[i].stat = statlist[i];

      // Pull Stat's Icon image hash
      // var currstat = statData.statTypes.find((a) => a.name == statlist[i]);
      // if (currstat?.icon) {
      //   statobj[i].hash = currstat.icon?.hash ?? "no_image_42df124128";
      // }

      // Alternate coloring every other stat.
      statobj[i].colormod = i % 2;
   }

   // =====================================
   // End Preprocessing for Stat Block, Output HTML Start
   // =====================================

   return (
      <>
         <div className="grid gap-3 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <section className="bg-2 shadow-1 border-color relative w-full overflow-hidden rounded-md border text-center shadow-sm">
               {/* Element Symbol */}
               <div
                  className="absolute left-3 top-3 z-10 h-10 w-10
                   rounded-full "
               >
                  <Image
                     options="width=100,height=100"
                     alt="Element"
                     url={elemurl}
                     className="object-contain"
                  />
               </div>

               {/* Path + Path Name ? */}
               <div
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center 
                  rounded-full bg-zinc-400 dark:bg-slate-800"
               >
                  <div className="h-6 w-6">
                     <Image
                        options="width=100,height=100"
                        alt="Element"
                        url={pathsmall}
                     />
                  </div>
               </div>

               {/* Rarity */}
               <div className="absolute bottom-4 left-4 z-20 flex h-8 items-center rounded-full bg-zinc-300 px-2 py-1 dark:bg-bg1Dark">
                  <Image options="height=100" alt="Rarity" url={rarityurl} />
               </div>
               <div className="relative h-96">
                  {/* Background Image */}
                  {bgurl ? (
                     <div className="absolute left-0 top-0 flex h-96 w-full items-center">
                        <Image
                           className="h-84 mx-auto object-contain"
                           options="height=800"
                           alt="Background Image"
                           url={bgurl}
                        />
                     </div>
                  ) : null}

                  {/* Main Image */}
                  {mainurl ? (
                     <div className="absolute left-0 top-0 flex h-96 w-full items-center">
                        <Image
                           className="h-84 mx-auto object-contain"
                           options="height=800"
                           alt="Background Image - Main"
                           url={mainurl}
                        />
                     </div>
                  ) : null}

                  {/* Front Image */}
                  {fronturl ? (
                     <div className="absolute left-0 top-0 flex h-96 w-full items-center">
                        <Image
                           className="h-84 mx-auto object-contain"
                           options="height=800"
                           alt="Background Image - Front"
                           url={fronturl}
                        />
                     </div>
                  ) : null}
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Character Stat Block Section */}
            {/* ======================== */}
            <section>
               <div className="bg-2 shadow-1 border-color mb-3 flex items-center gap-3 rounded-md border p-3 shadow-sm">
                  <div className="h-10 w-10 flex-none rounded-full bg-bg4Dark">
                     <Image
                        className="relative inline-block object-contain"
                        options="height=100"
                        alt="Character Stat"
                        url={pathurl}
                     />
                  </div>
                  <div className="font-bold">{pathname}</div>
               </div>

               <div className="divide-color shadow-1 border-color divide-y overflow-hidden rounded-md border shadow-sm">
                  {statobj.map((stat: any, index) => {
                     return (
                        <div
                           className={`${
                              stat.colormod
                                 ? "bg-2 relative block"
                                 : "bg-1 relative block"
                           } flex items-center px-2 py-2.5`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {stat.hash ? (
                                    <div
                                       className="relative inline-flex h-6 w-6 items-center 
                                        justify-center rounded-full align-middle"
                                    >
                                       <Image
                                          alt="Character Stat"
                                          url={
                                             stat.hash ?? "no_image_42df124128"
                                          }
                                          className="h-full w-full object-contain"
                                       />
                                    </div>
                                 ) : null}
                              </div>
                              <div className="text-1 font-bold">
                                 {stat.stat}
                              </div>
                           </div>
                           {/* 2biii) Stat value */}
                           <div className="">
                              {pageData?.stats.find((a) => a.label == stat.stat)
                                 ? formatStat(
                                      stat.stat,
                                      pageData?.stats.find(
                                         (a) => a.label == stat.stat
                                      ).data[
                                         pageData?.stats
                                            .find((a) => a.label == "Lv")
                                            .data.indexOf(
                                               "" +
                                                  levelSliderValue.toString() +
                                                  (levelAscensionCheck &&
                                                  [
                                                     "20",
                                                     "40",
                                                     "60",
                                                     "70",
                                                  ].indexOf(
                                                     levelSliderValue.toString()
                                                  ) > -1
                                                     ? "A"
                                                     : "")
                                            )
                                      ]
                                   )
                                 : ""}
                           </div>

                           {/* 2bii.a) Show bonus icon if stat is Secondary Stat ? */}
                           {/* 
                    {stat.bonus ? (
                      <div className="inline-flex absolute items-center align-middle justify-center rounded-full h-4 w-4 mt-1 right-2/3 bg-gray-400 text-center">
                        <img
                          src="https://res.cloudinary.com/genshinimpact-nalu/image/upload/v1631645303/UI_Icon_Arrow_Point_1a06775238.png"
                          height="15"
                          width="15"
                        ></img>
                      </div>
                    ) : null}
                     */}
                        </div>
                     );
                  })}
               </div>
            </section>
         </div>
         {/* ======================== */}
         {/* Stats Slider and additional top info block */}
         {/* ======================== */}
         {/* 2a) Header for Adjusting Level and Slider */}
         {/* ======================== */}
         <div className="bg-2 shadow-1 border-color my-3 rounded-lg border px-6 py-3 font-bold shadow-sm">
            <div className="flex w-full items-center justify-between text-center">
               <div className="flex items-center gap-1">
                  {/* Level Label */}
                  <div className="inline-flex justify-between pr-0.5 align-middle">
                     Lvl
                  </div>
                  {/* Level Input Box */}
                  <input
                     className="scale-20 level-input-box border-color bg-1 ml-1 mr-2 inline-flex
                     w-9 justify-center rounded-lg border px-0 py-1 text-center align-middle"
                     type="number"
                     value={levelSliderValue}
                     onChange={(event) => {
                        const numonly = /^[0-9\b]+$/;
                        const maxval = 80;

                        // Only set the level slider value if the entered value is not blank or a Number. Parseint as well so leading 0s are removed.
                        if (numonly.test(event.target.value)) {
                           var input = parseInt(event.target.value);
                           if (input > maxval) {
                              input = maxval;
                           } else if (input < 1) {
                              input = 1;
                           }
                           setLevelSliderValue(input);
                        }
                     }}
                  ></input>
                  {/* Asc Label */}
                  <div className="inline-flex justify-between pr-2 align-middle text-sm">
                     Asc
                  </div>
                  {/* Ascension Checkbox */}
                  <input
                     className="mr-2 inline-flex h-7 w-7 flex-shrink-0 items-center justify-between align-middle focus-within:border-blue-100"
                     type="checkbox"
                     disabled={
                        // [20, 40, 60, 70, 80, 90].indexOf(levelSliderValue) < -1
                        ["20", "40", "60", "70"].indexOf(
                           levelSliderValue.toString()
                        ) > -1
                           ? null
                           : true
                     }
                     checked={levelAscensionCheck}
                     onChange={(event) =>
                        setLevelAscensionCheck(event.target.checked)
                     }
                  ></input>
               </div>
               {/* Slider */}
               <input
                  className="slider-thumb h-1 w-full flex-grow appearance-none justify-end
                   rounded bg-zinc-200 align-middle accent-yellow-500 outline-none dark:bg-zinc-700"
                  type="range"
                  min="1"
                  max="80"
                  value={levelSliderValue}
                  onChange={(event) =>
                     setLevelSliderValue(parseInt(event.target.value))
                  }
               ></input>
            </div>
         </div>

         {/* 2c0) Material Summary - Just shows the Talent Mat(s) [Book + Boss mat(s)] and Ascension Mat(s) [Crystal + Ingredient + Monster Drop] */}
         {/* <MaterialSummaryTop charData={charData} talentData={talentData} /> */}

         {/* 2ci) Character Stat Graph */}
         {/* - Should include a drop down stat selector, shading between pre-post ascension breakpoints */}
         <StatGraph
            charData={pageData}
            graphStat={graphStat}
            setGraphStat={setGraphStat}
         />

         {/* 2d) Collapsible? Tab for Full Stats - We do want to hide this because we wanna make it more work for people to find this? 
        UPDATE: Hidden for now due to slider. CSV version still available for full stat table. */}
         {/* <Stats charData={charData} /> */}
         <CSVStats charData={pageData} />

         {/* 2e) Collapsible Tab for link to Detailed BinOutput (JSON describing detailed parameters for character skills and attacks) */}
         {/* <BinOutputLink charData={charData} /> */}
      </>
   );
};

// =====================================
// 2ci) Character Stat Graph
// =====================================
const StatGraph = ({ charData, graphStat, setGraphStat }) => {
   var data = charData;
   var statlist = [
      "HP",
      "ATK",
      "DEF",
      "Speed",
      "CritRate",
      "CritDMG",
      "BaseAggro",
   ];

   var tooltipsuffix = "";

   // Processing Graph Data for display

   const rawdata = data.stats.find((a) => a.label == graphStat).data;
   var processdata = [];
   for (var j = 0; j < rawdata.length; j++) {
      processdata[j] = formatStat(graphStat, rawdata[j]);
      // If a % exists in the output, remove it but set up the tooltipsuffix so a % displays.
      if (processdata[j].indexOf("%") > -1) {
         processdata[j] = processdata[j].replace("%", "");
         tooltipsuffix = "%";
      }
   }

   // Graph configuration start!
   // ==========================
   const showlabels = [
      "1",
      "10",
      "20",
      "30",
      "40",
      "50",
      "60",
      "70",
      "80",
      "90",
   ];
   const labels = data.stats.find((a) => a.label == "Lv").data;

   const options = {
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         // title: {
         //   display: true,
         //   text: "Chart.js Line Chart",
         // },
         tooltip: {
            callbacks: {
               label: function (context) {
                  return context.parsed.y + tooltipsuffix;
               },
            },
         },
      },

      scales: {
         y: {
            grid: {
               color: "rgba(150,150,150,0.5)",
            },
            ticks: {
               // Show % tooltip suffix in Y axis if applicable to the stat
               callback: function (value, index, values) {
                  return value + tooltipsuffix;
               },
            },
         },
         x: {
            grid: {
               tickLength: 2,
               // Only show vertical grid where a showlabel value is
               color: function (context) {
                  if (context.tick.label != "") {
                     return "rgba(150,150,150,0.5)";
                  } else {
                     return "rgba(0,0,0,0)"; //transparent
                  }
               },
            },
            ticks: {
               autoSkip: false,
               // For a category axis, only show label if the value matches the "showlabels" array
               callback: function (val, index) {
                  // Hide every non-10th tick label
                  return showlabels.indexOf(this.getLabelForValue(val)) > -1
                     ? this.getLabelForValue(val)
                     : "";
               },
            },
         },
      },
   };

   // END of Graph Configuration

   const graphdata = {
      labels,
      datasets: [
         {
            //label: graphStat,
            data: processdata,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
         },
      ],
   };

   if (data.stats != undefined && data.stats.length != 0) {
      return (
         <>
            <div className="my-1">
               <Disclosure>
                  {({ open }) => (
                     <>
                        <Disclosure.Button
                           className="border-color bg-2 shadow-1 mb-2 flex w-full items-center
                           gap-3 rounded-lg border px-4 py-3 font-bold shadow-sm"
                        >
                           <BarChart2 size={20} className="text-yellow-500" />
                           Stat Graph
                           <div
                              className={`${
                                 open ? "font-bol rotate-180 transform" : ""
                              } ml-auto inline-block `}
                           >
                              <ChevronDown size={28} />
                           </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-5">
                           <div className="bg-2 border-color rounded-md border px-4 py-3 text-center text-sm">
                              <div className="inline-block px-2 font-bold">
                                 Display Stat:{" "}
                              </div>
                              {/* Stat Select Drop Down */}
                              <select
                                 className="bg-1 border-color inline-block rounded-lg border"
                                 name="stats"
                                 value={graphStat}
                                 onChange={(event) =>
                                    setGraphStat(event.target.value)
                                 }
                              >
                                 {statlist.map((stat: any) => {
                                    return (
                                       <>
                                          <option value={stat}>{stat}</option>
                                       </>
                                    );
                                 })}
                              </select>
                              <Line
                                 options={options}
                                 data={graphdata}
                                 height={"auto"}
                              />
                           </div>
                        </Disclosure.Panel>
                     </>
                  )}
               </Disclosure>
            </div>
         </>
      );
   } else {
      return <></>;
   }
};

// =====================================
// Collapsible CSV Stat Text box
// =====================================
const CSVStats = ({ charData }) => {
   const data = charData;
   if (data.stats != undefined && data.stats.length != 0) {
      return (
         <>
            <Disclosure>
               {({ open }) => (
                  <>
                     <Disclosure.Button
                        className="border-color bg-2 shadow-1 mb-2 flex w-full items-center
                        gap-3 rounded-lg border px-4 py-3 font-bold shadow-sm"
                     >
                        <Binary size={20} className="text-yellow-500" />
                        Raw Stats for all Levels
                        <div
                           className={`${
                              open ? "font-bol rotate-180 transform" : ""
                           } ml-auto inline-block `}
                        >
                           <ChevronDown size={28} />
                        </div>
                     </Disclosure.Button>
                     <Disclosure.Panel className="">
                        <div
                           contentEditable="true"
                           dangerouslySetInnerHTML={{
                              __html: data.stats_csv,
                           }}
                           className="border-color bg-2 h-24 overflow-y-scroll rounded-md border px-4 py-3 font-mono"
                        ></div>
                     </Disclosure.Panel>
                  </>
               )}
            </Disclosure>
         </>
      );
   } else {
      return <></>;
   }
};

// =====================================
// Performs Rounding for Stats as Integers or as Percentages as necessary
// =====================================
function formatStat(type: any, stat: any) {
   // These are stats that should be formatted as an Integer.
   var intlist = ["HP", "ATK", "DEF", "Speed", "BaseAggro"];

   // Apply correct number formatting: Intlist should be rounded, otherwise *100 and display as Percentage of #.0% format
   if (intlist.indexOf(type) > -1) {
      stat = "" + Math.round(stat);
   } else {
      stat = (Math.round(stat * 1000) / 10).toFixed(1) + "%";
   }
   return stat;
}

// =====================================
// For rendering Down Icon
// =====================================
export const CaretDownIcon = (props: any) => (
   <svg
      className={props.class}
      width={props.w}
      height={props.h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path fill="currentColor" d="M20 8H4L12 16L20 8Z"></path>
   </svg>
);
