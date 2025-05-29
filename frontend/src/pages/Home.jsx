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
    <div className="bg-gradient-to-br from-orange-100 to-pink-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-400 to-pink-300 py-20 text-center text-white">
        <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Discover the Best Deals</h2>
        <p className="text-lg mb-6 font-medium">Shop top-quality products at unbeatable prices</p>
        <Button className="px-6 py-2 text-white bg-yellow-400 hover:bg-yellow-500 font-semibold rounded-full shadow-md">
          Start Shopping 
        </Button>
      </section>

      {/* Filters + Products */}
      <main className="flex-1 py-12 px-6 sm:px-10 lg:px-20">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          <h3 className="text-3xl font-bold text-purple-700">🌟 Featured Products</h3>

          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-purple-500 rounded px-3 py-2 w-60"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-purple-500 rounded px-3 py-2 w-28 "
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-purple-500 rounded px-3 py-2 w-28"
            />

            <div className="w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-purple-400 focus:ring-purple-500">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat, idx) => (
                    <SelectItem key={idx} value={String(cat)}>
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className="rounded-full"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
              className="transition-transform hover:scale-105 duration-300 bg-white rounded-2xl shadow-lg border border-purple-200"
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
                <h4 className="font-semibold text-lg text-purple-700 truncate">{product.name}</h4>
                <p className="text-gray-600 text-sm truncate">{product.description}</p>
                <p className="text-pink-600 font-bold text-lg">${product.price}</p>
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-400 to-pink-500 py-6 text-center text-sm text-white">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </footer>
    </div>
  );
}
