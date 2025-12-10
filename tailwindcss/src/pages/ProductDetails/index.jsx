import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Rating from "@mui/material/Rating";
import { 
  FaShoppingBag, 
  FaRegHeart, 
  FaHeart,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCreditCard,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
  FaLink, // Using FaLink for copy link instead of FaShareAlt
  FaTags, // For Discount/Offers
  FaStar // For Rating Summary
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
// Assuming ElectronicsItem is a custom component for product card display
import ElectronicsItem from "../../components/ElectronicsItem"; 
import { toast } from "react-toastify";

// --- Custom Components for Cleanliness ---

// Component for the Product Highlights/Policy Icons
const PolicyFeature = ({ Icon, title, subtitle }) => (
  <div className="flex items-start p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <Icon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
    <div className="ml-3">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

// Component for Social Share Buttons
const SocialShareButton = ({ platform, Icon, bgColor, onClick }) => (
  <button
    onClick={() => onClick(platform)}
    className={`flex items-center justify-center w-8 h-8 rounded-full text-white transition-opacity hover:opacity-80`}
    style={{ backgroundColor: bgColor }}
    aria-label={`Share on ${platform}`}
  >
    <Icon size={16} />
  </button>
);

// --- Main Component ---

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [imageZoomed, setImageZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // --- Data Fetching Hooks ---

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = res.data.data;
        setProduct(productData);
        setSelectedImage(productData.images?.[0]?.url);
        setSelectedColor(productData.colors?.[0] || null);
        setSelectedSize(productData.sizes?.[0] || null); // Auto-select first size
        fetchSimilarProducts(productData.category?._id);
        // Simulate checking wishlist status
        // setIsInWishlist(checkWishlistStatus(id)); 
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchSimilarProducts = async (categoryId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products?category=${categoryId}&limit=8`
      );
      // Filter out the current product from similar products
      const filteredProducts = res.data.data?.products?.filter(p => p._id !== id) || [];
      setSimilarProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to fetch similar products:", error);
    }
  };

  // --- Handlers ---

  const handleAddToCart = async () => {
    try {
      if (product.stock <= 0) {
        toast.error("Product is out of stock.");
        return;
      }
      const token = localStorage.getItem("token"); // Assumes token-based auth
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: id, quantity, color: selectedColor, size: selectedSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart. Please ensure you are logged in.");
    }
  };

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      navigate("/checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout.");
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to use the wishlist.");
        return;
      }
      
      const endpoint = isInWishlist 
        ? `http://localhost:5000/api/wishlist/remove/${id}` 
        : `http://localhost:5000/api/wishlist/add`;
      
      if (isInWishlist) {
        await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsInWishlist(false);
        toast.info("Removed from wishlist.");
      } else {
        await axios.post(
          endpoint,
          { productId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Failed to update wishlist.");
    }
  };

  const handleShare = (platform) => {
    const productUrl = window.location.href;
    const shareText = `Check out this amazing product: ${product.name} on our store!`;

    const shareConfig = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(productUrl);
      toast.info("Product link copied to clipboard!");
      return;
    }

    window.open(shareConfig[platform], "_blank");
  };

  // Improved Image Zoom Logic (Simplified for demonstration)
  const handleImageHover = (e) => {
    if (!imageZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: x - 50, y: y - 50 }); // Center the transform
  };

  // --- Derived State & Constants ---

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;
  
  const isOutOfStock = product?.stock <= 0;

  const topBrands = [
    { name: "Apple", logo: "https://cdn-icons-png.flaticon.com/512/0/747.png", products: 42 },
    { name: "Samsung", logo: "https://cdn-icons-png.flaticon.com/512/5967/5967283.png", products: 38 },
    { name: "Sony", logo: "https://cdn-icons-png.flaticon.com/512/732/732228.png", products: 25 },
    { name: "LG", logo: "https://cdn-icons-png.flaticon.com/512/732/732212.png", products: 22 },
    { name: "HP", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968326.png", products: 20 },
  ];
  
  // --- Loading & Not Found States ---

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found 😔</h2>
        <p className="text-gray-600 mb-6">The item you were looking for could not be located.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // --- Rendered JSX ---

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pb-0">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="text-gray-500 hover:text-red-600">Home</a></li>
              <li className="text-gray-400">/</li>
              <li>
                <a
                  href={`/productlisting?category=${product.category?._id}`}
                  className="text-gray-500 hover:text-red-600"
                >
                  {product.category?.name}
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-red-600 font-medium truncate max-w-xs sm:max-w-md">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Main Product Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg">
          
          {/* Left Column - Images */}
          <div className="lg:w-5/12">
            
            {/* Main Image with Zoom */}
            <div
              className={`relative border border-gray-200 rounded-lg overflow-hidden bg-white mb-4 transition-all duration-300 ${
                imageZoomed ? "cursor-zoom-out" : "cursor-crosshair"
              }`}
              onMouseEnter={() => setImageZoomed(true)}
              onMouseLeave={() => {
                setImageZoomed(false);
                setZoomPosition({ x: 0, y: 0 }); // Reset position on exit
              }}
              onMouseMove={handleImageHover}
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <div className="relative h-[400px] sm:h-[500px] lg:h-[550px] flex items-center justify-center">
                <img
                  src={selectedImage || product.images?.[0]?.url}
                  alt={product.name}
                  className={`max-w-full max-h-full object-contain ${imageZoomed ? 'absolute' : ''} transition-transform duration-100 ease-linear`}
                  style={{
                    transform: imageZoomed 
                      ? `scale(1.8) translate(${zoomPosition.x}%, ${zoomPosition.y}%)` 
                      : "scale(1)",
                    transformOrigin: imageZoomed ? 'center center' : 'initial',
                    willChange: 'transform',
                  }}
                />
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Slider */}
            <div className="mt-4">
              <Swiper
                modules={[Navigation, Thumbs]}
                spaceBetween={10}
                slidesPerView={4}
                navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                className="product-thumbnail-swiper"
              >
                {product.images?.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      className={`h-20 sm:h-24 border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 p-1 bg-white flex items-center justify-center ${
                        selectedImage === img.url
                          ? "border-red-600 shadow-md"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          
          {/* Right Column - Product Info */}
          <div className="lg:w-7/12">
            
            {/* Title & Brand */}
            <p className="text-sm font-semibold text-gray-500 mb-1">{product.brand?.name || 'Generic Brand'}</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating & Stock */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center">
                <Rating value={product.averageRating || 0} precision={0.1} readOnly size="medium" />
                <span className="ml-2 text-base font-semibold text-red-600">
                  {product.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({product.reviewCount || 0} Ratings)
                </span>
              </div>
              <span className={`text-sm font-bold ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
                ● {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
              </span>
            </div>
            
            {/* Price Block */}
            <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl font-extrabold text-red-600">₹{product.price.toLocaleString('en-IN')}</span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through font-medium">
                    ₹{product.comparePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    {discount}% Off
                  </span>
                  <span className="text-sm text-gray-700">
                    (You save ₹{(product.comparePrice - product.price).toLocaleString('en-IN')})
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Pay in 3-12 months with EMI starting at <span className="font-semibold text-gray-700">₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month</span>
              </p>
            </div>
            
            {/* Short Description/Highlights */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Key Highlights</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                {product.shortDescription?.split('\n').map((line, idx) => (
                    line.trim() && <li key={idx}>{line.trim()}</li>
                ))}
              </ul>
            </div>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Color: <span className="font-normal text-red-600">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all p-0.5 ${
                        selectedColor === color
                          ? "border-red-600 ring-2 ring-red-300"
                          : "border-gray-200 hover:border-red-400"
                      }`}
                      aria-label={`Select color ${color}`}
                    >
                      <div
                        className="w-full h-full rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Size: <span className="font-normal text-red-600">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-full transition-all text-sm font-medium ${
                        selectedSize === size
                          ? "bg-red-600 text-white border-red-600 shadow-md"
                          : "border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6 flex items-center gap-4">
              <h3 className="font-semibold text-gray-900">Quantity:</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-l-md flex items-center justify-center text-xl hover:bg-red-50 text-gray-700 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 sm:w-16 h-8 sm:h-10 border-t border-b border-gray-300 text-center font-medium focus:outline-none focus:border-red-500"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-r-md flex items-center justify-center text-xl hover:bg-red-50 text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-lg transition font-bold text-lg shadow-lg ${
                  isOutOfStock 
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <FaShoppingBag />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg transition font-bold text-lg shadow-lg ${
                  isOutOfStock 
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                    : "bg-red-800 text-white hover:bg-red-900"
                }`}
              >
                Buy Now
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 sm:w-14 sm:h-14 border border-gray-300 rounded-lg hover:bg-red-50 transition flex items-center justify-center"
                aria-label="Add to Wishlist"
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-600" size={24} />
                ) : (
                  <FaRegHeart className="text-gray-500 group-hover:text-red-600" size={24} />
                )}
              </button>
            </div>
            
            {/* Policy Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4 border-t border-gray-100 mt-4">
              <PolicyFeature Icon={FaTruck} title="Fast Delivery" subtitle="Across India" />
              <PolicyFeature Icon={FaUndo} title="Easy Returns" subtitle="30 Days Policy" />
              <PolicyFeature Icon={FaShieldAlt} title="Brand Warranty" subtitle="2 Year Coverage" />
              <PolicyFeature Icon={FaCreditCard} title="Secure Payments" subtitle="UPI, Cards, COD" />
            </div>

             {/* Share Product Section */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaShareAlt className="text-red-600" /> Share Product
              </h3>
              <div className="flex items-center gap-3">
                <SocialShareButton platform="facebook" Icon={FaFacebook} bgColor="#1877F2" onClick={handleShare} />
                <SocialShareButton platform="twitter" Icon={FaTwitter} bgColor="#1DA1F2" onClick={handleShare} />
                <SocialShareButton platform="pinterest" Icon={FaPinterest} bgColor="#E60023" onClick={handleShare} />
                <SocialShareButton platform="whatsapp" Icon={FaWhatsapp} bgColor="#25D366" onClick={handleShare} />
                <SocialShareButton platform="copy" Icon={FaLink} bgColor="#6B7280" onClick={handleShare} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs (Description, Specs, Reviews) */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-2 sm:space-x-4 px-4 sm:px-6 lg:px-8">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm sm:text-base font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && ` (${product.reviewCount || 0})`}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{product.description}</p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg">
                  <tbody className="bg-white divide-y divide-gray-100">
                    {product.specifications?.map((spec, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-red-50 transition-colors`}>
                        <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-500 w-1/3 lg:w-1/4">
                          {spec.key}
                        </td>
                        <td className="px-4 py-3 sm:px-6 whitespace-normal text-sm text-gray-900 font-semibold w-2/3 lg:w-3/4">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!product.specifications || product.specifications.length === 0) && (
                    <p className="text-gray-500 p-4">No specifications available for this product.</p>
                )}
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <FaStar className="text-red-600"/> Customer Reviews ({product.reviewCount || 0})
                </h3>
                {/* Simplified Review List for space */}
                {product.reviews?.length > 0 ? (
                  product.reviews.slice(0, 3).map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-b-0 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Rating value={review.rating} readOnly size="small" />
                          <span className="font-semibold text-gray-800 text-sm">{review.user?.name || 'Anonymous User'}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                )}
                {product.reviews?.length > 3 && (
                    <button className="mt-4 text-red-600 font-semibold hover:text-red-700 text-sm">
                        View All {product.reviewCount} Reviews →
                    </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12 lg:mt-16">
          <div className="flex justify-between items-end border-b-2 border-red-600 pb-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaTags className="text-red-600"/> You Might Also Like
            </h2>
            <button
              onClick={() => navigate(`/productlisting?category=${product.category?._id}`)}
              className="text-red-600 font-semibold hover:text-red-700 transition text-sm"
            >
              View All →
            </button>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.5}
            navigation
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            }}
            className="similar-products-swiper"
          >
            {similarProducts.slice(0, 8).map((item, idx) => (
              <SwiperSlide key={idx}>
                <ElectronicsItem
                  id={item._id}
                  imageFront={item.images?.[0]?.url}
                  imageBack={item.images?.[1]?.url || item.images?.[0]?.url}
                  category={item.category?.name}
                  title={item.name}
                  rating={item.averageRating}
                  oldPrice={item.comparePrice}
                  newPrice={item.price}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      
      {/* Sticky Add to Cart Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-red-600 shadow-2xl p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-red-600">₹{product.price.toLocaleString('en-IN')}</div>
            {product.comparePrice && (
              <div className="text-sm text-gray-500 line-through">₹{product.comparePrice.toLocaleString('en-IN')}</div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleWishlistToggle}
              className="p-3 border border-gray-300 rounded-lg hover:bg-red-50 transition flex items-center justify-center"
              aria-label="Add to Wishlist"
            >
              {isInWishlist ? (
                <FaHeart className="text-red-600" size={20} />
              ) : (
                <FaRegHeart size={20} />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                isOutOfStock 
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                    : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <FaShoppingBag /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;