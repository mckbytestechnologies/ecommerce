import React from "react";
import SlideBar from "../../components/SlideBar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../components/ProductItem";
import { Button, IconButton, Chip, Box, Rating, Badge } from "@mui/material";
import { 
  IoGrid, 
  IoMenu, 
  IoHeartOutline, 
  IoHeart, 
  IoShareSocial, 
  IoEye,
  IoCartOutline
} from "react-icons/io5";
import { FaShoppingCart, FaRegHeart, FaHeart, FaShare, FaEye } from "react-icons/fa";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProductListing = () => {
  // Enhanced Product Data
  const products = [
    {
      id: 1,
      imageFront: "/productitem/productitem1.jpg",
      imageBack: "/productitem/productitem2.jpg",
      category: "Fashion",
      title: "Premium Leather Jacket for Men - Winter Collection",
      rating: 4,
      reviews: 128,
      oldPrice: 1999,
      newPrice: 1499,
      discount: 25,
      isNew: true,
      isHot: false,
      colors: 3,
      delivery: "Free delivery",
      offers: ["10% off with HDFC Bank", "Exchange offer available"]
    },
    {
      id: 2,
      imageFront: "/productitem/productitem3.jpg",
      imageBack: "/productitem/productitem4.jpg",
      category: "Electronics",
      title: "Smartphone Pro Max 128GB with 48MP Camera",
      rating: 5,
      reviews: 89,
      oldPrice: 49999,
      newPrice: 44999,
      discount: 10,
      isNew: false,
      isHot: true,
      colors: 2,
      delivery: "Free delivery by tomorrow",
      offers: ["No Cost EMI", "Additional ₹2000 off"]
    },
    {
      id: 3,
      imageFront: "/productitem/productitem5.jpg",
      imageBack: "/productitem/productitem6.jpg",
      category: "Footwear",
      title: "Ultra Comfort Running Shoes for Men & Women",
      rating: 3,
      reviews: 64,
      oldPrice: 2999,
      newPrice: 2499,
      discount: 17,
      isNew: true,
      isHot: true,
      colors: 4,
      delivery: "Free delivery",
      offers: ["Buy 1 Get 1 50% off"]
    },
    {
      id: 4,
      imageFront: "/productitem/productitem1.jpg",
      imageBack: "/productitem/productitem1.jpg",
      category: "Bags",
      title: "Designer Leather Backpack - Waterproof & Durable",
      rating: 4,
      reviews: 42,
      oldPrice: 3999,
      newPrice: 2999,
      discount: 25,
      isNew: false,
      isHot: false,
      colors: 2,
      delivery: "Free delivery",
      offers: ["10% off on first order"]
    },
    {
      id: 5,
      imageFront: "/productitem/productitem3.jpg",
      imageBack: "/productitem/productitem4.jpg",
      category: "Electronics",
      title: "Wireless Bluetooth Headphones with Noise Cancellation",
      rating: 4,
      reviews: 156,
      oldPrice: 5999,
      newPrice: 4499,
      discount: 25,
      isNew: true,
      isHot: true,
      colors: 3,
      delivery: "Free delivery by today",
      offers: ["1 year warranty", "30-day replacement"]
    },
    {
      id: 6,
      imageFront: "/productitem/productitem5.jpg",
      imageBack: "/productitem/productitem6.jpg",
      category: "Fashion",
      title: "Casual Summer T-Shirt - Cotton Blend Fabric",
      rating: 4,
      reviews: 93,
      oldPrice: 999,
      newPrice: 699,
      discount: 30,
      isNew: false,
      isHot: true,
      colors: 5,
      delivery: "Free delivery",
      offers: ["Combo offers available"]
    },
    {
      id: 7,
      imageFront: "/productitem/productitem1.jpg",
      imageBack: "/productitem/productitem2.jpg",
      category: "Electronics",
      title: "Smart Watch with Health Monitoring Features",
      rating: 4,
      reviews: 217,
      oldPrice: 8999,
      newPrice: 5999,
      discount: 33,
      isNew: true,
      isHot: true,
      colors: 4,
      delivery: "Free delivery",
      offers: ["Extra ₹500 off on exchange"]
    },
    {
      id: 8,
      imageFront: "/productitem/productitem3.jpg",
      imageBack: "/productitem/productitem4.jpg",
      category: "Home",
      title: "Premium Coffee Maker with Thermal Carafe",
      rating: 4,
      reviews: 78,
      oldPrice: 12999,
      newPrice: 9999,
      discount: 23,
      isNew: false,
      isHot: false,
      colors: 2,
      delivery: "Free delivery",
      offers: ["Free coffee samples included"]
    }
  ];

  // State management
  const [open, setOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [view, setView] = React.useState("grid");
  const [wishlist, setWishlist] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 8;
  const anchorRef = React.useRef(null);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Dropdown handlers
  const handleToggle = () => setOpen((prevOpen) => !prevOpen);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab" || event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscount = (oldPrice, newPrice) => {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  return (
    <section className="py-6 bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div role="presentation" className="mb-4">
          <Breadcrumbs aria-label="breadcrumb" className="text-sm">
            <Link underline="hover" color="inherit" href="/" className="text-gray-600 hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/categories" className="text-gray-600 hover:text-red-600 transition-colors">
              Categories
            </Link>
            <span className="text-gray-900 font-medium">All Products</span>
          </Breadcrumbs>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className={`lg:w-64 flex-shrink-0 border-r border-gray-200 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4">
                <SlideBar />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              {/* Header Controls */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <IconButton
                        onClick={() => setView("grid")}
                        className={`rounded-md ${
                          view === "grid" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                        size="small"
                      >
                        <IoGrid className="text-lg" />
                      </IconButton>
                      <IconButton
                        onClick={() => setView("list")}
                        className={`rounded-md ${
                          view === "list" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                        size="small"
                      >
                        <IoMenu className="text-lg" />
                      </IconButton>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Stack direction="row" spacing={1}>
                      <div>
                        <Button
                          ref={anchorRef}
                          id="composition-button"
                          aria-controls={open ? "composition-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={handleToggle}
                          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 capitalize text-sm px-4 py-2 rounded-md"
                          endIcon={<span className="text-xs">▼</span>}
                        >
                          Relevance
                        </Button>
                        <Popper
                          open={open}
                          anchorEl={anchorRef.current}
                          role={undefined}
                          placement="bottom-start"
                          transition
                          disablePortal
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                transformOrigin:
                                  placement === "bottom-start"
                                    ? "left top"
                                    : "left bottom",
                              }}
                            >
                              <Paper className="shadow-lg border border-gray-200 rounded-lg mt-1 min-w-[200px]">
                                <ClickAwayListener onClickAway={handleClose}>
                                  <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                    className="py-1"
                                  >
                                    <MenuItem onClick={handleClose} className="text-sm px-4 py-2 hover:bg-gray-50">Relevance</MenuItem>
                                    <MenuItem onClick={handleClose} className="text-sm px-4 py-2 hover:bg-gray-50">Price: Low to High</MenuItem>
                                    <MenuItem onClick={handleClose} className="text-sm px-4 py-2 hover:bg-gray-50">Price: High to Low</MenuItem>
                                    <MenuItem onClick={handleClose} className="text-sm px-4 py-2 hover:bg-gray-50">Newest First</MenuItem>
                                    <MenuItem onClick={handleClose} className="text-sm px-4 py-2 hover:bg-gray-50">Customer Reviews</MenuItem>
                                    <MenuItem onClick={handleClose} className="text-sm px-4 py-2 hover:bg-gray-50">Popularity</MenuItem>
                                  </MenuList>
                                </ClickAwayListener>
                              </Paper>
                            </Grow>
                          )}
                        </Popper>
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>

              {/* Products Grid View */}
              {view === "grid" ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-blue-200">
                        {/* Product Image Section */}
                        <div className="relative overflow-hidden bg-gray-100">
                          <div className="relative h-48">
                            <img
                              src={product.imageFront}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.isNew && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                              )}
                              {product.isHot && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>
                              )}
                              {product.discount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">{product.discount}% OFF</span>
                              )}
                            </div>

                            {/* Action Icons on Hover */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button 
                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                onClick={() => toggleWishlist(product.id)}
                                title="Add to Wishlist"
                              >
                                {wishlist.includes(product.id) ? (
                                  <FaHeart className="text-red-500 text-sm" />
                                ) : (
                                  <FaRegHeart className="text-gray-600 text-sm" />
                                )}
                              </button>
                              <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Quick View">
                                <FaEye className="text-gray-600 text-sm" />
                              </button>
                              <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Share">
                                <FaShare className="text-gray-600 text-sm" />
                              </button>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button className="w-full bg-blue-600 text-white py-2 font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 absolute bottom-0">
                            <FaShoppingCart className="text-sm" />
                            ADD TO CART
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                          <div className="mb-1">
                            <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer text-sm leading-tight">
                            {product.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              <span>{product.rating}</span>
                              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                            <span className="text-xs text-gray-600">({product.reviews})</span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-900">₹{formatPrice(product.newPrice)}</span>
                            {product.oldPrice > product.newPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{formatPrice(product.oldPrice)}</span>
                            )}
                          </div>

                          <div className="text-xs text-gray-600 mb-1">{product.delivery}</div>
                          
                          {product.offers && product.offers.length > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              {product.offers[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Products List View */
                <div className="p-4">
                  <div className="space-y-4">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-blue-200">
                        <div className="flex flex-col md:flex-row">
                          {/* Product Image */}
                          <div className="md:w-64 relative overflow-hidden bg-gray-100">
                            <div className="relative h-48 md:h-full">
                              <img
                                src={product.imageFront}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {product.isNew && (
                                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                                )}
                                {product.isHot && (
                                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>
                                )}
                              </div>

                              {/* Action Icons */}
                              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                  onClick={() => toggleWishlist(product.id)}
                                  title="Add to Wishlist"
                                >
                                  {wishlist.includes(product.id) ? (
                                    <FaHeart className="text-red-500 text-sm" />
                                  ) : (
                                    <FaRegHeart className="text-gray-600 text-sm" />
                                  )}
                                </button>
                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Quick View">
                                  <FaEye className="text-gray-600 text-sm" />
                                </button>
                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Share">
                                  <FaShare className="text-gray-600 text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 p-4">
                            <div className="flex flex-col h-full">
                              <div className="mb-3">
                                <span className="text-xs text-gray-500 uppercase">{product.category}</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors cursor-pointer">
                                  {product.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                    <span>{product.rating}</span>
                                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                  </div>
                                  <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                                </div>

                                <div className="text-gray-600 text-sm mb-3">
                                  {product.offers?.map((offer, index) => (
                                    <div key={index} className="flex items-center gap-1 mb-1">
                                      <span className="text-green-600">•</span>
                                      <span>{offer}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-auto">
                                <div className="flex items-center gap-4 mb-3">
                                  <span className="text-2xl font-bold text-gray-900">₹{formatPrice(product.newPrice)}</span>
                                  {product.oldPrice > product.newPrice && (
                                    <>
                                      <span className="text-lg text-gray-500 line-through">₹{formatPrice(product.oldPrice)}</span>
                                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                        Save ₹{formatPrice(product.oldPrice - product.newPrice)}
                                      </span>
                                    </>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                    <FaShoppingCart />
                                    ADD TO CART
                                  </button>
                                  <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                    BUY NOW
                                  </button>
                                </div>
                                
                                <div className="text-xs text-gray-600 mt-2">{product.delivery}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                        {...item}
                        className="rounded-md"
                      />
                    )}
                    shape="rounded"
                    color="primary"
                    size="large"
                  />
                  
                  <div className="text-sm text-gray-600">
                    {products.length} products total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;