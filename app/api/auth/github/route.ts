import {NextResponse} from "next/server";
export async function GET(req:Request){
 const state=crypto.randomUUID(); const o=new URL(req.url).origin;
 const u=`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,read:user&state=${state}&redirect_uri=${o}/api/auth/callback`;
 const res=NextResponse.redirect(u);
 res.cookies.set("oauth_state",state,{httpOnly:true,maxAge:600,path:"/"});
 return res;
}
