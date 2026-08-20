import { adminsOnly, publicRead } from "../lib/payload/access.js";
import { refreshSingleGame } from "../lib/runtime/singleRefresh.js";

/** @type {import("payload").CollectionConfig} */
export const Games = {
  slug: "games",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "universeId", "isFeatured", "displayOrder"],
  },
  access: publicRead,
  fields: [
    {
      name: "universeId",
      type: "number",
      index: true,
      required: true,
      unique: true,
      admin: {
        description: "Roblox universe ID. Everything else (name, stats, thumbnail) is fetched from Roblox automatically.",
      },
    },
    {
      name: "name",
      type: "text",
      admin: {
        readOnly: true,
        description: "Synced from Roblox automatically.",
      },
    },
    {
      name: "displayOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description:
          "Higher values appear first. Leave at 0 for the default ranking (sorted by lifetime visits). Use a positive value to pin a game above the rest.",
      },
    },
    {
      name: "isActive",
      label: "Show on public site",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Uncheck to hide this game everywhere on the public site (catalog, top titles, stats, and the +N more games tile). The record stays in the CMS so it can be re-enabled later.",
      },
    },
    {
      name: "isFeatured",
      label: "Show in primary game list",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Uncheck to keep this active game available in the catalog but move it behind the +N more games tile. It will also be omitted from the home page Top Titles showcase.",
      },
    },
  ],
  hooks: {
    ...adminsOnly,
    afterChange: [
      ({ context, doc, operation, req }) => {
        if (operation !== "create" || !doc?.universeId || context?.skipSingleRefresh) {
          return;
        }

        refreshSingleGame(doc.universeId).catch((error) => {
          req?.payload?.logger?.error?.(
            `Single-game refresh failed for universeId ${doc.universeId}: ${error?.message || error}`
          );
        });
      },
    ],
  },
};
