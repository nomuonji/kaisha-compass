import MarkdownIt from "markdown-it";
export type CmsFeature = {
  siteId: string; slug: string; title: string; summary: string; bodyMarkdown: string;
  publishedAt: string|null; updatedAt: string|null;
  seo?: { title?: string; description?: string; noindex?: boolean };
};
const SITE_ID="kaisha-compass";
const BASE=import.meta.env.PUBLIC_CMS_BASE_URL||"https://my-portal-agent.netlify.app";
const SLUG=/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/;
const md=new MarkdownIt({html:false,linkify:true});
export const renderFeature=(markdown:string)=>md.render(markdown);
function valid(a:unknown):a is CmsFeature{
  if(!a||typeof a!=="object")return false;
  const r=a as Record<string,unknown>;
  return r.siteId===SITE_ID&&typeof r.slug==="string"&&SLUG.test(r.slug)&&
    typeof r.title==="string"&&typeof r.summary==="string"&&typeof r.bodyMarkdown==="string";
}
async function request(slug?:string):Promise<unknown>{
  if(slug&&!SLUG.test(slug))return null;
  const u=new URL("/api/public-content",BASE);
  u.searchParams.set("site",SITE_ID);
  if(slug)u.searchParams.set("slug",slug);else u.searchParams.set("limit","100");
  const res=await fetch(u,{signal:AbortSignal.timeout(7000)});
  return res.ok?res.json():null;
}
export async function listFeatures():Promise<CmsFeature[]>{
  try{const r=await request() as {items?:unknown[]}|null;return Array.isArray(r?.items)?r.items.filter(valid).slice(0,100):[];}catch{return [];}
}
export async function getFeature(slug:string):Promise<CmsFeature|null>{
  try{const r=await request(slug) as {item?:unknown}|null;return valid(r?.item)&&r.item.slug===slug?r.item:null;}catch{return null;}
}
