import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const PlayerIcons: CollectionConfig = {
   slug: "playerIcons",
   labels: { singular: "Player Icon", plural: "Player Icons" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "data_key",
         type: "text",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
