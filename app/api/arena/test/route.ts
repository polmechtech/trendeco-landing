import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 const login=process.env.ARENA_API_LOGIN,key=process.env.ARENA_API_KEY;
 if(!login||!key)return NextResponse.json({ok:false,error:"missing_env"},{status:503});
 const auth=Buffer.from(login+":"+key).toString("base64");
 try{const r=await fetch("https://arena.pl/api/v4/categories/search",{method:"POST",headers:{Authorization:"Basic "+auth,"Content-Type":"application/json",Accept:"application/json","User-Agent":"TrendEco-Arena-Integration/1.0"},body:JSON.stringify({perPage:1,filters:[]}),cache:"no-store"});const raw=await r.text();let d:any=null;try{d=JSON.parse(raw);}catch{}return NextResponse.json({ok:r.ok,status:r.status,count:d?.count??null,category:d?.results?.[0]?.name??null,error:r.ok?null:(d?.errors??raw.slice(0,300))},{status:r.ok?200:502});}catch(e){return NextResponse.json({ok:false,error:e instanceof Error?e.message:"connection_error"},{status:502});}
}