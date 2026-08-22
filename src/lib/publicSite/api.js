function createPublicSiteEtag(contract, scope) {
  const generatedAt = contract.meta.generatedAt || "no-runtime-data";
  const metricsKey = [
    contract.metrics.totalPlaying,
    contract.metrics.totalVisits,
    contract.metrics.totalMembers,
  ].join("-");

  return `"${scope}-${generatedAt}-${contract.catalog.games.length}-${contract.catalog.groups.length}-${metricsKey}"`;
}

function matchesEtag(ifNoneMatch, etag) {
  const comparableEtag = etag.replace(/^W\//, "");
  return ifNoneMatch
    ?.split(",")
    .some((candidate) => candidate.trim() === "*" || candidate.trim().replace(/^W\//, "") === comparableEtag);
}

export function createPublicJsonResponse(contract, scope, request, payload = contract) {
  const etag = createPublicSiteEtag(contract, scope);
  const headers = new Headers({
    "Cache-Control": "public, max-age=300, must-revalidate",
    ETag: etag,
    "X-Data-Freshness":
      contract.meta.cacheAgeMs == null ? "unavailable" : `${Math.floor(contract.meta.cacheAgeMs / 1000)}s`,
  });

  if (contract.meta.generatedAt) {
    headers.set("Last-Modified", new Date(contract.meta.generatedAt).toUTCString());
  }

  if (matchesEtag(request?.headers.get("If-None-Match"), etag)) {
    return new Response(null, { status: 304, headers });
  }

  return Response.json(payload, { headers });
}
