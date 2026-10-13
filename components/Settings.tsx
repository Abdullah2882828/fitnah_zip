"use client";
import {useState} from "react";
import {Provider,LABEL} from "@/lib/providers";
export default function Settings({providers,setProviders,user}:any){
 const [view,setView]=useState<"menu"|"providers"|"account">("menu");
 const upd=(id:string,p:Partial<Provider>)=>setProviders((ps:Provider[])=>ps.map(x=>x.id===id?{...x,...p}:x));
 async function connect(p:Provider){
  upd(p.id,{status:"checking"});
  const r=await fetch("/api/validate",{method:"POST",body:JSON.stringify(p)}).then(r=>r.json()).catch(()=>({status:"fail"}));
  upd(p.id,{status:r.status,models:r.models||[]});
 }
 const add=()=>setProviders((ps:Provider[])=>[...ps,{id:crypto.randomUUID(),name:"",baseURL:"",kind:"openai",key:"",status:"idle",models:[],custom:true}]);
 const card="bg-white rounded-2xl shadow-sm border border-slate-100 p-4";
 if(view==="menu")return <div className="space-y-3 max-w-xl mx-auto p-4">
  <h2 className="text-xl font-bold">الإعدادات</h2>
  <button onClick={()=>setView("providers")} className={card+" w-full text-right font-medium"}>المزودات والذكاء الاصطناعي ‹</button>
  <button onClick={()=>setView("account")} className={card+" w-full text-right font-medium"}>الحساب ‹</button></div>;
 return <div className="space-y-3 max-w-xl mx-auto p-4">
  <button onClick={()=>setView("menu")} className="text-blue-600">› رجوع</button>
  {view==="account"&&<div className={card+" flex items-center gap-3"}><img src={user.avatar} className="w-12 h-12 rounded-full"/><div><b>{user.name}</b><div className="text-slate-500 text-sm">@{user.login}</div></div></div>}
  {view==="providers"&&<>
   <h2 className="text-xl font-bold">المزودات والذكاء الاصطناعي</h2>
   {providers.map((p:Provider)=><div key={p.id} className={card+" space-y-2"}>
    {p.custom?<>
     <input value={p.name} onChange={e=>upd(p.id,{name:e.target.value})} placeholder="اسم المزود" className="w-full border rounded-xl p-2"/>
     <input dir="ltr" value={p.baseURL} onChange={e=>upd(p.id,{baseURL:e.target.value})} placeholder="https://api.example.com/v1 (OpenAI-compatible)" className="w-full border rounded-xl p-2"/></>
     :<b>{p.name}</b>}
    <input dir="ltr" type="password" value={p.key} onChange={e=>upd(p.id,{key:e.target.value,status:"idle"})} placeholder="API Key" className="w-full border rounded-xl p-2"/>
    <div className="flex items-center gap-3">
     <button onClick={()=>connect(p)} disabled={!p.key} className="bg-blue-600 text-white rounded-xl px-4 py-2 disabled:opacity-40">حفظ واتصال</button>
     <span className="text-sm">{LABEL[p.status as keyof typeof LABEL]}</span></div></div>)}
   <button onClick={add} className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-2xl p-3 font-medium">+ إضافه 🔑</button></>}
 </div>;
}
