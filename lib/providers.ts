export type Status="idle"|"checking"|"ok"|"fail"|"funds";
export type Provider={id:string;name:string;baseURL:string;kind:"openai"|"anthropic";key:string;status:Status;models:string[];custom?:boolean};
const P=(id:string,name:string,baseURL:string,kind:any="openai"):Provider=>({id,name,baseURL,kind,key:"",status:"idle",models:[]});
export const PRESETS:Provider[]=[
 P("groq","Groq","https://api.groq.com/openai/v1"),
 P("deepseek","DeepSeek","https://api.deepseek.com/v1"),
 P("gemini","Gemini","https://generativelanguage.googleapis.com/v1beta/openai"),
 P("openai","OpenAI","https://api.openai.com/v1"),
 P("anthropic","Claude","https://api.anthropic.com/v1","anthropic")];
export const LABEL:Record<Status,string>={idle:"",checking:"جارٍ الاتصال...",ok:"متصل ✅",fail:"فشل ❌",funds:"رفض المزود يحتاج إلى رصيد"};
