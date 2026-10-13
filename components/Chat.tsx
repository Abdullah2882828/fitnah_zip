"use client";
import {useRef,useState} from "react";
import {Provider} from "@/lib/providers";
import {parseFiles,SYSTEM} from "@/lib/preview";
type Msg={role:"user"|"assistant";content:any;shown?:string};
export default function Chat({providers,onProject}:{providers:Provider[];onProject:(f:any,t:string)=>void}){
 const ready=providers.flatMap(p=>p.status==="ok"?p.models.map(m=>({v:p.id+"|"+m,l:`${p.name} · ${m}`})):[]);
 const [sel,setSel]=useState(""),[msgs,setMsgs]=useState<Msg[]>([]),[text,setText]=useState(""),[busy,setBusy]=useState(false);
 const [att,setAtt]=useState<{name:string;type:string;data:string}[]>([]);
 const fileRef=useRef<HTMLInputElement>(null);
 const cur=ready.find(x=>x.v===sel)?sel:ready[0]?.v||"";
 async function addFiles(fl:FileList|null){
  if(!fl)return; const out=[];
  for(const f of Array.from(fl)){const img=f.type.startsWith("image/");
   const data=await new Promise<string>(res=>{const r=new FileReader();r.onload=()=>res(r.result as string);img?r.readAsDataURL(f):r.readAsText(f)});
   out.push({name:f.name,type:img?"image":"text",data});}
  setAtt(a=>[...a,...out]);
 }
 async function send(){
  if((!text.trim()&&!att.length)||!cur||busy)return;
  const [pid,model]=cur.split("|"); const p=providers.find(x=>x.id===pid)!;
  const tx=att.filter(a=>a.type==="text").map(a=>`\n\n[${a.name}]\n${a.data}`).join("");
  const imgs=att.filter(a=>a.type==="image");
  const content:any=imgs.length&&p.kind!=="anthropic"?[{type:"text",text:text+tx},...imgs.map(i=>({type:"image_url",image_url:{url:i.data}}))]:text+tx;
  const next:Msg[]=[...msgs,{role:"user",content,shown:text+att.map(a=>`\n📎 ${a.name}`).join("")}];
  setMsgs(next);setText("");setAtt([]);setBusy(true);
  const r=await fetch("/api/chat",{method:"POST",body:JSON.stringify({baseURL:p.baseURL,key:p.key,kind:p.kind,model,messages:[{role:"system",content:SYSTEM},...next.map(m=>({role:m.role,content:m.content}))]})}).then(r=>r.json()).catch(e=>({error:String(e)}));
  const reply=r.text||"⚠️ "+(r.error||"خطأ");
  setMsgs(m=>[...m,{role:"assistant",content:reply}]);setBusy(false);
  const {files,type}=parseFiles(reply); if(Object.keys(files).length)onProject(files,type);
 }
 return <div className="flex flex-col h-full">
  <div className="p-3 border-b bg-white flex items-center gap-2">
   <span className="text-sm text-slate-500">النموذج:</span>
   <select value={cur} onChange={e=>setSel(e.target.value)} className="border rounded-xl p-2 flex-1 min-w-0 bg-white">
    {ready.length?ready.map(o=><option key={o.v} value={o.v}>{o.l}</option>):<option>اربط مزوداً من الإعدادات</option>}</select></div>
  <div className="flex-1 overflow-y-auto p-4">
   {msgs.map((m,i)=><div key={i} className="border-b border-slate-200 py-4">
    <div className={"flex "+(m.role==="user"?"justify-start":"justify-end")}>
     <div className={"max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap shadow-sm "+(m.role==="user"?"bg-blue-600 text-white":"bg-white border border-slate-100")}>
      {m.role==="user"?m.shown:String(m.content).replace(/```\w*[ \t]+([^\n`]+)\n[\s\S]*?```/g,"📄 $1")}</div></div></div>)}
   {busy&&<div className="text-slate-400 p-4">...</div>}</div>
  <div className="p-3 bg-white border-t">
   {att.length>0&&<div className="flex gap-2 flex-wrap mb-2">{att.map((a,i)=><span key={i} className="text-xs bg-slate-100 rounded-full px-3 py-1">{a.name}</span>)}</div>}
   <div className="flex items-end gap-2">
    <button onClick={()=>fileRef.current?.click()} className="w-10 h-10 rounded-full bg-slate-100 text-xl">+</button>
    <input ref={fileRef} type="file" multiple hidden onChange={e=>{addFiles(e.target.files);e.target.value=""}}/>
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={1} placeholder="اكتب رسالتك..." className="flex-1 border rounded-2xl p-2 max-h-40"/>
    <button onClick={send} disabled={busy||!cur} className="bg-blue-600 text-white rounded-2xl px-4 h-10 disabled:opacity-40">إرسال</button></div></div></div>;
}
