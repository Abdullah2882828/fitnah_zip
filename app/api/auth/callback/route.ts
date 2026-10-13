import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {setSession} from "@/lib/session";
export async function GET(req:Request){
 const url=new URL(req.url); const code=url.searchParams.get("code");
 if(!code||url.searchParams.get("state")!==cookies().get("oauth_state")?.value)return NextResponse.redirect(url.origin+"/?error=state");
 const t=await (await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},
  body:JSON.stringify({client_id:process.env.GITHUB_CLIENT_ID,client_secret:process.env.GITHUB_CLIENT_SECRET,code})})).json();
 if(!t.access_token)return NextResponse.redirect(url.origin+"/?error=token");
 const u=await (await fetch("https://api.github.com/user",{headers:{Authorization:`Bearer ${t.access_token}`}})).json();
 await setSession({token:t.access_token,login:u.login,name:u.name||u.login,avatar:u.avatar_url});
 return NextResponse.redirect(url.origin+"/");
}
