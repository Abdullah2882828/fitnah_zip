"use client";
import {useState} from "react";
export default function GitHubModal({project,onClose}:any){
 const web=project.type==="website";
 const [name,setName]=useState(""),[desc,setDesc]=useState(""),[priv,setPriv]=useState(false),[busy,setBusy]=useState(false),[res,setRes]=useState<any>(null);
 async function go(){
  setBusy(true);
  const r=await fetch("/api/github/create",{method:"POST",body:JSON.stringify({name,description:desc,type:project.type,isPrivate:web?false:priv,files:project.files})}).then(r=>r.json()).catch(e=>({error:String(e)}));
  setRes(r);setBusy(false);
 }
 return <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
  <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-3" onClick={e=>e.stopPropagation()}>
   <h3 className="font-bold text-lg">متابعة التزامن مع GitHub</h3>
   <input value={name} onChange={e=>setName(e.target.value.replace(/[^\w.-]/g,"-"))} placeholder="اسم المستودع الجديد" dir="ltr" className="w-full border rounded-xl p-2"/>
   <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="وصف المستودع" className="w-full border rounded-xl p-2"/>
   <div><div className="text-sm mb-1">نوع المستودع</div>
    <div className="flex gap-2">{[["عام",false],["خاص",true]].map(([l,v]:any)=>
     <button key={l} disabled={web&&v} onClick={()=>setPriv(v)} className={"flex-1 rounded-xl p-2 border "+((web?false:priv)===v?"bg-blue-600 text-white":"bg-white")+(web&&v?" opacity-40":"")}>{l}</button>)}</div>
    {web&&<div className="text-xs text-slate-500 mt-1">المواقع تُنشأ عامة دائماً</div>}</div>
   {res?.url&&<a href={res.url} target="_blank" className="block text-blue-600 underline" dir="ltr">{res.url}</a>}
   {res?.error&&<div className="text-red-600 text-sm">{res.error}</div>}
   <button onClick={go} disabled={!name||busy} className="w-full bg-blue-600 text-white rounded-xl p-3 disabled:opacity-40">{busy?"جارٍ الرفع...":"إنشاء المستودع ورفع الملفات"}</button></div></div>;
}
