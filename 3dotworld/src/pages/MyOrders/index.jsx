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
  Tab
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
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
  MoreVert as MoreIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Star as StarIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled Components
const RedCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
  color: 'white',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    transform: 'translate(30%, -30%)',
  }
}));

const WhiteCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  border: '1px solid #ffebee',
  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(211, 47, 47, 0.15)',
  }
}));

const StatusBadge = styled(Chip)(({ status, theme }) => {
  const colors = {
    pending: { bg: '#fff3e0', text: '#e65100', icon: <PendingIcon /> },
    confirmed: { bg: '#e3f2fd', text: '#1565c0', icon: <ConfirmedIcon /> },
    processing: { bg: '#f3e5f5', text: '#7b1fa2', icon: <ProcessingIcon /> },
    shipped: { bg: '#e8f5e8', text: '#2e7d32', icon: <ShippingIcon /> },
    delivered: { bg: '#e8f5e8', text: '#1b5e20', icon: <DeliveredIcon /> },
    cancelled: { bg: '#ffebee', text: '#c62828', icon: <CancelIcon /> }
  };
  
  return {
    backgroundColor: colors[status]?.bg || '#f5f5f5',
    color: colors[status]?.text || '#616161',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '20px',
    '& .MuiChip-icon': {
      color: colors[status]?.text,
      marginLeft: '4px'
    }
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await axios.get("https://ecommerce-server-fhna.onrender.com/api/orders", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const ordersData = response.data.data || [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        calculateStats(ordersData);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate statistics
  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const pending = ordersData.filter(o => o.order_status === "pending").length;
    const confirmed = ordersData.filter(o => o.order_status === "confirmed").length;
    const shipped = ordersData.filter(o => o.order_status === "shipped").length;
    const delivered = ordersData.filter(o => o.order_status === "delivered").length;
    const cancelled = ordersData.filter(o => o.order_status === "cancelled").length;
    const revenue = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const avgOrderValue = total > 0 ? revenue / total : 0;

    setStats({
      total, pending, confirmed, shipped, delivered, cancelled, revenue, avgOrderValue
    });
  };

  // Apply filters and search
  useEffect(() => {
    let result = orders;

    // Apply tab filter
    if (selectedTab > 0) {
      const statusMap = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      result = result.filter(order => order.order_status === statusMap[selectedTab]);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.order_id.toLowerCase().includes(term) ||
        (order.user?.name?.toLowerCase().includes(term)) ||
        (order.user?.email?.toLowerCase().includes(term))
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
  }, [orders, searchTerm, selectedTab, sortBy]);

  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  // Handle update status
  const handleUpdateStatus = (order, newStatus) => {
    // Implement API call to update status
    console.log(`Update order ${order._id} to ${newStatus}`);
  };

  // Format currency
  const formatCurrency = (amount) => `₹${amount?.toFixed(2) || "0.00"}`;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method) {
      case "card": return <MoneyIcon fontSize="small" />;
      case "upi": return <PhoneIcon fontSize="small" />;
      case "cod": return <MoneyIcon fontSize="small" />;
      default: return <MoneyIcon fontSize="small" />;
    }
  };

  // Tabs
  const tabs = [
    { label: "All Orders", count: stats.total },
    { label: "Pending", count: stats.pending },
    { label: "Confirmed", count: stats.confirmed },
    { label: "Shipped", count: stats.shipped },
    { label: "Delivered", count: stats.delivered },
    { label: "Cancelled", count: stats.cancelled }
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#d32f2f' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="800" sx={{ color: '#b71c1c' }}>
              Order Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CartIcon fontSize="small" />
              Manage and track all customer orders
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <ActionButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchOrders}
              sx={{ borderColor: '#d32f2f', color: '#d32f2f' }}
            >
              Refresh
            </ActionButton>
            <ActionButton
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #b71c1c 0%, #8b0000 100%)',
                }
              }}
            >
              Export Report
            </ActionButton>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <RedCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h2" fontWeight="800">
                      {stats.total}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Total Orders
                    </Typography>
                  </Box>
                  <CartIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    <ArrowUpIcon fontSize="small" /> 12% from last month
                  </Typography>
                </Box>
              </CardContent>
            </RedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WhiteCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h3" fontWeight="800" color="#e65100">
                      {stats.pending}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Pending Orders
                    </Typography>
                  </Box>
                  <PendingIcon sx={{ fontSize: 40, color: '#ff9800' }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.pending / stats.total) * 100} 
                  sx={{ mt: 2, bgcolor: '#ffccbc', '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' } }}
                />
              </CardContent>
            </WhiteCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WhiteCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h3" fontWeight="800" color="#2e7d32">
                      {stats.delivered}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Delivered Orders
                    </Typography>
                  </Box>
                  <DeliveredIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 2, display: 'block' }}>
                  <ArrowUpIcon fontSize="small" /> 95% satisfaction rate
                </Typography>
              </CardContent>
            </WhiteCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <WhiteCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h3" fontWeight="800" color="#1565c0">
                      {formatCurrency(stats.revenue)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                </Box>
                <Typography variant="caption" color="primary.main" sx={{ mt: 2, display: 'block' }}>
                  Avg. order: {formatCurrency(stats.avgOrderValue)}
                </Typography>
              </CardContent>
            </WhiteCard>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <WhiteCard>
        <CardContent>
          {/* Search and Filter Bar */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search orders by ID, customer, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#d32f2f' }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '12px',
                      '&:hover': { borderColor: '#d32f2f' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="price-high">Amount: High to Low</MenuItem>
                    <MenuItem value="price-low">Amount: Low to High</MenuItem>
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
                    setSelectedTab(0);
                    setSortBy("newest");
                  }}
                  sx={{ 
                    borderRadius: '12px',
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#b71c1c',
                      backgroundColor: '#ffebee'
                    }
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
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
                },
                '& .Mui-selected': {
                  color: '#d32f2f !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#d32f2f',
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.label}
                      <Badge
                        badgeContent={tab.count}
                        color={index === 0 ? "error" : "default"}
                        sx={{
                          '& .MuiBadge-badge': index === 0 ? {
                            backgroundColor: '#d32f2f',
                            color: 'white'
                          } : {}
                        }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Orders Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: '#ffebee',
                  '& th': { 
                    fontWeight: 700,
                    color: '#b71c1c',
                    fontSize: '0.875rem',
                    padding: '16px 12px'
                  }
                }}>
                  <TableCell>ORDER DETAILS</TableCell>
                  <TableCell>CUSTOMER</TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>PAYMENT</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CartIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No orders found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm ? 'Try a different search term' : 'No orders available'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow 
                      key={order._id} 
                      hover
                      sx={{ 
                        '&:hover': { backgroundColor: '#fff8f8' },
                        '& td': { padding: '20px 12px' }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="700" color="#b71c1c">
                            {order.order_id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <CartIcon fontSize="small" />
                            {order.items?.length || 0} items
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              bgcolor: '#d32f2f',
                              fontWeight: 600
                            }}
                          >
                            {order.user?.name?.charAt(0)?.toUpperCase() || "C"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {order.user?.name || "Customer"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon fontSize="small" />
                              {order.user?.email || "No email"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(order.createdAt)}
                          </Typography>
                          {order.expected_delivery && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <CalendarIcon fontSize="small" />
                              Expected: {formatDate(order.expected_delivery)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight="700" color="#d32f2f">
                          {formatCurrency(order.total_amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          label={order.order_status?.toUpperCase()} 
                          status={order.order_status}
                          icon={(() => {
                            switch(order.order_status) {
                              case 'pending': return <PendingIcon />;
                              case 'confirmed': return <ConfirmedIcon />;
                              case 'processing': return <ProcessingIcon />;
                              case 'shipped': return <ShippingIcon />;
                              case 'delivered': return <DeliveredIcon />;
                              case 'cancelled': return <CancelIcon />;
                              default: return null;
                            }
                          })()}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPaymentIcon(order.payment_method)}
                          <Typography variant="body2" fontWeight="500">
                            {order.payment_method?.toUpperCase()}
                          </Typography>
                          <Chip
                            label={order.payment_status}
                            size="small"
                            sx={{
                              ml: 1,
                              bgcolor: order.payment_status === 'completed' ? '#e8f5e8' : '#fff3e0',
                              color: order.payment_status === 'completed' ? '#2e7d32' : '#e65100',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewOrder(order)}
                              sx={{ 
                                bgcolor: '#ffebee',
                                color: '#d32f2f',
                                '&:hover': { bgcolor: '#ffcdd2' }
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {order.order_status !== 'delivered' && order.order_status !== 'cancelled' && (
                            <Tooltip title="Update Status">
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateStatus(order, 'next')}
                                sx={{ 
                                  bgcolor: '#e3f2fd',
                                  color: '#1976d2',
                                  '&:hover': { bgcolor: '#bbdefb' }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Info */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredOrders.length} of {orders.length} orders
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                disabled
                sx={{ color: '#d32f2f' }}
              >
                Previous
              </Button>
              <Button
                size="small"
                sx={{ color: '#d32f2f' }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </CardContent>
      </WhiteCard>

      {/* View Order Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ 
              bgcolor: '#d32f2f', 
              color: 'white',
              borderBottom: '1px solid #ffcdd2'
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="600">
                  Order #{selectedOrder.order_id}
                </Typography>
                <StatusBadge 
                  label={selectedOrder.order_status?.toUpperCase()} 
                  status={selectedOrder.order_status}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="600" color="#b71c1c">
                      Order Items
                    </Typography>
                    {selectedOrder.items?.map((item, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          borderRadius: '12px',
                          bgcolor: '#fafafa',
                          border: '1px solid #ffebee'
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={2}>
                            <Avatar
                              src={item.image}
                              variant="rounded"
                              sx={{ width: 60, height: 60 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" fontWeight="600">
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography variant="h6" fontWeight="700" color="#d32f2f">
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ p: 3, bgcolor: '#fafafa', height: '100%' }}>
                    {/* Order Summary */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="#b71c1c">
                        Order Summary
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {[
                          { label: 'Subtotal', value: selectedOrder.subtotal },
                          { label: 'Shipping', value: selectedOrder.shipping_charge },
                          { label: 'Tax', value: selectedOrder.tax_amount },
                          { label: 'Discount', value: -selectedOrder.discount_amount },
                        ].map((item, index) => (
                          item.value !== 0 && (
                            <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" color="text.secondary">
                                {item.label}
                              </Typography>
                              <Typography variant="body2" fontWeight="500">
                                {formatCurrency(Math.abs(item.value))}
                              </Typography>
                            </Box>
                          )
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="h6" fontWeight="700">
                            Total
                          </Typography>
                          <Typography variant="h5" fontWeight="800" color="#d32f2f">
                            {formatCurrency(selectedOrder.total_amount)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Customer Info */}
                    <Box>
                      <Typography variant="h6" gutterBottom fontWeight="600" color="#b71c1c">
                        Customer Information
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '12px', border: '1px solid #ffebee' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: '#d32f2f' }}>
                            {selectedOrder.user?.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {selectedOrder.user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedOrder.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                        {selectedOrder.user?.phone && (
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {selectedOrder.user.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Timeline */}
                    {selectedOrder.order_status !== 'cancelled' && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom fontWeight="600" color="#b71c1c">
                          Order Timeline
                        </Typography>
                        <Box sx={{ position: 'relative', pl: 3, mt: 2 }}>
                          {['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                            <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: index <= ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.order_status) ? '#d32f2f' : '#e0e0e0',
                                  border: '2px solid white',
                                  position: 'absolute',
                                  left: 0,
                                  ml: -1.5
                                }}
                              />
                              <Box sx={{ ml: 3 }}>
                                <Typography variant="body2" fontWeight="500">
                                  {step}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {index <= ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.order_status) ? 'Completed' : 'Pending'}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid #ffebee' }}>
              <Button 
                onClick={() => setViewDialogOpen(false)}
                sx={{ color: '#d32f2f' }}
              >
                Close
              </Button>
              <Button 
                variant="contained"
                sx={{ 
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
                onClick={() => {
                  // Handle action
                }}
              >
                Print Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyOrders;