import {practicalGuidesA,type PracticalGuide} from "./practicalGuidesA";
import {practicalGuidesB} from "./practicalGuidesB";
export type {PracticalGuide} from "./practicalGuidesA";
export const practicalGuides:PracticalGuide[]=[...practicalGuidesA,...practicalGuidesB];
export const practicePhases=[
  {id:"founding",name:"設立前",label:"創業の準備",description:"会社形態、共同創業、資本金、定款、設立手続、行政への届出"},
  {id:"first-year",name:"初期運営",label:"会社を動かす",description:"会社のお金、契約、役員報酬、採用、経理と設備投資"},
  {id:"growing",name:"成長と意思決定",label:"経営判断が増える",description:"借入、意思決定、利益相反、本店・役員変更、株主と資金調達"},
  {id:"closing",name:"一年の締めくくり",label:"決算とその先",description:"決算、定時株主総会、事業変更、解散と清算"},
] as const;
export const practiceLastEdited="2026-10-12";
export const practicalGuideHref=(slug:string)=>`/practice/${slug}/`;
export const practiceSceneBySlug:Record<string,string>={
  "kk-or-gk":"foundation","cofounder-fifty-fifty":"foundation","capital-and-ownership":"foundation",
  "articles-business-purpose":"foundation","incorporation-paperwork":"foundation","first-month-admin":"foundation",
  "company-versus-personal-money":"bookkeeping","who-signs-contract":"first-contract","first-client-contract":"first-contract",
  "officer-compensation":"officer-compensation","first-employee":"hire","purchase-computer":"asset",
  "founder-loan-or-equity":"loan","profit-versus-cash":"loan","one-shareholder-meeting":"annual-meeting",
  "conflict-of-interest":"director-change","office-relocation":"director-change","change-director":"director-change",
  "keep-shareholder-register":"annual-meeting","cofounder-share-transfer":"director-change",
  "investment-new-shares":"loan","prepare-annual-accounts":"closing","annual-shareholders-meeting":"annual-meeting",
  "change-business-purpose":"director-change","close-or-liquidate":"closing"
};
