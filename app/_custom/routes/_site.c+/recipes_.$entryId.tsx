import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Header } from "~/_custom/components/recipes/Header";
import { Ingredients } from "~/_custom/components/recipes/Ingredients";
import { Relics } from "~/_custom/components/recipes/Relics";
import { SpecialMats } from "~/_custom/components/recipes/SpecialMats";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      rest: {
         depth: 3,
      },
   });

   return json({ entry });
}

export default function RecipeEntry() {
   const { entry } = useLoaderData<typeof loader>();
   return (
      <Entry>
         {/* Image */}
         <Header pageData={entry.data} />

         {/* Relic Results */}
         <Relics pageData={entry.data} />

         {/* Ingredients */}
         <Ingredients pageData={entry.data} />

         {/* Special Ingredients */}
         <SpecialMats pageData={entry.data} />
      </Entry>
   );
}
