import {cashStages,cashStageAt,ownershipAt} from "../lib/interactiveModels.mjs";
const yen=v=>Number(v).toLocaleString("ja-JP")+"円";
const pct=v=>Number(v).toFixed(1)+"%";
for(const root of document.querySelectorAll("[data-kc-cash]:not([data-kc-ready])")){
 root.dataset.kcReady="true";
 const buttons=[...root.querySelectorAll("[data-cash-step]")];
 const bars=[...root.querySelectorAll("[data-cash-bar]")];
 const setStep=index=>{
  const step=cashStageAt(index),i=cashStages.indexOf(step);
  root.dataset.step=String(i);
  buttons.forEach((b,n)=>b.setAttribute("aria-pressed",String(i===n)));
  bars.forEach((b,n)=>b.classList.toggle("is-current",i===n));
  const update=(sel,value)=>{const x=root.querySelector(sel);if(x)x.textContent=value;};
  update("[data-cash-revenue]",yen(step.revenue));
  update("[data-cash-receivable]",yen(step.receivable));
  update("[data-cash-balance]",yen(step.cash));
  update("[data-cash-headline]",step.headline);
  update("[data-cash-explanation]",step.explanation);
  update("[data-cash-action]",step.action);
  update("[data-cash-instruction]",["仕事の依頼","納品・請求","外注費の支払い","代金の回収"][i]);
 };
 buttons.forEach((b,i)=>b.addEventListener("click",()=>setStep(i)));
}
for(const root of document.querySelectorAll("[data-kc-ownership]:not([data-kc-ready])")){
 root.dataset.kcReady="true";
 const slider=root.querySelector("[data-share-slider]"),buttons=[...root.querySelectorAll("[data-share-preset]")];
 const arcs=["founder","partner","investor"].map(k=>root.querySelector('[data-share-arc="'+k+'"]'));
 const circumference=2*Math.PI*83;
 const update=(sel,value)=>{const x=root.querySelector(sel);if(x)x.textContent=value;};
 const setShares=value=>{
  const m=ownershipAt(value);slider.value=String(m.issued);
  update("[data-share-output]",m.issued+"株");
  update("[data-share-total]",m.total+"株");
  update("[data-share-count]",m.issued+"株");
  update("[data-share-a]",pct(m.founder));
  update("[data-share-b]",pct(m.partner));
  update("[data-share-c]",pct(m.investor));
  update("[data-share-conclusion]","創業者Aの持株比率は70% → "+pct(m.founder)+"。");
  update("[data-share-detail]",m.issued===0?"新株を発行しないため、割合は変わりません。":m.founderMajority?"Aの比率はまだ過半数ですが、新株発行で低下しました。":"Aの株数は70株のままですが、全体が増えたため過半数を下回りました。");
  let offset=0;
  [m.founder,m.partner,m.investor].forEach((n,i)=>{
   const length=n/100*circumference;
   arcs[i].setAttribute("stroke-dasharray",length+" "+circumference);
   arcs[i].setAttribute("stroke-dashoffset",String(-offset));
   offset+=length;
  });
  buttons.forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.sharePreset)===m.issued)));
 };
 slider.addEventListener("input",()=>setShares(slider.value));
 buttons.forEach(b=>b.addEventListener("click",()=>setShares(b.dataset.sharePreset)));
 setShares(slider.value);
}
