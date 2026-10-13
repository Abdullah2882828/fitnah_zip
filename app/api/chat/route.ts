import {NextResponse} from "next/server";
import {getSession} from "@/lib/session";
export const maxDuration=300;
export async function POST(r:Request){
 if(!(await getSession()))return NextResponse.json({error:"unauthorized"},{status:401});
 const {baseURL,key,kind,model,messages}=await r.json();
 const b=baseURL.replace(/\/$/,"");
 try{
  if(kind==="anthropic"){
   const sys=messages.filter((m:any)=>m.role==="system").map((m:any)=>m.content).join("\n");
   const res=await fetch(b+"/messages",{method:"POST",headers:{"x-api-key":key,"anthropic-version":"2023-06-01","Content-Type":"application/json"},
    body:JSON.stringify({model,max_tokens:16000,system:sys,messages:messages.filter((m:any)=>m.role!=="system")})});
   const j=await res.json(); if(!res.ok)return NextResponse.json({error:j.error?.message||res.statusText});
   return NextResponse.json({text:j.content.map((c:any)=>c.text||"").join("")});
  }
  const res=await fetch(b+"/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model,messages})});
  const j=await res.json(); if(!res.ok)return NextResponse.json({error:j.error?.message||res.statusText});
  return NextResponse.json({text:j.choices[0].message.content});
 }catch(e:any){return NextResponse.json({error:String(e.message||e)})}
}
