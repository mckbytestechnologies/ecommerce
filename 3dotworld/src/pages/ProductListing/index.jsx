import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SlideBar from "../../components/SlideBar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { 
  Button, 
  IconButton, 
  Box, 
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Badge,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Divider,
  Stack,
  Tooltip,
  Fade,
  Zoom,
  Skeleton
} from "@mui/material";
import { 
  IoEyeOutline
} from "react-icons/io5";
import {
  FilterList,
  Sort,
  Tune,
  ViewModule,
  ViewList,
  NavigateBefore,
  NavigateNext,
  LocalShipping,
  Shield,
  Replay,
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Bolt,
  TrendingUp,
  CheckCircle
} from "@mui/icons-material";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from "axios";

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // State management
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const anchorRef = React.useRef(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    search: queryParams.get('search') || '',
    inStock: queryParams.get('inStock') || '',
    brand: queryParams.get('brand') || '',
  });
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: parseInt(queryParams.get('page')) || 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });

  // Sort options mapping
  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First', sort: 'createdAt', order: 'desc' },
    { value: 'createdAt-asc', label: 'Oldest First', sort: 'createdAt', order: 'asc' },
    { value: 'price-asc', label: 'Price: Low to High', sort: 'price', order: 'asc' },
    { value: 'price-desc', label: 'Price: High to Low', sort: 'price', order: 'desc' },
    { value: 'averageRating-desc', label: 'Top Rated', sort: 'averageRating', order: 'desc' },
    { value: 'name-asc', label: 'Name: A to Z', sort: 'name', order: 'asc' },
    { value: 'name-desc', label: 'Name: Z to A', sort: 'name', order: 'desc' },
    { value: 'sales-desc', label: 'Best Selling', sort: 'sales', order: 'desc' },
  ];

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => 
      opt.sort === sortBy && opt.order === sortOrder
    );
    return option ? option.label : 'Newest First';
  };

  // Count active filters
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(val => val && val !== '').length;
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.limit);
      
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (filters.inStock) params.append('inStock', filters.inStock);
      if (filters.brand) params.append('brand', filters.brand);
      
      params.append('sort', sortBy);
      params.append('order', sortOrder);
      
      const response = await axios.get(
        `https://ecommerce-server-fhna.onrender.com/api/products?${params.toString()}`
      );
      
      if (response.data.success && response.data.data) {
        const productsData = response.data.data.products || [];
        const paginationData = response.data.data.pagination || {};
        
        setProducts(productsData);
        
        setPagination(prev => ({
          ...prev,
          totalPages: paginationData.totalPages || 1,
          totalProducts: paginationData.totalProducts || 0,
        }));
        
        const uniqueCategories = [...new Set(productsData
          .map(p => p.category?.name || p.category)
          .filter(Boolean)
        )];
        setCategories(uniqueCategories);
        
      } else {
        setProducts([]);
        setError(response.data.message || "No products found");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://ecommerce-server-fhna.onrender.com/api/categories");
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (value) => {
    const [sort, order] = value.split('-');
    setSortBy(sort);
    setSortOrder(order);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      inStock: '',
      brand: '',
    });
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      limit: 12,
    });
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const params = new URLSearchParams();
    
    params.set('page', pagination.currentPage);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    if (sortBy !== 'createdAt' || sortOrder !== 'desc') {
      params.set('sort', sortBy);
      params.set('order', sortOrder);
    }
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, sortBy, sortOrder, pagination.currentPage, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, sortOrder, pagination.currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Loading skeleton for grid view
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {[...Array(6)].map((_, index) => (
        <Card key={index} sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <Skeleton 
            variant="rectangular" 
            height={200}
            animation="wave" 
          />
          <CardContent sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 3
          }}>
            <Skeleton variant="text" height={20} width="60%" animation="wave" />
            <Skeleton variant="text" height={24} width="90%" animation="wave" sx={{ my: 1.5 }} />
            <Skeleton variant="text" height={20} width="40%" animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={32} width="50%" animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={48} animation="wave" sx={{ 
              borderRadius: '10px',
              mt: 'auto'
            }} />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Loading skeleton for list view
  const ListSkeleton = () => (
    <Stack spacing={3}>
      {[...Array(3)].map((_, index) => (
        <Card key={index} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Skeleton variant="rectangular" width={{ xs: '100%', md: 300 }} height={300} animation="wave" />
            <Box sx={{ flex: 1, p: 3 }}>
              <Skeleton variant="text" height={32} width="70%" animation="wave" />
              <Skeleton variant="text" height={20} width="40%" animation="wave" />
              <Skeleton variant="text" height={80} animation="wave" />
              <Skeleton variant="text" height={40} width="30%" animation="wave" />
            </Box>
          </Box>
        </Card>
      ))}
    </Stack>
  );

  if (loading && products.length === 0) {
    return (
      <Box className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <CircularProgress size={80} sx={{ color: '#D32F2F' }} />
        <Typography variant="h6" className="mt-6 text-gray-700 font-medium">
          Loading amazing products...
        </Typography>
        <Typography variant="body2" className="mt-2 text-gray-500">
          Please wait a moment
        </Typography>
      </Box>
    );
  }

  if (error && products.length === 0) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
        <Alert 
          severity="error" 
          className="max-w-md shadow-lg"
          sx={{ 
            borderRadius: 2,
            borderLeft: '4px solid #D32F2F'
          }}
          action={
            <Stack direction="row" spacing={1}>
              <Button 
                color="error" 
                size="small" 
                variant="outlined"
                onClick={fetchProducts}
              >
                Retry
              </Button>
              <Button 
                color="inherit" 
                size="small" 
                variant="text"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </Stack>
          }
        >
          <Typography variant="h6" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        
        {/* Breadcrumbs */}
        <Box className="mb-8">
          <Breadcrumbs aria-label="breadcrumb" separator="›" className="text-sm">
            <Link 
              underline="hover" 
              color="inherit" 
              href="/" 
              className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center gap-1"
            >
              <span className="text-lg">🏠</span>
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              underline="hover" 
              color="inherit" 
              href="/categories" 
              className="text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Categories
            </Link>
            <Typography className="text-red-600 font-bold">
              {filters.category ? filters.category : 'All Products'}
            </Typography>
          </Breadcrumbs>
          
          {/* Page Header */}
          <Box className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Box>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                {filters.category ? filters.category : 'All Products'}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Discover our premium collection of products
              </Typography>
            </Box>
            
            {/* Active Filters Badge */}
            {getActiveFilterCount() > 0 && (
              <Badge 
                badgeContent={getActiveFilterCount()} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: '20px',
                    minWidth: '20px',
                    top: -5,
                    right: -5,
                  }
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Tune />}
                  onClick={() => setSidebarOpen(true)}
                  sx={{
                    borderColor: '#D32F2F',
                    color: '#D32F2F',
                    '&:hover': {
                      borderColor: '#B71C1C',
                      backgroundColor: '#FFF5F5'
                    },
                    borderRadius: '10px',
                    fontWeight: '600',
                    px: 3,
                    py: 1
                  }}
                >
                  Active Filters
                </Button>
              </Badge>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <Box className="hidden lg:block w-80 flex-shrink-0">
            <SlideBar 
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              onResetFilters={resetFilters}
            />
          </Box>

          {/* Mobile Filter Overlay */}
          {sidebarOpen && (
            <Box className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <Box className="absolute right-0 top-0 h-full w-4/5 max-w-md bg-white shadow-2xl overflow-y-auto">
                <Box className="p-4">
                  <Box className="flex items-center justify-between mb-6">
                    <Typography variant="h5" className="font-bold text-gray-900">
                      Filters
                    </Typography>
                    <IconButton onClick={() => setSidebarOpen(false)}>
                      <NavigateBefore />
                    </IconButton>
                  </Box>
                  <SlideBar 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    categories={categories}
                    onResetFilters={resetFilters}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Main Content Area */}
          <Box className="flex-1">
            
            {/* Toolbar */}
            <Card elevation={0} sx={{ 
              borderRadius: 3, 
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <CardContent className="p-4 sm:p-6">
                <Box className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* View Toggle & Results */}
                  <Box className="flex items-center gap-4">
                    {/* View Toggle */}
                    <Box sx={{ 
                      display: 'flex', 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 2,
                      p: 0.5,
                      border: '1px solid #e5e7eb'
                    }}>
                      <Tooltip title="Grid View">
                        <IconButton
                          onClick={() => setView("grid")}
                          sx={{ 
                            borderRadius: 1.5,
                            ...(view === "grid" && {
                              bgcolor: 'white',
                              color: '#D32F2F',
                              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                            })
                          }}
                        >
                          <ViewModule />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="List View">
                        <IconButton
                          onClick={() => setView("list")}
                          sx={{ 
                            borderRadius: 1.5,
                            ...(view === "list" && {
                              bgcolor: 'white',
                              color: '#D32F2F',
                              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                            })
                          }}
                        >
                          <ViewList />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {/* Results Count */}
                    <Box>
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        Showing <span className="text-red-600">{products.length}</span> of{' '}
                        <span className="font-bold text-gray-900">{pagination.totalProducts}</span> products
                      </Typography>
                      {getActiveFilterCount() > 0 && (
                        <Typography variant="caption" className="text-red-600 font-medium">
                          ({getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''})
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Sort & Filter Controls */}
                  <Box className="flex items-center gap-3">
                    
                    {/* Mobile Filter Button */}
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => setSidebarOpen(true)}
                      sx={{
                        display: { xs: 'flex', lg: 'none' },
                        borderColor: '#D32F2F',
                        color: '#D32F2F',
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: '600',
                        px: 2.5
                      }}
                    >
                      Filters
                    </Button>

                    {/* Sort Dropdown */}
                    <Box>
                      <Button
                        ref={anchorRef}
                        id="sort-button"
                        aria-controls={open ? 'sort-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        startIcon={<Sort />}
                        endIcon={open ? <NavigateBefore sx={{ transform: 'rotate(-90deg)' }} /> : <NavigateNext sx={{ transform: 'rotate(90deg)' }} />}
                        sx={{
                          bgcolor: 'white',
                          border: '1px solid #e5e7eb',
                          color: '#374151',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: '600',
                          px: 3,
                          py: 1.2,
                          '&:hover': {
                            bgcolor: '#f9fafb',
                            borderColor: '#D32F2F',
                            boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.1)'
                          }
                        }}
                      >
                        Sort: {getCurrentSortLabel()}
                      </Button>
                      
                      <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-end"
                        transition
                        disablePortal
                        sx={{ zIndex: 1300 }}
                      >
                        {({ TransitionProps }) => (
                          <Grow {...TransitionProps}>
                            <Paper sx={{ 
                              mt: 1, 
                              minWidth: 240,
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                              borderRadius: 2,
                              border: '1px solid #f3f4f6',
                              overflow: 'hidden'
                            }}>
                              <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                  autoFocusItem={open}
                                  id="sort-menu"
                                  onKeyDown={handleListKeyDown}
                                  sx={{ py: 0.5 }}
                                >
                                  {sortOptions.map((option) => (
                                    <MenuItem 
                                      key={option.value}
                                      onClick={() => {
                                        handleSortChange(option.value);
                                        handleClose();
                                      }}
                                      sx={{
                                        py: 1.5,
                                        px: 3,
                                        borderBottom: '1px solid #f9fafb',
                                        '&:last-child': { borderBottom: 'none' },
                                        ...(sortBy === option.sort && sortOrder === option.order && {
                                          bgcolor: '#fef2f2',
                                          color: '#D32F2F',
                                          fontWeight: '600'
                                        }),
                                        '&:hover': {
                                          bgcolor: '#fef2f2'
                                        }
                                      }}
                                    >
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {sortBy === option.sort && sortOrder === option.order && (
                                          <CheckCircle sx={{ fontSize: 18, color: '#D32F2F' }} />
                                        )}
                                        {option.label}
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </Box>
                  </Box>
                </Box>

                {/* Active Filters */}
                {getActiveFilterCount() > 0 && (
                  <Box className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="subtitle2" className="text-gray-600 mb-2 font-medium">
                      Active Filters:
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {filters.category && (
                        <Chip
                          label={`Category: ${filters.category}`}
                          onDelete={() => handleFilterChange('category', '')}
                          size="small"
                          deleteIcon={<Replay fontSize="small" />}
                          sx={{
                            bgcolor: '#fef2f2',
                            color: '#D32F2F',
                            fontWeight: '500',
                            borderRadius: '6px',
                            '& .MuiChip-deleteIcon': {
                              color: '#D32F2F',
                              '&:hover': { color: '#B71C1C' }
                            }
                          }}
                        />
                      )}
                      {(filters.minPrice || filters.maxPrice) && (
                        <Chip
                          label={`Price: ${filters.minPrice ? `₹${filters.minPrice}` : ''}${filters.minPrice && filters.maxPrice ? ' - ' : ''}${filters.maxPrice ? `₹${filters.maxPrice}` : ''}`}
                          onDelete={() => {
                            handleFilterChange('minPrice', '');
                            handleFilterChange('maxPrice', '');
                          }}
                          size="small"
                          deleteIcon={<Replay fontSize="small" />}
                          sx={{
                            bgcolor: '#fef2f2',
                            color: '#D32F2F',
                            fontWeight: '500',
                            borderRadius: '6px',
                            '& .MuiChip-deleteIcon': {
                              color: '#D32F2F',
                              '&:hover': { color: '#B71C1C' }
                            }
                          }}
                        />
                      )}
                      {filters.inStock && (
                        <Chip
                          label="In Stock Only"
                          onDelete={() => handleFilterChange('inStock', '')}
                          size="small"
                          deleteIcon={<Replay fontSize="small" />}
                          sx={{
                            bgcolor: '#fef2f2',
                            color: '#D32F2F',
                            fontWeight: '500',
                            borderRadius: '6px',
                            '& .MuiChip-deleteIcon': {
                              color: '#D32F2F',
                              '&:hover': { color: '#B71C1C' }
                            }
                          }}
                        />
                      )}
                      <Button
                        size="small"
                        onClick={resetFilters}
                        startIcon={<Replay fontSize="small" />}
                        sx={{
                          ml: 'auto',
                          color: '#666',
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Clear All
                      </Button>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Products Display */}
            {loading ? (
              view === "grid" ? <GridSkeleton /> : <ListSkeleton />
            ) : products.length === 0 ? (
              <Card elevation={0} sx={{ 
                borderRadius: 3,
                p: 8,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                border: '2px dashed #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <Box sx={{ 
                  fontSize: 80, 
                  mb: 3,
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🛒
                </Box>
                <Typography variant="h5" className="text-gray-700 mb-2 font-bold">
                  No products found
                </Typography>
                <Typography variant="body1" className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or browse our full collection.
                </Typography>
                <Button
                  variant="contained"
                  onClick={resetFilters}
                  startIcon={<Replay />}
                  sx={{
                    background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                    color: 'white',
                    borderRadius: '10px',
                    px: 5,
                    py: 1.5,
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(211, 47, 47, 0.3)'
                    }
                  }}
                >
                  Reset All Filters
                </Button>
              </Card>
            ) : view === "grid" ? (
              <Zoom in={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Card 
                      key={product._id}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        border: '1px solid #f3f4f6',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          borderColor: '#ffcdd2',
                          '& .product-actions': {
                            opacity: 1,
                            transform: 'translateY(0)'
                          }
                        }
                      }}
                    >
                      {/* Product Image */}
                      <Box sx={{ 
                        position: 'relative',
                        overflow: 'hidden',
                        height: 200,
                        backgroundColor: '#f9fafb',
                        flexShrink: 0
                      }}>
                        <CardMedia
                          component="img"
                          image={product.images?.[0]?.url || "/placeholder.jpg"}
                          alt={product.name}
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        
                        {/* Badges */}
                        <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                          {product.stock === 0 ? (
                            <Chip
                              label="Out of Stock"
                              size="small"
                              sx={{
                                bgcolor: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.7rem',
                                borderRadius: '4px'
                              }}
                            />
                          ) : product.stock < 10 ? (
                            <Chip
                              label={`Only ${product.stock} left`}
                              size="small"
                              sx={{
                                bgcolor: '#ff9800',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.7rem',
                                borderRadius: '4px'
                              }}
                            />
                          ) : null}
                          
                          {product.comparePrice && product.comparePrice > product.price && (
                            <Chip
                              label={`${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF`}
                              size="small"
                              sx={{
                                bgcolor: '#D32F2F',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.7rem',
                                borderRadius: '4px',
                                mt: product.stock <= 10 ? 1 : 0
                              }}
                            />
                          )}
                        </Box>

                        {/* Quick Actions */}
                        <Box className="product-actions" sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          opacity: 0,
                          transform: 'translateY(-10px)',
                          transition: 'all 0.3s ease'
                        }}>
                          <Tooltip title={favorites.includes(product._id) ? "Remove from favorites" : "Add to favorites"}>
                            <IconButton
                              onClick={() => toggleFavorite(product._id)}
                              sx={{
                                bgcolor: 'white',
                                color: favorites.includes(product._id) ? '#D32F2F' : '#9ca3af',
                                '&:hover': {
                                  bgcolor: '#fef2f2',
                                  color: '#D32F2F'
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            >
                              {favorites.includes(product._id) ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Quick View">
                            <IconButton
                              onClick={() => setQuickView(product._id)}
                              sx={{
                                bgcolor: 'white',
                                color: '#374151',
                                '&:hover': {
                                  bgcolor: '#f3f4f6',
                                  color: '#D32F2F'
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            >
                              <IoEyeOutline />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Card Content */}
                      <CardContent sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3
                      }}>
                        {/* Category */}
                        <Typography variant="caption" sx={{ 
                          color: '#D32F2F',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          mb: 1,
                          display: 'block'
                        }}>
                          {product.category?.name || product.category || "Uncategorized"}
                        </Typography>

                        {/* Product Title */}
                        <Typography variant="h6" sx={{ 
                          fontWeight: '700',
                          color: '#111827',
                          mb: 1.5,
                          lineHeight: 1.3,
                          height: '44px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {product.name}
                        </Typography>

                        {/* Rating */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          minHeight: '24px'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating 
                              value={product.averageRating || 0} 
                              readOnly 
                              precision={0.5}
                              size="small"
                              sx={{ color: '#fbbf24' }}
                            />
                            <Typography variant="caption" sx={{ ml: 1, color: '#6b7280', fontWeight: '500' }}>
                              ({product.reviewCount || 0})
                            </Typography>
                          </Box>
                          {product.soldCount > 100 && (
                            <Chip
                              label="🔥 Best Seller"
                              size="small"
                              sx={{
                                bgcolor: '#fef3c7',
                                color: '#92400e',
                                fontSize: '0.65rem',
                                fontWeight: '600',
                                height: 20
                              }}
                            />
                          )}
                        </Box>

                        {/* Price */}
                        <Box sx={{ mb: 2, minHeight: '40px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography variant="h5" sx={{ 
                              fontWeight: '800',
                              color: '#111827',
                              background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}>
                              ₹{formatPrice(product.price)}
                            </Typography>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <>
                                <Typography variant="body2" sx={{ 
                                  color: '#9ca3af',
                                  textDecoration: 'line-through',
                                  fontWeight: '500'
                                }}>
                                  ₹{formatPrice(product.comparePrice)}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: '#10b981',
                                  fontWeight: '700',
                                  bgcolor: '#d1fae5',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: '4px'
                                }}>
                                  Save ₹{formatPrice(product.comparePrice - product.price)}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>

                        {/* Stock Status */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          p: 1.5,
                          bgcolor: product.stock > 0 ? '#f0fdf4' : '#fef2f2',
                          borderRadius: '8px',
                          border: `1px solid ${product.stock > 0 ? '#d1fae5' : '#fecaca'}`,
                          minHeight: '40px'
                        }}>
                          {product.stock > 0 ? (
                            <>
                              <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                              <Typography variant="body2" sx={{ color: '#065f46', fontWeight: '500' }}>
                                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                              <Typography variant="body2" sx={{ color: '#991b1b', fontWeight: '500' }}>
                                Out of Stock
                              </Typography>
                            </>
                          )}
                        </Box>

                        {/* Add to Cart Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          disabled={product.stock === 0}
                          sx={{
                            background: product.stock === 0 
                              ? '#9ca3af' 
                              : 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                            color: 'white',
                            borderRadius: '10px',
                            py: 1.5,
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: product.stock === 0 
                                ? '#9ca3af' 
                                : 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 10px 20px rgba(211, 47, 47, 0.3)'
                            },
                            '&.Mui-disabled': {
                              background: '#9ca3af',
                              color: 'white'
                            },
                            mt: 'auto'
                          }}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Zoom>
            ) : (
              <Fade in={true}>
                <Stack spacing={3}>
                  {products.map((product) => (
                    <Card key={product._id} sx={{ 
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid #f3f4f6',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: '#ffcdd2',
                        '& .list-product-image': {
                          transform: 'scale(1.05)'
                        }
                      }
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
                        <Box sx={{ 
                          width: { xs: '100%', lg: 380 },
                          height: { xs: 280, lg: 'auto' },
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#f9fafb'
                        }}>
                          <CardMedia
                            component="img"
                            image={product.images?.[0]?.url || "/placeholder.jpg"}
                            alt={product.name}
                            className="list-product-image"
                            sx={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.6s ease'
                            }}
                          />
                          
                          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                            {product.stock === 0 ? (
                              <Chip
                                label="Out of Stock"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(0,0,0,0.85)',
                                  color: 'white',
                                  fontWeight: '700',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px'
                                }}
                              />
                            ) : product.stock < 10 ? (
                              <Chip
                                label={`Only ${product.stock} left`}
                                size="small"
                                sx={{
                                  bgcolor: '#ff9800',
                                  color: 'white',
                                  fontWeight: '700',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px'
                                }}
                              />
                            ) : null}
                            
                            {product.comparePrice && product.comparePrice > product.price && (
                              <Chip
                                label={`${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF`}
                                size="small"
                                sx={{
                                  bgcolor: '#D32F2F',
                                  color: 'white',
                                  fontWeight: '700',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  mt: 1
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                          }}>
                            <Tooltip title={favorites.includes(product._id) ? "Remove from favorites" : "Add to favorites"}>
                              <IconButton
                                onClick={() => toggleFavorite(product._id)}
                                sx={{
                                  bgcolor: 'white',
                                  color: favorites.includes(product._id) ? '#D32F2F' : '#374151',
                                  '&:hover': {
                                    bgcolor: '#fef2f2',
                                    color: '#D32F2F'
                                  },
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              >
                                {favorites.includes(product._id) ? <Favorite /> : <FavoriteBorder />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box sx={{ flex: 1, p: { xs: 3, lg: 4 } }}>
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Chip
                                label={product.category?.name || product.category || "Uncategorized"}
                                size="small"
                                sx={{
                                  bgcolor: '#fef2f2',
                                  color: '#D32F2F',
                                  fontWeight: '600',
                                  fontSize: '0.75rem',
                                  borderRadius: '6px'
                                }}
                              />
                              {product.isFeatured && (
                                <Chip
                                  icon={<TrendingUp sx={{ fontSize: 14 }} />}
                                  label="Featured"
                                  size="small"
                                  sx={{
                                    bgcolor: '#fef3c7',
                                    color: '#92400e',
                                    fontWeight: '600',
                                    fontSize: '0.75rem',
                                    borderRadius: '6px'
                                  }}
                                />
                              )}
                              {product.soldCount > 500 && (
                                <Chip
                                  icon={<Bolt sx={{ fontSize: 14 }} />}
                                  label="Popular"
                                  size="small"
                                  sx={{
                                    bgcolor: '#dbeafe',
                                    color: '#1e40af',
                                    fontWeight: '600',
                                    fontSize: '0.75rem',
                                    borderRadius: '6px'
                                  }}
                                />
                              )}
                            </Box>

                            <Typography variant="h5" sx={{ 
                              fontWeight: '800',
                              color: '#111827',
                              mb: 1.5,
                              lineHeight: 1.2
                            }}>
                              {product.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating 
                                  value={product.averageRating || 0} 
                                  readOnly 
                                  precision={0.5}
                                  sx={{ color: '#fbbf24' }}
                                />
                                <Typography variant="body2" sx={{ ml: 1.5, color: '#6b7280', fontWeight: '600' }}>
                                  {product.averageRating?.toFixed(1) || '0.0'}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                ({product.reviewCount || 0} reviews)
                              </Typography>
                              {product.soldCount > 0 && (
                                <Typography variant="body2" sx={{ color: '#10b981', fontWeight: '600' }}>
                                  {product.soldCount}+ sold
                                </Typography>
                              )}
                            </Box>

                            <Typography variant="body1" sx={{ 
                              color: '#6b7280',
                              mb: 3,
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {product.description || "Premium quality product with excellent features and durability."}
                            </Typography>

                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalShipping sx={{ fontSize: 18, color: '#6b7280' }} />
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                  Free Shipping
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Shield sx={{ fontSize: 18, color: '#6b7280' }} />
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                  2-Year Warranty
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Replay sx={{ fontSize: 18, color: '#6b7280' }} />
                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                  30-Day Returns
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>

                          <Divider sx={{ my: 3 }} />

                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' }, 
                            justifyContent: 'space-between',
                            gap: 3
                          }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                                <Typography variant="h3" sx={{ 
                                  fontWeight: '900',
                                  color: '#111827',
                                  background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }}>
                                  ₹{formatPrice(product.price)}
                                </Typography>
                                {product.comparePrice && product.comparePrice > product.price && (
                                  <>
                                    <Typography variant="h6" sx={{ 
                                      color: '#9ca3af',
                                      textDecoration: 'line-through',
                                      fontWeight: '500'
                                    }}>
                                      ₹{formatPrice(product.comparePrice)}
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                      color: '#10b981',
                                      fontWeight: '700',
                                      bgcolor: '#d1fae5',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: '6px'
                                    }}>
                                      Save ₹{formatPrice(product.comparePrice - product.price)}
                                    </Typography>
                                  </>
                                )}
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {product.stock > 0 ? (
                                  <>
                                    <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography variant="body2" sx={{ color: '#065f46', fontWeight: '600' }}>
                                      {product.stock > 10 ? 'In Stock - Ready to ship' : `Only ${product.stock} left - Order soon!`}
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                                    <Typography variant="body2" sx={{ color: '#991b1b', fontWeight: '600' }}>
                                      Out of Stock - Check back later
                                    </Typography>
                                  </>
                                )}
                              </Box>
                            </Box>

                            <Stack direction="row" spacing={2} sx={{ 
                              flexShrink: 0,
                              width: { xs: '100%', sm: 'auto' }
                            }}>
                              <Button
                                variant="outlined"
                                startIcon={<IoEyeOutline />}
                                onClick={() => setQuickView(product._id)}
                                sx={{
                                  borderColor: '#e5e7eb',
                                  color: '#374151',
                                  borderRadius: '10px',
                                  px: 3,
                                  py: 1.5,
                                  fontWeight: '600',
                                  textTransform: 'none',
                                  minWidth: 120,
                                  '&:hover': {
                                    borderColor: '#D32F2F',
                                    backgroundColor: '#fef2f2',
                                    color: '#D32F2F'
                                  }
                                }}
                              >
                                Quick View
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<ShoppingCart />}
                                disabled={product.stock === 0}
                                sx={{
                                  background: product.stock === 0 
                                    ? '#9ca3af' 
                                    : 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                                  color: 'white',
                                  borderRadius: '10px',
                                  px: 4,
                                  py: 1.5,
                                  fontWeight: '700',
                                  textTransform: 'none',
                                  minWidth: 140,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    background: product.stock === 0 
                                      ? '#9ca3af' 
                                      : 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 25px rgba(211, 47, 47, 0.3)'
                                  }
                                }}
                              >
                                Add to Cart
                              </Button>
                            </Stack>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Fade>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Card elevation={0} sx={{ 
                borderRadius: 3, 
                mt: 8,
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <Box className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Typography variant="body2" className="text-gray-600 font-medium">
                    Page <span className="font-bold text-red-600">{pagination.currentPage}</span> of{' '}
                    <span className="font-bold text-gray-900">{pagination.totalPages}</span>
                  </Typography>
                  
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    renderItem={(item) => (
                      <PaginationItem
                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                        {...item}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#D32F2F',
                            color: 'white',
                            fontWeight: '700',
                            '&:hover': {
                              backgroundColor: '#B71C1C',
                            }
                          },
                          borderRadius: '8px',
                          margin: '0 4px',
                          fontWeight: '600',
                          '&:hover': {
                            backgroundColor: '#fef2f2'
                          }
                        }}
                      />
                    )}
                    shape="rounded"
                    size="large"
                  />
                  
                  <Typography variant="body2" className="text-gray-600 font-medium">
                    Total: <span className="font-bold text-gray-900">{pagination.totalProducts}</span> products
                  </Typography>
                </Box>
              </Card>
            )}
          </Box>
        </Box>
      </div>
    </section>
  );
};

export default ProductListing;