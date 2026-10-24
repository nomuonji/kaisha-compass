import type { APIRoute } from "astro";
import { events,resources,topicMeta } from "../lib/data";
export const GET:APIRoute=({site})=>{
  const base=site??new URL("https://example.invalid");
  const paths=["/","/resources/",...events.map(e=>"/journey/"+e.id+"/"),...Object.keys(topicMeta).map(t=>"/topics/"+t+"/"),...resources.map(r=>"/resources/"+r.id+"/")];
  // <lastmod> only where a real content date exists (resource pages carry their last verification date); never build time.
  const today=new Date().toISOString().slice(0,10);
  const lastmodByPath=new Map(resources.flatMap(r=>{const day=(r.lastCheckedAt??r.validAsOf??"").slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(day)&&day<=today?[["/resources/"+r.id+"/",day] as const]:[];}));
  const urls=paths.map(path=>"<url><loc>"+new URL(path,base).href+"</loc>"+(lastmodByPath.has(path)?"<lastmod>"+lastmodByPath.get(path)+"</lastmod>":"")+"</url>").join("");
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+"</urlset>",{headers:{"Content-Type":"application/xml; charset=utf-8"}});
};
