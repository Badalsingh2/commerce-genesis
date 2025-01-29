"use client"
//searhc products
//  - ai summary of review
//    - add user details like address
//      - live image of product

import { useSearchParams } from "next/navigation";

//        - fake product via upload
export default function SearchPage() {
  const query = useSearchParams().get("q");
  return (
    <p>Searching for: '{query}'</p>
  )
}
