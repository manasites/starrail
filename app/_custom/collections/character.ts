import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Character: CollectionConfig = {
   slug: "character",
   labels: { singular: "Character", plural: "Characters" },
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
         name: "character_id",
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
         name: "element",
         type: "relationship",
         relationTo: "_element",
         hasMany: false,
      },
      {
         name: "path",
         type: "relationship",
         relationTo: "_path",
         hasMany: false,
      },
      {
         name: "sp_need",
         type: "number",
      },
      {
         name: "exp_group",
         type: "number",
      },
      {
         name: "max_promotion",
         type: "number",
      },
      {
         name: "max_rank",
         type: "number",
      },
      {
         name: "eidolons",
         type: "relationship",
         relationTo: "eidolon",
         hasMany: true,
      },
      {
         name: "traces",
         type: "relationship",
         relationTo: "trace",
         hasMany: true,
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "image_round_icon_name",
         type: "text",
      },
      {
         name: "image_action_name",
         type: "text",
      },
      {
         name: "image_battle_detail_name",
         type: "text",
      },
      {
         name: "image_full_name",
         type: "text",
      },
      {
         name: "image_full_bg_name",
         type: "text",
      },
      {
         name: "image_full_front_name",
         type: "text",
      },
      {
         name: "reward_list",
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
         name: "reward_max_list",
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
         name: "stats_csv",
         type: "textarea",
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
                  return (
                     data?.label || `Stat ${String(index).padStart(2, "0")}`
                  );
               },
            },
         },
      },
      {
         name: "promotion_cost",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "max_level",
               type: "number",
            },
            {
               name: "material_qty",
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
         ],
      },
      {
         name: "voice_lines",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "text",
               type: "text",
            },
            {
               name: "voice_en",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "voice_jp",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "voice_cn",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "voice_kr",
               type: "upload",
               relationTo: "images",
            },
         ],
      },
      {
         name: "image_round_icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_action",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_battle_detail",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full_bg",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full_front",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
      {
         name: "checksum_voice_lines",
         type: "text",
      },
   ],
};
