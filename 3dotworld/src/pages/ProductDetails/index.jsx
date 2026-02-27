import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Rating from "@mui/material/Rating";
import { addToCart } from "../../utils/cart"; 
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
  FaLink,
  FaTags,
  FaStar,
  FaCheck,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaThumbsUp,
  FaCamera,
  FaFilter,
  FaSortAmountDown,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import ElectronicsItem from "../../components/ElectronicsItem";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  Chip,
  Avatar,
  Divider,
  Paper,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Image as ImageIcon,
  ThumbUp as ThumbUpIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  CheckCircle as VerifiedIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

// Custom Components
const PolicyFeature = ({ Icon, title, subtitle }) => (
  <div className="flex items-start p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <Icon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
    <div className="ml-3">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

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

// Review Form Component
const ReviewForm = ({ productId, open, onClose, onReviewSubmit, editMode, reviewToEdit }) => {
  const [formData, setFormData] = useState({
    rating: editMode ? reviewToEdit?.rating || 5 : 5,
    title: editMode ? reviewToEdit?.title || "" : "",
    comment: editMode ? reviewToEdit?.comment || "" : "",
    pros: editMode ? reviewToEdit?.pros || "" : "",
    cons: editMode ? reviewToEdit?.cons || "" : "",
    productUsage: editMode ? reviewToEdit?.productUsage || "less-than-month" : "less-than-month",
  });

  const [images, setImages] = useState(editMode ? reviewToEdit?.images || [] : []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post("https://server-kzwj.onrender.com/api/upload/review", formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data.url;
      } catch (err) {
        console.error("Upload failed:", err);
        return null;
      }
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);
    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.rating || formData.rating < 1) {
      setError("Please select a rating");
      return false;
    }
    if (!formData.comment.trim()) {
      setError("Review comment is required");
      return false;
    }
    if (formData.comment.length < 10) {
      setError("Review must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const endpoint = editMode
        ? `https://server-kzwj.onrender.com/api/reviews/${reviewToEdit._id}`
        : "https://server-kzwj.onrender.com/api/reviews";

      const method = editMode ? "put" : "post";

      const response = await axios[method](
        endpoint,
        {
          productId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          pros: formData.pros,
          cons: formData.cons,
          productUsage: formData.productUsage,
          images,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        onReviewSubmit();
        onClose();
        toast.success(editMode ? "Review updated successfully!" : "Review submitted successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{editMode ? "Edit Review" : "Write a Review"}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Rating */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Overall Rating *
          </Typography>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={(_, value) => setFormData((prev) => ({ ...prev, rating: value }))}
            size="large"
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarIcon fontSize="inherit" />}
          />
        </Box>

        {/* Title */}
        <TextField
          fullWidth
          label="Review Title (Optional)"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          margin="normal"
          size="small"
        />

        {/* Comment */}
        <TextField
          fullWidth
          label="Your Review *"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          multiline
          rows={4}
          margin="normal"
          size="small"
          placeholder="Share your experience with this product..."
        />

        {/* Pros & Cons */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="What you like (Pros)"
              name="pros"
              value={formData.pros}
              onChange={handleInputChange}
              multiline
              rows={2}
              size="small"
              placeholder="Good battery life, Great display..."
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="What could be better (Cons)"
              name="cons"
              value={formData.cons}
              onChange={handleInputChange}
              multiline
              rows={2}
              size="small"
              placeholder="Heavy, Expensive..."
            />
          </Grid>
        </Grid>

        {/* Product Usage */}
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>How long have you used this product?</InputLabel>
          <Select
            name="productUsage"
            value={formData.productUsage}
            onChange={handleInputChange}
            label="How long have you used this product?"
          >
            <MenuItem value="less-than-month">Less than a month</MenuItem>
            <MenuItem value="1-6-months">1-6 months</MenuItem>
            <MenuItem value="6-12-months">6-12 months</MenuItem>
            <MenuItem value="1-2-years">1-2 years</MenuItem>
            <MenuItem value="more-than-2-years">More than 2 years</MenuItem>
          </Select>
        </FormControl>

        {/* Image Upload */}
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Add Photos (Optional)
          </Typography>
          <input
            accept="image/*"
            type="file"
            multiple
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="review-image-upload"
            disabled={uploading || images.length >= 5}
          />
          <label htmlFor="review-image-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={<AddPhotoIcon />}
              disabled={uploading || images.length >= 5}
            >
              {uploading ? "Uploading..." : "Add Photos"}
            </Button>
          </label>
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
            Maximum 5 images
          </Typography>

          {/* Image Previews */}
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
            {images.map((url, index) => (
              <Box key={index} position="relative">
                <img
                  src={url}
                  alt={`Review ${index + 1}`}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "white" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Submitting..." : editMode ? "Update Review" : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Review Item Component
const ReviewItem = ({ review, currentUser, onLike, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(review.userLiked || false);
  const [likeCount, setLikeCount] = useState(review.likes || 0);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      await onLike(review._id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const getUsageLabel = (usage) => {
    const labels = {
      "less-than-month": "Less than a month",
      "1-6-months": "1-6 months",
      "6-12-months": "6-12 months",
      "1-2-years": "1-2 years",
      "more-than-2-years": "More than 2 years",
    };
    return labels[usage] || usage;
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 2, bgcolor: "background.default", borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={review.user?.avatar || review.user?.profilePicture}>
            {review.user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {review.user?.name || "Anonymous"}
              {review.user?.verified && (
                <VerifiedIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
              )}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {format(new Date(review.createdAt), "MMM dd, yyyy")}
            </Typography>
          </Box>
        </Box>

        {currentUser && currentUser._id === review.user?._id && (
          <>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  onEdit(review);
                  handleMenuClose();
                }}
              >
                <FaEdit style={{ marginRight: 8 }} /> Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDelete(review._id);
                  handleMenuClose();
                }}
                sx={{ color: "error.main" }}
              >
                <FaTrash style={{ marginRight: 8 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Rating and Title */}
      <Box mt={2} display="flex" alignItems="center" gap={2}>
        <Rating value={review.rating} readOnly size="small" />
        {review.title && (
          <Typography variant="subtitle1" fontWeight="bold">
            {review.title}
          </Typography>
        )}
      </Box>

      {/* Review Body */}
      <Typography variant="body2" sx={{ mt: 2, mb: 2, whiteSpace: "pre-line" }}>
        {review.comment}
      </Typography>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          {review.pros && (
            <Grid item xs={6}>
              <Box sx={{ p: 1.5, bgcolor: "success.light", borderRadius: 1 }}>
                <Typography variant="caption" fontWeight="bold" color="success.dark">
                  PROS
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {review.pros}
                </Typography>
              </Box>
            </Grid>
          )}
          {review.cons && (
            <Grid item xs={6}>
              <Box sx={{ p: 1.5, bgcolor: "error.light", borderRadius: 1 }}>
                <Typography variant="caption" fontWeight="bold" color="error.dark">
                  CONS
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {review.cons}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <Box display="flex" gap={1} mt={2} flexWrap="wrap">
          {review.images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img}
              alt={`Review image ${idx + 1}`}
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => window.open(img, "_blank")}
            />
          ))}
        </Box>
      )}

      {/* Review Metadata */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Typography variant="caption" color="textSecondary">
          <FaCalendarAlt style={{ marginRight: 4 }} />
          Used for: {getUsageLabel(review.productUsage)}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            size="small"
            label={`${likeCount} helpful`}
            icon={<ThumbUpIcon />}
            onClick={handleLike}
            variant={liked ? "filled" : "outlined"}
            color={liked ? "primary" : "default"}
            clickable
          />
        </Box>
      </Box>
    </Paper>
  );
};

// Main ProductDetails Component
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

  // Review System States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewSort, setReviewSort] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const reviewsPerPage = 5;

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    const token = getToken();
    if (!token) {
      setIsInWishlist(false);
      return;
    }

    try {
      const response = await axios.get(`https://server-kzwj.onrender.com/api/wishlist/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        setIsInWishlist(response.data.data.isInWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://server-kzwj.onrender.com/api/products/${id}`);
        const productData = res.data.data;
        setProduct(productData);
        setSelectedImage(productData.images?.[0]?.url);
        setSelectedColor(productData.colors?.[0] || null);
        setSelectedSize(productData.sizes?.[0] || null);
        fetchSimilarProducts(productData.category?._id);
        fetchUserAndPurchaseStatus();
        checkWishlistStatus(); // Check wishlist status
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`https://server-kzwj.onrender.com/api/reviews/product/${id}`);
      
      if (response.data.success) {
        setReviews(response.data.data);
        const total = response.data.data.length;
        setTotalReviewPages(Math.ceil(total / reviewsPerPage));
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch user and purchase status
  const fetchUserAndPurchaseStatus = async () => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      
      try {
        // Fetch user profile
        const userResponse = await axios.get("https://server-kzwj.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (userResponse.data.success) {
          setCurrentUser(userResponse.data.data);
          
          // Check if user has purchased this product
          try {
            const purchaseResponse = await axios.get(
              `https://server-kzwj.onrender.com/api/orders/check-purchase/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (purchaseResponse.data.success) {
              setHasPurchasedProduct(purchaseResponse.data.hasPurchased);
            }
          } catch (purchaseError) {
            console.log("Purchase check endpoint not available");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    // Fetch reviews after user status is checked
    fetchReviews();
  };

  // Fetch similar products
  const fetchSimilarProducts = async (categoryId) => {
    try {
      const res = await axios.get(`https://server-kzwj.onrender.com/api/products?category=${categoryId}&limit=8`);
      const filteredProducts = res.data.data?.products?.filter((p) => p._id !== id) || [];
      setSimilarProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to fetch similar products:", error);
    }
  };

  // Add to cart - FIXED

const handleAddToCart = async () => {
  try {
    if (product.stock <= 0) {
      toast.error("Product is out of stock.");
      return;
    }
    
    const token = getToken();
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    setCartLoading(true);
    
    // ✅ Use the imported addToCart function
    const result = await addToCart(id, quantity);
    
    if (result.success) {
      toast.success(`${quantity} item(s) added to cart!`);
      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      // Handle specific error cases
      if (result.requiresAuth || result.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(result.message || "Failed to add to cart");
      }
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("Error adding to cart. Please try again.");
  } finally {
    setCartLoading(false);
  }
};

  // Buy now
  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      navigate("/Checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout.");
    }
  };

  // Wishlist toggle - FIXED
  const handleWishlistToggle = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login to use the wishlist.");
        navigate("/login");
        return;
      }
      
      setWishlistLoading(true);
      
      if (isInWishlist) {
        // ✅ FIXED: Remove from wishlist - DELETE /api/wishlist/:productId
        const response = await axios.delete(
          `https://server-kzwj.onrender.com/api/wishlist/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data.success) {
          setIsInWishlist(false);
          toast.info("Removed from wishlist.");
        }
      } else {
        // ✅ FIXED: Add to wishlist - POST /api/wishlist
        const response = await axios.post(
          "https://server-kzwj.onrender.com/api/wishlist",
          { productId: id },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        if (response.data.success) {
          setIsInWishlist(true);
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.response?.data?.message || "Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Share product
  const handleShare = (platform) => {
    const productUrl = window.location.href;
    const shareText = `Check out this amazing product: ${product?.name} on our store!`;

    const shareConfig = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(productUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        productUrl
      )}&description=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(productUrl);
      toast.info("Product link copied to clipboard!");
      return;
    }

    window.open(shareConfig[platform], "_blank");
  };

  // Image zoom
  const handleImageHover = (e) => {
    if (!imageZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: x - 50, y: y - 50 });
  };

  // Review functions
  const handleReviewSubmit = () => {
    fetchReviews();
    // Refresh product to update review count
    axios.get(`https://server-kzwj.onrender.com/api/products/${id}`).then((res) => {
      setProduct(res.data.data);
    });
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login to like reviews");
        return;
      }
      
      const response = await axios.put(
        `https://server-kzwj.onrender.com/api/reviews/${reviewId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to like review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = getToken();
      const response = await axios.delete(`https://server-kzwj.onrender.com/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews();
        // Refresh product
        axios.get(`https://server-kzwj.onrender.com/api/products/${id}`).then((res) => {
          setProduct(res.data.data);
        });
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewModalOpen(true);
  };

  // Filter and sort reviews
  const filteredReviews = reviews.filter((review) => {
    if (reviewFilter === "with-images" && (!review.images || review.images.length === 0))
      return false;
    if (reviewFilter !== "all" && reviewFilter !== "with-images" && review.rating !== parseInt(reviewFilter))
      return false;
    if (
      searchQuery &&
      !review.comment.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !review.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (reviewSort) {
      case "helpful":
        return (b.likes || 0) - (a.likes || 0);
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      default: // recent
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const paginatedReviews = sortedReviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  );

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : product?.averageRating?.toFixed(1) || "0.0";

  const discount = product?.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const isOutOfStock = product?.stock <= 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <CircularProgress size={60} />
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

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-red-600">
                  Home
                </a>
              </li>
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
              <li className="text-red-600 font-medium truncate max-w-xs sm:max-w-md">
                {product.name}
              </li>
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
                setZoomPosition({ x: 0, y: 0 });
              }}
              onMouseMove={handleImageHover}
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <div className="relative h-[400px] sm:h-[500px] lg:h-[550px] flex items-center justify-center">
                <img
                  src={selectedImage || product.images?.[0]?.url}
                  alt={product.name}
                  className={`max-w-full max-h-full object-contain ${
                    imageZoomed ? "absolute" : ""
                  } transition-transform duration-100 ease-linear`}
                  style={{
                    transform: imageZoomed
                      ? `scale(1.8) translate(${zoomPosition.x}%, ${zoomPosition.y}%)`
                      : "scale(1)",
                    transformOrigin: imageZoomed ? "center center" : "initial",
                    willChange: "transform",
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
                navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
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
            <p className="text-sm font-semibold text-gray-500 mb-1">
              {product.brand?.name || "Generic Brand"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center">
                <Rating value={parseFloat(averageRating)} precision={0.1} readOnly size="medium" />
                <span className="ml-2 text-base font-semibold text-red-600">{averageRating}</span>
                <span className="ml-1 text-sm text-gray-500">
                  ({product.reviewCount || reviews.length} Ratings)
                </span>
              </div>
              <span
                className={`text-sm font-bold ${
                  isOutOfStock ? "text-red-500" : "text-green-600"
                }`}
              >
                ● {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
              </span>
            </div>

            {/* Price Block */}
            <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl font-extrabold text-red-600">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through font-medium">
                    ₹{product.comparePrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">{discount}% Off</span>
                  <span className="text-sm text-gray-700">
                    (You save ₹
                    {(product.comparePrice - product.price).toLocaleString("en-IN")})
                  </span>
                </div>
              )}
            </div>

            {/* Short Description/Highlights */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Key Highlights</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                {product.shortDescription
                  ? product.shortDescription.split("\n").map(
                      (line, idx) => line.trim() && <li key={idx}>{line.trim()}</li>
                    )
                  : product.description
                      ?.split("\n")
                      .slice(0, 3)
                      .map((line, idx) => line.trim() && <li key={idx}>{line.trim()}</li>)}
              </ul>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Color: <span className="font-normal text-red-600">{selectedColor}</span>
                </h3>
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
                <h3 className="font-semibold text-gray-900 mb-3">
                  Size: <span className="font-normal text-red-600">{selectedSize}</span>
                </h3>
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
                disabled={isOutOfStock || cartLoading}
                className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-lg transition font-bold text-lg shadow-lg ${
                  isOutOfStock || cartLoading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {cartLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <FaShoppingBag />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </>
                )}
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
                disabled={wishlistLoading}
                className="p-3 sm:w-14 sm:h-14 border border-gray-300 rounded-lg hover:bg-red-50 transition flex items-center justify-center disabled:opacity-50"
                aria-label="Add to Wishlist"
              >
                {wishlistLoading ? (
                  <CircularProgress size={24} />
                ) : isInWishlist ? (
                  <FaHeart className="text-red-600" size={24} />
                ) : (
                  <FaRegHeart className="text-gray-500 group-hover:text-red-600" size={24} />
                )}
              </button>
            </div>

            {/* Policy Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4 border-t border-gray-100 mt-4">
              <PolicyFeature Icon={FaTruck} title="Fast Delivery" />
              <PolicyFeature Icon={FaUndo} title="Easy Returns"  />
              <PolicyFeature Icon={FaShieldAlt} title="Brand Warranty"  />
              <PolicyFeature Icon={FaCreditCard} title="Secure Payments"/>
            </div>

            {/* Share Product Section */}
            <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-100 shadow-lg p-6">

              {/* Decorative Background Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-200 opacity-20 rounded-full blur-3xl"></div>

              <h3 className="relative font-semibold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                <span className="bg-red-600 text-white p-2 rounded-full shadow-md">
                  <FaShareAlt size={16} />
                </span>
                Share this Product
              </h3>

              <div className="relative flex flex-wrap items-center gap-4">

                <SocialShareButton
                  platform="facebook"
                  Icon={FaFacebook}
                  bgColor="#1877F2"
                  onClick={handleShare}
                  className="share-btn"
                />

                <SocialShareButton
                  platform="twitter"
                  Icon={FaTwitter}
                  bgColor="#1DA1F2"
                  onClick={handleShare}
                  className="share-btn"
                />

                <SocialShareButton
                  platform="pinterest"
                  Icon={FaPinterest}
                  bgColor="#E60023"
                  onClick={handleShare}
                  className="share-btn"
                />

                <SocialShareButton
                  platform="whatsapp"
                  Icon={FaWhatsapp}
                  bgColor="#25D366"
                  onClick={handleShare}
                  className="share-btn"
                />

                <SocialShareButton
                  platform="copy"
                  Icon={FaLink}
                  bgColor="#6B7280"
                  onClick={handleShare}
                  className="share-btn"
                />

              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-2 sm:space-x-4 px-4 sm:px-6 lg:px-8">
              {["description", "specifications"].map((tab) => (
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
                  {tab === "reviews" && ` (${product.reviewCount || reviews.length})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="text-gray-700 leading-relaxed">
                <div className="prose max-w-none">
                  {product.description
                    ? product.description.split("\n").map((line, idx) => (
                        <p key={idx} className="mb-4">
                          {line}
                        </p>
                      ))
                    : "No description available."}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <Box sx={{ mt: 2 }}>
                
                {/* Section Title */}
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: "#d32f2f",
                    mb: 3,
                    borderBottom: "3px solid #d32f2f",
                    display: "inline-block",
                    pb: 1,
                  }}
                >
                  Product Specifications
                </Typography>

                {/* Specifications Grid */}
                {product.specifications &&
                typeof product.specifications === "object" &&
                !Array.isArray(product.specifications) &&
                Object.keys(product.specifications).length > 0 ? (
                  
                  <Grid container spacing={3}>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "#ffffff",
                            borderLeft: "5px solid #d32f2f",
                            transition: "0.3s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottom: "1px solid #f5c6c6",
                              py: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "#d32f2f",
                                minWidth: "40%",
                              }}
                            >
                              {key} :
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#333",
                                textAlign: "right",
                                flex: 1,
                              }}
                            >
                              {value || "Not specified"}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                ) : product.features && product.features.length > 0 ? (

                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#d32f2f", fontWeight: "bold", mb: 2 }}
                    >
                      Key Features
                    </Typography>

                    <List>
                      {product.features.map((feature, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            bgcolor: "#fff5f5",
                            mb: 1,
                            borderRadius: 2,
                            borderLeft: "4px solid #d32f2f",
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 35 }}>
                            <FaCheck style={{ color: "#d32f2f" }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                ) : (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                    }}
                  >
                    No detailed specifications available for this product.
                  </Alert>
                )}

                {/* Additional Information */}
                <Box mt={5}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    Additional Information
                  </Typography>

                  <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableBody>

                        {product.brand && (
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#ffe5e5",
                                width: "30%",
                                color: "#d32f2f",
                              }}
                            >
                              Brand
                            </TableCell>
                            <TableCell>
                              {typeof product.brand === "object"
                                ? product.brand.name
                                : product.brand}
                            </TableCell>
                          </TableRow>
                        )}

                        {product.category && (
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#ffe5e5",
                                color: "#d32f2f",
                              }}
                            >
                              Category
                            </TableCell>
                            <TableCell>
                              {typeof product.category === "object"
                                ? product.category.name
                                : product.category}
                            </TableCell>
                          </TableRow>
                        )}

                        {product.model && (
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#ffe5e5",
                                color: "#d32f2f",
                              }}
                            >
                              Model
                            </TableCell>
                            <TableCell>{product.model}</TableCell>
                          </TableRow>
                        )}

                        {product.warranty && (
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#ffe5e5",
                                color: "#d32f2f",
                              }}
                            >
                              Warranty
                            </TableCell>
                            <TableCell>{product.warranty}</TableCell>
                          </TableRow>
                        )}

                        {product.dimensions && (
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#ffe5e5",
                                color: "#d32f2f",
                              }}
                            >
                              Dimensions
                            </TableCell>
                            <TableCell>
                              {typeof product.dimensions === "object"
                                ? `${product.dimensions.length || ""} x ${
                                    product.dimensions.width || ""
                                  } x ${product.dimensions.height || ""}`
                                : product.dimensions}
                            </TableCell>
                          </TableRow>
                        )}

                        {product.weight && (
                          <TableRow hover>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                bgcolor: "#ffe5e5",
                                color: "#d32f2f",
                              }}
                            >
                              Weight
                            </TableCell>
                            <TableCell>
                              {product.weight} {product.weightUnit || "kg"}
                            </TableCell>
                          </TableRow>
                        )}

                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

              </Box>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12 lg:mt-16">
          <div className="flex justify-between items-end border-b-2 border-red-600 pb-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaTags className="text-red-600" /> You Might Also Like
            </h2>
            <button
              onClick={() => navigate(`/productlisting?category=${product.category?._id}`)}
              className="text-red-600 font-semibold hover:text-red-700 transition text-sm"
            >
              View All →
            </button>
          </div>

          {similarProducts.length > 0 ? (
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
                    productId={item._id}
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
          ) : (
            <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
              No similar products found.
            </Typography>
          )}
        </div>
      </div>

      {/* Sticky Add to Cart Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-red-600 shadow-2xl p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-red-600">
              ₹{product.price.toLocaleString("en-IN")}
            </div>
            {product.comparePrice && (
              <div className="text-sm text-gray-500 line-through">
                ₹{product.comparePrice.toLocaleString("en-IN")}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="p-3 border border-gray-300 rounded-lg hover:bg-red-50 transition flex items-center justify-center disabled:opacity-50"
              aria-label="Add to Wishlist"
            >
              {wishlistLoading ? (
                <CircularProgress size={20} />
              ) : isInWishlist ? (
                <FaHeart className="text-red-600" size={20} />
              ) : (
                <FaRegHeart size={20} />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || cartLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                isOutOfStock || cartLoading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {cartLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  <FaShoppingBag /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewForm
        productId={product._id}
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setEditingReview(null);
        }}
        onReviewSubmit={handleReviewSubmit}
        editMode={!!editingReview}
        reviewToEdit={editingReview}
      />
    </div>
  );
};

export default ProductDetails;