import { NextResponse } from "next/server";
import { sprzedajemyEditorial } from "@/lib/sprzedajemyEditorial";
import { sprzedajemyMapping } from "@/lib/sprzedajemyMapping";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const API = "https://sprzedajemy.pl/webapi/v1";
const TEST_ID = "18550962217";

function attrs(a: Record<string,string|number|boolean>) {
  return Object.entries(a).map(([id,value]) => ({ id, value }));
}
async function json(res: Response) {
  const raw=await res.text(); try{return JSON.parse(raw)}catch{return {raw}};
}

export async function POST() {
 try {
  const token=process.env.SPRZEDAJEMY_API_TOKEN;
  if(!token) return NextResponse.json({error:"SPRZEDAJEMY_API_TOKEN missing"},{status:500});
  const headers={Authorization:`Bearer ${token}`,"Content-Type":"application/json"};

  const locRes=await fetch(`${API}/get-location?q=Warszawa`,{headers,cache:"no-store"});
  const locations=await json(locRes);
  const warsaw=Array.isArray(locations)?locations.find((x:any)=>x.name==="Warszawa" && /mazowieck/i.test(x.parentName??"")):null;
  if(!warsaw?.locationId) return NextResponse.json({error:"Warszawa location not found",locations},{status:502});

  const catalogRes=await fetch("https://trendeco.eu/api/catalog",{cache:"no-store"});
  if(!catalogRes.ok) return NextResponse.json({error:`Catalog HTTP ${catalogRes.status}`},{status:502});
  const data=await catalogRes.json();
  const products=Array.isArray(data)?data:(data.products??[]);
  const results:any[]=[];

  for(const p of products){
   const sourceId=String(p.id);
   const externalId=`trendeco_${sourceId}`;
   if(sourceId===TEST_ID){ results.push({sourceId,status:"skip",reason:"test_offer_exists"}); continue; }
   try{
    const existing=await fetch(`${API}/offer-details?external_id=${encodeURIComponent(externalId)}`,{headers,cache:"no-store"});
    if(existing.ok){ results.push({sourceId,status:"skip",reason:"already_exists"}); continue; }

    const editorial=sprzedajemyEditorial(p);
    const mapping=sprzedajemyMapping(sourceId,p.price);
    const payload={
      externalId,title:editorial.title,description:editorial.description,
      categoryId:mapping.categoryId,locationId:Number(warsaw.locationId),
      attributes:attrs(mapping.attributes)
    };
    const create=await fetch(`${API}/create-offer`,{method:"POST",headers,body:JSON.stringify(payload),cache:"no-store"});
    const body=await json(create);
    if(!create.ok || !body?.offerId){ results.push({sourceId,status:"error",step:"create",http:create.status,error:body}); continue; }

    const pictures=(p.images??[]).map((x:any)=>typeof x==="string"?x:x.url).filter(Boolean).slice(0,12);
    let pictureResult:any={queued:0};
    if(pictures.length){
      const add=await fetch(`${API}/add-offer-pictures-batch`,{method:"POST",headers,body:JSON.stringify([{offerId:Number(body.offerId),pictures}]),cache:"no-store"});
      const addBody=await json(add);
      pictureResult={ok:add.ok,http:add.status,response:addBody,requested:pictures.length};
    }
    results.push({sourceId,status:"created",offerId:body.offerId,title:body.title??editorial.title,categoryId:mapping.categoryId,pictures:pictureResult});
   }catch(e){results.push({sourceId,status:"error",step:"exception",error:e instanceof Error?e.message:String(e)});}
  }
  const summary={
    total:products.length,
    created:results.filter(x=>x.status==="created").length,
    skipped:results.filter(x=>x.status==="skip").length,
    errors:results.filter(x=>x.status==="error").length
  };
  return NextResponse.json({summary,results});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:String(e)},{status:500});}
}
