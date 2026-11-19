import test from 'node:test';
import assert from 'node:assert/strict';
import {mount} from '../src/interface.mjs';
import {day} from '../src/model.mjs';

// Exercise the same delegated events as the browser, using a minimal host
// for the shell. Playwright separately checks real controls and responsive layout.
test('mounted workspace completes the dealer-to-dispatch demonstration',()=>{
  const values=new Map(), handlers={}, elements=new Map();
  const root={
    innerHTML:'',
    addEventListener(name,fn){handlers[name]=fn},
    removeEventListener(name){delete handlers[name]},
    querySelector(selector){
      if(!elements.has(selector))elements.set(selector,{focus(){},showModal(){},close(){},value:'100',reportValidity:()=>true});
      return elements.get(selector);
    }
  };
  const outer={window:globalThis.window,document:globalThis.document,localStorage:Object.getOwnPropertyDescriptor(globalThis,'localStorage'),FormData:globalThis.FormData};
  globalThis.window={scrollTo(){}};
  globalThis.document={activeElement:{focus(){}}};
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}});
  globalThis.FormData=class{constructor(form){return Object.entries(form.fields)}};
  let unmount;
  try {
    unmount=mount(root);
    const click=(act,val='')=>handlers.click({target:{closest:()=>({dataset:{act,val:String(val)}})}});
    const submit=(id,fields)=>handlers.submit({target:{id,fields},preventDefault(){}});
    const state=()=>JSON.parse(values.get('oneflow-v1')).data;
    click('enter');assert.match(root.innerHTML,/Executive Control Tower/);
    click('nav',1);click('form',0);assert.match(root.querySelector('dialog').innerHTML,/Requested delivery/);
    submit('order',{p:'0',q:'100',date:day(5)});const id=state().orders[0].id;
    assert.match(root.querySelector('dialog').innerHTML,new RegExp('OF-'+id));
    click('nav',2);click('review',id);click('confirm',id);
    click('nav',3);handlers.change({target:{id:'planId',value:String(id)}});
    click('allocate',id);assert.match(root.innerHTML,/Generate work order for 40/);
    click('work',id);click('nav',4);
    submit('log',{id:String(id),good:'40',bad:'0',minutes:'0',reason:'None'});
    click('nav',2);click('deliver',id);assert.equal(state().orders[0].s,5);
    click('nav',1);assert.match(root.innerHTML,/Delivered/);
    click('restore');assert.equal(state().stock[0],60);assert.match(root.innerHTML,/Enter demo workspace/);
  }finally{
    unmount?.();
    for(const key of ['window','document','FormData']){
      if(outer[key]===undefined)delete globalThis[key];else globalThis[key]=outer[key];
    }
    if(outer.localStorage)Object.defineProperty(globalThis,'localStorage',outer.localStorage);else delete globalThis.localStorage;
  }
});
