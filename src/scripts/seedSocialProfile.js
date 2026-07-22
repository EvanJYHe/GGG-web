import { getPayloadClient } from "../lib/payload/client.js";

const profile = {
  id: "x",
  platform: "X",
  href: "https://x.com/GlazingGorillas",
};

const payload = await getPayloadClient();

const existing = await payload.find({
  collection: "social-profiles",
  depth: 0,
  limit: 1,
  where: { id: { equals: profile.id } },
});

if (existing.totalDocs) {
  const existingProfile = existing.docs[0];
  const needsUpdate =
    existingProfile.platform !== profile.platform || existingProfile.href !== profile.href;

  if (needsUpdate) {
    await payload.update({
      collection: "social-profiles",
      context: { trustedImport: true },
      data: {
        platform: profile.platform,
        href: profile.href,
      },
      id: existingProfile.id,
      overrideAccess: true,
    });
    console.log(`Updated social profile "${profile.id}" in CMS.`);
  } else {
    console.log(`Social profile "${profile.id}" already exists in CMS.`);
  }
  process.exit(0);
}

const allProfiles = await payload.find({
  collection: "social-profiles",
  depth: 0,
  limit: 100,
  overrideAccess: true,
});

const maxDisplayOrder = allProfiles.docs.reduce(
  (acc, item) => Math.max(acc, Number.isFinite(item.displayOrder) ? item.displayOrder : 0),
  -1
);

await payload.create({
  collection: "social-profiles",
  context: { trustedImport: true },
  data: {
    ...profile,
    displayOrder: maxDisplayOrder + 1,
  },
  overrideAccess: true,
});

console.log(`Created social profile "${profile.id}" in CMS.`);

process.exit(0);
