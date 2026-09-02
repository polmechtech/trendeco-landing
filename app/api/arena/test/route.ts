import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 const login=process.env.ARENA_API_LOGIN, key=process.env.ARENA_API_KEY;
 if(!login||!key) return NextResponse.json({ok:false,error:"Arena API variables are not configured"},{status:503});
 const auth=Buffer.from(login+":"+key).toString("base64");
 try{
  const response=await fetch("https://arena.pl/api/v4/categories/search",{method:"POST",headers:{Authorization:"Basic "+auth,"Content-Type":"application/json",Accept:"application/json","User-Agent":"TrendEco-Arena-Integration/1.0"},body:JSON.stringify({perPage:1,filters:[]}),cache:"no-store"});
  const data=await response.json().catch(()=>null);
  if(!response.ok) return NextResponse.json({ok:false,status:response.status,error:data?.errors??"Arena API request failed"},{status:502});
  return NextResponse.json({ok:true,status:response.status,count:data?.count??null,category: data?.results?.[0]?.name??null},{headers:{"Cache-Control":"no-store"}});
 }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Connection failed"},{status:502});}
}