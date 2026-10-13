import {NextResponse} from "next/server";
import {getSession} from "@/lib/session";
export async function GET(){
 const s=await getSession(); if(!s)return NextResponse.json(null,{status:401});
 return NextResponse.json({login:s.login,name:s.name,avatar:s.avatar});
}
