"use client";
import {useEffect,useState} from "react";
import Chat from "@/components/Chat";
import Settings from "@/components/Settings";
import GitHubModal from "@/components/GitHubModal";
import {PRESETS,Provider} from "@/lib/providers";
import {buildPreview,Files} from "@/lib/preview";
export default function Home(){
 const [user,setUser]=useState<any>(undefined),[providers,setProviders]=useState<Provider[]>(PRESETS),[loaded,setLoaded]=useState(false);
 const [tab,setTab]=useState<"chat"|"settings">("chat"),[project,setProject]=useState<{files:Files;type:string}|null>(null),[gh,setGh]=useState(false);
 useEffect(()=>{
  fetch("/api/me").then(r=>r.ok?r.json():null).then(setUser);
  try{const s=localStorage.getItem("fitnah.providers");if(s)setProviders(JSON.parse(s).map((p:Provider)=>p.status==="checking"?{...p,status:"idle"}:p))}catch{}
  setLoaded(true);
 },[]);
 useEffect(()=>{if(loaded)localStorage.setItem("fitnah.providers",JSON.stringify(providers))},[providers,loaded]);
 if(user===undefined)return null;
 if(!user)return <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
  <img src="/logo.png" className="w-48 h-48 rounded-[2rem] shadow-xl"/>
  <p className="text-slate-500 text-center">منصة ذكاء اصطناعي للمحادثة وبناء المواقع والتطبيقات</p>
  <a href="/api/auth/github" className="bg-slate-900 text-white rounded-2xl px-6 py-3 font-medium shadow-lg">المتابعة بـ GitHub</a></div>;
 const nav=(t:any,l:string)=><button onClick={()=>setTab(t)} className={"w-full text-right rounded-xl px-3 py-2 "+(tab===t?"bg-blue-50 text-blue-700 font-medium":"hover:bg-slate-50")}>{l}</button>;
 return <div className="h-screen flex">
  <aside className="hidden md:flex w-56 bg-white border-l flex-col p-3 gap-2">
   <img src="/logo.png" className="w-24 mx-auto rounded-2xl"/>{nav("chat","المحادثة")}{nav("settings","الإعدادات")}</aside>
  <div className="flex-1 flex flex-col min-w-0">
   <header className="bg-white border-b p-2 flex items-center gap-2">
    <img src="/logo.png" className="w-9 h-9 rounded-xl"/><b className="flex-1">الفطنة</b>
    <div className="md:hidden flex gap-1">{["chat","settings"].map(t=><button key={t} onClick={()=>setTab(t as any)} className={"px-3 py-1 rounded-lg "+(tab===t?"bg-blue-50 text-blue-700":"")}>{t==="chat"?"المحادثة":"الإعدادات"}</button>)}</div>
    {project&&<button onClick={()=>setGh(true)} className="bg-slate-900 text-white rounded-xl px-3 py-2 text-sm">متابعة التزامن مع GitHub</button>}</header>
   <main className="flex-1 flex min-h-0">
    <div className={"flex-1 min-w-0 overflow-y-auto "+(tab==="chat"?"":"hidden")}>
     <Chat providers={providers} onProject={(files,type)=>setProject(p=>({files:{...p?.files,...files},type}))}/></div>
    {tab==="settings"&&<div className="flex-1 overflow-y-auto"><Settings providers={providers} setProviders={setProviders} user={user}/></div>}
    {project&&tab==="chat"&&<section className="flex-1 min-w-0 border-r bg-white flex flex-col fixed md:static inset-x-0 bottom-0 top-14 z-10 md:z-auto">
     <div className="p-2 border-b flex items-center"><b className="flex-1">المعاينة الحية ({Object.keys(project.files).length} ملف)</b>
      <button onClick={()=>setProject(null)} className="px-2">✕</button></div>
     <iframe className="flex-1 w-full" sandbox="allow-scripts allow-forms allow-modals allow-popups" srcDoc={buildPreview(project.files)||"<p style='font-family:sans-serif;padding:20px'>لا يوجد index.html للمعاينة</p>"}/></section>}
   </main></div>
  {gh&&project&&<GitHubModal project={project} onClose={()=>setGh(false)}/>}</div>;
}
