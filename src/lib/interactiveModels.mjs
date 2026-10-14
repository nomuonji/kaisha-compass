/** Illustrative simplified models; not accounting or legal advice. */
export const cashStages=[
 {id:"order",label:"受注",cash:50000,revenue:0,receivable:0,cost:0,headline:"仕事を受注した。まだお金は動いていない。",explanation:"制作会社が顧客から10万円の仕事を受注。この例では、受注だけでは売上を記録せず、銀行口座にも変化はありません。",action:"顧客 → 会社：仕事の依頼"},
 {id:"delivery",label:"納品",cash:50000,revenue:100000,receivable:100000,cost:0,headline:"売上10万円。でも口座残高はそのまま。",explanation:"制作物を納品し、代金を請求。この例では納品時に売上10万円を計上しますが、入金されていないため、売掛金も10万円です。",action:"会社 → 顧客：納品・請求"},
 {id:"expense",label:"外注費",cash:10000,revenue:100000,receivable:100000,cost:40000,headline:"売上があるのに、残高は1万円まで減った。",explanation:"顧客からの入金を待つ間に、外注先へ4万円を口座から支払いました。売上は10万円でも、今使えるお金は別です。",action:"会社 → 外注先：4万円を支払う"},
 {id:"collection",label:"入金",cash:110000,revenue:100000,receivable:0,cost:40000,headline:"売掛金が、銀行口座のお金に変わった。",explanation:"顧客から10万円を回収。売掛金は0円になり、口座残高は11万円に増えました。残高には当初の5万円も含まれ、全額が利益というわけではありません。",action:"顧客 → 会社の銀行口座：10万円入金"}
];
export const cashStageAt=index=>cashStages[Math.max(0,Math.min(cashStages.length-1,Math.trunc(Number(index)||0)))];
export function ownershipAt(newShares){
 const issued=Math.max(0,Math.min(200,Math.round(Number(newShares)||0)));
 const total=100+issued;
 const founder=70/total*100,partner=30/total*100,investor=issued/total*100;
 return {issued,total,founder,partner,investor,founderMajority:founder>50};
}
