import "./globals.css";
import {Tajawal} from "next/font/google";
const f=Tajawal({subsets:["arabic","latin"],weight:["400","500","700"]});
export const metadata={title:"الفطنة",icons:{icon:"/logo.png"}};
export default function L({children}:{children:React.ReactNode}){
 return <html lang="ar" dir="rtl"><body className={f.className}>{children}</body></html>;}
