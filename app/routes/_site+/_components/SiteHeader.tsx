import { Fragment, useState } from "react";

import {
   Menu,
   MenuButton,
   MenuItem,
   MenuItems,
   Transition,
} from "@headlessui/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { DotLoader } from "~/components/DotLoader";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { LogoBW } from "~/components/Logo";
import { useSearchToggleState } from "~/root";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { FollowingSite } from "~/routes/_auth+/components/FollowingSite";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { NotFollowingSite } from "~/routes/_auth+/components/NotFollowingSite";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding } from "~/utils/form";

import { MenuTrayContent, MobileTray } from "./MobileTray";
import SearchComboBox from "../action+/search";

export function SiteHeader({
   setPrimaryMenuOpen,
   isPrimaryMenu,
}: {
   setPrimaryMenuOpen: (open: boolean) => void;
   isPrimaryMenu: boolean;
}) {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};

   const fetcher = useFetcher({ key: "site" });

   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);

   const [searchToggle, setSearchToggle] = useSearchToggleState();

   return (
      <section
         className="z-30 w-full laptop:z-50 fixed max-laptop:top-[56px] shadow-sm dark:shadow-zinc-900/30
        laptop:sticky laptop:top-0 dark:bg-dark350 bg-white border-color border-b"
      >
         <div
            className="pattern-dots absolute left-0
            top-0 -z-0 h-full
              w-full pattern-bg-white pattern-zinc-500 pattern-opacity-10 
              pattern-size-1 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
         />
         <div className="relative mx-auto w-full laptop:max-w-[732px] laptop:rounded-b-2xl">
            <div className="relative mx-auto flex h-[60px] items-center justify-between">
               {searchToggle ? (
                  <SearchComboBox siteType={site.type} />
               ) : (
                  <>
                     <div className="flex items-center truncate max-laptop:pl-3">
                        <Link
                           prefetch="intent"
                           to="/"
                           className="flex items-center group h-14 truncate"
                        >
                           <div
                              className="dark:bg-dark450 border dark:border-zinc-600 shadow-1 bg-zinc-50 overflow-hidden flex-none
                              text-1 flex h-10 w-10 items-center justify-center dark:group-hover:border-zinc-600 border-zinc-300/60
                              rounded-full shadow-sm transition duration-300 active:translate-y-0.5 group-hover:border-zinc-300"
                           >
                              {site?.icon?.url ? (
                                 <Image
                                    width={40}
                                    height={40}
                                    //@ts-ignore
                                    url={site.icon?.url}
                                    options="aspect_ratio=1:1&height=120&width=120"
                                    alt="Site Logo"
                                 />
                              ) : (
                                 <>
                                    <LogoBW className="size-5 text-zinc-400" />
                                 </>
                              )}
                           </div>
                           <div className="truncate pl-3 text-sm">
                              <div className="font-bold truncate group-hover:underline decoration-zinc-300 underline-offset-2 dark:decoration-zinc-600">
                                 {site.name}
                              </div>
                              {site?.followers && (
                                 <div className="text-[10px] flex items-center gap-1">
                                    <Icon
                                       name="users-2"
                                       className="text-1 size-3"
                                    />
                                    <span className="dark:text-zinc-500 text-zinc-400">
                                       {site?.followers}
                                    </span>
                                 </div>
                              )}
                           </div>
                        </Link>
                     </div>
                     <div className="flex items-center gap-3 pl-2 max-laptop:pr-3">
                        <FollowingSite>
                           <Menu as="div" className="relative">
                              {({ open }) => (
                                 <>
                                    <MenuButton
                                       className="text-1 hover:bg-3 flex h-9 w-9 
                                items-center justify-center rounded-full transition duration-300 active:translate-y-0.5"
                                    >
                                       {open ? (
                                          <Icon
                                             name="x"
                                             className={`${
                                                open &&
                                                "tet-zinc-400 dark:text-zinc-500"
                                             } transition duration-150 ease-in-out w-5 h-5`}
                                          />
                                       ) : (
                                          <>
                                             <Icon
                                                name="settings-2"
                                                className="transition duration-150 ease-in-out w-5 h-5"
                                             />
                                          </>
                                       )}
                                    </MenuButton>
                                    <Transition
                                       as={Fragment}
                                       enter="transition ease-out duration-100"
                                       enterFrom="transform opacity-0 scale-95"
                                       enterTo="transform opacity-100 scale-100"
                                       leave="transition ease-in duration-75"
                                       leaveFrom="transform opacity-100 scale-100"
                                       leaveTo="transform opacity-0 scale-95"
                                    >
                                       <MenuItems
                                          className="absolute -right-1 z-30 mt-1.5 w-full min-w-[140px]
                                 max-w-md origin-top-right transform transition-all"
                                       >
                                          <div
                                             className="border-color-sub bg-3-sub shadow-1 rounded-lg border
                                            p-1 shadow-md dark:shadow-zinc-800/80 space-y-0.5"
                                          >
                                             <AdminOrStaffOrOwner>
                                                <MenuItem>
                                                   <Link
                                                      to="/settings/site"
                                                      className="text-1 text-xs text-left flex w-full items-center gap-3 rounded-lg
                                               p-2 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                   >
                                                      <div className="flex-grow">
                                                         Settings
                                                      </div>
                                                      <Icon
                                                         size={14}
                                                         name="settings"
                                                         className="text-zinc-400 w-4.5 h-4.5"
                                                      />
                                                   </Link>
                                                </MenuItem>
                                             </AdminOrStaffOrOwner>
                                             <MenuItem>
                                                <button
                                                   onClick={() => {
                                                      fetcher.submit(
                                                         { intent: "unfollow" },
                                                         {
                                                            method: "post",
                                                            action:
                                                               "/action/follow",
                                                         },
                                                      );
                                                   }}
                                                   type="submit"
                                                   className="text-1 text-xs text-left flex w-full items-center gap-3 rounded-lg
                                               p-2 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                >
                                                   <div className="flex-grow">
                                                      {t(
                                                         "follow.actionUnfollow",
                                                      )}
                                                   </div>
                                                   <Icon
                                                      size={14}
                                                      name="log-out"
                                                      className="text-zinc-400 w-4.5 h-4.5"
                                                   />
                                                </button>
                                             </MenuItem>
                                          </div>
                                       </MenuItems>
                                    </Transition>
                                 </>
                              )}
                           </Menu>
                        </FollowingSite>
                        <LoggedOut>
                           <div className="flex items-center">
                              <Link
                                 prefetch="intent"
                                 reloadDocument={true}
                                 to={`/login?redirectTo=/`}
                                 className="flex h-9 items-center justify-center rounded-full bg-zinc-700 px-3.5
                        text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden"
                              >
                                 Follow
                              </Link>
                           </div>
                        </LoggedOut>
                        <NotFollowingSite>
                           <div className="flex items-center">
                              <button
                                 onClick={() => {
                                    fetcher.submit(
                                       { intent: "followSite" },
                                       {
                                          method: "post",
                                          action: "/action/follow",
                                       },
                                    );
                                 }}
                                 className="flex h-9 items-center justify-center rounded-full bg-black shadow dark:shadow-zinc-950
                                 w-[72px] text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden shadow-zinc-400"
                              >
                                 {adding ? (
                                    <DotLoader />
                                 ) : (
                                    t("follow.actionFollow")
                                 )}
                              </button>
                           </div>
                        </NotFollowingSite>
                        <button
                           className="dark:bg-zinc-700 dark:border-zinc-600 shadow-1 flex h-10 w-10 items-center justify-center
                            rounded-full border-2 shadow-sm bg-white hover:bg-zinc-50 dark:hover:bg-zinc-600"
                           aria-label="Search"
                           onClick={() => {
                              setSearchToggle(true);
                           }}
                        >
                           <Icon name="search" title="Search" size={18} />
                        </button>
                        <button
                           className="dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-950/40 bg-white flex h-10 w-10 items-center justify-center rounded-full
                                      border-2 shadow-sm transition duration-300 active:translate-y-0.5 laptop:hidden"
                           aria-label="Menu"
                           onClick={() => setPrimaryMenuOpen(true)}
                        >
                           <Icon name="menu" className="w-5 h-5" />
                        </button>
                        <MobileTray
                           direction="left"
                           onOpenChange={setPrimaryMenuOpen}
                           open={isPrimaryMenu}
                        >
                           <MenuTrayContent
                              onOpenChange={setPrimaryMenuOpen}
                              site={site}
                           />
                        </MobileTray>
                     </div>
                  </>
               )}
            </div>
         </div>
      </section>
   );
}
