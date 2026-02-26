import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Badge,
  Tooltip,
  LinearProgress,
  MenuItem,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Alert,
  AlertTitle,
  Rating,
  Fab,
  Zoom,
  Fade,
  Grow,
  Slide
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  AccessTime as PendingIcon,
  CheckCircleOutline as ConfirmedIcon,
  Build as ProcessingIcon,
  DeliveryDining as DeliveredIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MoneyIcon,
  ArrowUpward as ArrowUpIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  TrackChanges as TrackIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  LocalOffer as OfferIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Red and White Theme Colors
const colors = {
  red: {
    main: '#d32f2f',
    light: '#ff6659',
    dark: '#9a0007',
    gradient: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
    lightGradient: 'linear-gradient(135deg, #ff6659 0%, #d32f2f 100%)',
    bg: '#ffebee',
    border: '#ffcdd2'
  },
  white: {
    main: '#ffffff',
    dark: '#f5f5f5',
    text: '#333333'
  },
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  success: {
    main: '#4caf50',
    light: '#a5d6a7',
    dark: '#2e7d32',
    bg: '#e8f5e8'
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    bg: '#fff3e0'
  }
};

// Styled Components with Red Theme
const RedGradientCard = styled(Card)(({ theme }) => ({
  background: colors.red.gradient,
  color: 'white',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(211, 47, 47, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    transform: 'translate(30%, -30%)'
  }
}));

const WhiteCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  border: `1px solid ${colors.red.border}`,
  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(211, 47, 47, 0.15)',
    borderColor: colors.red.main
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  border: `1px solid ${colors.red.border}`,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: colors.red.bg,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: colors.red.main,
    borderRadius: '4px',
    '&:hover': {
      background: colors.red.dark,
    },
  },
}));

const StatusChip = styled(Chip)(({ status }) => {
  const statusColors = {
    pending: { bg: colors.warning.bg, color: colors.warning.dark, border: colors.warning.light, icon: <PendingIcon /> },
    confirmed: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9', icon: <ConfirmedIcon /> },
    processing: { bg: '#f3e5f5', color: '#7b1fa2', border: '#ce93d8', icon: <ProcessingIcon /> },
    shipped: { bg: '#e0f2f1', color: '#00695c', border: '#80cbc4', icon: <ShippingIcon /> },
    delivered: { bg: colors.success.bg, color: colors.success.dark, border: colors.success.light, icon: <DeliveredIcon /> },
    cancelled: { bg: colors.red.bg, color: colors.red.dark, border: colors.red.light, icon: <CancelIcon /> }
  };
  
  const selectedColors = statusColors[status] || statusColors.pending;
  
  return {
    backgroundColor: selectedColors.bg,
    color: selectedColors.color,
    border: `1px solid ${selectedColors.border}`,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: '28px',
    '& .MuiChip-icon': {
      color: selectedColors.color,
      fontSize: '16px'
    },
    '& .MuiChip-label': {
      px: 1.5
    }
  };
});




const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 20px',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px -10px rgba(211, 47, 47, 0.3)'
  }
}));

const RedDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    overflow: 'hidden'
  }
}));

const ProductImage = styled(Box)(({ src }) => ({
  width: 80,
  height: 80,
  borderRadius: '12px',
  backgroundImage: `url(${src || 'https://via.placeholder.com/80x80?text=Product'})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `2px solid ${colors.red.border}`,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
}));

const MyOrders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userDetails, setUserDetails] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
    avgOrderValue: 0
  });

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://server-kzwj.onrender.com/api/users", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserDetails(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://server-kzwj.onrender.com/api/orders", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const ordersData = response.data.data || [];
        
        // Enrich orders with user details and ensure product names are present
        const enrichedOrders = ordersData.map(order => ({
          ...order,
          user: userDetails || {
            name: "Loading...",
            email: "Loading...",
            phone: "Loading..."
          },
          // Ensure each item has a name
          items: order.items?.map(item => ({
            ...item,
            name: item.name || item.productName || item.title || `Product ${item.productId || ''}`,
            displayName: item.name || item.productName || item.title || `Product ${item.productId || ''}`
          })) || []
        }));
        
        setOrders(enrichedOrders);
        setFilteredOrders(enrichedOrders);
        calculateStats(enrichedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      fetchOrders();
    }
  }, [userDetails]);

  // Calculate statistics
  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const pending = ordersData.filter(o => o.order_status === "pending").length;
    const confirmed = ordersData.filter(o => o.order_status === "confirmed").length;
    const processing = ordersData.filter(o => o.order_status === "processing").length;
    const shipped = ordersData.filter(o => o.order_status === "shipped").length;
    const delivered = ordersData.filter(o => o.order_status === "delivered").length;
    const cancelled = ordersData.filter(o => o.order_status === "cancelled").length;
    const revenue = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const avgOrderValue = total > 0 ? revenue / total : 0;

    setStats({
      total, pending, confirmed, processing, shipped, delivered, cancelled, 
      revenue, avgOrderValue
    });
  };

  // Apply filters
  useEffect(() => {
    let result = orders;

    // Apply tab filter
    if (selectedTab > 0) {
      const statusMap = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      result = result.filter(order => order.order_status === statusMap[selectedTab]);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.order_status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.order_id.toLowerCase().includes(term) ||
        order.items?.some(item => item.name?.toLowerCase().includes(term)) ||
        order.user?.name?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-high":
          return b.total_amount - a.total_amount;
        case "price-low":
          return a.total_amount - b.total_amount;
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
    setPage(1);
  }, [orders, searchTerm, statusFilter, selectedTab, sortBy]);

  // Pagination
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  const handleReorder = (order) => {
    // Add items to cart and navigate to checkout
    console.log("Reorder:", order);
  };

  // Format functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card':
      case 'credit card':
      case 'debit card':
        return <PaymentIcon />;
      case 'upi':
        return <PhoneIcon />;
      case 'cod':
      case 'cash on delivery':
        return <MoneyIcon />;
      case 'netbanking':
        return <HomeIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  // Tabs configuration
  const tabs = [
    { label: "All Orders", count: stats.total, icon: <CartIcon /> },
    { label: "Pending", count: stats.pending, icon: <PendingIcon /> },
    { label: "Confirmed", count: stats.confirmed, icon: <ConfirmedIcon /> },
    { label: "Processing", count: stats.processing, icon: <ProcessingIcon /> },
    { label: "Shipped", count: stats.shipped, icon: <ShippingIcon /> },
    { label: "Delivered", count: stats.delivered, icon: <DeliveredIcon /> },
    { label: "Cancelled", count: stats.cancelled, icon: <CancelIcon /> }
  ];

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: colors.red.bg
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: colors.red.main, mb: 3 }} />
          <Typography variant="h6" color={colors.red.dark}>
            Loading your orders...
          </Typography>
          <Typography variant="body2" color={colors.gray[600]}>
            Please wait while we fetch your order history
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: colors.red.bg,
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: { xs: 60, sm: 70 },
                      height: { xs: 60, sm: 70 },
                      bgcolor: colors.red.main,
                      background: colors.red.gradient
                    }}
                  >
                    <CartIcon sx={{ fontSize: { xs: 35, sm: 40 }, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        color: colors.red.dark,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                      }}
                    >
                      My Orders
                    </Typography>
                    <Typography variant="body1" color={colors.gray[700]}>
                      {userDetails?.name ? `Welcome back, ${userDetails.name}! ` : ''}
                      Track and manage all your orders
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: { xs: 'flex-start', md: 'flex-end' }
                }}>
                  <ActionButton
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchOrders}
                    sx={{
                      borderColor: colors.red.main,
                      color: colors.red.main,
                      '&:hover': {
                        borderColor: colors.red.dark,
                        backgroundColor: colors.red.bg
                      }
                    }}
                  >
                    Refresh
                  </ActionButton>
                  <ActionButton
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{
                      background: colors.red.gradient,
                      '&:hover': {
                        background: colors.red.lightGradient
                      }
                    }}
                  >
                    Export
                  </ActionButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Stats Cards */}
        <Grow in={true} timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <RedGradientCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                        Total Orders
                      </Typography>
                    </Box>
                    <CartIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Lifetime value: {formatCurrency(stats.revenue)}
                    </Typography>
                  </Box>
                </CardContent>
              </RedGradientCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <WhiteCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h4" fontWeight="700" color={colors.warning.dark}>
                        {stats.pending}
                      </Typography>
                      <Typography variant="body2" color={colors.gray[600]} sx={{ mt: 1 }}>
                        Pending
                      </Typography>
                    </Box>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      bgcolor: colors.warning.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PendingIcon sx={{ color: colors.warning.dark, fontSize: 30 }} />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.total ? (stats.pending / stats.total) * 100 : 0}
                    sx={{
                      mt: 2,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: colors.red.bg,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: colors.warning.main,
                        borderRadius: 4
                      }
                    }}
                  />
                </CardContent>
              </WhiteCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <WhiteCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h4" fontWeight="700" color={colors.success.dark}>
                        {stats.delivered}
                      </Typography>
                      <Typography variant="body2" color={colors.gray[600]} sx={{ mt: 1 }}>
                        Delivered
                      </Typography>
                    </Box>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      bgcolor: colors.success.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DeliveredIcon sx={{ color: colors.success.dark, fontSize: 30 }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" color={colors.success.dark} sx={{ mt: 2, display: 'block' }}>
                    {stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0}% delivered
                  </Typography>
                </CardContent>
              </WhiteCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <WhiteCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h4" fontWeight="700" color={colors.red.main}>
                        {formatCurrency(stats.avgOrderValue)}
                      </Typography>
                      <Typography variant="body2" color={colors.gray[600]} sx={{ mt: 1 }}>
                        Avg. Order Value
                      </Typography>
                    </Box>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      bgcolor: colors.red.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingUpIcon sx={{ color: colors.red.main, fontSize: 30 }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" color={colors.red.dark} sx={{ mt: 2, display: 'block' }}>
                    Total spent: {formatCurrency(stats.revenue)}
                  </Typography>
                </CardContent>
              </WhiteCard>
            </Grid>
          </Grid>
        </Grow>

        {/* User Profile Card */}
        {userDetails && (
          <Slide direction="up" in={true} timeout={1200}>
            <WhiteCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: colors.red.main,
                          background: colors.red.gradient
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 35, color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="700" color={colors.red.dark}>
                          {userDetails.name}
                        </Typography>
                        <Typography variant="body2" color={colors.gray[600]}>
                          Member since {formatDate(userDetails.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmailIcon sx={{ color: colors.red.main, fontSize: 20 }} />
                          <Typography variant="body2" color={colors.gray[600]}>
                            {userDetails.email}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon sx={{ color: colors.red.main, fontSize: 20 }} />
                          <Typography variant="body2" color={colors.gray[600]}>
                            {userDetails.phone || "Not provided"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationIcon sx={{ color: colors.red.main, fontSize: 20 }} />
                          <Typography variant="body2" color={colors.gray[600]} noWrap>
                            {userDetails.address?.city || "No address"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </WhiteCard>
          </Slide>
        )}

        {/* Filters Section */}
        <Grow in={true} timeout={1400}>
          <Paper sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            background: 'white',
            border: `1px solid ${colors.red.border}`
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by order ID, product, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: colors.red.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm("")}>
                          <CancelIcon fontSize="small" sx={{ color: colors.red.main }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.red.main,
                          borderWidth: '2px'
                        }
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.red.main }}>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.red.main
                      }
                    }}
                  >
                    <MenuItem value="newest">🆕 Newest First</MenuItem>
                    <MenuItem value="oldest">📅 Oldest First</MenuItem>
                    <MenuItem value="price-high">💰 Price: High to Low</MenuItem>
                    <MenuItem value="price-low">💵 Price: Low to High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.red.main }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.red.main
                      }
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">⏳ Pending</MenuItem>
                    <MenuItem value="confirmed">✅ Confirmed</MenuItem>
                    <MenuItem value="processing">⚙️ Processing</MenuItem>
                    <MenuItem value="shipped">🚚 Shipped</MenuItem>
                    <MenuItem value="delivered">📦 Delivered</MenuItem>
                    <MenuItem value="cancelled">❌ Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSelectedTab(0);
                    setSortBy("newest");
                  }}
                  sx={{
                    borderRadius: '12px',
                    borderColor: colors.red.main,
                    color: colors.red.main,
                    height: '56px',
                    '&:hover': {
                      borderColor: colors.red.dark,
                      backgroundColor: colors.red.bg
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grow>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                minHeight: 48,
                color: colors.gray[700],
                '&.Mui-selected': {
                  color: colors.red.main,
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.red.main,
                height: 3
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                    <Badge
                      badgeContent={tab.count}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: selectedTab === index ? colors.red.main : colors.gray[400],
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Orders Table */}
        <Zoom in={true} timeout={1600}>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: colors.red.bg,
                  '& th': {
                    fontWeight: 700,
                    color: colors.red.dark,
                    fontSize: '0.875rem',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.red.main}`
                  }
                }}>
                 
                  <TableCell>PRODUCTS</TableCell>
                 
                  <TableCell>DATE</TableCell>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>PAYMENT</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Fade in={true}>
                          <Box sx={{ textAlign: 'center' }}>
                            <CartIcon sx={{ fontSize: 80, color: colors.gray[400], mb: 2 }} />
                            <Typography variant="h5" color={colors.gray[600]} gutterBottom>
                              No orders found
                            </Typography>
                            <Typography variant="body2" color={colors.gray[500]} sx={{ mb: 3 }}>
                              {searchTerm || statusFilter !== 'all' 
                                ? 'Try adjusting your filters' 
                                : 'Start shopping to see your orders here!'}
                            </Typography>
                            <ActionButton
                              variant="contained"
                              sx={{ background: colors.red.gradient }}
                              onClick={() => navigate('/products')}
                            >
                              Browse Products
                            </ActionButton>
                          </Box>
                        </Fade>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          backgroundColor: index % 2 === 0 ? 'white' : colors.red.bg,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.red.light}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : colors.red.bg;
                        }}
                      >
                        
                        <TableCell>
                          <Box>
                            {/* Display first product name prominently */}
                            {order.items && order.items.length > 0 && (
                              <>
                                <Typography variant="body2" fontWeight="600" color={colors.gray[800]}>
                                  {order.items[0].name}
                                </Typography>
                                {order.items.length > 1 && (
                                  <Typography variant="caption" color={colors.red.main} sx={{ display: 'block', mt: 0.5 }}>
                                    +{order.items.length - 1} more item(s)
                                  </Typography>
                                )}
                              </>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(order.createdAt)}
                          </Typography>
                          <Typography variant="caption" color={colors.gray[600]}>
                            {formatRelativeTime(order.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" fontWeight="700" color={colors.red.main}>
                            {formatCurrency(order.total_amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={order.order_status?.toUpperCase()}
                            status={order.order_status}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Tooltip title={`Payment: ${order.payment_method || 'N/A'}`}>
                              <Avatar sx={{
                                width: 32,
                                height: 32,
                                bgcolor: colors.red.bg,
                                color: colors.red.main
                              }}>
                                {getPaymentMethodIcon(order.payment_method)}
                              </Avatar>
                            </Tooltip>
                            <Chip
                              label={order.payment_status}
                              size="small"
                              sx={{
                                bgcolor: order.payment_status === 'completed' ? colors.success.bg : colors.warning.bg,
                                color: order.payment_status === 'completed' ? colors.success.dark : colors.warning.dark,
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewOrder(order)}
                                sx={{
                                  bgcolor: colors.red.bg,
                                  color: colors.red.main,
                                  '&:hover': { bgcolor: colors.red.main, color: 'white' }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Track Order">
                              <IconButton
                                size="small"
                                onClick={() => handleTrackOrder(order.order_id)}
                                sx={{
                                  bgcolor: colors.success.bg,
                                  color: colors.success.dark,
                                  '&:hover': { bgcolor: colors.success.dark, color: 'white' }
                                }}
                              >
                                <TrackIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reorder">
                              <IconButton
                                size="small"
                                onClick={() => handleReorder(order)}
                                sx={{
                                  bgcolor: colors.warning.bg,
                                  color: colors.warning.dark,
                                  '&:hover': { bgcolor: colors.warning.dark, color: 'white' }
                                }}
                              >
                                <RefreshIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Zoom>

        {/* Pagination */}
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}
             justifyContent="space-between" alignItems="center" gap={2} mt={4}>
          <Typography variant="body2" color={colors.gray[600]}>
            Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              sx={{ color: colors.red.main }}
            >
              Previous
            </Button>
            {[...Array(Math.ceil(filteredOrders.length / rowsPerPage))].map((_, i) => (
              <Button
                key={i}
                size="small"
                variant={page === i + 1 ? "contained" : "text"}
                onClick={() => setPage(i + 1)}
                sx={{
                  minWidth: '35px',
                  bgcolor: page === i + 1 ? colors.red.main : 'transparent',
                  color: page === i + 1 ? 'white' : colors.gray[600],
                  '&:hover': {
                    bgcolor: page === i + 1 ? colors.red.dark : colors.red.bg
                  }
                }}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="small"
              disabled={page === Math.ceil(filteredOrders.length / rowsPerPage)}
              onClick={() => setPage(p => p + 1)}
              sx={{ color: colors.red.main }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Order Details Dialog - With Product Names */}
      <RedDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Zoom}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{
              p: 3,
              background: colors.red.gradient,
              color: 'white'
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h5" fontWeight="700">
                    Order Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Order #{selectedOrder.order_id} • Placed on {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Box>
                <StatusChip
                  label={selectedOrder.order_status?.toUpperCase()}
                  status={selectedOrder.order_status}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)'
                  }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
              <Grid container>
                {/* Left Column - Order Items with Product Names */}
                <Grid item xs={12} md={7}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
                      <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Ordered Products
                    </Typography>
                    
                    {selectedOrder.items?.map((item, index) => (
                      <Fade key={index} in={true} timeout={500 + index * 100}>
                        <Paper sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: '12px',
                          border: `1px solid ${colors.red.border}`,
                          '&:hover': {
                            borderColor: colors.red.main,
                            boxShadow: `0 4px 12px ${colors.red.main}20`
                          }
                        }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3} sm={2}>
                              <ProductImage src={item.image} />
                            </Grid>
                            <Grid item xs={9} sm={10}>
                              <Typography variant="subtitle1" fontWeight="700" color={colors.red.dark}>
                                {item.name || item.productName || item.title}
                              </Typography>
                              <Typography variant="caption" color={colors.gray[600]} sx={{ display: 'block', mb: 1 }}>
                                SKU: {item.sku || item.productId || 'N/A'}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={4}>
                                  <Typography variant="body2" color={colors.gray[600]}>
                                    Qty: <strong>{item.quantity}</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography variant="body2" color={colors.gray[600]}>
                                    Price: <strong>{formatCurrency(item.price)}</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography variant="body2" fontWeight="700" color={colors.red.main}>
                                    Total: {formatCurrency(item.price * item.quantity)}
                                  </Typography>
                                </Grid>
                              </Grid>
                              {item.discount > 0 && (
                                <Typography variant="caption" color={colors.success.dark} sx={{ mt: 1, display: 'block' }}>
                                  <OfferIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                  Saved {formatCurrency(item.discount)}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Paper>
                      </Fade>
                    ))}

                    {/* Order Summary */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
                        <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Order Summary
                      </Typography>
                      <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: colors.red.bg }}>
                        {[
                          { label: 'Subtotal', value: selectedOrder.subtotal || selectedOrder.total_amount },
                          { label: 'Shipping', value: selectedOrder.shipping_charge || 0 },
                          { label: 'Tax', value: selectedOrder.tax_amount || 0 },
                          { label: 'Discount', value: -(selectedOrder.discount_amount || 0) },
                        ].map((item, index) => (
                          item.value !== 0 && (
                            <Box key={index} display="flex" justifyContent="space-between" mb={1.5}>
                              <Typography variant="body2" color={colors.gray[600]}>
                                {item.label}
                              </Typography>
                              <Typography variant="body2" fontWeight="500" color={
                                item.value < 0 ? colors.success.dark : colors.gray[800]
                              }>
                                {item.value < 0 ? '-' : ''}{formatCurrency(Math.abs(item.value))}
                              </Typography>
                            </Box>
                          )
                        ))}
                        <Divider sx={{ my: 2, borderColor: colors.red.border }} />
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="h6" fontWeight="700" color={colors.red.dark}>
                            Total
                          </Typography>
                          <Typography variant="h5" fontWeight="800" color={colors.red.main}>
                            {formatCurrency(selectedOrder.total_amount)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Column - Customer & Shipping Details */}
                {/* Right Column - Customer & Shipping Details */}
<Grid item xs={12} md={5}>
  <Box sx={{ p: 3, bgcolor: colors.red.bg, height: '100%' }}>
    {/* Customer Information */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Customer Information
      </Typography>
      <Paper sx={{ p: 3, borderRadius: '12px' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: colors.red.main }}>
            <PersonIcon sx={{ color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" color={colors.red.dark}>
              {selectedOrder.user?.name || userDetails?.name}
            </Typography>
            <Typography variant="caption" color={colors.gray[600]}>
              Customer since {formatDate(userDetails?.createdAt)}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.red.border }} />
        <Box sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <EmailIcon sx={{ color: colors.red.main, fontSize: 20 }} />
            <Typography variant="body2">
              {selectedOrder.user?.email || userDetails?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>

    {/* Default Address (from user profile) */}
    {userDetails?.address && (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Default Address
        </Typography>
        <Paper sx={{ p: 3, borderRadius: '12px' }}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" fontWeight="600" color={colors.red.dark}>
                {userDetails.address.name}
              </Typography>
              <Chip 
                label={userDetails.address.address_type} 
                size="small" 
                sx={{ 
                  bgcolor: colors.red.bg, 
                  color: colors.red.main,
                  textTransform: 'capitalize',
                  fontSize: '0.7rem',
                  height: '20px'
                }} 
              />
            </Box>
            <Typography variant="body2" color={colors.gray[600]}>
              {userDetails.address.address_line}
            </Typography>
            <Typography variant="body2" color={colors.gray[600]}>
              {userDetails.address.city}, {userDetails.address.state} - {userDetails.address.pincode}
            </Typography>
            <Typography variant="body2" color={colors.gray[600]}>
              {userDetails.address.country}
            </Typography>
            {userDetails.address.landmark && (
              <Typography variant="caption" color={colors.gray[500]} sx={{ mt: 0.5, display: 'block' }}>
                Landmark: {userDetails.address.landmark}
              </Typography>
            )}
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <PhoneIcon sx={{ color: colors.red.main, fontSize: 16 }} />
              <Typography variant="body2">
                {userDetails.address.mobile}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    )}

    {/* Shipping Address from Order */}
    {selectedOrder.shipping_address && (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Shipping Address
        </Typography>
        <Paper sx={{ p: 3, borderRadius: '12px' }}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="body2" fontWeight="600" color={colors.red.dark}>
                {selectedOrder.shipping_address.name}
              </Typography>
              {selectedOrder.shipping_address.address_type && (
                <Chip 
                  label={selectedOrder.shipping_address.address_type} 
                  size="small" 
                  sx={{ 
                    bgcolor: colors.red.bg, 
                    color: colors.red.main,
                    textTransform: 'capitalize',
                    fontSize: '0.7rem',
                    height: '20px'
                  }} 
                />
              )}
            </Box>
            <Typography variant="body2" color={colors.gray[600]}>
              {selectedOrder.shipping_address.address_line}
            </Typography>
            <Typography variant="body2" color={colors.gray[600]}>
              {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
            </Typography>
            <Typography variant="body2" color={colors.gray[600]}>
              {selectedOrder.shipping_address.country || 'India'}
            </Typography>
            {selectedOrder.shipping_address.landmark && (
              <Typography variant="caption" color={colors.gray[500]} sx={{ mt: 0.5, display: 'block' }}>
                Landmark: {selectedOrder.shipping_address.landmark}
              </Typography>
            )}
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <PhoneIcon sx={{ color: colors.red.main, fontSize: 16 }} />
              <Typography variant="body2">
                {selectedOrder.shipping_address.mobile}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    )}

    {/* Payment Information */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
        <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Payment Information
      </Typography>
      <Paper sx={{ p: 3, borderRadius: '12px' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: colors.red.bg, color: colors.red.main }}>
            {getPaymentMethodIcon(selectedOrder.payment_method)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="600" color={colors.red.dark}>
              {selectedOrder.payment_method?.toUpperCase() || 'N/A'}
            </Typography>
            <Chip
              label={selectedOrder.payment_status}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: selectedOrder.payment_status === 'completed' ? colors.success.bg : colors.warning.bg,
                color: selectedOrder.payment_status === 'completed' ? colors.success.dark : colors.warning.dark,
              }}
            />
          </Box>
        </Box>
        {selectedOrder.transaction_id && (
          <Typography variant="caption" color={colors.gray[600]}>
            Transaction ID: {selectedOrder.transaction_id}
          </Typography>
        )}
      </Paper>
    </Box>

    {/* Order Timeline */}
    {selectedOrder.order_status !== 'cancelled' && (
      <Box>
        <Typography variant="h6" fontWeight="700" color={colors.red.dark} gutterBottom>
          <TrackIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Order Timeline
        </Typography>
        <Paper sx={{ p: 3, borderRadius: '12px' }}>
          <Stepper
            activeStep={['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.order_status)}
            orientation="vertical"
            connector={<StepConnector sx={{ ml: 1 }} />}
          >
            {[
              { label: 'Order Placed', date: selectedOrder.createdAt },
              { label: 'Order Confirmed', date: selectedOrder.confirmedAt },
              { label: 'Processing', date: selectedOrder.processingAt },
              { label: 'Shipped', date: selectedOrder.shippedAt },
              { label: 'Delivered', date: selectedOrder.deliveredAt }
            ].map((step, index) => (
              <Step key={index} active={step.date ? true : false}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      color: step.date ? colors.red.main : colors.gray[400],
                      '&.Mui-active': { color: colors.red.main },
                      '&.Mui-completed': { color: colors.success.main }
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="600" color={colors.red.dark}>
                      {step.label}
                    </Typography>
                    {step.date && (
                      <Typography variant="caption" color={colors.gray[600]}>
                        {formatDate(step.date)}
                      </Typography>
                    )}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>
    )}

    {/* Cancellation Reason */}
    {selectedOrder.order_status === 'cancelled' && selectedOrder.cancellation_reason && (
      <Box sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '12px',
            '& .MuiAlert-icon': { color: colors.red.main }
          }}
        >
          <AlertTitle sx={{ color: colors.red.dark, fontWeight: 700 }}>
            Cancellation Reason
          </AlertTitle>
          {selectedOrder.cancellation_reason}
        </Alert>
      </Box>
    )}
  </Box>
</Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${colors.red.border}` }}>
              <Button
                onClick={() => setViewDialogOpen(false)}
                sx={{ color: colors.gray[600] }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                sx={{
                  bgcolor: colors.gray[700],
                  '&:hover': { bgcolor: colors.gray[800] }
                }}
              >
                Print Invoice
              </Button>
              <Button
                variant="contained"
                startIcon={<TrackIcon />}
                onClick={() => handleTrackOrder(selectedOrder.order_id)}
                sx={{
                  background: colors.red.gradient,
                  '&:hover': { background: colors.red.lightGradient }
                }}
              >
                Track Order
              </Button>
            </DialogActions>
          </>
        )}
      </RedDialog>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: colors.red.gradient,
            '&:hover': { background: colors.red.lightGradient }
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpIcon sx={{ color: 'white' }} />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default MyOrders;