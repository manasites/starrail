import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Relic: CollectionConfig = {
   slug: "relic",
   labels: { singular: "relic", plural: "relics" },
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
         name: "relic_id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarity",
         hasMany: false,
      },
      {
         name: "max_limit",
         type: "number",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "bg_description",
         type: "text",
      },
      {
         name: "return_item_list",
         type: "array",
         fields: [
            {
               name: "materials",
               type: "relationship",
               relationTo: "materials",
               hasMany: false,
            },
            {
               name: "qty",
               type: "number",
            },
         ],
      },
      {
         name: "relicset_id",
         type: "relationship",
         relationTo: "relicSet",
         hasMany: false,
      },
      {
         name: "relic_type",
         type: "text",
      },
      {
         name: "mainstat_group",
         type: "relationship",
         relationTo: "_relicStat",
         hasMany: true,
      },
      {
         name: "substat_group",
         type: "relationship",
         relationTo: "_relicStat",
         hasMany: true,
      },
      {
         name: "max_level",
         type: "number",
      },
      {
         name: "exp_type",
         type: "number",
      },
      {
         name: "exp_value",
         type: "number",
      },
      {
         name: "coin_cost",
         type: "number",
      },
      {
         name: "r_storycontent",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
