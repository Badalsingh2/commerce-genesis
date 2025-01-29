"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void // Optional callback for page change
}

export function EnhancedPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page) // Trigger callback if provided
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", page.toString())
      router.push(`/search?${params.toString()}`)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []

    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include the first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near the start: show first 4 pages + ellipsis + last page
        pages.push(2, 3, 4, "ellipsis")
      } else if (currentPage >= totalPages - 2) {
        // Near the end: show first page + ellipsis + last 4 pages
        pages.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1)
      } else {
        // Middle: first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push("ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis")
      }

      // Always include the last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) goToPage(currentPage - 1)
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  goToPage(page as number)
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) goToPage(currentPage + 1)
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
