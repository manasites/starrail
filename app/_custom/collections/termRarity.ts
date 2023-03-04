import { isAdmin } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const termRarity: CollectionConfig = {
   slug: "termRarity-lKJ16E5IhH",
   labels: { singular: "termRarity", plural: "termRarities" },
   admin: { 
         group: "Custom",
         useAsTitle:  "display_number",
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
				 collectionEntity: { equals: "termRarity-lKJ16E5IhH" },
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
         name: "data_key",
         type: "text",
      },
      {
         name: "display_number",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
