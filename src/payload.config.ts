import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";

import { Games } from "./collections/Games.js";
import { Groups } from "./collections/Groups.js";
import { MediaAssets } from "./collections/MediaAssets.js";
import { MediaCards } from "./collections/MediaCards.js";
import { RuntimeGameMetrics } from "./collections/RuntimeGameMetrics.js";
import { RuntimeGroupMetrics } from "./collections/RuntimeGroupMetrics.js";
import { RuntimeRefreshRuns } from "./collections/RuntimeRefreshRuns.js";
import { SocialProfiles } from "./collections/SocialProfiles.js";
import { Users } from "./collections/Users.js";
import { PublicSite } from "./globals/PublicSite.js";
import { SiteSettings } from "./globals/SiteSettings.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.resolve(dirname, "..", ".env") });

const csrfOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const r2Enabled = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_PUBLIC_URL &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_ENDPOINT
);

export default buildConfig({
  secret: (() => {
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error("PAYLOAD_SECRET environment variable is required");
    }
    return process.env.PAYLOAD_SECRET;
  })(),
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  csrf: csrfOrigins,
  admin: {
    user: "users",
  },
  collections: [
    Users,
    Games,
    Groups,
    MediaCards,
    SocialProfiles,
    MediaAssets,
    RuntimeGameMetrics,
    RuntimeGroupMetrics,
    RuntimeRefreshRuns,
  ],
  globals: [SiteSettings, PublicSite],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: process.env.NODE_ENV !== "production",
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      collections: {
        "media-assets": {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${process.env.R2_PUBLIC_URL}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        region: "auto",
      },
    }),
  ],
});
