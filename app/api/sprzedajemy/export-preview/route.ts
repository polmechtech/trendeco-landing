import { NextResponse } from "next/server";
import { sprzedajemyEditorial } from "@/lib/sprzedajemyEditorial";
import { sprzedajemyMapping } from "@/lib/sprzedajemyMapping";

export const dynamic = "force-dynamic";

export async function GET(request:Request){
 try{
   const origin=new URL(request.url).origin;
   const res=await fetch(`${origin}/api/catalog`,{cache:"no-store"});
   if(!res.ok) throw new Error(`Catalog HTTP ${res.status}`);
   const data=await res.json();
   const products=Array.isArray(data)?data:(data.products??[]);
   const offers=products.map((p:any)=>{
     const editorial=sprzedajemyEditorial(p);
     const mapping=sprzedajemyMapping(String(p.id),p.price);
     return {
       sourceId:String(p.id),
       externalId:`trendeco_${p.id}`,
       title:editorial.title,
       description:editorial.description,
       categoryId:mapping.categoryId,
       category:mapping.category,
       attributes:mapping.attributes,
       pictureUrls:(p.images??[]).map((x:any)=>typeof x==="string"?x:x.url).filter(Boolean),
       sourcePrice:Number(p.price)
     };
   });
   return NextResponse.json({count:offers.length,valid:offers.length===products.length,offers},{headers:{"Cache-Control":"no-store"}});
 }catch(error){
   return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:500});
 }
}
