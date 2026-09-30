"use client";

import { useEffect, type ReactNode } from "react";

export type AnalyticsProduct = { id:string; name:string; price:string; currency:string; category?:string };

function item(product:AnalyticsProduct) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: Number.parseFloat(String(product.price).replace(",", ".")) || 0,
    quantity: 1,
  };
}

export default function ProductAnalytics({product}:{product:AnalyticsProduct}) {
  useEffect(() => {
    const value = Number.parseFloat(String(product.price).replace(",", ".")) || 0;
    window.gtag?.("event", "view_item", { currency: product.currency || "PLN", value, items: [item(product)] });
  }, [product.id, product.name, product.price, product.currency, product.category]);
  return null;
}

export function ExternalOfferLink({href,product,className,children}:{href:string;product:AnalyticsProduct;className?:string;children:ReactNode}) {
  function track() {
    const value = Number.parseFloat(String(product.price).replace(",", ".")) || 0;
    window.gtag?.("event", "click_allegro", { currency: product.currency || "PLN", value, items: [item(product)], link_url: href });
  }
  return <a href={href} target="_blank" rel="noopener noreferrer sponsored" onClick={track} className={className}>{children}</a>;
}
