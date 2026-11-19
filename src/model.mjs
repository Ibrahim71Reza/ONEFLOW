export const stages=['Submitted','Under Review','Confirmed','In Production','Ready for Dispatch','Delivered'];
export const products=['Solid Core Wire','Flexible Wire','Project/Commercial Wire','Special Project Wire'];
export const dealers=['Delta Electricals','Padma Traders','Eastern Projects'];
export function day(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export function seed(){return {orders:[[1042,0,100,2,0],[1041,1,240,1,1],[1040,2,1200,3,2],[1039,3,80,5,0]].map(([id,p,q,s,d])=>({id,p,q,s,d,date:day(s===1?-1:5),allocated:0,work:s===3?q:0,good:0})), stock:[60,320,400,200],logs:[],resolved:[],po:['In Transit','Delayed','Ordered','Received'],copper:205}}
const whole=(n,min=0)=>Number.isSafeInteger(n)&&n>=min&&n<=1000000;
export function change(previous,action,x={}){
 const v=structuredClone(previous), o=v.orders.find(t=>t.id===x.id);
 function check(b,msg){if(!b)throw Error(msg)}
 if(action==='order'){
  check(whole(x.p)&&x.p<4&&whole(x.q,1),'Enter 1–1,000,000 whole coils.');
  check(/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&!Number.isNaN(Date.parse(x.date))&&new Date(x.date+'T00:00:00Z').toISOString().slice(0,10)===x.date&&x.date>=day(),'Choose today or a future date.');
  v.orders.unshift({id:Math.max(...v.orders.map(o=>o.id))+1,p:x.p,q:x.q,date:x.date,d:0,s:0,allocated:0,work:0,good:0});
 }else if(action==='resolve'){check(whole(x.i)&&x.i<6&&!v.resolved.includes(x.i),'Alert already resolved.');v.resolved.push(x.i)}
 else if(action==='po'){const next={Ordered:'In Transit','In Transit':'Received',Delayed:'In Transit'}[v.po[x.i]];check(next,'Purchase order complete.');v.po[x.i]=next;if(next==='Received')v.copper+=[40,25,10,15][x.i]}
 else{
  check(o,'Select an order.');
  if(action==='review'||action==='confirm'){check(o.s===(action==='review'?0:1),'Order already updated.');o.s++}
  else if(action==='allocate'){check(o.s===2&&!o.allocated,'Stock already handled.');let n=Math.min(o.q,v.stock[o.p]);check(n>0,'No stock available.');o.allocated=n;v.stock[o.p]-=n;if(n===o.q)o.s=4}
  else if(action==='work'){check(o.s===2&&(o.allocated||!v.stock[o.p]),'Allocate available stock first.');o.work=o.q-o.allocated;o.s=3}
  else if(action==='log'){check(o.s===3&&whole(x.good)&&whole(x.bad)&&whole(x.minutes)&&x.good+x.bad+x.minutes>0,'Enter a valid production log.');check(x.good<=o.work-o.good,'Good coils exceed the remaining requirement.');check(!x.bad||['Insulation','Diameter','Surface'].includes(x.reason),'Choose a rejection reason.');o.good+=x.good;v.logs.unshift({...x});if(o.good===o.work)o.s=4}
  else if(action==='deliver'){check(o.s===4,'Order must be ready for dispatch.');o.s=5}
  else throw Error('Unknown action.');
 }return v
}
