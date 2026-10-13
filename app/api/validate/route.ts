import {NextResponse} from "next/server";
import {getSession} from "@/lib/session";
const out=(status:string,models:string[]=[])=>NextResponse.json({status,models});
export async function POST(r:Request){
 if(!(await getSession()))return NextResponse.json({status:"fail"},{status:401});
 const {baseURL,key,kind}=await r.json();
 if(!key||!baseURL)return out("fail");
 const b=baseURL.replace(/\/$/,"");
 const h:any=kind==="anthropic"?{"x-api-key":key,"anthropic-version":"2023-06-01"}:{Authorization:`Bearer ${key}`};
 try{
  const m=await fetch(b+"/models",{headers:h});
  if(m.status===402||m.status===429)return out("funds");
  if(!m.ok)return out("fail");
  const j=await m.json();
  const models:string[]=(j.data||[]).map((x:any)=>String(x.id).replace(/^models\//,"")).filter((x:string)=>!/whisper|embed|guard|tts|dall|moderation|image/i.test(x));
  if(!models.length)return out("ok",[]);
  const body=JSON.stringify({model:models[0],max_tokens:1,messages:[{role:"user",content:"hi"}]});
  const probe=await fetch(b+(kind==="anthropic"?"/messages":"/chat/completions"),{method:"POST",headers:{...h,"Content-Type":"application/json"},body});
  if(probe.status===402||probe.status===429)return out("funds");
  if(probe.status===401||probe.status===403)return out("fail");
  const txt=probe.ok?"":await probe.text();
  if(/insufficient|balance|quota|credit/i.test(txt))return out("funds");
  return out("ok",models);
 }catch{return out("fail")}
}
