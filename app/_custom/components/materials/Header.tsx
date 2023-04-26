import { Image } from "~/components";

export const Header = ({ pageData }: any) => {
   const iconurl = pageData?.icon?.url;
   const rarityurl = pageData?.rarity?.icon?.url;

   const statobj = [
      { stat: "Rarity", value: pageData?.rarity?.display_number },
      { stat: "Max Limit", value: pageData?.max_limit },
   ];

   return (
      <>
         <div className="grid gap-4 laptop:grid-cols-2">
            {/* ======================== */}
            {/* 1) Character Image div */}
            {/* ======================== */}
            <section>
               <div
                  className="bg-2 border-color shadow-1 relative w-full
                rounded-lg border text-center shadow-sm"
               >
                  {/* Rarity */}
                  <div className="absolute bottom-4 left-4 z-20 flex h-8 items-center rounded-full bg-zinc-300 px-2 py-1 dark:bg-bg1Dark">
                     <Image options="height=100" alt="Rarity" url={rarityurl} />
                  </div>

                  <div className="relative inline-block h-96 w-full text-center">
                     {/* Main Image */}
                     {iconurl ? (
                        <Image
                           alt="Materials Icon"
                           url={iconurl}
                           className="absolute h-96 w-full object-contain"
                        />
                     ) : null}
                  </div>
               </div>
            </section>

            {/* ======================== */}
            {/* 2) Info Block Section */}
            {/* ======================== */}
            <section>
               {/* <div className="flex rounded-md border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 mb-3 p-3">
                  <div className="flex flex-grow items-center space-x-2">
                     <div className="relative bg-gray-800 rounded-full h-10 w-20">
                        <img
                           className="relative inline-block object-contain"
                           src={rarityurl}
                        />
                     </div>
                  </div>
                  <div className="flex flex-grow items-center space-x-2">
                     Rarity
                  </div>
               </div> */}

               <div className="divide-color border-color shadow-1 mb-4 divide-y overflow-hidden rounded-md border shadow-sm">
                  {statobj.map((stat: any, index) => {
                     return (
                        /*2b) Alternating background stats for 5 or 6 stats depending on bonus stat */
                        <div
                           className={`
                      ${
                         index % 2 == 1
                            ? "bg-1 relative block"
                            : "bg-2 relative block"
                      } flex items-center p-2`}
                           key={index}
                        >
                           {/* 2bi) Stat Icon */}
                           <div className="flex flex-grow items-center space-x-2">
                              <div>
                                 {stat.hash ? (
                                    <div
                                       className="relative inline-flex h-6 w-6 items-center 
                          justify-center rounded-full bg-gray-600 align-middle"
                                    >
                                       <Image
                                          alt="Background"
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
                           <div className="">{stat.value}</div>

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

               <div className="border-color bg-2 shadow-1 my-2 mb-3 rounded-md border p-3 text-sm shadow-sm">
                  {pageData?.description}
                  {pageData?.bg_description ? (
                     <>
                        <div
                           dangerouslySetInnerHTML={{
                              __html: pageData?.bg_description,
                           }}
                        ></div>
                     </>
                  ) : null}
               </div>
            </section>
         </div>
      </>
   );
};
