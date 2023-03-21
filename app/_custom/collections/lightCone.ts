import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const LightCone: CollectionConfig = {
   slug: "lightCone-lKJ16E5IhH",
   labels: { singular: "lightCone", plural: "lightCones" },
   admin: { 
         group: "Custom",
         useAsTitle:  "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "entry",
         type: "relationship",
         relationTo: "entries",
         hasMany: false,
         required: true,
         filterOptions: () => {
            return {
               collectionEntity: { equals: "lightCone-lKJ16E5IhH" },
            };
         },
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "lightcone_id",
         type: "text",
      },
      {
         name: "name",
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
         name: "term_rarity",
         type: "relationship",
         relationTo: "termRarity-lKJ16E5IhH",
         hasMany: false,
      },
      {
         name: "term_path",
         type: "relationship",
         relationTo: "termPath-lKJ16E5IhH",
         hasMany: false,
      },
      {
         name: "max_promotion",
         type: "number",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "image_full_name",
         type: "text",
      },
      {
         name: "max_rank",
         type: "number",
      },
      {
         name: "exp_type",
         type: "number",
      },
      {
         name: "exp_provide",
         type: "number",
      },
      {
         name: "coin_cost",
         type: "number",
      },
      {
         name: "skill_data",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "name",
               type: "text",
            },
            {
               name: "desc",
               type: "text",
            },
         ],
      },
      {
         name: "stats",
         type: "array",
         fields: [
            {
               name: "label",
               type: "text",
            },
            {
               name: "data",
               type: "json",
            },
         ],
         admin: {
            components: {
               RowLabel: ({ data, index }: any) => {
                  return data?.label || `Stat ${String(index).padStart(2, '0')}`;
               },
            },
         },
      },
      {
         name: "stats_csv",
         type: "textarea",
      },
      {
         name: "promotion_cost",
         type: "array",
         fields: [
            {
               name: "material_qty",
               type: "array",
               fields: [
                  {
                     name: "materials",
                     type: "relationship",
                     relationTo: "materials-lKJ16E5IhH",
                     hasMany: false,
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ]
            },
         ],
      },
      {
         name: "image_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};