import type { Achievement } from "payload/generated-custom-types";

export const Header = ({ pageData }: { pageData: Achievement }) => {
   return (
      <>
         <div className="space-y-1 pb-3 pl-1">
            <div className="font-bold">
               Track Achievement Progress using the Checkboxes below!
            </div>
            <div className="text-1 text-sm">
               Requires LocalStorage to be enabled
            </div>
         </div>
      </>
   );
};
