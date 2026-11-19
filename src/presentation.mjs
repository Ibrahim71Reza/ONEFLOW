import {change,day,seed} from './model.mjs';
import {btn,ic} from './views.mjs';

const storySteps = [
  ['Demand', 'A dealer needs 100 coils.', 'Delta Electricals requests 100 P1 solid-core coils. Follow the same order through each handoff.', 'Submit dealer order', 'bag'],
  ['Sales', 'Give planning a confirmed order.', 'Sales reviews the delivery request and releases the 100-coil commitment to planning.', 'Review and confirm', 'check'],
  ['Allocation', 'Use the 60 coils already on hand.', 'Reserve 60 coils for this order. The remaining requirement falls to 40 coils.', 'Reserve 60 coils', 'layers'],
  ['Production', 'Make only the missing 40.', 'Release a work order for the shortfall. The reserved stock stays assigned to this dealer.', 'Release work order', 'factory'],
  ['Factory', 'Record 40 good coils.', 'The operator completes the work order. Together with the reserved stock, all 100 coils are ready.', 'Record factory output', 'pulse'],
  ['Dispatch', 'Close the dealer’s order.', 'Record the delivery and complete the dealer’s tracking history.', 'Record delivery', 'box'],
  ['Outcome', '100 coils delivered.', 'The team fulfilled one order using 60 coils from stock and 40 from production. The case baseline and proposed OTIF target remain separate.', 'Replay walkthrough', 'flag']
];

export function startStory(){return {step:0,data:seed(),id:null}}
export function advanceStory(story){
  let {step,data,id}=story;
  switch(step){
    case 0: data=change(data,'order',{p:0,q:100,date:day(5)});id=data.orders[0].id;break;
    case 1: data=change(change(data,'review',{id}),'confirm',{id});break;
    case 2: data=change(data,'allocate',{id});break;
    case 3: data=change(data,'work',{id});break;
    case 4: data=change(data,'log',{id,good:40,bad:0,minutes:0,reason:'None'});break;
    case 5: data=change(data,'deliver',{id});break;
    default:return startStory();
  }
  return {step:step+1,data,id};
}
export function storyView(story){
  const {step,data,id}=story;
  const [stage,title,description,action,icon]=storySteps[step];
  const order=data.orders.find(o=>o.id===id);
  const stocked=order?.allocated??0, produced=order?.good??0;
  return `<section class="story" aria-label="Guided order walkthrough">
    <div class="storyhead"><small>COIL-TO-CASH · GUIDED WALKTHROUGH</small>${btn('Exit walkthrough','end-story','','quiet')}</div>
    <ol class="storyline" aria-label="Order journey">${storySteps.slice(0,6).map(([name],i)=>`<li class="${i<step?'complete':i===step?'current':''}" ${i===step?'aria-current="step"':''}>${name}</li>`).join('')}</ol>
    <div class="storybody"><div class="storycopy"><span class="storyicon">${ic(icon)}</span><small>${stage.toUpperCase()} · ${step<6?'DECISION '+(step+1)+' OF 6':'COMPLETED'}</small>
    <h1 tabindex="-1" id="story-heading">${title}</h1><p>${description}</p>${btn(action,'advance-story','','primary')}</div>
    <div class="ordercard"><div class="spread"><b>Order balance</b><small>${id?'OF-'+id:'Draft · P1'}</small></div>
    <div class="orderbig">100 <span>coils requested</span></div>
    <div class="balance" role="img" aria-label="${stocked} coils reserved, ${produced} produced, ${100-stocked-produced} remaining"><i style="width:${stocked}%"></i><i style="width:${produced}%"></i></div>
    <dl><div><dt>Reserved stock</dt><dd>${stocked} coils</dd></div><div><dt>Good production</dt><dd>${produced} coils</dd></div><div><dt>Still to cover</dt><dd>${100-stocked-produced} coils</dd></div></dl>
    <small>Illustrative Prototype Data</small></div></div></section>`;
}
