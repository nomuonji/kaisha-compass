import companyData from "../data/company.json";
import eventsData from "../data/events.json";
import resourcesData from "../data/resources.json";

export type TopicId = "company" | "tax" | "labor" | "accounting" | "finance" | "contracts";
export type SourceType = "official" | "practical";

export interface CompanyFact { label: string; value: string; }
export interface Company { name: string; description: string; facts: CompanyFact[]; }
export interface CompanyEvent { id: string; month: string; title: string; summary: string; }
export interface Resource {
  id: string; title: string; provider: string; url: string; sourceType: SourceType;
  difficulty: string; time: string; why: string; topics: TopicId[]; eventIds: string[];
  tags: string[]; lastCheckedAt?: string; validAsOf?: string;
}

export const company = companyData as Company;
export const events = eventsData as CompanyEvent[];
export const resources = resourcesData as Resource[];

export const topicMeta: Record<TopicId, { label: string; short: string; description: string; color: string }> = {
  company: { label:"会社設立・登記", short:"会社法", description:"設立、定款、機関設計、役員変更、本店移転、株主総会など。", color:"#173f31" },
  tax: { label:"税務", short:"税務", description:"法人税、消費税、源泉徴収、年末調整、各種届出。", color:"#b85d36" },
  labor: { label:"労務・社会保険", short:"労務", description:"採用、労働条件、社会保険、給与、退職まで。", color:"#b28a48" },
  accounting: { label:"会計・経理", short:"会計", description:"帳簿、決算、減価償却、損益と資産の見方。", color:"#486a7c" },
  finance: { label:"財務・資金繰り", short:"財務", description:"創業資金、融資、資金繰り、キャッシュ管理、財務分析。", color:"#705d7d" },
  contracts: { label:"契約・取引", short:"契約", description:"受注、契約、請求、回収、価格交渉、取引適正化。", color:"#52705d" }
};

export const sourceLabels: Record<SourceType,string> = { official:"公式資料", practical:"実務解説" };
export const resourcesForEvent = (id:string) => resources.filter(r => r.eventIds.includes(id));
export const resourcesForTopic = (topic:TopicId) => resources.filter(r => r.topics.includes(topic));
export const topicsForEvent = (id:string) => [...new Set(resourcesForEvent(id).flatMap(r => r.topics))] as TopicId[];

export function sortResources(list: Resource[]) {
  const order = new Map([["初級",0],["中級",1],["上級",2]]);
  return [...list].sort((a,b) => {
    if (a.sourceType !== b.sourceType) return a.sourceType === "official" ? -1 : 1;
    const d=(order.get(a.difficulty)??5)-(order.get(b.difficulty)??5);
    return d || a.title.localeCompare(b.title,"ja");
  });
}

export const stats = {
  resources: resources.length,
  events: events.length,
  official: resources.filter(r => r.sourceType === "official").length,
  practical: resources.filter(r => r.sourceType === "practical").length
};
