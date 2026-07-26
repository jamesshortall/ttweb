import { siteSettings } from "./siteSettings";
import { statistic } from "./statistic";
import { service } from "./service";
import { successStory } from "./successStory";
import { resource } from "./resource";
import { faq } from "./faq";
import { article } from "./article";
import { featuredBlogPost } from "./featuredBlogPost";
import { cardmasterFeature, cardmasterScreenshot } from "./cardmaster";
import { imageCollection } from "./imageCollection";
import { legalPage } from "./legalPage";
import { testimonial } from "./testimonial";
import { advertiser } from "./advertiser";
import { campaign } from "./campaign";
import { advertisement } from "./advertisement";
import { placementZone } from "./placementZone";
import { adNetwork } from "./adNetwork";
import { app } from "./app";

/**
 * All content models for the Travel Technician site. Field names mirror the
 * GROQ projections in the website's src/lib/cms/queries.ts — keep them in sync.
 */
export const schemaTypes = [
  siteSettings,
  statistic,
  service,
  successStory,
  resource,
  faq,
  article,
  featuredBlogPost,
  cardmasterFeature,
  cardmasterScreenshot,
  imageCollection,
  legalPage,
  testimonial,
  // Advertising
  advertiser,
  campaign,
  advertisement,
  placementZone,
  adNetwork,
  app,
];
