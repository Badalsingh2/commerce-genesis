import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Filter, RefreshCw } from "lucide-react"

interface FilterSidebarProps {
  filters: {
    category: string
    minPrice: string
    maxPrice: string
    seller: string
  }
  applyFilters: (filters: any) => void
}

export default function FilterSidebar({ filters, applyFilters }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleChange = (key: string, value: string) => {
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
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-primary">Filters</h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select
                value={localFilters.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger id="category" className="w-full bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Price Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    id="minPrice"
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleChange("minPrice", e.target.value)}
                    placeholder="Min"
                    className="bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="maxPrice"
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleChange("maxPrice", e.target.value)}
                    placeholder="Max"
                    className="bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="seller" className="text-sm font-medium text-gray-700">
                Seller
              </Label>
              <Select value={localFilters.seller} onValueChange={(value) => handleChange("seller", value)}>
                <SelectTrigger id="seller" className="w-full bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select seller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sellers</SelectItem>
                  <SelectItem value="TechGadgets">TechGadgets</SelectItem>
                  <SelectItem value="MobileWorld">MobileWorld</SelectItem>
                  <SelectItem value="KitchenEssentials">KitchenEssentials</SelectItem>
                  <SelectItem value="OutdoorGear">OutdoorGear</SelectItem>
                  <SelectItem value="BookWorm">BookWorm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3"
          >
            <Button
              onClick={handleApply}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Apply Filters
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
