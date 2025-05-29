// src/pages/blog/BlogPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Healthy Hair",
    date: "2023-05-15",
    excerpt: "Discover our top recommendations for maintaining healthy hair all year round.",
    image: "/images/blog-hair.jpg",
    category: "Beauty",
    readTime: "5 min read",
    author: "Sarah Johnson",
    authorAvatar: "/images/avatars/sarah.jpg"
  },
  {
    id: 2,
    title: "New Organic Shampoo Launch",
    date: "2023-04-28",
    excerpt: "Learn about our new eco-friendly shampoo formula now available in stores.",
    image: "/images/blog-shampoo.jpg",
    category: "Products",
    readTime: "4 min read",
    author: "Michael Chen",
    authorAvatar: "/images/avatars/michael.jpg"
  },
  {
    id: 3,
    title: "Sustainable Packaging Initiative",
    date: "2023-06-10",
    excerpt: "How we're reducing our environmental impact with new packaging solutions.",
    image: "/images/blog-packaging.jpg",
    category: "Sustainability",
    readTime: "7 min read",
    author: "Emma Rodriguez",
    authorAvatar: "/images/avatars/emma.jpg"
  }
];

const categories = ["All", "Beauty", "Products", "Sustainability", "Lifestyle"];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          The Glow Journal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the latest beauty trends, product launches, and expert tips
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image with category badge */}
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder-blog.jpg';
                  }}
                />
                <span className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                {/* Author and Read More */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      loading="lazy"
                    />
                    <span className="text-sm font-medium text-gray-700">{post.author}</span>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                  >
                    Read more <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <Search className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-20 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Latest Posts
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our newsletter to receive beauty tips, product launches, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}