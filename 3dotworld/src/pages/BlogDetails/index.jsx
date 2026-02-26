// BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  const { id } = useParams(); // Changed from slug to id
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // API configuration
  const API_URL = "https://server-kzwj.onrender.com/api/blogs";

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        
        // Use ID directly since your backend uses /:id
        const response = await axios.get(`${API_URL}/${id}`);
        
        if (response.data.success) {
          const blogData = response.data.data;
          setBlog(blogData);
          
          // Fetch related blogs (same category, excluding current)
          if (blogData.category) {
            const relatedResponse = await axios.get(`${API_URL}?category=${blogData.category}`);
            if (relatedResponse.data.success) {
              const related = relatedResponse.data.data.filter(b => b._id !== blogData._id);
              setRelatedBlogs(related.slice(0, 3));
            }
          }
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog details");
        
        // Fallback to mock data for demonstration
        const mockBlog = {
          _id: id,
          title: `Blog Post ${id}`,
          content: `
            <h2>Introduction</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            
            <h2>Main Content</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <blockquote>
              "This is a beautiful quote about the topic. It adds credibility and depth to the content."
            </blockquote>
            
            <h2>Conclusion</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          `,
          image: `/ad_banner/banner${Math.floor(Math.random() * 8) + 1}.jpg`,
          category: ["Technology", "Fashion", "Lifestyle", "Health", "Business", "Other"][Math.floor(Math.random() * 6)],
          author: {
            name: "John Doe"
          },
          createdAt: new Date().toISOString(),
          views: 0,
          status: "published"
        };
        setBlog(mockBlog);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The blog you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blogs
          </button>
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          {/* <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">{blog.title}</h1> */}
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {blog.category && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                {blog.category}
              </span>
            )}
            {blog.author?.name && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {blog.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(blog.createdAt)}
            </span>
            {blog.views > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {blog.views} views
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {blog.image && (
          <div className="mb-12">
            <img
              src={blog.image.startsWith('http') ? blog.image : `https://server-kzwj.onrender.com${blog.image}`}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-light text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((related) => (
                <Link
                  key={related._id}
                  to={`/blog/${related._id}`}
                  className="group block"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {related.image && (
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                      <img
                        src={related.image.startsWith('http') ? related.image : `https://server-kzwj.onrender.com${related.image}`}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  )}
                  <h4 className="text-gray-900 font-medium group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                    {related.title}
                  </h4>
                  {related.category && (
                    <p className="text-sm text-gray-500 mt-1">{related.category}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;