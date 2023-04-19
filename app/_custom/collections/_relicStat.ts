import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const _RelicStat: CollectionConfig = {
   slug: "_relicStat",
   labels: { singular: "_relicStat", plural: "_relicStats" },
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
         name: "data_key",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "group_id",
         type: "text",
      },
      {
         name: "type",
         type: "text",
      },
      {
         name: "affix_id",
         type: "text",
      },
      {
         name: "stattype",
         type: "relationship",
         relationTo: "_statType",
         hasMany: false,
      },
      {
         name: "base_val",
         type: "number",
      },
      {
         name: "level_add",
         type: "number",
      },
      {
         name: "stats",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
