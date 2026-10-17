import type { APIRoute } from "astro";
import { events, resources, topicMeta } from "../lib/data";
import { companyLawLessons, lawLessonPath } from "../lib/companyLawLessons";
import { practicalGuides, practicalGuideHref } from "../lib/practicalGuides";

// These are the three public, indexable modes from explore/[mode].astro.
const exploreModes = ["events", "practice", "law"] as const;

const xmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};
const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => xmlEntities[character]);

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://kaisha-compass.antonbase.com/");

  // Use the same published datasets and path helpers as getStaticPaths.
  // Do not list the noindex CMS template or query-driven explorer states.
  const paths = [
    "/",
    "/resources/",
    "/company-law/",
    "/practice/",
    "/privacy/",
    ...events.map((event) => `/journey/${event.id}/`),
    ...Object.keys(topicMeta).map((topic) => `/topics/${topic}/`),
    ...resources.map((resource) => `/resources/${resource.id}/`),
    ...companyLawLessons.map((lesson) => lawLessonPath(lesson.slug)),
    ...practicalGuides.map((guide) => practicalGuideHref(guide.slug)),
    ...exploreModes.map((mode) => `/explore/${mode}/`),
  ];

  const locations = [...new Set(paths.map((path) => new URL(path, base).href))];
  const urls = locations
    .map((location) => `<url><loc>${escapeXml(location)}</loc></url>`)
    .join("");

  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls +
      "</urlset>",
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
