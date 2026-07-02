import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

/* ---------------------------------------------------------------
   OHLQ Wave 6 Brand Tracker — Story + Segment Explorer
   Branding pulled from OHLQ's own deck materials: deep red header
   accent (#CF343E) with charcoal display type on a clean white
   ground, flat cards, no gradients or shadows.
   ------------------------------------------------------------- */

const ACCENT = "#CF343E"; // OHLQ red, pulled from client deck headers
const ACCENT_TINT = "#FBEAEA";
const CHARCOAL = "#333333";
const GRAY_TINT = "#F2F2F2";
const BORDER = "#DDDDDD";
const TEXT = "#262626";
const MUTED = "#6B6B6B";
const FONT = "Arial, Helvetica, 'Segoe UI', sans-serif";

const SEGMENTS = [
  { id: "all", label: "All Shoppers" },
  { id: "we", label: "Whisky Enthusiasts" },
  { id: "ls", label: "Light Spirit Drinkers" },
  { id: "gm", label: "Gin-Lovers Mixologists" },
  { id: "cannabis", label: "Cannabis Purchasers" },
];

/* ---------------------------------------------------------------
   CHART DATA
   ------------------------------------------------------------- */
const INFO_SOURCE_DATA = [
  { name: "Word of Mouth", value: 50, category: "General" },
  { name: "General Liquor/Spirits Sites", value: 39, category: "Industry" },
  { name: "Facebook", value: 38, category: "Social" },
  { name: "Liquor Brand Sites", value: 36, category: "Industry" },
  { name: "Search / Online News", value: 35, category: "Social" },
  { name: "YouTube", value: 34, category: "Social" },
  { name: "In-Store Signage/Displays", value: 30, category: "General" },
  { name: "Store Employees", value: 27, category: "General" },
  { name: "Bartenders/Servers", value: 25, category: "General" },
  { name: "OHLQ.com (Owned)", value: 22, category: "General" },
  { name: "Instagram", value: 21, category: "Social" },
  { name: "Industry Publications", value: 15, category: "Industry" },
  { name: "OHLQ Mobile App (Owned)", value: 13, category: "General" },
  { name: "OHLQ Social Media (Owned)", value: 11, category: "General" },
  { name: "OHLQ Emails (Owned)", value: 11, category: "General" },
].sort((a, b) => b.value - a.value);

const CATEGORY_COLOR = {
  General: CHARCOAL,
  Social: ACCENT,
  Industry: "#A3A3A3",
};

const WAVE_LABELS = ["W1 (Mar '21)", "W2 (Dec '21)", "W3 (Jan '23)", "W4 (Jan '24)", "W5 (Jan '25)", "W6 (Feb '26)"];

const AWARENESS_TREND_DATA = WAVE_LABELS.map((wave, i) => ({
  wave,
  "Unaided Awareness": [21, 21, 29, 25, 22, 25][i],
  "Aided Awareness": [54, 57, 60, 62, 61, 60][i],
  "Logo Recall": [35, 42, 54, 62, 74, 70][i],
}));

const SATISFACTION_TREND_DATA = WAVE_LABELS.map((wave, i) => ({
  wave,
  "Satisfaction (Top-2-Box)": [91, 94, 90, 91, 93, 97][i],
  NPS: [49.6, 54.2, 60.0, 58.0, 69.6, 62.3][i],
}));

/* ---------------------------------------------------------------
   APPENDIX: Shopper Clusters reference table
   Reproduced from the client's cluster reference deck. Colors flag
   statistically significant differences vs. the other clusters
   shown, at 95% confidence: red = significantly lower, blue =
   significantly higher, black = no significant difference.
   Note: a sixth cluster, Frequent Low-Cost Moderate Buyers
   (~5% of shoppers), is tracked in the full crosstab but is not
   part of this particular summary table.
   ------------------------------------------------------------- */
const CLUSTER_TABLE = {
  columns: [
    { key: "ls", label: "Light Spirits" },
    { key: "vc", label: "Variety Cordial" },
    { key: "gm", label: "Gin Mixologists" },
    { key: "we", label: "Whiskies Enthusiast" },
    { key: "sc", label: "Spirited Scotch Connoisseur" },
  ],
  size: { ls: "39%", vc: "5%", gm: "13%", we: "27%", sc: "12%" },
  spend: { ls: "$1,569", vc: "$3,080", gm: "$3,133", we: "$3,851", sc: "$4,627" },
  frequency: {
    ls: "Monthly",
    vc: "Monthly",
    gm: "2-3x/Month to Monthly",
    we: "2-3x/Month to Monthly",
    sc: "2-3x/Month to Monthly",
  },
  topCategories: {
    ls: ["Vodka (57%, $27)", "Am. Whiskey (37%, $34)", "Tequila (37%, $35)"],
    vc: ["Cordial (100%, $25)", "Vodka (74%, $24)", "Am. Whiskey (64%, $40)", "Rum (52%, $23)", "Tequila (37%, $43)"],
    gm: ["Gin (100%, $29)", "Vodka (78%, $27)", "Tequila (73%, $36)", "Am. Whiskey (54%, $34)", "Rum (46%, $29)"],
    we: ["Am. Whiskey (80%, $33)", "Vodka (76%, $28)", "Tequila (67%, $35)", "Rum (54%, $29)", "Canadian (48%, $37)"],
    sc: ["Scotch (100%, $45)", "Vodka (69%, $35)", "Tequila (57%, $34)", "Am. Whiskey (57%, $38)", "Rum (53%, $38)"],
  },
  otherCategories: {
    ls: [
      { name: "Beer", value: "58%", sig: "lower" },
      { name: "Wine", value: "44%", sig: "lower" },
      { name: "Hard Seltzer/Soda", value: "40%", sig: "lower" },
      { name: "NA Beer/Wine", value: "6%", sig: "lower" },
      { name: "Cannabis", value: "45%", sig: "neutral" },
      { name: "THC", value: "12%", sig: "lower" },
      { name: "RTD", value: "26%", sig: "lower" },
    ],
    vc: [
      { name: "Beer", value: "76%", sig: "higher" },
      { name: "Wine", value: "62%", sig: "higher" },
      { name: "Hard Seltzer/Soda", value: "58%", sig: "higher" },
      { name: "NA Beer/Wine", value: "20%", sig: "higher" },
      { name: "Cannabis", value: "34%", sig: "lower" },
      { name: "THC", value: "18%", sig: "lower" },
      { name: "RTD", value: "46%", sig: "higher" },
    ],
    gm: [
      { name: "Beer", value: "75%", sig: "higher" },
      { name: "Wine", value: "58%", sig: "higher" },
      { name: "Hard Seltzer/Soda", value: "50%", sig: "mixed" },
      { name: "NA Beer/Wine", value: "10%", sig: "lower" },
      { name: "Cannabis", value: "48%", sig: "neutral" },
      { name: "THC", value: "25%", sig: "higher" },
      { name: "RTD", value: "39%", sig: "mixed" },
    ],
    we: [
      { name: "Beer", value: "79%", sig: "higher" },
      { name: "Wine", value: "60%", sig: "higher" },
      { name: "Hard Seltzer/Soda", value: "58%", sig: "higher" },
      { name: "NA Beer/Wine", value: "12%", sig: "mixed" },
      { name: "Cannabis", value: "55%", sig: "higher" },
      { name: "THC", value: "28%", sig: "higher" },
      { name: "RTD", value: "48%", sig: "higher" },
    ],
    sc: [
      { name: "Beer", value: "78%", sig: "higher" },
      { name: "Wine", value: "60%", sig: "higher" },
      { name: "Hard Seltzer/Soda", value: "64%", sig: "higher" },
      { name: "NA Beer/Wine", value: "25%", sig: "higher" },
      { name: "Cannabis", value: "54%", sig: "higher" },
      { name: "THC", value: "33%", sig: "higher" },
      { name: "RTD", value: "45%", sig: "higher" },
    ],
  },
};

/* ---------------------------------------------------------------
   GROUNDING CONTEXT for the Q&A assistant (Wave 6 source data)
   ------------------------------------------------------------- */
const GROUNDING_CONTEXT = `
CLIENT: OHLQ (Ohio Liquor) — state-controlled liquor retail brand in Ohio.
STUDY: Wave 6 of an annual brand awareness tracker. Two data sources are used here:
(1) The published Wave 6 report, n=500, Ohio residents 21+, purchased high-proof liquor in past 6 months, fielded February 2026.
(2) A separate purchasing-cluster crosstab (LTV Cluster Crosstabs), base n=990 (a larger, natural-fallout-inclusive sample used specifically for cluster-level analysis), which breaks every question out by six purchasing clusters. Figures from the two sources may differ slightly in base size but are closely consistent (e.g., overall NPS is 62.3 in the report and 62.5 in the crosstab).

PURCHASING CLUSTERS (from crosstab, n=990): Whisky Enthusiasts (WE, n=292), Spirited Scotch Connoisseurs (SC, n=51), Light Spirit Drinkers (LS, n=412), Frequent Low-Cost Moderate Buyer (FC, n=48), Gin-Lovers Mixologists (GM, n=157), Variety Cordial Liquor Purchasers (VC, n=30). This tool's segment toggle uses All Shoppers, Whisky Enthusiasts (WE), Light Spirit Drinkers (LS), Gin-Lovers Mixologists (GM), and Cannabis Purchasers only.

CLUSTER DEMOGRAPHIC PROFILE (crosstab, n=990):
- Gender: WE 57.5% male / 42.1% female. LS 44.4% male / 55.3% female. GM 66.2% male / 33.8% female. All shoppers 53.0% male / 46.8% female.
- Age: WE skews 35-44 (32.9%) and 21-34 (23.6%); only 6.2% are 65+. LS skews oldest: 33.9% combined are 55+. GM skews youngest: 61.8% combined are 21-44.

CLUSTER CATEGORY PURCHASE RATES (Q7, "purchase regularly," crosstab n=990):
Category | WE | LS | GM | All Shoppers
American Whiskey/Bourbon | 64.4% | 45.9% | 48.4% | 52.3%
Irish Whiskey | 39.0% | 14.1% | 16.6% | 24.6%
Gin | 13.4% | 4.9% | 66.2% | 19.8%
Tequila | 68.2% | 41.0% | 52.2% | 52.9%
Vodka | 75.7% | 56.1% | 77.7% | 66.8%
Rum | 47.9% | 23.3% | 53.5% | 37.0%
Scotch | 25.0% | 3.9% | 28.0% | 16.2%
Japanese/International Whisky | 2.7% | 1.0% | 5.1% | 4.5%
Brandy/Cognac | 26.7% | 10.9% | 35.7% | 21.6%
Cordials | 6.8% | 1.2% | 3.8% | 6.4%
High-Proof RTD Cocktails | 37.3% | 20.1% | 25.5% | 28.6%
Canadian Whisky | 48.3% | 24.3% | 26.8% | 33.5%
GM shoppers over-index dramatically on gin (66.2% vs. 19.8% average) and also over-index on vodka, tequila, rum, scotch, and brandy. WE is concentrated in American and Irish whiskey and Canadian whisky. LS under-indexes on nearly every category.

CLUSTER ATTRIBUTE IMPORTANCE — Top-2-Box "important" (Q26, crosstab n=990):
Attribute | WE | LS | GM | All Shoppers
Convenient shopping experience | 88.0% | 88.4% | 93.6% | 88.9%
Clean/organized store environment | 87.4% | 87.6% | 89.8% | 87.7%
Is a brand I trust | 87.7% | 83.2% | 88.5% | 85.7%
Easy to navigate/find product | 88.0% | 87.1% | 93.0% | 88.1%
Has helpful displays | 74.4% | 63.1% | 84.1% | 71.2%
Provides access to knowledgeable staff | 74.3% | 64.4% | 85.3% | 71.4%
Offers products at a good value | 88.3% | 88.8% | 94.3% | 89.4%
Helps me learn about and explore the liquor category | 64.1% | 41.8% | 70.7% | 55.9%
Offers a wide assortment | 85.6% | 78.0% | 95.6% | 84.2%
GM shoppers rate nearly every attribute more important than average — the most attribute-engaged cluster overall. LS is consistently the least engaged with discovery-oriented attributes.

CLUSTER ATTRIBUTE PERFORMANCE — Top-2-Box "agree" about OHLQ specifically (Q29, crosstab n=990):
Attribute | WE | LS | GM | All Shoppers
Is a brand I trust | 88.9% | 79.5% | 80.4% | 81.4%
Convenient shopping experience | 86.1% | 79.4% | 90.8% | 82.1%
Easy to navigate/find product | 90.5% | 82.2% | 82.8% | 84.5%
Has helpful displays | 78.3% | 64.0% | 77.0% | 71.4%
Provides access to knowledgeable staff | 82.7% | 68.3% | 75.8% | 74.3%
Has a clean and organized store environment | 83.9% | 77.5% | 85.0% | 80.7%
Offers a wide assortment | 90.0% | 85.8% | 93.1% | 88.0%
Offers products at a good value | 83.9% | 72.7% | 81.6% | 77.3%
Helps me learn about and explore the liquor category | 76.6% | 61.3% | 74.7% | 67.2%
Overall opinion "very positive" (Q28) | 62.8% | 49.0% | 64.4% | 56.1%
WE shows the single highest trust score (88.9%) and easy-navigation score (90.5%) of any cluster.

CLUSTER SATISFACTION AND NPS (Q21/Q22 on OHLQ specifically, crosstab n=990):
- Top-2-box satisfaction: WE 95.5%, LS 95.8%, GM 96.0%, All Shoppers 95.8%.
- "Very satisfied" (top box only): WE 74.7%, LS 65.1%, GM 76.0%, All Shoppers 70.9%.
- NPS: WE 74.8, LS 52.4, GM 60.1, All Shoppers 62.5 (closely matches the report's published 62.3). WE's promoter rate is 79.2% with a 4.4% detractor rate; LS is 62.4% promoters / 10.0% detractors; GM is 65.4% promoters / 5.3% detractors.
Whisky Enthusiasts are OHLQ's strongest advocates by a wide margin.

CLUSTER EMERGING TRENDS (Q33 social/search sources, Q6 cannabis purchase, crosstab n=990):
- AI tools (e.g., ChatGPT) for liquor research: WE 19.9%, LS 6.6%, GM 14.0%, All Shoppers 13.0% (closely matches report's published 12%).
- Facebook: WE 42.5%, LS 26.7%, GM 52.9%, All Shoppers 37.7%. YouTube: WE 34.2%, LS 17.7%, GM 52.9%, All Shoppers 31.5%. Reddit: WE 19.2%, LS 12.6%, GM 10.8%, All Shoppers 14.0%.
- Cannabis/marijuana purchase (past 6 months): WE 52.1%, LS 41.3%, GM 56.1%, All Shoppers 47.4%. THC beverages: WE 23.6%, LS 13.8%, GM 21.7%, All Shoppers 19.1%.

CANNABIS PURCHASERS (from the published Wave 6 report appendix, cutting the full n=500 sample by cannabis-purchase status): Cannabis purchasers are 51% of the sample, down 2 points from 53% in Wave 5. Brand awareness 66.9% vs. 55.1% among non-purchasers. Ever shopped OHLQ 57.6% vs. 43.4%. Shop OHLQ most often 31.8% vs. 18.1%. Very positive brand opinion 89.9% vs. 78.3%. Widest disparity in the entire dataset: OHLQ.com ease-of-navigation rated 79.5% by cannabis purchasers vs. 100% among non-purchasers.

STATE OF THE SHOPPER (published report, n=500): 43% now buy less expensive options due to economy, up 3 points from 40% in Wave 5. 44% waiting longer to restock, up 5 points from 39% in Wave 5. Among those cutting back: 53% want to spend less overall, 47% cite rising alcohol prices, 19% cite tariffs/trade concerns. OHLQ top-2-box satisfaction is 97% (report figure; crosstab shows 95.8%), up 4 points from 93% in Wave 5. 60% hold a very positive opinion (report figure; crosstab shows 56.1%). Trust rose 5 points, from 78% to 83%.

CHAPTER 2 — CATEGORY, exact wave-over-wave figures published in the report: American whiskey 56%→51% (-5 pts). Irish whiskey 28%→24% (-4 pts). Brandy/cognac 25%→22% (-3 pts). These are the only three categories for which the report publishes an exact prior-wave figure; gin, scotch, cordials, and RTDs are reported only as increasing versus Wave 5, without a published point figure. Non-alcoholic beer/wine/liquor purchases increased significantly, reaching 15% of respondents in Wave 6 (prior-wave figure not published).

CHAPTER 3 — OCCASION (published report, All Shoppers only, no cluster cut available): Personal use ranges 33% (Japanese/Int'l Whiskey) to 63% (American Whiskey); restocking ranges 29%-51%. Gifting strongest for Scotch and Japanese/Int'l Whiskey (38% each). Gin leads cocktail/recipe missions (27%). Canadian Whisky highest restock rate (48%). Exploration occasions index highest for Scotch (23%) and Japanese/Int'l Whiskey (38%). Cordial (21%) and RTD (19%) shoppers have highest unplanned purchase rates.

CHAPTER 4 — INFORMATION SOURCES (published report, All Shoppers only): Word of mouth 50%, in-store signage/displays 30%, store employees 27%, bartenders/servers 25% — all outrank digital. Top digital: Facebook 38%, search 35%, YouTube 34%, Instagram 21%, TikTok 21%. Top industry sources: general liquor/spirits sites 39%, liquor brand sites 36%. OHLQ.com 22%; owned channels app 13%, social 11%, email 11% trail. AI tools 12% (first wave measured). App drives highest visit frequency (18% daily, 31% weekly) vs. OHLQ.com (monthly or less). Owned-channel usefulness 83%-89% top-2-box.

CHAPTER 6 — AWARENESS, full wave history (W1→W6) published in the report's key comparison table: Unaided Awareness 21%, 21%, 29%, 25%, 22%, 25%. Aided Awareness 54%, 57%, 60%, 62%, 61%, 60%. Logo Recall 35%, 42%, 54%, 62%, 74%, 70%. OHLQ ranks #2 in aided awareness behind Kroger (up from #4 at baseline). Name-specific mentions grew 2%→12% since baseline; generic "state store" references declined 19%→13%. Four new competitors entered W6: Total Wine, Spec's, WhiskeySearcher, Wine Searcher. Logo recall declined 4 points from 74% in Wave 5 to 70% in Wave 6 — the first decline after five consecutive waves of growth. OHLQ locations are top source of logo recall (49%).

CHAPTER 7 — SATISFACTION, full wave history (W1→W6) published in the report's key comparison table: Satisfaction Top-2-Box 91%, 94%, 90%, 91%, 93%, 97%. NPS 49.6, 54.2, 60.0, 58.0, 69.6, 62.3. Wave 5 (Jan 2025) was fielded immediately after the November 2024 presidential election, a period of measurably elevated consumer confidence across all retailers (Giant Eagle NPS spiked 61.4→70.3, Kroger 48.1→63.3, independents 64.9→79.0 in that wave). Wave 6's NPS of 62.3 represents a return to baseline and remains well above Wave 1's 49.6. Trust rose 5 points, from 78% to 83%. OHLQ.com satisfaction hit an all-time high of 95%.

CHAPTER 8 — PROMOTION (published report, All Shoppers only): Unaided communication recall steady at 21%, though 21-34 year-old recall dropped 34%→21% while 35-54 grew 20%→28%. "Raise a Glass. Responsibly." recall dropped 69%→49% (-20 pts), falling below every prior wave. "Last Call" tag recalled by only 20%, and most who recall it think it means bar closing time. "Liquordation" recalled by 11%, but 83% of those who recognize it correctly identify it as a discount/sale signal.

APPENDIX — CLUSTER REFERENCE TABLE (client deck, 5 of the 6 clusters; Frequent Low-Cost Moderate Buyers, ~5% of shoppers, is tracked separately in the full crosstab but not shown in this summary table): Light Spirits (39% of shoppers, $1,569 annual spend, top categories vodka/Am. whiskey/tequila, monthly frequency, significantly LOWER other-category crossover across the board). Variety Cordial (5%, $3,080, cordial/vodka/Am. whiskey/rum/tequila, monthly, significantly HIGHER beer/wine/hard-seltzer/NA-beverage/RTD crossover but LOWER cannabis/THC). Gin Mixologists (13%, $3,133, gin/vodka/tequila/Am. whiskey/rum, 2-3x monthly, mostly higher other-category crossover with mixed results on hard seltzer and RTD). Whiskies Enthusiast (27%, $3,851, Am. whiskey/vodka/tequila/rum/Canadian whisky, 2-3x monthly, significantly HIGHER crossover on nearly every other category including cannabis and THC). Spirited Scotch Connoisseur (12%, $4,627 — highest annual spend of any cluster, scotch/vodka/tequila/Am. whiskey/rum, 2-3x monthly, significantly HIGHER crossover across the board). Colors in the table indicate statistically significant differences vs. the other clusters shown at 95% confidence: red = significantly lower, blue = significantly higher, black = no significant difference.

IMPORTANT FOR ANSWERING: Chapters 3, 4, 6, and 8 are All-Shoppers-only in the underlying data; no cluster or segment cut exists for them. Chapters 1, 2, 5, 7, and 9 have real cluster-level breakouts for Whisky Enthusiasts, Light Spirit Drinkers, and Gin-Lovers Mixologists, and real Cannabis Purchaser breakouts from the report appendix — use the exact figures given above. Do not invent numbers for clusters not listed above (Spirited Scotch Connoisseurs, Frequent Low-Cost Moderate Buyer, and Variety Cordial Purchasers have crosstab data that exists but is not reproduced in this context beyond the Appendix reference table — say so if asked for more detail). Personas (Set It and Forget It, Maturing Drinkers, Social Drinkers, Hobbyists, Bourbon Fans) have no numeric cluster-style breakout available in this tool — flag that clearly if asked rather than inventing numbers. Never state a wave-over-wave change without the actual point figure if one exists above; if no exact figure is published for a given change, say so explicitly rather than using vague language like "directionally." Keep answers concise (3-6 sentences unless asked for more detail), client-ready, and grounded only in the data above.
`;

/* ---------------------------------------------------------------
   CHAPTER CONTENT
   ------------------------------------------------------------- */
const CHAPTERS = [
  {
    id: "intro",
    number: "Intro",
    title: "State of the Shopper",
    framing: "What changed since last year?",
    hasSegments: false,
    questions: [
      "Why are shoppers cutting back right now?",
      "How does this wave compare to Wave 5 overall?",
      "What's driving the rise in trust?",
    ],
    content: {
      all: {
        stats: [
          { value: "97%", label: "Top-2-Box Satisfaction", delta: "+4 pts vs. Wave 5 (93%→97%) — highest ever recorded" },
          { value: "43%", label: "Buying Less Expensive Due to Economy", delta: "+3 pts vs. Wave 5 (40%→43%)" },
          { value: "44%", label: "Waiting Longer to Restock", delta: "+5 pts vs. Wave 5 (39%→44%)" },
        ],
        narrative:
          "Ohio liquor shoppers continue to demonstrate remarkable resilience, but their expectations are evolving. Economic pressures are influencing decision-making more than in previous waves: 43% of shoppers now purchase less expensive options because of the economy, up 3 points from 40% in Wave 5, and 44% are waiting longer to restock, up 5 points from 39% in Wave 5. Among those cutting back, the top reasons are a desire to spend less overall (53%), rising alcohol prices (47%), and concern about tariffs or trade issues (19%). At the same time, interest in discovery, new brands, and confidence-building remains strong, reinforcing that value today is defined by more than price alone. Against this backdrop, OHLQ's relationship with shoppers remains exceptionally strong: top-2-box satisfaction climbed to 97%, up 4 points from 93% in Wave 5 and the highest level recorded since tracking began, while 60% now hold a very positive opinion of the brand and trust continues to rise.",
        takeaway:
          "Shoppers are resilient but increasingly intentional, and OHLQ's strong brand fundamentals position it well to capture deepening engagement.",
        implication:
          "Lean into value and discovery messaging simultaneously — price-conscious behavior is not a sign of eroding brand love, and OHLQ's satisfaction and trust levels justify a confident, relationship-building content strategy rather than a defensive one.",
      },
    },
  },
  {
    id: "ch1",
    number: "01",
    title: "Shopper Profile / Segmentation",
    framing: "Who are today's Ohio liquor shoppers?",
    hasSegments: true,
    questions: [
      "Which purchasing cluster is most valuable for advocacy?",
      "How does Gin-Lovers Mixologists' engagement compare across attributes?",
      "What does the cannabis crossover mean for targeting?",
    ],
    content: {
      all: {
        stats: [
          { value: "51%", label: "Also Purchased Cannabis (Past 6 Mo.)", delta: "-2 pts vs. Wave 5 (53%→51%)" },
          { value: "412", label: "Light Spirit Drinkers — Largest Cluster", delta: "42% of the n=990 cluster base" },
          { value: "6", label: "Distinct Purchasing Clusters", delta: "Same taxonomy since Wave 1" },
        ],
        narrative:
          "The Wave 6 shopper base can be understood through purchasing clusters built from actual category and spending behavior. Light Spirit Drinkers are the largest cluster (n=412) and skew older — 33.9% are 55 or older — driving volume in vodka, RTDs, and lower-cost spirits, but under-indexing on nearly every category relative to the average shopper. Whisky Enthusiasts (n=292) are concentrated in American whiskey (64.4%), Irish whiskey (39.0%), and Canadian whisky (48.3%), skew male (57.5%), and are OHLQ's strongest advocates by NPS. Gin-Lovers Mixologists (n=157) skew young (61.8% are 21-44) and male (66.2%), and don't just over-index on gin (66.2% vs. 19.8% average) — they rate nearly every category and attribute higher than the average shopper, making them OHLQ's most broadly engaged cluster. Cannabis crossover fell 2 points versus Wave 5 (53%→51%) but remains highest among Gin-Lovers Mixologists (56.1%) and Whisky Enthusiasts (52.1%), and lowest among Light Spirit Drinkers (41.3%).",
        takeaway:
          "The shopper base is not one audience. Whisky Enthusiasts and Gin-Lovers Mixologists — the clusters most engaged across categories, attributes, and digital channels — are also OHLQ's strongest advocates, while Light Spirit Drinkers anchor volume without driving advocacy.",
        implication:
          "Tiered messaging that serves Light Spirit Drinkers with convenience and value cues, while serving Whisky Enthusiasts and Gin-Lovers Mixologists with discovery, education, and exclusive access, will be more effective than a single mass-market approach.",
      },
      we: {
        stats: [
          { value: "292", label: "Cluster Size (of n=990 Base)", delta: "Concentrated in American/Irish whiskey" },
          { value: "64.4%", label: "American Whiskey Purchase Rate", delta: "vs. 52.3% average" },
          { value: "74.8", label: "NPS for OHLQ", delta: "vs. 62.5 average — highest of any cluster" },
        ],
        narrative:
          "Whisky Enthusiasts are concentrated in American whiskey (64.4% vs. 52.3% average), Irish whiskey (39.0% vs. 24.6%), and Canadian whisky (48.3% vs. 33.5%), and skew male (57.5%) and 35-44 (32.9%). This cluster is OHLQ's clearest advocacy engine: NPS of 74.8 versus 62.5 for the average shopper, driven by a 79.2% promoter rate and just a 4.4% detractor rate. WE also shows the highest trust score of any cluster (88.9% top-2-box) and the highest AI-tool adoption for liquor research (19.9% vs. 13.0% average).",
        takeaway:
          "WE is OHLQ's highest-value advocacy cluster by a wide margin — the highest NPS, the highest trust score, and among the most digitally engaged.",
        implication:
          "Prioritize tasting events, enthusiast education content, and early access to limited whiskey releases for this cluster — it converts engagement into advocacy more efficiently than any other segment.",
      },
      ls: {
        stats: [
          { value: "412", label: "Cluster Size — Largest of the Six", delta: "42% of the n=990 base" },
          { value: "33.9%", label: "Aged 55+", delta: "Oldest cluster in the study" },
          { value: "52.4", label: "NPS for OHLQ", delta: "vs. 62.5 average — lowest of the three profiled clusters" },
        ],
        narrative:
          "Light Spirit Drinkers are the largest cluster by a wide margin and skew older — 33.9% are 55 or older, the highest share of any cluster. LS under-indexes on nearly every category (e.g., American whiskey 45.9% vs. 52.3% average, gin just 4.9% vs. 19.8%) and on discovery-oriented attributes like helpful displays (63.1% importance vs. 71.2% average) and knowledgeable staff (64.4% vs. 71.4%). Satisfaction remains high (95.8% top-2-box) but NPS is the lowest of the three profiled clusters at 52.4, driven by a lower promoter rate (62.4%) and the highest detractor rate (10.0%).",
        takeaway:
          "LS drives volume, not advocacy. This cluster is broadly satisfied but far less likely than WE or GM to actively recommend OHLQ.",
        implication:
          "Focus messaging on convenience, reliability, and value for this segment rather than discovery-oriented campaigns, which land far better with Whisky Enthusiasts and Gin-Lovers Mixologists.",
      },
      gm: {
        stats: [
          { value: "157", label: "Cluster Size (of n=990 Base)", delta: "Skews young (61.8% aged 21-44) and male (66.2%)" },
          { value: "66.2%", label: "Gin Purchase Rate", delta: "vs. 19.8% average — by far the largest category skew in the study" },
          { value: "95.6%", label: "Wide Assortment — Stated Importance", delta: "Highest of any cluster, vs. 84.2% average" },
        ],
        narrative:
          "Gin-Lovers Mixologists don't just over-index on gin (66.2% vs. 19.8% average) — they rate nearly every category and attribute above average: vodka 77.7%, tequila 52.2%, rum 53.5%, brandy/cognac 35.7%, wide assortment importance 95.6%, knowledgeable staff importance 85.3%, and OHLQ.com/social engagement well above the norm (Facebook 52.9%, YouTube 52.9%). This makes GM OHLQ's most broadly engaged cluster, not just a mixology niche.",
        takeaway:
          "GM is a high-engagement, high-expectation cluster across the board — the segment most likely to notice and reward (or penalize) assortment, staff knowledge, and display quality.",
        implication:
          "Invest in cocktail recipe content, mixology education, and cross-merchandising with adjacent spirits — but also ensure in-store execution (assortment, displays, staff knowledge) is strongest where GM shoppers concentrate, since this cluster's expectations are the highest in the study.",
      },
      cannabis: {
        stats: [
          { value: "66.9%", label: "Brand Awareness (vs. 55.1% Non-Purchasers)", delta: "+11.8 pts" },
          { value: "57.6%", label: "Ever Shopped OHLQ (vs. 43.4%)", delta: "+14.2 pts" },
          { value: "89.9%", label: "Very Positive Brand Opinion (vs. 78.3%)", delta: "+11.6 pts" },
        ],
        narrative:
          "Cannabis purchasers make up just over half of respondents (51%, down 2 points from 53% in Wave 5) and are a meaningfully different, higher-value audience. They are more brand-aware, more likely to have ever shopped OHLQ, more likely to shop OHLQ most often (31.8% vs. 18.1%), and hold more positive opinions of the brand than non-purchasers. Cannabis crossover itself is highest among Gin-Lovers Mixologists (56.1%) and Whisky Enthusiasts (52.1%), and lowest among Light Spirit Drinkers (41.3%) — reinforcing that OHLQ's most engaged clusters are also its most likely cannabis crossover shoppers.",
        takeaway:
          "Cannabis purchasers are a higher-value, higher-engagement audience hiding in plain sight — and this behavior concentrates most heavily in OHLQ's already-most-engaged clusters.",
        implication:
          "Treat cannabis crossover as a targeting asset, not a risk — this audience is already predisposed toward OHLQ and is reachable through the social and Reddit channels where it over-indexes, particularly among Whisky Enthusiasts and Gin-Lovers Mixologists.",
      },
    },
  },
  {
    id: "ch2",
    number: "02",
    title: "Category",
    framing: "What are shoppers buying?",
    hasSegments: true,
    questions: [
      "Why is American whiskey softening?",
      "Which cluster is driving the gin growth?",
      "Is cannabis substitution really behind the whiskey decline?",
    ],
    content: {
      all: {
        stats: [
          { value: "68%", label: "Vodka Purchase Rate", delta: "Steady vs. Wave 5" },
          { value: "51%", label: "American Whiskey Purchase Rate", delta: "-5 pts vs. Wave 5 (56%→51%)" },
          { value: "15%", label: "Non-Alcoholic Beer/Wine/Liquor Purchasers", delta: "Up significantly vs. Wave 5" },
        ],
        narrative:
          "Vodka (68%) and tequila (55%) remain the most widely purchased categories and held steady wave over wave. American whiskey softened from 56% to 51% (-5 pts), the largest single-category shift this wave. Irish whiskey dropped from 28% to 24% (-4 pts) and brandy/cognac declined from 25% to 22% (-3 pts) — the three categories for which the Wave 6 report publishes exact wave-over-wave point changes. Gin, scotch, cordials, and RTDs all increased versus Wave 5, though the report does not publish exact point deltas for these upticks. Most notably, non-alcoholic beer, wine, and liquor purchases increased significantly versus Wave 5, reaching 15% of respondents this wave.",
        takeaway:
          "Vodka and tequila lead and are holding. The softening of American whiskey is a structural signal worth monitoring, driven by price pressure, demographic rotation, and potential cannabis substitution rather than any single cause.",
        implication:
          "Lean into the growing tequila and gin segments with cocktail and recipe content, while shifting American whiskey marketing from broad reach to high-value enthusiast targeting.",
      },
      we: {
        stats: [
          { value: "64.4%", label: "American Whiskey Purchase Rate", delta: "vs. 52.3% average — highest of any cluster" },
          { value: "39.0%", label: "Irish Whiskey Purchase Rate", delta: "vs. 24.6% average — highest of any cluster" },
          { value: "48.3%", label: "Canadian Whisky Purchase Rate", delta: "vs. 33.5% average — highest of any cluster" },
        ],
        narrative:
          "Whisky Enthusiasts are concentrated in exactly the categories showing wave-over-wave softening in the published report — American whiskey (-5 pts) and Irish whiskey (-4 pts) — plus Canadian whisky, which also declined though the report does not publish an exact point figure for it. Because this cluster over-indexes so heavily on brown spirits (64.4%, 39.0%, and 48.3% respectively, all the highest of any cluster), the whiskey softening trend sits squarely inside OHLQ's highest-NPS, most valuable cluster's core category.",
        takeaway:
          "The whiskey softening trend is concentrated within OHLQ's most valuable cluster's own core category — a retention issue for the segment that matters most, not just a category-mix shift.",
        implication:
          "Defend WE with premium and limited whiskey releases while actively expanding credible adjacent categories — WE also shows meaningfully above-average scotch purchase (25.0% vs. 16.2%) — to capture this cluster's exploration spend.",
      },
      ls: {
        stats: [
          { value: "56.1%", label: "Vodka Purchase Rate", delta: "vs. 66.8% average — still the largest single category for LS" },
          { value: "20.1%", label: "RTD Purchase Rate", delta: "Below average (28.6%), but LS's large base still anchors volume" },
          { value: "4.9%", label: "Gin Purchase Rate", delta: "vs. 19.8% average — lowest of the three profiled clusters" },
        ],
        narrative:
          "Light Spirit Drinkers under-index on nearly every individual category — vodka (56.1% vs. 66.8%), gin (4.9% vs. 19.8%), and RTDs (20.1% vs. 28.6%) are all below the shopper-wide average. LS is the least exposed of any profiled cluster to the American whiskey softening trend (45.9% purchase rate vs. 52.3% average), simply because whiskey was never central to this cluster's mix — its scale, not its category intensity, is what makes it OHLQ's volume anchor.",
        takeaway:
          "LS's size, not its category engagement, is what matters for OHLQ's overall numbers — this cluster is not driving (or exposed to) the category shifts seen elsewhere in the data.",
        implication:
          "Category-mix messaging (whiskey rebalancing, gin growth, RTD innovation) will land better with Whisky Enthusiasts and Gin-Lovers Mixologists than with this larger but lower-intensity cluster.",
      },
      gm: {
        stats: [
          { value: "66.2%", label: "Gin Purchase Rate", delta: "vs. 19.8% average — the single largest category skew in the study" },
          { value: "77.7%", label: "Vodka Purchase Rate", delta: "Highest of any cluster, vs. 66.8% average" },
          { value: "53.5%", label: "Rum Purchase Rate", delta: "vs. 37.0% average" },
        ],
        narrative:
          "Gin-Lovers Mixologists are the clear driver of gin's uptick this wave, purchasing gin at more than three times the shopper-wide rate (66.2% vs. 19.8%). This cluster also leads on vodka (77.7%) and shows above-average purchase of rum, tequila, brandy/cognac, and scotch — a broadly high-engagement category profile rather than a single-category niche.",
        takeaway:
          "Category growth in gin this wave is being driven almost entirely by this cluster's mixology-oriented purchase behavior, and their engagement extends well beyond gin alone.",
        implication:
          "Cross-merchandise gin with vodka, rum, and tequila under mixology and cocktail-recipe content aimed specifically at GM shoppers, who are already buying broadly across the spirits aisle.",
      },
      cannabis: {
        stats: [
          { value: "51%", label: "Overlap With Total OHLQ Shopper Base", delta: "-2 pts vs. Wave 5 (53%→51%)" },
          { value: "56.1% / 52.1%", label: "Cannabis Purchase Rate — GM / WE Clusters", delta: "vs. 41.3% for Light Spirit Drinkers" },
          { value: "66.9%", label: "Brand Awareness (vs. 55.1% Non-Purchasers)", delta: "+11.8 pts" },
        ],
        narrative:
          "Chapter 2 raises cannabis substitution as one possible driver of the brown-spirits softening. Notably, cannabis crossover is highest among Gin-Lovers Mixologists (56.1%) and Whisky Enthusiasts (52.1%) — the same clusters driving category engagement and advocacy — and lowest among Light Spirit Drinkers (41.3%). This suggests the substitution effect, if real, coexists with strong underlying brand affinity rather than category abandonment.",
        takeaway:
          "Cannabis crossover may contribute to category softening, but it concentrates in OHLQ's most engaged clusters, who remain highly brand-positive overall.",
        implication:
          "Don't treat cannabis crossover as pure category loss — use lighter, mixable categories and targeted digital content to re-engage this audience, which is already predisposed toward the brand.",
      },
    },
  },
  {
    id: "ch3",
    number: "03",
    title: "Occasion",
    framing: "When and why are shoppers buying?",
    hasSegments: false,
    questions: [
      "Which categories over-index for gifting?",
      "Where is the biggest untapped conversion opportunity?",
      "What makes Canadian Whisky a pantry staple?",
    ],
    content: {
      all: {
        stats: [
          { value: "63%", label: "American Whiskey — Personal Use Rate", delta: "Highest personal-use rate of any category" },
          { value: "48%", label: "Canadian Whisky — Restock Rate", delta: "Marks it as a pantry staple" },
          { value: "38%", label: "Scotch & Japanese/Int'l Whiskey — Gifting Rate", delta: "Leads all categories in gifting" },
        ],
        narrative:
          "Personal use at home and restocking dominate purchase missions across every category: personal use ranges from 33% for Japanese/International Whiskey to 63% for American Whiskey, while restocking ranges from 29% to 51%. Gifting is a meaningful secondary mission for higher-consideration categories, with Scotch and Japanese/International Whiskey leading at 38% each. Gin leads cocktail and recipe-driven purchase at 27%, while Canadian Whisky's high restock rate (48%) marks it firmly as a pantry staple. Exploration-driven occasions — trying something new, buying as a souvenir or collector's item — index highest among Scotch (23%) and Japanese/International Whiskey (38%). Cordial and RTD shoppers show the highest unplanned purchase rates at 21% and 19% respectively.",
        takeaway:
          "Most volume is driven by routine missions. The highest-growth opportunity lies in converting in-store traffic into exploratory purchases, particularly in premium and specialty categories where discovery intent is already elevated.",
        implication:
          "Concentrate in-store merchandising, sampling, and display investment around discovery-oriented categories (Scotch, Japanese Whiskey, gin) and impulse-prone categories (cordials, RTDs), rather than distributing evenly across the floor.",
      },
    },
  },
  {
    id: "ch4",
    number: "04",
    title: "Information Sources / Shopping Experience",
    framing: "Where do shoppers go to learn and decide?",
    hasSegments: false,
    hasChart: "info-sources",
    questions: [
      "How big a role do AI tools play in research today?",
      "Why do owned channels trail despite high usefulness scores?",
      "Which digital channel should get the most investment?",
    ],
    content: {
      all: {
        stats: [
          { value: "50%", label: "Word of Mouth — Top Information Source", delta: "Outranks every digital channel" },
          { value: "38%", label: "Facebook — Leading Digital Channel", delta: "Ahead of search (35%) and YouTube (34%)" },
          { value: "12%", label: "AI Tools (e.g. ChatGPT) for Liquor Research", delta: "New metric, on par with influencers/podcasts" },
        ],
        narrative:
          "Information seeking is overwhelmingly personal and in-store: word of mouth (50%), in-store signage and displays (30%), store employees (27%), and bartenders or servers (25%) all outrank every digital source. Among digital channels, Facebook (38%), search (35%), and YouTube (34%) lead, with Instagram (21%) and TikTok (21%) close behind. OHLQ.com (22%) competes well as an information source, but owned channels including the app (13%), social (11%), and email (11%) trail significantly. AI tools like ChatGPT already register at 12% for liquor research despite appearing in the survey for the first time this wave. Among those who do engage with OHLQ's owned channels, the app drives the highest visit frequency (18% daily, 31% weekly), and usefulness scores across all owned channels range from 83% to 89% top-2-box — meaning quality is not the barrier to engagement, reach and habit formation are.",
        takeaway:
          "Human interaction and in-store touchpoints are the primary drivers of purchase decisions. Digital channels matter for discovery but play a secondary role.",
        implication:
          "Field marketing, knowledgeable staff, and in-store signage likely deliver a higher ROI than digital spend for most segments. Concentrate digital investment on Facebook, search, and YouTube, and on building app adoption among the already-engaged high-frequency user base.",
      },
    },
  },
  {
    id: "ch5",
    number: "05",
    title: "Attributes / Drivers",
    framing: "What do shoppers value, and how does that connect to revenue?",
    hasSegments: true,
    questions: [
      "Which cluster is hardest to satisfy on attributes?",
      "Why did knowledgeable staff performance decline?",
      "What's the single highest-ROI investment based on this data?",
    ],
    content: {
      all: {
        stats: [
          { value: "0.46", label: "Convenient Shopping Experience — Top Derived Driver", delta: "Highest-ranked attribute" },
          { value: "90%", label: "Good Value — Stated Importance", delta: "+5 pts vs. Wave 5 (85%→90%)" },
          { value: "75%", label: "Knowledgeable Staff — Performance", delta: "-3 pts vs. Wave 5 (78%→75%)" },
        ],
        narrative:
          "The attributes that most strongly predict whether shoppers recommend OHLQ align closely with the operational and revenue drivers that matter most to the business. Convenient shopping experience ranks first in derived importance (correlation 0.46), a clean and organized store environment ranks second (0.45), brand trust ranks third (0.43), easy navigation ranks fourth (0.43), and helpful displays rank fifth (0.41) — representing the largest gap between stated and derived importance. Good value increased significantly from 85% to 90% in stated importance this wave, its largest single-wave gain. OHLQ's performance against the highest-derived-importance attributes is strong: assortment at 86%, navigation at 86%, and convenience at 85% all rate well. The one soft spot is knowledgeable staff, which slipped from 78% to 75% top-2-box.",
        takeaway:
          "Retail execution, value perception, and in-store discovery are the three revenue levers most directly supported by the attribute data. Staff knowledge is the most actionable gap.",
        implication:
          "Investment that strengthens planogram execution, in-store display quality, and staff product knowledge will have a more measurable impact on advocacy and revenue than brand communications alone.",
      },
      we: {
        stats: [
          { value: "88.9%", label: "Brand Trust — Agreement About OHLQ", delta: "Highest of any cluster, vs. 81.4% average" },
          { value: "90.5%", label: "Easy to Navigate — Agreement About OHLQ", delta: "Highest of any cluster, vs. 84.5% average" },
          { value: "82.7%", label: "Knowledgeable Staff — Agreement About OHLQ", delta: "vs. 74.3% average" },
        ],
        narrative:
          "Whisky Enthusiasts rate OHLQ's performance higher than any other cluster on trust (88.9%), navigation (90.5%), and knowledgeable staff (82.7%) — all well above the shopper-wide average. This cluster also places above-average stated importance on staff knowledge (74.3% vs. 71.4% average) and helpful displays (74.4% vs. 71.2%), meaning the overall 3-point decline in staff knowledge performance is worth watching closely for the segment that currently rates OHLQ most favorably.",
        takeaway:
          "WE currently rates OHLQ's execution higher than any other cluster — protecting that lead, especially on staff knowledge, is critical to preserving this segment's outsized advocacy.",
        implication:
          "Pilot staff training investment first in stores and regions with high Whisky Enthusiast traffic, where both the stakes and the visibility of the return are highest.",
      },
      ls: {
        stats: [
          { value: "64.0%", label: "Helpful Displays — Agreement About OHLQ", delta: "Lowest of any cluster, vs. 71.4% average" },
          { value: "68.3%", label: "Knowledgeable Staff — Agreement About OHLQ", delta: "Lowest of any cluster, vs. 74.3% average" },
          { value: "72.7%", label: "Good Value — Agreement About OHLQ", delta: "Lowest of any cluster, vs. 77.3% average" },
        ],
        narrative:
          "Light Spirit Drinkers rate OHLQ's performance lowest of any profiled cluster on nearly every attribute measured — helpful displays (64.0%), knowledgeable staff (68.3%), good value (72.7%), and learn/explore (61.3%) all trail the shopper-wide average. Stated importance for these same discovery-oriented attributes is also lowest for LS, so the gap reflects lower engagement more than active dissatisfaction — LS shoppers care less about these attributes and rate OHLQ's delivery on them lower as well.",
        takeaway:
          "LS is both the least engaged with discovery-oriented attributes and the cluster that rates OHLQ's delivery on them lowest — but this reflects lower priority, not acute dissatisfaction.",
        implication:
          "Prioritize checkout speed, restock ease, and price-competitiveness messaging for this segment over in-store education content, which would be reaching an audience that has told us it cares less about it.",
      },
      gm: {
        stats: [
          { value: "90.8%", label: "Convenient Shopping — Agreement About OHLQ", delta: "Highest of any cluster, vs. 82.1% average" },
          { value: "93.1%", label: "Wide Assortment — Agreement About OHLQ", delta: "Highest of any cluster, vs. 88.0% average" },
          { value: "95.6%", label: "Wide Assortment — Stated Importance", delta: "Highest of any cluster, vs. 84.2% average" },
        ],
        narrative:
          "Gin-Lovers Mixologists both demand the most (95.6% stated importance on wide assortment, the highest of any cluster) and rate OHLQ's delivery the highest on several core attributes — convenience (90.8%), assortment (93.1%), and clean/organized environment (85.0%). This is a segment with high standards that OHLQ is currently meeting on execution basics, though its stated importance on knowledgeable staff (85.3%) still outpaces OHLQ's performance among this cluster (75.8%).",
        takeaway:
          "GM is a high-expectation, high-satisfaction cluster on core execution attributes, but the staff-knowledge gap (85.3% importance vs. 75.8% performance) is the largest of any measured attribute for this segment.",
        implication:
          "Pilot cocktail-recipe end-caps and mixology-focused displays in stores with high GM concentration, and prioritize staff training investment there as well — this cluster will both notice and reward the improvement.",
      },
      cannabis: {
        stats: [
          { value: "79.5%", label: "OHLQ.com Navigation Ease (Cannabis Purchasers)", delta: "-20.5 pts vs. 100% among non-purchasers" },
          { value: "Above Avg.", label: "Digital Discovery Engagement", delta: "Over-indexes on Facebook, Reddit, X" },
          { value: "89.9%", label: "Very Positive Brand Opinion", delta: "+11.6 pts vs. non-purchasers" },
        ],
        narrative:
          "The widest single disparity in the Wave 6 dataset is this segment's OHLQ.com navigation experience — rated 79.5% versus 100% among non-purchasers — despite otherwise excellent brand sentiment (89.9% very positive opinion).",
        takeaway:
          "Attribute performance for cannabis purchasers is bifurcated: sentiment is excellent, digital usability is not.",
        implication:
          "OHLQ.com UX remediation targeted at this segment is a discrete, high-ROI fix rather than a broad brand problem.",
      },
    },
  },
  {
    id: "ch6",
    number: "06",
    title: "Awareness and Recognition",
    framing: "How well known and recognizable is OHLQ as a brand?",
    hasSegments: false,
    hasChart: "awareness-trend",
    questions: [
      "Why did logo recall dip this wave?",
      "How does OHLQ's awareness compare to competitors?",
      "What does the shift from 'state store' to 'OHLQ' mean?",
    ],
    content: {
      all: {
        stats: [
          { value: "60%", label: "Aided Brand Awareness", delta: "-1 pt vs. Wave 5 (61%→60%), stable across three waves" },
          { value: "70%", label: "Logo Recall", delta: "-4 pts vs. Wave 5 (74%→70%)" },
          { value: "12%", label: "Name-Specific Mentions", delta: "+10 pts vs. baseline (2%→12%)" },
        ],
        narrative:
          "Unaided awareness sits at 25% and aided awareness at 60%, both consistent with the past several waves. OHLQ ranks second in aided awareness behind only Kroger, up from fourth at baseline. Name-specific mentions grew from 2% at baseline to 12% today, while generic 'state store' references declined from 19% to 13% — a clear shift from commodity to brand. Four new competitors entered the consideration set for the first time in Wave 6: Total Wine, Spec's, WhiskeySearcher, and Wine Searcher. Logo recall reached 70%, more than double the 35% baseline, but declined 4 points from 74% in Wave 5 — the first decline after five consecutive waves of growth. Logo recognition continues to outpace aided brand awareness (70% vs. 60%). OHLQ locations remain the top source of logo recall at 49%.",
        takeaway:
          "Awareness has largely matured. The visual identity is stronger than the name alone. The opportunity is no longer reach but depth: converting ambient familiarity into active brand preference.",
        implication:
          "Shift media strategy from broad awareness-building to contextual relevance at the moments shoppers are deciding, particularly in-store and on search.",
      },
    },
  },
  {
    id: "ch7",
    number: "07",
    title: "Satisfaction",
    framing: "How satisfying, trustworthy, and useful is the OHLQ experience?",
    hasSegments: true,
    hasChart: "satisfaction-trend",
    questions: [
      "Why is Whisky Enthusiasts' NPS so much higher than other clusters?",
      "How does Wave 5's post-election spike affect how we read this wave?",
      "What's the clearest model for deepening digital loyalty?",
    ],
    content: {
      all: {
        stats: [
          { value: "97%", label: "Top-2-Box Satisfaction", delta: "+4 pts vs. Wave 5 (93%→97%) — highest ever recorded" },
          { value: "62.3", label: "Net Promoter Score", delta: "-7.3 pts vs. Wave 5 (69.6→62.3)" },
          { value: "83%", label: "Trust — Top-2-Box", delta: "+5 pts vs. Wave 5 (78%→83%)" },
        ],
        narrative:
          "OHLQ's top-2-box satisfaction reached 97% this wave, up 4 points from 93% in Wave 5 and the highest level recorded since tracking began, and negative opinions have effectively disappeared. Net Promoter Score declined from 69.6 to 62.3 (-7.3 pts), but this requires context: Wave 5 was fielded immediately following the November 2024 presidential election, a period of measurably elevated consumer confidence across all retailers (Giant Eagle spiked 61.4→70.3, Kroger 48.1→63.3, independents 64.9→79.0). Wave 6 represents a return to baseline conditions, and OHLQ's 62.3 NPS remains 12.7 points above its Wave 1 score of 49.6. Trust rose 5 points, from 78% to 83%, and 60% of shoppers hold a very positive overall opinion, up 21 points since Wave 1. OHLQ.com satisfaction hit an all-time high at 95%.",
        takeaway:
          "Satisfaction is genuinely strong and still improving. The NPS decline is a measurement artifact of an unusually elevated Wave 5 baseline, not a signal of deteriorating performance.",
        implication:
          "The app's engagement frequency pattern is the clearest model for deepening digital loyalty — migrating OHLQ.com visitors toward app adoption is the highest-ROI digital investment available.",
      },
      we: {
        stats: [
          { value: "74.8", label: "NPS for OHLQ", delta: "vs. 62.5 cluster-base average — highest of any cluster" },
          { value: "79.2%", label: "Promoter Rate", delta: "vs. 69.8% average" },
          { value: "4.4%", label: "Detractor Rate", delta: "vs. 7.3% average — lowest of any cluster" },
        ],
        narrative:
          "Whisky Enthusiasts post an NPS of 74.8 versus a 62.5 average across the cluster base — a gap driven by both a higher promoter rate (79.2% vs. 69.8%) and a notably lower detractor rate (4.4% vs. 7.3%). Satisfaction itself is comparable across clusters (95.5% top-2-box for WE), so the advocacy gap is really about conviction: WE shoppers who are satisfied are far more likely to say so at the top of the recommendation scale.",
        takeaway:
          "WE is both OHLQ's strongest advocacy engine and the clearest proof point that satisfaction alone doesn't predict advocacy — conviction does.",
        implication:
          "Track WE-specific NPS as a leading indicator of brand health, and study what drives this cluster's outsized promoter conviction to replicate it in other segments.",
      },
      ls: {
        stats: [
          { value: "52.4", label: "NPS for OHLQ", delta: "vs. 62.5 average — lowest of the three profiled clusters" },
          { value: "10.0%", label: "Detractor Rate", delta: "Highest of any cluster, vs. 7.3% average" },
          { value: "65.1%", label: "'Very Satisfied' Rate", delta: "Lowest of any cluster, vs. 70.9% average" },
        ],
        narrative:
          "Light Spirit Drinkers show comparable top-2-box satisfaction to other clusters (95.8%) but the lowest 'very satisfied' rate (65.1% vs. 70.9% average) and the highest detractor rate (10.0%), producing the lowest NPS of the three profiled clusters at 52.4. This is a segment that is broadly content but rarely enthusiastic.",
        takeaway:
          "LS satisfaction is real but shallow — high top-2-box scores mask the lowest conviction and highest detractor rate of any profiled cluster.",
        implication:
          "Monitor LS-specific NPS (not just satisfaction) as an early-warning metric, since this cluster's size means even modest movement in its detractor rate could meaningfully affect OHLQ's overall NPS.",
      },
      gm: {
        stats: [
          { value: "60.1", label: "NPS for OHLQ", delta: "Close to the 62.5 average" },
          { value: "96.0%", label: "Top-2-Box Satisfaction", delta: "Highest of any cluster" },
          { value: "76.0%", label: "'Very Satisfied' Rate", delta: "Highest of any cluster, vs. 70.9% average" },
        ],
        narrative:
          "Gin-Lovers Mixologists post the highest top-2-box satisfaction (96.0%) and 'very satisfied' rate (76.0%) of any cluster, yet their NPS (60.1) sits close to the overall average — driven by a higher passive rate (29.4% score 7-8) than WE, meaning highly satisfied GM shoppers are somewhat less likely than WE shoppers to convert that satisfaction into a top-box recommendation score.",
        takeaway:
          "GM is highly satisfied but converts that satisfaction into advocacy less efficiently than Whisky Enthusiasts — a conversion gap worth closing given this cluster's high engagement elsewhere.",
        implication:
          "Test targeted recommendation prompts or loyalty incentives for GM shoppers at the point of high satisfaction (e.g., post-purchase, post-recipe-content engagement) to convert passive sentiment into active advocacy.",
      },
      cannabis: {
        stats: [
          { value: "89.9%", label: "Very Positive Brand Opinion", delta: "+11.6 pts vs. non-purchasers" },
          { value: "Above Avg.", label: "Overall Satisfaction", delta: "Higher engagement across discovery channels" },
          { value: "79.5%", label: "OHLQ.com Navigation Satisfaction", delta: "-20.5 pts vs. non-purchasers" },
        ],
        narrative:
          "Cannabis purchasers hold more positive opinions of OHLQ than non-purchasers across nearly every measure, but satisfaction is bifurcated by the same OHLQ.com navigation gap identified in Chapter 5 and Chapter 9.",
        takeaway:
          "Overall sentiment is excellent for this segment; a specific digital usability gap is the exception, not the rule.",
        implication:
          "Closing the OHLQ.com navigation gap is the single highest-leverage satisfaction fix available for this segment.",
      },
    },
  },
  {
    id: "ch8",
    number: "08",
    title: "Promotion",
    framing: "Is OHLQ's messaging landing with shoppers?",
    hasSegments: false,
    questions: [
      "Why did 'Raise a Glass. Responsibly.' recall drop so sharply?",
      "Why does Liquordation outperform Last Call despite lower recall?",
      "What should we test before launching the next promotion?",
    ],
    content: {
      all: {
        stats: [
          { value: "49%", label: "'Raise a Glass. Responsibly.' Recall", delta: "-20 pts vs. Wave 5 (69%→49%)" },
          { value: "21%", label: "Unaided Communication Recall", delta: "Steady, well above baseline" },
          { value: "83%", label: "Correct ID Rate for 'Liquordation'", delta: "vs. only 20% recall / frequent misread for 'Last Call'" },
        ],
        narrative:
          "Unaided communication recall held steady at 21%, well above baseline, though recall among 21–34 year-olds dropped sharply from 34% to 21% while 35–54 year-olds grew from 20% to 28%. The most significant finding: recall of 'Raise a Glass. Responsibly.' dropped from 69% to 49% (-20 pts), falling below every prior wave after years of steady growth. Among promotional mechanics, the performance gap between 'Last Call' and 'Liquordation' is stark: only 20% of shoppers recall the 'Last Call' tag, and among those who do, most interpret it as bar closing time rather than a discontinued product event. By contrast, 'Liquordation' is recalled by 11% of shoppers, and 83% of those who recognize it correctly identify it as a discount or sale signal.",
        takeaway:
          "The sharp drop in 'Raise a Glass' recall is the clearest red flag in Wave 6. Liquordation should be the creative model for future in-store promotions; Last Call needs a fundamental rethink before it can function as an effective conversion tool.",
        implication:
          "Test message comprehension before launch — if a shopper cannot identify what a promotional tag means within two seconds, it will not drive behavior at shelf.",
      },
    },
  },
  {
    id: "ch9",
    number: "09",
    title: "Emerging Trends",
    framing: "What's newly shaping the shopper landscape?",
    hasSegments: true,
    questions: [
      "Why does Whisky Enthusiasts over-index so heavily on AI tools?",
      "How significant is AI tool usage for liquor research right now?",
      "What's the single highest-ROI near-term investment based on this data?",
    ],
    content: {
      all: {
        stats: [
          { value: "51%", label: "Shoppers Who Also Purchase Cannabis", delta: "-2 pts vs. Wave 5 (53%→51%)" },
          { value: "12%", label: "AI Tool Usage for Liquor Research", delta: "New metric, on par with influencers/podcasts" },
          { value: "20.5 pt", label: "OHLQ.com Navigation Gap (Cannabis vs. Non)", delta: "Widest disparity in the dataset" },
        ],
        narrative:
          "Cannabis purchasers represent just over half of respondents (51%, down 2 points from 53% in Wave 5) and are a meaningfully different, higher-value audience. They are more brand-aware (66.9% vs. 55.1%), more likely to have ever shopped OHLQ (57.6% vs. 43.4%), and more likely to shop OHLQ most often (31.8% vs. 18.1%). They hold more positive opinions of the brand (89.9% vs. 78.3%) and are more engaged across discovery channels including Facebook, Reddit, and X. The gap shows up specifically on OHLQ.com, where cannabis purchasers rate ease of navigation at 79.5% versus 100% among non-purchasers — the widest single disparity in the Wave 6 dataset. Separately, AI tools like ChatGPT already register at 12% for liquor research despite appearing in the survey for the first time this wave.",
        takeaway:
          "Cannabis purchasers are a higher-value, higher-engagement audience hiding in plain sight. The OHLQ.com navigation gap is a targeted, fixable problem standing between this audience and stronger brand loyalty.",
        implication:
          "OHLQ.com UX improvement for the cannabis purchaser segment, combined with social and Reddit presence where this group over-indexes, represents one of the highest-ROI near-term marketing investments available.",
      },
      we: {
        stats: [
          { value: "19.9%", label: "AI Tool Usage for Liquor Research", delta: "Highest of any cluster, vs. 13.0% average" },
          { value: "52.1%", label: "Cannabis Purchase Rate (Past 6 Mo.)", delta: "vs. 47.4% average" },
          { value: "42.5%", label: "Facebook Usage for Liquor Research", delta: "vs. 37.7% average" },
        ],
        narrative:
          "Whisky Enthusiasts show by far the highest AI-tool adoption for liquor research of any cluster (19.9% vs. 13.0% average) — nearly triple the rate of Light Spirit Drinkers (6.6%). This cluster is also above average on cannabis crossover (52.1%) and on Facebook, Reddit, and general search engagement, confirming that WE's exploration-driven mindset extends into the newest research channels, not just traditional ones.",
        takeaway:
          "Emerging-trend behaviors, especially AI-assisted research, are already concentrated in OHLQ's highest-value cluster.",
        implication:
          "Pilot AI-tool-friendly content — structured product info, FAQ-style copy — targeting Whisky Enthusiasts first, since this cluster is already the earliest adopter of the channel.",
      },
      ls: {
        stats: [
          { value: "6.6%", label: "AI Tool Usage for Liquor Research", delta: "Lowest of any cluster, vs. 13.0% average" },
          { value: "41.3%", label: "Cannabis Purchase Rate (Past 6 Mo.)", delta: "Lowest of any cluster, vs. 47.4% average" },
          { value: "42.0%", label: "'None of the Above' for Social/Search Sources", delta: "Highest of any cluster, vs. 28.1% average" },
        ],
        narrative:
          "Light Spirit Drinkers show the lowest engagement with every emerging channel measured: AI tools (6.6% vs. 13.0% average), cannabis crossover (41.3% vs. 47.4%), and social/search sources broadly, with 42.0% selecting 'none of the above' for social and search tools versus 28.1% on average.",
        takeaway:
          "Emerging trends covered in this chapter are least relevant to this segment's current decision journey of any profiled cluster.",
        implication:
          "Don't divert emerging-channel investment away from Whisky Enthusiasts or Gin-Lovers Mixologists in order to reach LS shoppers, who are demonstrably not there yet.",
      },
      gm: {
        stats: [
          { value: "56.1%", label: "Cannabis Purchase Rate (Past 6 Mo.)", delta: "Highest of any cluster, vs. 47.4% average" },
          { value: "52.9%", label: "YouTube Usage for Liquor Research", delta: "Highest of any cluster, vs. 31.5% average" },
          { value: "14.0%", label: "AI Tool Usage for Liquor Research", delta: "vs. 13.0% average" },
        ],
        narrative:
          "Gin-Lovers Mixologists show the highest cannabis crossover of any cluster (56.1%) and the highest YouTube usage for liquor research (52.9%, versus 31.5% average) — consistent with a segment that leans heavily on visual, recipe-driven content. AI tool usage (14.0%) is close to average, trailing Whisky Enthusiasts but still ahead of Light Spirit Drinkers.",
        takeaway:
          "GM's emerging-channel engagement is concentrated in visual and recipe-driven platforms (YouTube, Facebook) rather than AI search specifically.",
        implication:
          "Prioritize YouTube and Facebook cocktail/recipe content for GM shoppers as the highest-reach emerging-channel investment, rather than leading with AI-search-optimized content as with Whisky Enthusiasts.",
      },
      cannabis: {
        stats: [
          { value: "66.9%", label: "Brand Awareness (vs. 55.1% Non-Purchasers)", delta: "+11.8 pts" },
          { value: "89.9%", label: "Very Positive Brand Opinion (vs. 78.3%)", delta: "+11.6 pts" },
          { value: "79.5%", label: "OHLQ.com Navigation Ease", delta: "-20.5 pts vs. 100% among non-purchasers" },
        ],
        narrative:
          "This is the segment Chapter 9 is centered on: cannabis purchasers are more brand-aware, more likely to have shopped OHLQ, more likely to shop it most often, and hold more positive opinions than non-purchasers — but experience a sharply worse OHLQ.com navigation experience, the widest disparity in the entire dataset.",
        takeaway:
          "Cannabis purchasers are a higher-value, higher-engagement audience hiding in plain sight, undermined by one fixable digital gap.",
        implication:
          "OHLQ.com UX improvement for this segment, paired with social/Reddit presence, is one of the highest-ROI near-term investments available.",
      },
    },
  },
  {
    id: "appendix",
    number: "App.",
    title: "Appendix: Supporting Resources",
    framing: "Reference material for the client team",
    hasSegments: false,
    isAppendix: true,
    questions: [
      "Which cluster has the highest annual spend?",
      "How does Whiskies Enthusiast compare to Gin Mixologists on cannabis crossover?",
      "Where can I find the sixth cluster not shown in this table?",
    ],
    content: {
      all: {
        stats: [],
        narrative:
          "The table below is reproduced from the client's cluster reference deck for quick lookup alongside this tool. It summarizes cluster size, annual spend, top spirit categories, purchase frequency, and other-category crossover for five of the six purchasing clusters used throughout this tracker (Frequent Low-Cost Moderate Buyers, roughly 5% of shoppers, is tracked in the full crosstab but not shown in this particular summary).",
        takeaway: "",
        implication: "",
      },
    },
  },
];

/* ---------------------------------------------------------------
   CHART COMPONENTS
   ------------------------------------------------------------- */
function InfoSourcesChart() {
  return (
    <div style={styles.chartCard} className="ohlq-chart-card">
      <div style={styles.chartTitle}>Where Shoppers Look for Liquor Information</div>
      <ResponsiveContainer width="100%" height={430}>
        <BarChart data={INFO_SOURCE_DATA} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
          <XAxis type="number" domain={[0, 55]} tick={{ fontSize: 11, fill: MUTED, fontFamily: FONT }} unit="%" />
          <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 11.5, fill: TEXT, fontFamily: FONT }} />
          <Tooltip
            formatter={(value) => [`${value}%`, "Selected this source"]}
            contentStyle={{ fontFamily: FONT, fontSize: 12, border: `1px solid ${BORDER}` }}
          />
          <Bar dataKey="value" radius={0} barSize={14}>
            {INFO_SOURCE_DATA.map((entry, i) => (
              <Cell key={i} fill={CATEGORY_COLOR[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={styles.chartLegendRow}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendSwatch, background: CHARCOAL }} /> General / In-Store
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendSwatch, background: ACCENT }} /> Social / Search
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendSwatch, background: "#A3A3A3" }} /> Industry
        </span>
      </div>
      <div style={styles.chartCaption}>
        Base: All respondents, Wave 6 (N=500). "(Owned)" denotes an OHLQ-operated channel.
      </div>
    </div>
  );
}

function WaveTrendChart({ type }) {
  const isAwareness = type === "awareness-trend";
  const data = isAwareness ? AWARENESS_TREND_DATA : SATISFACTION_TREND_DATA;
  const title = isAwareness
    ? "Awareness & Logo Recall by Wave"
    : "Satisfaction & NPS by Wave";
  const lines = isAwareness
    ? [
        { key: "Unaided Awareness", color: "#A3A3A3" },
        { key: "Aided Awareness", color: CHARCOAL },
        { key: "Logo Recall", color: ACCENT },
      ]
    : [
        { key: "Satisfaction (Top-2-Box)", color: CHARCOAL },
        { key: "NPS", color: ACCENT },
      ];

  return (
    <div style={styles.chartCard} className="ohlq-chart-card">
      <div style={styles.chartTitle}>{title}</div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 24, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
          <XAxis dataKey="wave" tick={{ fontSize: 10.5, fill: MUTED, fontFamily: FONT }} />
          <YAxis tick={{ fontSize: 11, fill: MUTED, fontFamily: FONT }} />
          <Tooltip contentStyle={{ fontFamily: FONT, fontSize: 12, border: `1px solid ${BORDER}` }} />
          <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 12 }} />
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              stroke={l.color}
              strokeWidth={2.5}
              dot={{ r: 3.5 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={styles.chartCaption}>
        {isAwareness
          ? "Source: OHLQ Key Comparison Metrics, Wave 1 (Mar '21, N=1,000) through Wave 6 (Feb '26, N=500)."
          : "Source: OHLQ Key Comparison Metrics, Wave 1 (Mar '21, N=1,000) through Wave 6 (Feb '26, N=500). The Wave 5 NPS spike coincides with fielding immediately after the Nov. 2024 election."}
      </div>
    </div>
  );
}

function sigColor(sig) {
  if (sig === "higher") return "#2A5CAA";
  if (sig === "lower") return ACCENT;
  return TEXT;
}

function ClusterReferenceTable() {
  const cols = CLUSTER_TABLE.columns;
  return (
    <div style={styles.tableWrap} className="ohlq-table-wrap">
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableCornerCell}></th>
            {cols.map((c) => (
              <th key={c.key} style={styles.tableHeaderCell}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tableRowLabel}>Cluster Size</td>
            {cols.map((c) => (
              <td style={styles.tableCell} key={c.key}>
                {CLUSTER_TABLE.size[c.key]}
              </td>
            ))}
          </tr>
          <tr>
            <td style={{ ...styles.tableRowLabel, background: GRAY_TINT }}>Annual Spend</td>
            {cols.map((c) => (
              <td style={{ ...styles.tableCell, background: GRAY_TINT }} key={c.key}>
                {CLUSTER_TABLE.spend[c.key]}
              </td>
            ))}
          </tr>
          <tr>
            <td style={styles.tableRowLabel}>
              Top Spirit Categories
              <div style={styles.tableRowSubLabel}>(% of segment that purchases, avg $/bottle)</div>
            </td>
            {cols.map((c) => (
              <td style={styles.tableCellList} key={c.key}>
                <ul style={styles.ul}>
                  {CLUSTER_TABLE.topCategories[c.key].map((line, i) => (
                    <li key={i} style={styles.li}>
                      {line}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <td style={{ ...styles.tableRowLabel, background: GRAY_TINT }}>Average Frequency</td>
            {cols.map((c) => (
              <td style={{ ...styles.tableCell, background: GRAY_TINT }} key={c.key}>
                {CLUSTER_TABLE.frequency[c.key]}
              </td>
            ))}
          </tr>
          <tr>
            <td style={styles.tableRowLabel}>
              Other Category Purchase
              <div style={styles.tableRowSubLabel}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>Red</span> = significantly lower,{" "}
                <span style={{ color: "#2A5CAA", fontWeight: 700 }}>Blue</span> = significantly higher vs.
                other clusters (95% CI)
              </div>
            </td>
            {cols.map((c) => (
              <td style={styles.tableCellList} key={c.key}>
                <ul style={styles.ul}>
                  {CLUSTER_TABLE.otherCategories[c.key].map((item, i) => (
                    <li key={i} style={styles.li}>
                      {item.name}{" "}
                      <span style={{ color: sigColor(item.sig), fontWeight: 700 }}>({item.value})</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------
   STYLES
   ------------------------------------------------------------- */
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: FONT,
    color: TEXT,
    background: "#FFFFFF",
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    borderRight: `1px solid ${BORDER}`,
    background: "#FAFAFA",
    padding: "24px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  sidebarHeader: {
    padding: "0 20px 20px 20px",
    borderBottom: `3px solid ${ACCENT}`,
    marginBottom: 12,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  brandName: {
    fontSize: 20,
    fontWeight: 800,
    color: ACCENT,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    cursor: "pointer",
    background: active ? ACCENT : "transparent",
    color: active ? "#FFFFFF" : TEXT,
    borderLeft: active ? `3px solid ${CHARCOAL}` : "3px solid transparent",
  }),
  navNumber: (active) => ({
    fontSize: 11,
    fontWeight: 700,
    color: active ? "#F7D9DB" : MUTED,
    minWidth: 30,
  }),
  navLabel: {
    fontSize: 13.5,
    lineHeight: 1.3,
  },
  navDivider: {
    borderTop: `1px solid ${BORDER}`,
    margin: "12px 20px",
  },
  main: {
    flex: 1,
    padding: "40px 56px 80px 56px",
    maxWidth: 980,
  },
  chapterEyebrow: {
    fontSize: 12,
    fontWeight: 800,
    color: ACCENT,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  chapterTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: CHARCOAL,
    margin: 0,
  },
  framing: {
    fontStyle: "italic",
    color: MUTED,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  segmentRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  pill: (active) => ({
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    borderRadius: 2,
    border: `1.5px solid ${ACCENT}`,
    background: active ? ACCENT : "#FFFFFF",
    color: active ? "#FFFFFF" : ACCENT,
    cursor: "pointer",
  }),
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    border: `1px solid ${BORDER}`,
    borderTop: `3px solid ${ACCENT}`,
    borderRadius: 2,
    padding: "18px 18px 16px 18px",
    background: "#FFFFFF",
  },
  statValue: {
    fontSize: 26,
    fontWeight: 800,
    color: ACCENT,
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: 13,
    color: TEXT,
    marginTop: 8,
    fontWeight: 600,
  },
  statDelta: {
    fontSize: 12,
    color: MUTED,
    marginTop: 6,
  },
  narrative: {
    fontSize: 15.5,
    lineHeight: 1.7,
    color: TEXT,
    marginBottom: 28,
  },
  chartCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: 2,
    padding: "20px 20px 12px 20px",
    marginBottom: 32,
    background: "#FFFFFF",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: CHARCOAL,
    marginBottom: 4,
  },
  chartCaption: {
    fontSize: 11.5,
    color: MUTED,
    marginTop: 8,
  },
  chartLegendRow: {
    display: "flex",
    gap: 18,
    marginTop: 6,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: MUTED,
  },
  legendSwatch: {
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: 1,
  },
  takeawayBox: {
    borderLeft: `4px solid ${CHARCOAL}`,
    background: GRAY_TINT,
    padding: "16px 20px",
    marginBottom: 20,
    borderRadius: 2,
  },
  takeawayLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: CHARCOAL,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  takeawayText: {
    fontSize: 15,
    fontWeight: 700,
    color: TEXT,
    lineHeight: 1.55,
    margin: 0,
  },
  implicationBox: {
    background: ACCENT,
    padding: "22px 26px",
    marginBottom: 40,
    borderRadius: 2,
  },
  implicationLabel: {
    fontSize: 11.5,
    fontWeight: 800,
    color: "#FFFFFF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
    opacity: 0.92,
  },
  implicationText: {
    fontSize: 17,
    fontStyle: "italic",
    fontWeight: 800,
    color: "#FFFFFF",
    lineHeight: 1.5,
    margin: 0,
  },
  qaSection: {
    borderTop: `1px solid ${BORDER}`,
    paddingTop: 28,
  },
  qaHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: ACCENT,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  suggestedRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  suggestedChip: {
    padding: "8px 14px",
    fontSize: 13,
    border: `1px solid ${BORDER}`,
    borderRadius: 2,
    background: "#FFFFFF",
    color: ACCENT,
    cursor: "pointer",
  },
  chatLog: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 16,
  },
  chatQ: {
    fontSize: 14,
    fontWeight: 700,
    color: TEXT,
    background: "#F2F4F7",
    padding: "10px 14px",
    borderRadius: 2,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  chatA: {
    fontSize: 14,
    lineHeight: 1.6,
    color: TEXT,
    border: `1px solid ${BORDER}`,
    padding: "12px 14px",
    borderRadius: 2,
    background: "#FFFFFF",
  },
  inputRow: {
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    fontSize: 14,
    border: `1px solid ${BORDER}`,
    borderRadius: 2,
    fontFamily: FONT,
    outline: "none",
  },
  sendBtn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    background: ACCENT,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 2,
    cursor: "pointer",
  },
  sendBtnDisabled: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    background: "#C9A6A9",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 2,
    cursor: "not-allowed",
  },
  tableWrap: {
    overflowX: "auto",
    marginBottom: 32,
    border: `1px solid ${BORDER}`,
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    minWidth: 900,
  },
  tableCornerCell: {
    border: `1px solid ${BORDER}`,
    background: "#FFFFFF",
    width: 170,
  },
  tableHeaderCell: {
    border: `1px solid ${BORDER}`,
    background: ACCENT,
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: 800,
    padding: "12px 10px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRowLabel: {
    border: `1px solid ${BORDER}`,
    fontSize: 12.5,
    fontWeight: 700,
    color: CHARCOAL,
    padding: "10px 12px",
    verticalAlign: "top",
    width: 170,
  },
  tableRowSubLabel: {
    fontSize: 10.5,
    fontWeight: 400,
    color: MUTED,
    marginTop: 4,
    textTransform: "none",
  },
  tableCell: {
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    color: TEXT,
    padding: "10px 12px",
    textAlign: "center",
  },
  tableCellList: {
    border: `1px solid ${BORDER}`,
    fontSize: 12,
    color: TEXT,
    padding: "10px 12px",
    verticalAlign: "top",
  },
  ul: {
    margin: 0,
    paddingLeft: 16,
  },
  li: {
    marginBottom: 4,
    lineHeight: 1.4,
  },
};

/* ---------------------------------------------------------------
   RESPONSIVE / MOBILE CSS
   Inline styles above define the desktop layout. This stylesheet
   uses !important to override those inline styles at narrower
   viewports (inline styles otherwise beat plain CSS specificity).
   ------------------------------------------------------------- */
const RESPONSIVE_CSS = `
  .ohlq-mobile-topbar { display: none; }
  .ohlq-mobile-overlay { display: none; }
  .ohlq-mobile-close-btn { display: none; }

  @media (max-width: 860px) {
    .ohlq-app { flex-direction: column !important; }

    .ohlq-mobile-topbar {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 3px solid ${ACCENT};
      background: #FFFFFF;
      position: sticky;
      top: 0;
      z-index: 900;
    }
    .ohlq-mobile-topbar-brand {
      font-size: 15px;
      font-weight: 800;
      color: ${ACCENT};
      letter-spacing: 0.4px;
    }
    .ohlq-mobile-topbar-sub {
      font-size: 11px;
      font-weight: 400;
      color: ${MUTED};
      margin-left: 6px;
    }
    .ohlq-hamburger-btn {
      width: 34px;
      height: 34px;
      border: 1px solid ${BORDER};
      background: #FFFFFF;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      padding: 0;
    }
    .ohlq-hamburger-btn span {
      display: block;
      width: 16px;
      height: 2px;
      background: ${CHARCOAL};
    }
    .ohlq-mobile-close-btn {
      display: block !important;
      width: 30px;
      height: 30px;
      border: none;
      background: transparent;
      color: ${MUTED};
      font-size: 16px;
      cursor: pointer;
      line-height: 1;
    }

    .ohlq-mobile-overlay.open {
      display: block !important;
      position: fixed;
      inset: 0;
      background: rgba(20, 20, 20, 0.45);
      z-index: 999;
    }

    .ohlq-sidebar {
      display: none !important;
    }
    .ohlq-sidebar.open {
      display: block !important;
      position: fixed !important;
      top: 0;
      left: 0;
      height: 100vh !important;
      width: 84% !important;
      max-width: 300px !important;
      z-index: 1000;
    }

    .ohlq-main {
      padding: 20px 16px 56px 16px !important;
      max-width: 100% !important;
    }
    .ohlq-chapter-title {
      font-size: 24px !important;
    }
    .ohlq-stat-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
      margin-bottom: 24px !important;
    }
    .ohlq-chart-card {
      padding: 14px 12px 10px 12px !important;
    }
    .ohlq-table-wrap {
      -webkit-overflow-scrolling: touch;
    }
  }

  @media (max-width: 480px) {
    .ohlq-narrative {
      font-size: 14.5px !important;
    }
    .ohlq-input-row {
      flex-direction: column !important;
    }
    .ohlq-send-btn {
      width: 100% !important;
    }
  }
`;


export default function OHLQExplorer() {
  const [activeChapterId, setActiveChapterId] = useState(CHAPTERS[0].id);
  const [segment, setSegment] = useState("all");
  const [qaState, setQaState] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logEndRef = useRef(null);

  function goToChapter(id) {
    setActiveChapterId(id);
    setMobileMenuOpen(false);
  }

  const chapter = CHAPTERS.find((c) => c.id === activeChapterId);
  const segKey = chapter.hasSegments ? segment : "all";
  const content = chapter.content[segKey] || chapter.content.all;
  const segLabel = SEGMENTS.find((s) => s.id === segKey)?.label || "All Shoppers";

  const chapterQa = qaState[activeChapterId] || { history: [], loading: false, input: "" };

  const setChapterQa = (updates) => {
    setQaState((prev) => ({
      ...prev,
      [activeChapterId]: { ...chapterQa, ...updates },
    }));
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chapterQa.history.length, chapterQa.loading]);

  async function askQuestion(question) {
    if (!question || !question.trim()) return;
    const trimmed = question.trim();
    const newHistory = [...chapterQa.history, { role: "user", content: trimmed }];
    setChapterQa({ history: newHistory, loading: true, input: "" });

    const systemPrompt = `You are a research analyst assistant embedded in an interactive client presentation for OHLQ's Wave 6 brand awareness tracker. Answer questions grounded strictly in the Wave 6 study data provided below. Be concise, precise, and client-ready. The user is currently viewing: Chapter "${chapter.title}" (${chapter.framing}), with the segment filter set to "${segLabel}". Use that context to tailor your answer when relevant, but also answer questions about other chapters, other segments, the Appendix reference table, or wave-over-wave comparisons if asked. If a question requires data not present below, say so plainly rather than inventing figures.\n\nWAVE 6 STUDY DATA:\n${GROUNDING_CONTEXT}`;

    try {
      const apiMessages = newHistory.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const response = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const text =
        (data.content || [])
          .map((block) => (block.type === "text" ? block.text : ""))
          .filter(Boolean)
          .join("\n") || "I wasn't able to generate a response. Please try rephrasing your question.";

      setQaState((prev) => {
        const cur = prev[activeChapterId] || { history: newHistory, loading: true, input: "" };
        return {
          ...prev,
          [activeChapterId]: {
            ...cur,
            history: [...cur.history, { role: "assistant", content: text }],
            loading: false,
          },
        };
      });
    } catch (err) {
      setQaState((prev) => {
        const cur = prev[activeChapterId] || { history: newHistory, loading: true, input: "" };
        return {
          ...prev,
          [activeChapterId]: {
            ...cur,
            history: [
              ...cur.history,
              {
                role: "assistant",
                content:
                  "Sorry — I couldn't reach the analysis service just now. Please try again in a moment.",
              },
            ],
            loading: false,
          },
        };
      });
    }
  }

  return (
    <div style={styles.app} className="ohlq-app">
      <style>{RESPONSIVE_CSS}</style>

      {/* MOBILE TOP BAR */}
      <div className="ohlq-mobile-topbar">
        <button
          className="ohlq-hamburger-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open chapter menu"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="ohlq-mobile-topbar-brand">
          OHLQ <span className="ohlq-mobile-topbar-sub">Wave 6</span>
        </div>
        <div style={{ width: 34 }} />
      </div>

      {/* MOBILE BACKDROP */}
      <div
        className={`ohlq-mobile-overlay${mobileMenuOpen ? " open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* SIDEBAR */}
      <div style={styles.sidebar} className={`ohlq-sidebar${mobileMenuOpen ? " open" : ""}`}>
        <div style={styles.sidebarHeader} className="ohlq-sidebar-header">
          <div>
            <div style={styles.brandName}>OHLQ</div>
            <div style={styles.brandSub}>Brand Tracker · Wave 6 · Feb 2026</div>
          </div>
          <button
            className="ohlq-mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close chapter menu"
          >
            ✕
          </button>
        </div>
        {CHAPTERS.map((c) => (
          <React.Fragment key={c.id}>
            {c.id === "appendix" && <div style={styles.navDivider} />}
            <div style={styles.navItem(c.id === activeChapterId)} onClick={() => goToChapter(c.id)}>
              <span style={styles.navNumber(c.id === activeChapterId)}>{c.number}</span>
              <span style={styles.navLabel}>{c.title}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* MAIN */}
      <div style={styles.main} className="ohlq-main">
        <div style={styles.chapterEyebrow}>
          {chapter.number === "Intro"
            ? "Executive Summary"
            : chapter.isAppendix
            ? "Appendix"
            : `Chapter ${chapter.number}`}
        </div>
        <h1 style={styles.chapterTitle} className="ohlq-chapter-title">{chapter.title}</h1>
        <p style={styles.framing}>{chapter.framing}</p>

        {chapter.hasSegments && (
          <div style={styles.segmentRow}>
            {SEGMENTS.map((s) => (
              <div key={s.id} style={styles.pill(segment === s.id)} onClick={() => setSegment(s.id)}>
                {s.label}
              </div>
            ))}
          </div>
        )}

        {chapter.isAppendix ? (
          <>
            <p style={styles.narrative} className="ohlq-narrative">{content.narrative}</p>
            <ClusterReferenceTable />
          </>
        ) : (
          <>
            {content.stats.length > 0 && (
              <div style={styles.statGrid} className="ohlq-stat-grid">
                {content.stats.map((stat, i) => (
                  <div style={styles.statCard} key={i}>
                    <div style={styles.statValue}>{stat.value}</div>
                    <div style={styles.statLabel}>{stat.label}</div>
                    <div style={styles.statDelta}>{stat.delta}</div>
                  </div>
                ))}
              </div>
            )}

            <p style={styles.narrative} className="ohlq-narrative">{content.narrative}</p>

            {chapter.hasChart === "info-sources" && <InfoSourcesChart />}
            {chapter.hasChart === "awareness-trend" && <WaveTrendChart type="awareness-trend" />}
            {chapter.hasChart === "satisfaction-trend" && <WaveTrendChart type="satisfaction-trend" />}

            <div style={styles.takeawayBox}>
              <div style={styles.takeawayLabel}>Key Takeaway</div>
              <p style={styles.takeawayText}>{content.takeaway}</p>
            </div>

            <div style={styles.implicationBox}>
              <div style={styles.implicationLabel}>Marketing Implication</div>
              <p style={styles.implicationText}>{content.implication}</p>
            </div>
          </>
        )}

        {/* Q&A */}
        <div style={styles.qaSection}>
          <div style={styles.qaHeader}>Ask About This Chapter</div>
          <div style={styles.suggestedRow}>
            {chapter.questions.map((q, i) => (
              <div key={i} style={styles.suggestedChip} onClick={() => askQuestion(q)}>
                {q}
              </div>
            ))}
          </div>

          {chapterQa.history.length > 0 && (
            <div style={styles.chatLog}>
              {chapterQa.history.map((m, i) =>
                m.role === "user" ? (
                  <div style={styles.chatQ} key={i}>
                    {m.content}
                  </div>
                ) : (
                  <div style={styles.chatA} key={i}>
                    {m.content}
                  </div>
                )
              )}
              {chapterQa.loading && <div style={styles.chatA}>Thinking…</div>}
              <div ref={logEndRef} />
            </div>
          )}

          <div style={styles.inputRow} className="ohlq-input-row">
            <input
              style={styles.input}
              type="text"
              placeholder="Ask a follow-up question about this chapter, a segment, or a prior wave..."
              value={chapterQa.input || ""}
              onChange={(e) => setChapterQa({ input: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") askQuestion(chapterQa.input);
              }}
            />
            <button
              style={chapterQa.loading ? styles.sendBtnDisabled : styles.sendBtn}
              className="ohlq-send-btn"
              disabled={chapterQa.loading}
              onClick={() => askQuestion(chapterQa.input)}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}