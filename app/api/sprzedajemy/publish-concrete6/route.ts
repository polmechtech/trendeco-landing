import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const API = "https://sprzedajemy.pl/webapi/v1";
const IDS = ["18980430400","18980349067","18979510247","18775327435","18690933709","18690183650"];
const SITE_PRICE: Record<string,number> = {
 "18980430400":1799, "18980349067":2729, "18979510247":3029,
 "18775327435":2749, "18690933709":4739, "18690183650":5689
};
const CATEGORY: Record<string,number> = {
 "18980430400":19337, "18980349067":19337,
 "18979510247":19262, "18775327435":19262, "18690933709":19262, "18690183650":19262
};
const TITLES: Record<string,string> = {
 "18980430400":"TrendEco prowadnica ręczna 2,5 m do piły pierścieniowej do betonu",
 "18980349067":"TrendEco prowadnica elektryczna 2,5 m do piły do betonu + pilot",
 "18979510247":"TrendEco piła pierścieniowa do betonu 3000W GYRO AUTO OFF + pierścień",
 "18775327435":"TrendEco piła pierścieniowa do betonu 3000W GYRO AUTO OFF Profi Bud",
 "18690933709":"TrendEco piła pierścieniowa do betonu + prowadnica ręczna 2,5 m",
 "18690183650":"TrendEco piła pierścieniowa do betonu + prowadnica elektryczna 2,5 m"
};
function attrs(a:Record<string,string|number|boolean>){return Object.entries(a).map(([id,value])=>({id,value}));}
function strip(s:string){return s.replace(/<[^>]+>/g," ").replace(/[^\p{L}\p{N}\s.,;:()/%+×x–—-]/gu," ").replace(/\r/g,"").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();}
function desc(p:any){
 const raw=strip(p.description??"");
 const intro=raw.slice(0,1550).replace(/\s+\S*$/,"").trim();
 return (intro+"\n\nProdukt nowy. Sprzedaż, części zamienne i obsługa z Polski. TrendEco.").slice(0,1800);
}
async function js(r:Response){const t=await r.text();try{return JSON.parse(t)}catch{return {raw:t}}}
export async function GET(req:Request){
 if(new URL(req.url).searchParams.get("run")!=="concrete6-20261006") return NextResponse.json({error:"not found"},{status:404});
 const token=process.env.SPRZEDAJEMY_API_TOKEN?.trim();
 if(!token) return NextResponse.json({error:"SPRZEDAJEMY_API_TOKEN missing"},{status:500});
 const headers={Authorization:`Bearer ${token}`,"Content-Type":"application/json"};
 const locR=await fetch(`${API}/get-location?q=Warszawa`,{headers,cache:"no-store"});
 const locs=await js(locR); const warsaw=Array.isArray(locs)?locs.find((x:any)=>x.name==="Warszawa"&&/mazowieck/i.test(x.parentName??"")):null;
 if(!warsaw?.locationId) return NextResponse.json({error:"Warszawa not found",locs},{status:502});
 const catR=await fetch("https://trendeco.eu/api/catalog",{cache:"no-store"}); const cat=await catR.json();
 const products=(cat.products??[]).filter((p:any)=>IDS.includes(String(p.id)));
 const out:any[]=[];
 for(const p of products){
   const id=String(p.id), externalId=`trendeco_${id}`;
   const ex=await fetch(`${API}/offer-details?external_id=${encodeURIComponent(externalId)}`,{headers,cache:"no-store"});
   if(ex.ok){out.push({id,status:"exists",details:await js(ex)});continue;}
   const payload={externalId,title:TITLES[id],description:desc(p),categoryId:CATEGORY[id],locationId:Number(warsaw.locationId),
     attributes:attrs({price:SITE_PRICE[id],condition:1,"2692_marka":212270})};
   const cr=await fetch(`${API}/create-offer`,{method:"POST",headers,body:JSON.stringify(payload),cache:"no-store"}); const body=await js(cr);
   if(!cr.ok||!body?.offerId){out.push({id,status:"error",http:cr.status,error:body,payload});continue;}
   const pictures=(p.images??[]).map((x:any)=>typeof x==="string"?x:x.url).filter(Boolean).slice(0,12);
   let pics:any=null;
   if(pictures.length){const pr=await fetch(`${API}/add-offer-pictures-batch`,{method:"POST",headers,body:JSON.stringify([{offerId:Number(body.offerId),pictures}]),cache:"no-store"});pics={http:pr.status,body:await js(pr)};}
   out.push({id,status:"created",offerId:body.offerId,url:body.url,title:TITLES[id],price:SITE_PRICE[id],pictures:pics});
 }
 return NextResponse.json({count:out.length,results:out});
}