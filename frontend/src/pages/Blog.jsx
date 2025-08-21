import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Healthy Hair",
    date: "2023-05-15",
    excerpt: "Discover our top recommendations for maintaining healthy hair all year round.",
    image: "https://placehold.co/600x400/E0F2F7/283593?text=Hair+Care", // Placeholder image
    category: "Beauty",
    readTime: "5 min read",
    author: "Sarah Johnson",
    authorAvatar: "https://placehold.co/40x40/FFEBEE/D32F2F?text=SJ" // Placeholder avatar
  },
  {
    id: 2,
    title: "New Organic Shampoo Launch",
    date: "2023-04-28",
    excerpt: "Learn about our new eco-friendly shampoo formula now available in stores.",
    image: "https://placehold.co/600x400/FFF3E0/E65100?text=Shampoo", // Placeholder image
    category: "Products",
    readTime: "4 min read",
    author: "Michael Chen",
    authorAvatar: "https://placehold.co/40x40/E8F5E9/2E7D32?text=MC" // Placeholder avatar
  },
  {
    id: 3,
    title: "Sustainable Packaging Initiative",
    date: "2023-06-10",
    excerpt: "How we're reducing our environmental impact with new packaging solutions.",
    image: "https://placehold.co/600x400/E3F2FD/1565C0?text=Packaging", // Placeholder image
    category: "Sustainability",
    readTime: "7 min read",
    author: "Emma Rodriguez",
    authorAvatar: "https://placehold.co/40x40/F3E5F5/8E24AA?text=ER" // Placeholder avatar
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
      // Loading state also uses semantic colors
      <div className="flex justify-center items-center h-64 bg-background text-muted-foreground">
        <div className="animate-pulse">Loading articles...</div>
      </div>
    );
  }

  return (
    // Main container uses background and foreground colors
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background text-foreground">
      {/* Hero Header */}
      <div className="text-center mb-16">
        {/* Title uses gradient text, remains explicit */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          The Glow Journal
        </h1>
        {/* Paragraph uses muted-foreground for body text */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              // Category buttons use primary/secondary semantic colors
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground' // Active state
                  : 'bg-secondary text-secondary-foreground hover:bg-accent' // Inactive state
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          {/* Search icon uses muted-foreground */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          {/* Search input uses input semantic colors */}
          <input
            type="text"
            placeholder="Search articles..."
            className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
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
              // Article card uses card semantic colors for background and text
              className="bg-card text-card-foreground rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border"
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
                    e.target.src = 'https://placehold.co/600x400?text=No+Image'; // Fallback placeholder
                  }}
                />
                {/* Category badge remains explicit pink/white */}
                <span className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta info text color uses muted-foreground */}
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                {/* Title text uses foreground, hover remains purple */}
                <h2 className="text-xl font-bold text-foreground mb-2 hover:text-purple-600 transition-colors">
                  {post.title}
                </h2>
                {/* Excerpt text uses muted-foreground */}
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>

                {/* Author and Read More */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      loading="lazy"
                    />
                    {/* Author name text uses foreground */}
                    <span className="text-sm font-medium text-foreground">{post.author}</span>
                  </div>
                  {/* Read more link remains explicit purple */}
                  <Link 
                    to={`#`}
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
        // No articles found state uses muted background and foreground text
        <div className="text-center py-16 bg-muted text-muted-foreground rounded-xl">
          <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
            <Search className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
          <p className="max-w-md mx-auto">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Newsletter CTA */}
      {/* Newsletter CTA section uses muted background */}
      <div className="mt-20 bg-muted rounded-2xl p-8 md:p-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Newsletter CTA text uses foreground and muted-foreground */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Stay Updated with Our Latest Posts
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our newsletter to receive beauty tips, product launches, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {/* Newsletter input uses input semantic colors */}
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
            />
            {/* Subscribe button remains explicit gradient/white */}
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
