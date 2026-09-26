// Export / Download text documents for FreshFind (Markets, Produce, All Bookmarks)

export function generateMarketDetailsDoc(market, note = "", userDistance = null) {
  const days = market.daysList ? market.daysList.join(", ") : market.days;
  const categories = market.categoryList ? market.categoryList.join(" · ") : market.categories;
  const produceList = (market.produce || []).join(", ");
  const distanceStr =
    userDistance != null ? `${userDistance.toFixed(1)} km from your current GPS location` : "Not computed";

  const separator = "=".repeat(60);
  const subSeparator = "-".repeat(60);

  return [
    separator,
    "               FRESHFIND \u2014 MARKET DETAILS",
    separator,
    `Market Name      : ${market.name}`,
    `Location         : ${market.location}`,
    `Exact Address    : ${market.address || market.location + ", Karachi, Sindh"}`,
    `Operating Days   : ${days}`,
    `Hours            : ${market.hours}`,
    `Market Type      : ${market.type || "Outdoor"} Market`,
    `Organic Option   : ${market.organic ? "Yes \u2014 Organic stalls available" : "Standard local produce"}`,
    `Rating           : ${market.rating ? market.rating.toFixed(1) : "4.5"} / 5.0`,
    `Approx. Distance : ${distanceStr}`,
    subSeparator,
    "CONTACT & LOCATION INFORMATION",
    subSeparator,
    `Phone            : ${market.phone || "+92 (21) 111-FRESH (Demo)"}`,
    `Email            : ${market.email || "market@freshfind.example (Demo)"}`,
    `Website          : ${market.website || "https://freshfind.example (Demo)"}`,
    `Social Media     : FB: ${market.social?.facebook || "FreshFindDemo"} | IG: ${market.social?.instagram || "@freshfind_demo"}`,
    subSeparator,
    "PRODUCE & OFFERINGS",
    subSeparator,
    `Categories       : ${categories}`,
    `Typically Sold   : ${produceList || "Seasonal farm produce"}`,
    subSeparator,
    "MARKET DESCRIPTION",
    subSeparator,
    market.description || "Verified local farmers market.",
    subSeparator,
    "YOUR PERSONAL SESSION NOTE",
    subSeparator,
    note ? note : "(No personal note added for this market yet)",
    separator,
    `Exported from FreshFind on: ${new Date().toLocaleString()}`,
    "FreshFind \u2014 Connecting Communities with Local Harvests",
    separator
  ].join("\n");
}

export function generateProduceGuideDoc(product, note = "") {
  const now = new Date().toLocaleString();
  const marketsStr = (product.markets || []).map((m) => "  - " + m).join("\n");
  const separator = "=".repeat(60);

  return [
    separator,
    "FRESHFIND \u2022 PRODUCE GUIDE",
    separator,
    "Produce Item : " + product.name,
    "Category     : " + product.category,
    "Season       : " + product.season,
    "",
    "Description:",
    product.description,
    "",
    "Available at Markets:",
    marketsStr || "  - Contact local vendors for availability",
    "",
    "Personal Note (Session):",
    note || "None attached",
    "",
    "Exported On  : " + now,
    "Website      : FreshFind Seasonal Discovery",
    separator
  ].join("\n");
}

export function generateAllBookmarksDoc(savedMarkets = [], savedProducts = []) {
  const now = new Date().toLocaleString();
  const lines = [
    "=".repeat(60),
    "FRESHFIND",
    "MY BOOKMARKS & PERSONAL NOTES",
    "Exported On: " + now,
    "=".repeat(60),
    ""
  ];

  lines.push("MARKETS");
  lines.push("-".repeat(60));
  if (!savedMarkets.length) {
    lines.push("No markets currently bookmarked.");
    lines.push("");
  } else {
    savedMarkets.forEach((m, idx) => {
      const days = m.daysList ? m.daysList.join(", ") : m.days;
      const categories = m.categoryList ? m.categoryList.join(", ") : m.categories;
      lines.push(`${idx + 1}. ${m.name}`);
      lines.push(`   Location   : ${m.location}`);
      lines.push(`   Address    : ${m.address || m.location + ", Karachi (Demo)"}`);
      lines.push(`   Days       : ${days}`);
      lines.push(`   Hours      : ${m.hours}`);
      lines.push(`   Categories : ${categories}`);
      lines.push(`   Contact    : Phone: ${m.phone || "N/A"} | Email: ${m.email || "N/A"}`);
      lines.push("");
    });
  }

  lines.push("-".repeat(60));
  lines.push("PRODUCE");
  lines.push("-".repeat(60));
  if (!savedProducts.length) {
    lines.push("No produce items currently bookmarked.");
    lines.push("");
  } else {
    savedProducts.forEach((p, idx) => {
      lines.push(`${idx + 1}. ${p.name}`);
      lines.push(`   Category   : ${p.category}`);
      lines.push(`   Season     : ${p.season}`);
      lines.push(`   Markets    : ${(p.markets || []).join(", ")}`);
      lines.push(`   Description: ${p.description}`);
      lines.push("");
    });
  }

  lines.push("=".repeat(60));
  lines.push("FreshFind \u2014 Making local market discovery simpler.");
  lines.push("=".repeat(60));

  return lines.join("\n");
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
