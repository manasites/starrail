import { isAdmin } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const termElement: CollectionConfig = {
   slug: "termElement-lKJ16E5IhH",
   labels: { singular: "termElement", plural: "termElements" },
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
				 collectionEntity: { equals: "termElement-lKJ16E5IhH" },
			 };
		 },
      },
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
         name: "icon_path",
         type: "text",
      },
	  {
         name: "icon_active_path",
         type: "text",
      },
	  {
         name: "icon_color_path",
         type: "text",
      },
	  {
         name: "icon_damage_res_path",
         type: "text",
      },
	  {
         name: "icon_inactive_path",
         type: "text",
      },
	  {
         name: "icon_active",
         type: "upload",
         relationTo: "images",
      },
	  {
         name: "icon_color",
         type: "upload",
         relationTo: "images",
      },
	  {
         name: "icon_damage_res",
         type: "upload",
         relationTo: "images",
      },
	  {
         name: "icon_inactive",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
