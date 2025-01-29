"use client"
//searhc products
//  - ai summary of review
//    - add user details like address
//      - live image of product

import { useSearchParams } from "next/navigation";
import { ProductList } from "./ProductList";

//        - fake product via upload
export default function SearchPage() {
  const query = useSearchParams().get("q");
  return (
    <div>

      <p>Searching for: '{query}'</p>
      <ProductList />
    </div>

  )
}
