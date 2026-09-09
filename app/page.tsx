'use client';
import { useEffect, useState } from 'react';

type Game={potential:number,seeds:number,levels:Record<string,number>,last:number};
type Upgrade={id:string,name:string,cost:number,max:number,x:number,y:number,parent?:string,color:string,effect:string};
const upgrades:Upgrade[]=[
 {id:'void',name:'Touch the Void',cost:1,max:25,x:450,y:680,color:'#a1a1aa',effect:'+1 potential/sec'},
 {id:'spark',name:'First Spark',cost:10,max:15,x:450,y:550,parent:'void',color:'#facc15',effect:'Void power ×1.6'},
 {id:'root',name:'World Root',cost:100,max:10,x:450,y:420,parent:'spark',color:'#4ade80',effect:'Spark power ×2'},
 {id:'energy',name:'Energy',cost:1200,max:10,x:280,y:290,parent:'root',color:'#22d3ee',effect:'Production ×2.5'},
 {id:'matter',name:'Matter',cost:1200,max:10,x:620,y:290,parent:'root',color:'#c084fc',effect:'Costs grow slower'},
 {id:'star',name:'Star Leaves',cost:25000,max:8,x:180,y:150,parent:'energy',color:'#fb923c',effect:'Energy boosts roots'},
 {id:'life',name:'Living Leaves',cost:25000,max:8,x:720,y:150,parent:'matter',color:'#34d399',effect:'Matter boosts sparks'},
 {id:'seed',name:'Harvest World Seed',cost:500000,max:1,x:450,y:40,parent:'star',color:'#f5d08a',effect:'Reset for a permanent seed'}
];
const start:Game={potential:0,seeds:0,levels:{},last:Date.now()};
const lvl=(g:Game,id:string)=>g.levels[id]||0;
const format=(n:number)=>n<1e3?n.toFixed(n<10?1:0):n<1e6?(n/1e3).toFixed(2)+'K':n<1e9?(n/1e6).toFixed(2)+'M':n.toExponential(2);
function production(g:Game){let p=.1+lvl(g,'void');p*=Math.pow(1.6,lvl(g,'spark'));p*=Math.pow(2,lvl(g,'root'));p*=Math.pow(2.5,lvl(g,'energy'));p*=1+lvl(g,'star')*lvl(g,'energy')*.2;p*=1+lvl(g,'life')*lvl(g,'matter')*.2;return p*(1+g.seeds*2)}
export default function Home(){const[g,setG]=useState<Game>(start),[ready,setReady]=useState(false),[paused,setPaused]=useState(false),[menu,setMenu]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem('toe-simple');if(raw){const saved=JSON.parse(raw)as Game;saved.potential+=production(saved)*Math.min(14400,(Date.now()-saved.last)/1000)*.5;saved.last=Date.now();setG(saved)}}catch{}setReady(true)},[]);
 useEffect(()=>{if(!ready||paused)return;const t=setInterval(()=>setG(v=>({...v,potential:v.potential+production(v)/10,last:Date.now()})),100);return()=>clearInterval(t)},[ready,paused]);
 useEffect(()=>{if(ready)localStorage.setItem('toe-simple',JSON.stringify(g))},[g,ready]);
 const cost=(u:Upgrade)=>u.cost*Math.pow(u.id==='matter'?1.75:2,lvl(g,u.id));
 const unlocked=(u:Upgrade)=>!u.parent||lvl(g,u.parent)>0||(u.id==='seed'&&lvl(g,'life')>0);
 const buy=(u:Upgrade)=>{if(u.id==='seed'){if(g.potential<cost(u))return;setG({potential:0,seeds:g.seeds+1,levels:{},last:Date.now()});return}if(g.potential<cost(u)||lvl(g,u.id)>=u.max)return;setG(v=>({...v,potential:v.potential-cost(u),levels:{...v.levels,[u.id]:lvl(v,u.id)+1}}))};
 return <main className="shell"><header><h1>THE TREE OF EVERYTHING</h1><div><strong>{format(g.potential)}</strong> POTENTIAL <span>({format(production(g))}/s)</span></div></header>
 <section className="viewport"><div className="world">
 {upgrades.filter(unlocked).map(u=>{if(!u.parent)return null;const parent=upgrades.find(p=>p.id===u.parent)!;const dx=u.x-parent.x,dy=u.y-parent.y,len=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;return <div key={'e'+u.id} className="edge" style={{left:parent.x+75,top:parent.y+38,width:len,transform:`rotate(${angle}deg)`,background:u.color}}/>})}
 {upgrades.filter(unlocked).map(u=>{const n=lvl(g,u.id),c=cost(u),can=g.potential>=c&&n<u.max;return <button key={u.id} className={`node ${n?'bought':''} ${u.id==='seed'?'prestige':''}`} style={{left:u.x,top:u.y,borderColor:u.color}} disabled={!can} onClick={()=>buy(u)}><b style={{color:u.color}}>{u.name}</b><span>{u.effect}</span><small>{u.id==='seed'?format(c):`Lv. ${n}/${u.max} · ${n>=u.max?'MAX':format(c)}`}</small></button>})}
 </div></section>
 <div className="hud"><b>POTENTIAL</b><span>{format(g.potential)}</span><small>+{format(production(g))}/sec</small><div><button onClick={()=>setPaused(v=>!v)}>{paused?'▶ RESUME':'Ⅱ STOP'}</button></div></div>
 <button className="menu-button" onClick={()=>setMenu(v=>!v)}>☰</button>{menu&&<div className="settings"><b>THE VOID</b><p>World Seeds: {g.seeds}</p><button onClick={()=>{localStorage.removeItem('toe-simple');setG(start);setMenu(false)}}>WIPE SAVE</button></div>}
 </main>}
