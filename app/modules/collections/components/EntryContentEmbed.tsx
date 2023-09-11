import { lazily } from "react-lazily";

import { H2 } from "~/components/H2.tsx";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/modules/auth";
import { initialValue } from "~/routes/_editor+/core/utils.ts";

// we'll lazy load the editor and viewer to make sure they get tree-shaken when not used
const { ManaEditor } = lazily(() => import("~/routes/_editor+/editor.tsx"));
const { EntryViewer } = lazily(() => import("./EntryViewer.tsx"));

export const EntryContentEmbed = ({
   title,
   fetcher,
   defaultValue,
   siteId,
   collectionEntity,
   entryId,
   sectionId,
}: {
   title: string;
   fetcher: any;
   defaultValue: any;
   siteId: any;
   collectionEntity?: string;
   entryId?: string;
   sectionId?: string;
}) => {
   //Filter out content based on sectionId
   const content =
      defaultValue &&
      defaultValue.find((item: any) => item.sectionId === sectionId)?.content;
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   return (
      <div className="mx-auto max-w-[728px]">
         {hasAccess ? (
            <>
               <H2 text={title} />
               <ManaEditor
                  intent="customCollectionEmbed"
                  sectionId={sectionId}
                  siteId={siteId}
                  fetcher={fetcher}
                  collectionEntity={collectionEntity}
                  pageId={entryId}
                  defaultValue={content ?? initialValue()}
               />
            </>
         ) : (
            <>
               {content && (
                  <>
                     <H2 text={title} />
                     <EntryViewer content={content} />
                  </>
               )}
            </>
         )}
      </div>
   );
};
