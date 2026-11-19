import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {seed,change} from '../src/model.mjs';
import * as screens from '../src/views.mjs';
const ui={query:'',filter:'All statuses',range:30,planId:1042};
for(const name of ['tower','dealer','sales','plan','factory','procurement','finance','reports']){
 test(name+' renders its opening data and references available artwork',()=>{
  const html=screens[name](seed(),ui);
  assert.match(html,/<section/);assert.doesNotMatch(html,/undefined|NaN/);
  for(const m of html.matchAll(/<img src="([^"]+)"/g))assert.ok(existsSync('public'+m[1]));
 });
}
test('report windows contain 7, 30 and 90 daily rows ending on the same date',()=>{
 const sets=[7,30,90].map(n=>screens.reportData(n,seed()));
 assert.deepEqual(sets.map(s=>s.length),[7,30,90]);assert.equal(sets[0].at(-1).date,sets[2].at(-1).date);
 assert.deepEqual(sets[0],sets[2].slice(-7));
});
test('finance includes the case values and target is explicitly labelled',()=>{
 assert.match(screens.finance(),/53.9/);assert.match(screens.tower(seed()),/proposed OTIF target is at least 92%/);
});
test('factory shows the generated work order and procurement reflects receipts',()=>{
 const id=1042;let s=change(change(seed(),'allocate',{id}),'work',{id});
 assert.match(screens.factory(s),/WO-1042 · P1 · 40 coils remaining/);
 assert.match(screens.procurement(change(s,'po',{i:0})),/245 t/);
});
test('offline file contains executable JavaScript and embedded assets',()=>{
 const html=readFileSync('offline/ONEFLOW.html','utf8');let script=html.match(/<script type="module">([\s\S]+)<\/script>/)[1];
 new Script(script);assert.doesNotMatch(html,/src="\/assets|url\('\/assets/);
 assert.match(html,/data:font\/woff2;base64/);assert.match(html,/data:image\/webp;base64/);
});

test('guided walkthrough completes the model transitions and replays with fresh stock',async()=>{
 const {startStory,advanceStory,storyView}=await import('../src/presentation.mjs');
 let story=startStory();const opening=story.data;
 for(let step=0;step<6;step++){
   assert.match(storyView(story),new RegExp('DECISION '+(step+1)+' OF 6'));
   story=advanceStory(story);
 }
 const order=story.data.orders.find(o=>o.id===story.id);
 assert.deepEqual([order.s,order.allocated,order.work,order.good],[5,60,40,40]);
 assert.match(storyView(story),/100 coils delivered/);
 assert.equal(opening.stock[0],60);
 const replay=advanceStory(story);assert.equal(replay.step,0);assert.equal(replay.data.stock[0],60);
});
test('phone table cards expose individual field labels',()=>{
 const html=screens.sales(seed(),ui);assert.match(html,/<td data-label="Dealer">Delta Electricals/);
 assert.match(html,/<td data-label="Action">/);
});
test('every chart series has a readable values alternative',()=>{
 const html=screens.line(['Week 1','Week 2'],[['Coils',[100,60]]]);
 assert.match(html,/View chart values/);assert.match(html,/<td data-label="Coils">60/);
});
