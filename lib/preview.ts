export type Files=Record<string,string>;
export const SYSTEM=`You are "الفطنة", an AI assistant that chats and builds websites/apps. Reply in the user's language.
When building a project: first line "PROJECT_TYPE: website" or "PROJECT_TYPE: app". Output EVERY file as a fenced block whose opening fence has the language then the file path, e.g. \`\`\`html index.html. Always include a self-contained index.html (HTML/CSS/JS, CDN libraries allowed) so it can be previewed live. Re-send full content of any file you change.`;
export function parseFiles(t:string){
 const files:Files={};
 t.replace(/```\w*[ \t]+([^\n`]+\.\w+)\n([\s\S]*?)```/g,(_,p,c)=>{files[p.trim()]=c;return ""});
 const type=/PROJECT_TYPE:\s*app/i.test(t)?"app":"website";
 return {files,type};
}
export function buildPreview(f:Files){
 const ks=Object.keys(f);
 const k=ks.find(p=>/(^|\/)index\.html$/.test(p))||ks.find(p=>p.endsWith(".html"));
 if(!k)return "";
 const dir=k.includes("/")?k.slice(0,k.lastIndexOf("/")+1):"";
 const get=(s:string)=>f[dir+s.replace(/^\.?\//,"")];
 return f[k]
  .replace(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/g,(m,s)=>get(s)!=null?`<style>${get(s)}</style>`:m)
  .replace(/<script([^>]*?)src=["']([^"']+\.js)["']([^>]*)><\/script>/g,(m,a,s,b)=>get(s)!=null?`<script${a}${b}>${get(s)}</script>`:m);
}
