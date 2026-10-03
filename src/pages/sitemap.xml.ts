import type { APIRoute } from "astro";
import { events,resources,topicMeta } from "../lib/data";
export const GET:APIRoute=({site})=>{
  const base=site??new URL("https://example.invalid");
  const paths=["/","/resources/",...events.map(e=>"/journey/"+e.id+"/"),...Object.keys(topicMeta).map(t=>"/topics/"+t+"/"),...resources.map(r=>"/resources/"+r.id+"/")];
  const urls=paths.map(path=>"<url><loc>"+new URL(path,base).href+"</loc></url>").join("");
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+"</urlset>",{headers:{"Content-Type":"application/xml; charset=utf-8"}});
};
