import { isAdmin } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Character: CollectionConfig = {
   slug: "character-lKJ16E5IhH",
   labels: { singular: "Character", plural: "Characters" },
   admin: { 
         group: "Custom",
         useAsTitle:  "name",
   },
   access: {
      create: isAdmin, //udpate in future to allow site admins as well
      read: () => true,
      update: isAdmin, //udpate in future to allow site admins as well
      delete: isAdmin, //udpate in future to allow site admins as well
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
				 collectionEntity: { equals: "character-lKJ16E5IhH" },
			 };
		 },
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "character_id",
         type: "text",
      },
      {
         name: "term_rarity",
         type: "relationship",
         relationTo: "termRarity-lKJ16E5IhH",
         hasMany: false,
      },
      {
         name: "term_element",
         type: "relationship",
         relationTo: "termElement-lKJ16E5IhH",
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
         name: "reward_list",
         type: "array",
		 fields: [
			{
				name: "item",
				type: "relationship",
				relationTo: "materials-lKJ16E5IhH",
				hasMany: false,
			},
			{
				name: "qty",
				type: "number",
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
				RowLabel: ({ data, index }) => {
					return data?.label || `Stat ${String(index).padStart(2, '0')}`;
				},
			 },
		 },
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
