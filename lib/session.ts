import {EncryptJWT,jwtDecrypt} from "jose";
import {cookies} from "next/headers";
import {createHash} from "crypto";
const key=()=>createHash("sha256").update(process.env.SESSION_SECRET!).digest();
export async function setSession(d:any){
 const jwt=await new EncryptJWT(d).setProtectedHeader({alg:"dir",enc:"A256GCM"}).setExpirationTime("365d").encrypt(key());
 cookies().set("fitnah",jwt,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:31536000,path:"/"});
}
export async function getSession():Promise<any|null>{
 const c=cookies().get("fitnah")?.value; if(!c)return null;
 try{return (await jwtDecrypt(c,key())).payload}catch{return null}
}
