import assert from "node:assert/strict";
import {cashStages,cashStageAt,ownershipAt} from "../src/lib/interactiveModels.mjs";
assert.equal(cashStages.length,4);
assert.deepEqual(cashStages.map(s=>s.cash),[50000,50000,10000,110000]);
assert.deepEqual(cashStages.map(s=>s.receivable),[0,100000,100000,0]);
assert.deepEqual(cashStages.map(s=>s.revenue),[0,100000,100000,100000]);
for(const s of cashStages)assert.equal(s.cash,50000+s.revenue-s.receivable-s.cost);
assert.equal(cashStageAt(99).id,"collection");
for(const n of [0,10,50,100,200]){
 const m=ownershipAt(n);
 assert.equal(m.total,100+n);
 assert.ok(Math.abs(m.founder+m.partner+m.investor-100)<1e-9);
 assert.equal(m.founder,70/m.total*100);
 assert.equal(m.partner,30/m.total*100);
 assert.equal(m.investor,n/m.total*100);
}
assert.equal(ownershipAt(0).founderMajority,true);
assert.equal(ownershipAt(50).founderMajority,false);
console.log("Interactive explainer models passed.");
