import { CameraIcon, Send } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <button className="text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition duration-300 absolute right-0 z-10">
          <Send className="h-6 w-6 text-foreground" />
        </button>
        <button className="absolute ml-2 bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition duration-300">
          <CameraIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

