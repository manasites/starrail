import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import {
   afterDeleteSearchSyncHook,
   afterChangeSearchSyncHook,
} from "../hooks/search-hooks";

export const RelicSets: CollectionConfig = {
   slug: "relicSets",
   labels: { singular: "Relic Set", plural: "Relic Sets" },
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
   hooks: {
      afterDelete: [afterDeleteSearchSyncHook],
      afterChange: [afterChangeSearchSyncHook],
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "relicset_id",
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
         name: "icon_name",
         type: "text",
      },
      {
         name: "set_effect",
         type: "array",
         fields: [
            {
               name: "req_no",
               type: "number",
            },
            {
               name: "description",
               type: "text",
            },
            {
               name: "property_list",
               type: "array",
               fields: [
                  {
                     name: "stattype",
                     type: "relationship",
                     relationTo: "_statTypes",
                     hasMany: false,
                  },
                  {
                     name: "value",
                     type: "number",
                  },
               ],
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
