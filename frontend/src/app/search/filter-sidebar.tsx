import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FilterSidebar({ filters, applyFilters }) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    applyFilters(localFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      seller: "",
    }
    setLocalFilters(resetFilters)
    applyFilters(resetFilters)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={localFilters.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
            <SelectItem value="Fashion">Fashion</SelectItem>
            <SelectItem value="Books">Books</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="minPrice">Min Price</Label>
        <Input
          id="minPrice"
          type="number"
          value={localFilters.minPrice}
          onChange={(e) => handleChange("minPrice", e.target.value)}
          placeholder="Min price"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxPrice">Max Price</Label>
        <Input
          id="maxPrice"
          type="number"
          value={localFilters.maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          placeholder="Max price"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seller">Seller</Label>
        <Select value={localFilters.seller} onValueChange={(value) => handleChange("seller", value)}>
          <SelectTrigger id="seller">
            <SelectValue placeholder="Select seller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="TechGadgets">TechGadgets</SelectItem>
            <SelectItem value="MobileWorld">MobileWorld</SelectItem>
            <SelectItem value="KitchenEssentials">KitchenEssentials</SelectItem>
            <SelectItem value="OutdoorGear">OutdoorGear</SelectItem>
            <SelectItem value="BookWorm">BookWorm</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleApply} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  )
}


