import { useEffect, useState } from "react";
import api from "../api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const itemsPerPage = 8;

  useEffect(() => {
    api.get("products/").then((res) => {
      const productList = res.data.results || res.data;
      setProducts(productList);
      setFilteredProducts(productList);
      const uniqueCategories = [
        ...new Set(productList.map((product) => product.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    });
  }, []);

  useEffect(() => {
    filterProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, minPrice, maxPrice, products]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice !== "") {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice !== "") {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    // Main container now uses bg-background and text-foreground
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Hero Section - fixed gradient background, text remains white */}
      <section className="dark:bg-black dark:text-white  bg-gradient-to-r from-purple-400 to-pink-300 py-20 text-center ">
        <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Discover the Best Deals</h2>
        <p className="text-lg mb-6 font-medium">Shop top-quality products at unbeatable prices</p>
        <Button className="px-6 py-2 text-white bg-yellow-400 hover:bg-yellow-500 font-semibold rounded-full shadow-md">
          Start Shopping 
        </Button>
      </section>

      {/* Filters + Products */}
      <main className="flex-1 py-12 px-6 sm:px-10 lg:px-20">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          {/* Featured Products heading - text-purple-700 remains explicit */}
          <h3 className="text-3xl font-bold text-purple-700">🌟 Featured Products</h3>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Input fields use semantic colors for background, text, and border */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-input rounded px-3 py-2 w-60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-input rounded px-3 py-2 w-28 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-input rounded px-3 py-2 w-28 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                {/* SelectTrigger uses semantic colors for background, text, and border */}
                <SelectTrigger className="border border-input focus:ring-ring bg-background text-foreground">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                {/* SelectContent uses semantic colors for background and text */}
                <SelectContent className="bg-popover text-popover-foreground">
                  {/* SelectItem uses semantic colors for text and hover states */}
                  <SelectItem value="all" className="hover:bg-accent hover:text-accent-foreground">All Categories</SelectItem>
                  {categories.map((cat, idx) => (
                    <SelectItem key={idx} value={String(cat)} className="hover:bg-accent hover:text-accent-foreground">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 mb-10">
            <Pagination>
              <PaginationContent className="flex justify-center flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    // Pagination navigation colors adjust
                    className={currentPage === 1 ? "pointer-events-none opacity-50 text-muted-foreground" : "text-foreground hover:text-primary"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className="rounded-full text-foreground hover:bg-accent hover:text-accent-foreground" // Pagination numbers
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    // Pagination navigation colors adjust
                    className={currentPage === totalPages ? "pointer-events-none opacity-50 text-muted-foreground" : "text-foreground hover:text-primary"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
            <Card
              key={product.id}
              // Card background and border adjust with theme
              className="transition-transform hover:scale-105 duration-300 bg-card text-card-foreground rounded-2xl shadow-lg border border-border"
            >
              <div className="h-48 bg-gradient-to-tr from-pink-100 to-purple-100 flex items-center justify-center rounded-t-2xl overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-purple-400">No Image</span>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-lg truncate">{product.name}</h4> {/* Uses text-card-foreground */}
                <p className="text-sm truncate text-muted-foreground">{product.description}</p> {/* Uses text-muted-foreground */}
                <p className="text-pink-600 font-bold text-lg">${product.price}</p> {/* Explicit pink, remains pink */}
                <Link to={`/productdetail/${product.id}`}>
                  <Button className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
                    View Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer - uses fixed dark background and white text */}
      <footer className="bg-gradient-to-r from-purple-400 to-pink-500 py-6 text-center text-sm text-white">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </footer>
    </div>
  );
}
