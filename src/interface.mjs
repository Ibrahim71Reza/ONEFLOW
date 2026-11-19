import {startStory,advanceStory,storyView} from './presentation.mjs';
import {day,products,seed,change} from './model.mjs';
import {brand,nav,titles,icons,ic,alerts,btn,badge,esc,tower,dealer,sales,plan,factory,procurement,finance,reports,reportData} from './views.mjs';
const roles=['Executive','Dealer','Sales lead','Planner','Factory operator','Procurement lead','Finance lead','Analyst'];
const pages=[tower,dealer,sales,plan,factory,procurement,finance,reports];
const subtitles=['','A simplified ordering and delivery-tracking experience.','Review dealer demand and turn requests into confirmed orders.','Match dealer commitments to available stock and line capacity.','Record shift output and move completed orders to dispatch.','Track purchase orders, supplier mix and copper cover.','See where cash is committed across the operating cycle.','Explore service, output and inventory over a selected period.'];
export function mount(root){
 let v=seed(),u={page:0,role:0,entered:false,query:'',filter:'All statuses',range:30,planId:1042},timer,opener;
 try{let saved=JSON.parse(localStorage.getItem('oneflow-v1'));if(saved?.data?.orders?.length){v=saved.data;u.entered=!!saved.entered}}catch{}
 const store=()=>{try{localStorage.setItem('oneflow-v1',JSON.stringify({data:v,entered:u.entered}))}catch{}};
 function toast(s){clearTimeout(timer);let n=root.querySelector('.toast');n.textContent=s;n.hidden=false;timer=setTimeout(()=>n.hidden=true,4500)}
 let story=null;
 function render(){let body=u.entered?`<div class="shell"><aside id="workspace-nav"><div class="sidehead">${brand}${btn('Close menu','menu','','mobile')}</div><div class="plant"><b>Rupsha Cables Ltd.</b><small>Manufacturing workspace</small></div><small class="navtitle">WORKSPACE</small><nav aria-label="Workspace">${nav.map((n,i)=>`<button data-act="nav" data-val="${i}" ${!story&&u.page===i?'aria-current="page" class="active"':''}>${ic(icons[i])}${n}</button>`).join('')}</nav><div class="sidefoot">${btn(ic('refresh')+' Reset demo','reset','','reset')}<div class="identity"><b>TM</b><div>Team Masterminds<small>Competition workspace</small></div></div></div></aside><button class="navshade" aria-label="Dismiss navigation" data-act="menu" tabindex="-1"></button><div class="workspace"><header><button class="mobile" data-act="menu" aria-expanded="false" aria-controls="workspace-nav">${ic('menu')}<span class="sr">Open menu</span></button><span class="crumb">Workspace &nbsp; / &nbsp; <b>${story?'Guided walkthrough':nav[u.page]}</b></span><div class="tools">${btn(ic('search')+'<span class="sr">Search workspace</span>','search')}${btn(ic('bell')+'<span class="sr">Notifications</span><em>'+ (6-v.resolved.length)+'</em>','notifications')}<select id="role" aria-label="Demo role">${roles.map((r,i)=>`<option value="${i}" ${i===u.role?'selected':''}>${r}</option>`).join('')}</select></div></header><main id="main" tabindex="-1"><div class="dateline">${badge('Demo workspace','blue')}<time>${new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}</time></div>${story?storyView(story):`${u.page?'<div class="pagetitle"><small>'+['','DEALER SERVICES','PULL','PULL + PROTECT','PROTECT','PREPARE','RELEASE','EXECUTIVE REPORTING'][u.page]+'</small><h1>'+titles[u.page]+'</h1><p>'+subtitles[u.page]+'</p></div>':''}${pages[u.page](v,u)}`}</main></div></div>`:`<main class="entry" id="main"><header>${brand}<span>Rupsha Cables Ltd.</span></header><div class="entrybody"><section><div class="entrytag"><i></i> MANUFACTURING CONTROL TOWER</div><h1>One order.<br>One production plan.<br><em>One delivery promise.</em></h1><p>Follow a dealer order from copper allocation to dispatch inside RCL’s connected manufacturing workspace.</p>${btn('Enter demo workspace','enter','','entrybtn')} ${btn('Guided walkthrough','start-story','','entryguide')}<small class="entrynote">Interactive prototype &nbsp; · &nbsp; No login required</small></section><div class="blueprint"><div class="drafthead">RCL ENGINEERING <span>SECTION A–A</span></div><img src="/assets/cable0.webp" alt="Cutaway illustration showing insulated conductors and exposed copper strands"><div class="draftfoot"><b>Conductor assembly</b><span>Copper / Multi-core</span></div></div></div><footer><b>Team Masterminds</b><span>COIL-TO-CASH &nbsp; / &nbsp; ONEFLOW</span></footer></main>`;
 root.innerHTML='<a class="skip" href="#main">Skip to content</a>'+body+'<dialog></dialog><div class="toast" role="status" hidden></div>';}
 function go(i){story=null;u.page=i;u.role=i;render();window.scrollTo(0,0);root.querySelector('#main')?.focus({preventScroll:true})}
 function modal(title,content){opener=document.activeElement;let d=root.querySelector('dialog');d.innerHTML=`<div class="spread"><h2 id="dlgtitle">${title}</h2>${btn('Close','close','','quiet')}</div>${content}`;d.setAttribute('aria-labelledby','dlgtitle');d.showModal()}
 function apply(act,x,msg){v=change(v,act,x);store();render();toast(msg)}
 function orderform(p,q){modal('Place dealer order',`<form id="order"><label>Product<select name="p">${products.map((n,i)=>`<option value="${i}" ${p===i?'selected':''}>P${i+1} · ${n}</option>`).join('')}</select></label><label>Quantity (coils)<input name="q" required type="number" min="1" max="1000000" value="${q}"></label><label>Requested delivery<input required name="date" type="date" min="${day()}" value="${day(5)}"></label><button class="primary">Submit order</button></form>`)}
 function searchResults(val){return nav.map((n,i)=>[n,i]).filter(([n,i])=>(n+' '+titles[i]).toLowerCase().includes(val.toLowerCase())).map(([n,i])=>btn(ic(icons[i])+n,'nav',i,'result')).join('')||'<p>No matching sections.</p>'}
 function toggleMenu(){
  const sidebar=root.querySelector('aside');
  const open=sidebar.classList.toggle('open');
  const trigger=root.querySelector('[aria-controls="workspace-nav"]');
  trigger.setAttribute('aria-expanded',String(open));
  (open?sidebar.querySelector('.mobile'):trigger).focus();
 }
 function keydown(e){
  const sidebar=root.querySelector('aside.open');
  if(!sidebar||!window.matchMedia('(max-width:800px)').matches||root.querySelector('dialog[open]'))return;
  if(e.key==='Escape'){toggleMenu();return}
  if(e.key!=='Tab')return;
  const controls=sidebar.querySelectorAll('button');
  const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
 function click(e){let b=e.target.closest('[data-act]');if(!b)return;let a=b.dataset.act,n=Number(b.dataset.val);try{
 if(a==='start-story'){u.entered=true;story=startStory();render();root.querySelector('#story-heading')?.focus()}
 else if(a==='advance-story'){story=advanceStory(story);render();root.querySelector('#story-heading')?.focus()}
 else if(a==='end-story'){go(0)}
 else if(a==='close'){root.querySelector('dialog').close();opener?.focus()}
 else if(a==='enter'){u.entered=true;store();go(0)}
 else if(a==='nav')go(n);
 else if(a==='menu')toggleMenu();
 else if(a==='reset')modal('Reset the demo?','<p>This restores the sample orders, factory logs and case opening balances on this device.</p>'+btn('Restore starting data','restore','','primary'));
 else if(a==='restore'){story=null;v=seed();u={...u,role:0,planId:1042,query:'',filter:'All statuses',range:30,entered:false};store();render();toast('Demo restored.')}
 else if(a==='search')modal('Search workspace','<label>Find a section<input id="global" placeholder="Try copper or dealer" autofocus></label><div id="results">'+searchResults('')+'</div>');
 else if(a==='notifications')modal('Notifications',alerts.map(([s,l,p],i)=>v.resolved.includes(i)?'':btn(s+' · '+l,'nav',p,'result')).join('')||'<p>No open alerts.</p>');
 else if(a==='form'){let f=root.querySelector('#qty'+n);if(f.reportValidity())orderform(n,Number(f.value))}
 else if(a==='reorder'){let o=v.orders.find(o=>o.id===n);orderform(o.p,o.q)}
 else if(a==='export'){let rows=reportData(u.range,v),csv='Date,OTIF percent,Extrusion OEE percent,Production coils,Inventory cover days\r\n'+rows.map(r=>Object.values(r).join(',')).join('\r\n');let url=URL.createObjectURL(new Blob([csv],{type:'text/csv'})),l=document.createElement('a');l.href=url;l.download='ONEFLOW-illustrative-'+u.range+'-days.csv';l.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Report exported.')}
 else apply(a,{id:n,i:n},({allocate:'Stock allocated to the dealer order.',work:'Work order released to Factory Floor.',po:'Purchase order updated.',resolve:'Alert resolved.',review:'Order under review.',confirm:'Order confirmed for planning.',deliver:'Delivery recorded.'})[a]);
 }catch(err){toast(err.message)}}
 function input(e){if(e.target.id==='global')root.querySelector('#results').innerHTML=searchResults(e.target.value);
 if(e.target.id==='query'){u.query=e.target.value;let i=e.target.selectionStart;render();let f=root.querySelector('#query');f.focus();f.setSelectionRange(i,i)}}
 function select(e){let {id,value}=e.target;if(id==='role'){u.role=+value;go(+value)}else if(['filter','range','planId'].includes(id)){u[id]=id==='filter'?value:+value;render()}}
 function submit(e){if(!['order','log'].includes(e.target.id))return;e.preventDefault();let x=Object.fromEntries(new FormData(e.target));for(let k of ['p','q','id','good','bad','minutes'])if(k in x)x[k]=Number(x[k]);try{if(e.target.id==='order'){apply('order',x,'Order submitted.');modal('Order confirmed for review',`<p><b>OF-${v.orders[0].id}</b> · ${x.q} coils of ${products[x.p]} requested for ${esc(x.date)}.</p><p>Sales can now review this request in the order book.</p>${btn('View tracking','close','','primary')}`)}else apply('log',x,'Production log saved.')}catch(err){toast(err.message)}}
 const listeners={click,input,change:select,submit,keydown};for(let [k,f] of Object.entries(listeners))root.addEventListener(k,f);render();return ()=>{clearTimeout(timer);for(let [k,f] of Object.entries(listeners))root.removeEventListener(k,f)}}
