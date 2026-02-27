console.log("✅ Checkout page loaded!");

// ... rest of your code
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Fade,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  Add,
  ArrowForward,
  Home,
  CreditCard,
  Security,
  Timer,
  VerifiedUser,
  MonetizationOn,
  QrCode,
  Phone,
  AccountBalance,
  LocalOffer,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Styled Components


const CheckoutPage = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [userDetails, setUserDetails] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    type: "",
    data: null,
  });

  const steps = [
    { label: "Review Cart", icon: <ShoppingCart /> },
    { label: "Delivery", icon: <LocationOn /> },
    { label: "Payment", icon: <Payment /> },
    { label: "Confirmation", icon: <CheckCircle /> },
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: "cod",
      title: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: <MonetizationOn />,
      available: true,
    },
    {
      id: "upi",
      title: "UPI (Google Pay, PhonePe, Paytm)",
      description: "Instant payment via UPI apps",
      icon: <QrCode />,
      available: true,
    },
    {
      id: "card",
      title: "Credit/Debit Card",
      description: "Visa, Mastercard, RuPay, Amex",
      icon: <CreditCard />,
      available: true,
    },
    {
      id: "netbanking",
      title: "Net Banking",
      description: "All major banks supported",
      icon: <AccountBalance />,
      available: true,
    },
    {
      id: "wallet",
      title: "Wallets",
      description: "Paytm, PhonePe, Amazon Pay",
      icon: <AccountBalance />,
      available: true,
    },
  ];

  const API_BASE_URL = "https://server-kzwj.onrender.com/api";

  const getToken = () =>
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  // Get user details from token or localStorage
  const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return null;
  };

  // Load cart and addresses
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
          navigate("/login");
          return;
        }

        // Get user from token
        const userFromToken = getUserFromToken();
        setUserDetails(userFromToken);

        // Load cart data - Fix: Access the cart data correctly
        const cartRes = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          console.error("Cart API error:", err);
          return { data: { data: { items: [], total: 0, discountAmount: 0, couponCode: null } } };
        });

        // Load addresses
        const addrRes = await axios.get(`${API_BASE_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          console.error("Addresses API error:", err);
          return { data: { data: [] } };
        });

        // Handle different response structures
        const cartData = cartRes.data?.data || cartRes.data || { items: [], total: 0, discountAmount: 0, couponCode: null };
        
        console.log("Cart data loaded:", cartData); // Debug log
        setCart(cartData);
        setAddresses(addrRes.data?.data || []);

        const defaultAddr = addrRes.data?.data?.find((a) => a.is_default);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
        
      } catch (err) {
        console.error("Load data error:", err);
        setError("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Handle COD order
  const handleCODOrder = async () => {
    try {
      setProcessing(true);
      const token = getToken();

      const orderData = {
        shippingAddressId: selectedAddress,
        paymentMethod: "cod",
        couponCode: cart?.couponCode || "",
      };

      console.log("Placing COD order:", orderData);

      const res = await axios.post(
        `${API_BASE_URL}/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setOrderId(res.data.data._id);
        setSuccess("🎉 Order placed successfully!");
        setActiveStep(3);
        setCart({ items: [], total: 0, discountAmount: 0, couponCode: null });
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        throw new Error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  // Create Razorpay order
  const createRazorpayOrder = async (orderId, paymentMethod) => {
    try {
      const token = getToken();
      console.log("Creating Razorpay order with:", { orderId, paymentMethod });
      
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-razorpay-order`,
        { orderId, paymentMethod },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log("Razorpay order response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create Razorpay order error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to create payment order";
      const errorDetails = error.response?.data?.details || "";
      throw new Error(`${errorMessage} ${errorDetails}`.trim());
    }
  };

  // Confirm payment
  const confirmPayment = async (paymentId, gateway, paymentData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${API_BASE_URL}/payments/confirm`,
        { paymentId, gateway, paymentData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to confirm payment" };
    }
  };

  // Handle online payment
  const handleOnlinePayment = async () => {
    try {
      setProcessing(true);
      setError("");

      const token = getToken();

      const orderData = {
        shippingAddressId: selectedAddress,
        paymentMethod: paymentMethod,
        couponCode: cart?.couponCode || "",
      };

      console.log("Creating order:", orderData);

      const orderRes = await axios.post(
        `${API_BASE_URL}/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to create order");
      }

      const order = orderRes.data.data;
      setOrderId(order._id);

      const paymentData = await createRazorpayOrder(order._id, paymentMethod);

      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const options = {
        key: paymentData.data.key,
        amount: paymentData.data.amount,
        currency: paymentData.data.currency,
        name: "Your Store Name",
        description: `Payment for Order #${order.order_id}`,
        order_id: paymentData.data.id,
        prefill: {
          name: userDetails?.name || "",
          email: userDetails?.email || "",
          contact: userDetails?.phone || "",
        },
        notes: {
          order_id: order._id,
          payment_method: paymentMethod,
        },
        theme: {
          color: "#D32F2F",
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setError("Payment cancelled by user");
          },
        },
        handler: async function(response) {
          try {
            setPaymentDialog({
              open: true,
              type: "processing",
              data: { message: "Confirming payment..." },
            });

            const confirmResult = await confirmPayment(
              paymentData.data.payment_id,
              "razorpay",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (confirmResult.success) {
              setPaymentDialog({
                open: true,
                type: "success",
                data: { 
                  message: "Payment successful!",
                  payment_id: response.razorpay_payment_id 
                },
              });
              
              setSuccess("Payment successful! Your order is confirmed.");
              setActiveStep(3);
              setCart({ items: [], total: 0, discountAmount: 0, couponCode: null });
              window.dispatchEvent(new Event("cartUpdated"));
              
              setTimeout(() => {
                setPaymentDialog({ open: false, type: "", data: null });
              }, 3000);
            } else {
              throw new Error("Payment confirmation failed");
            }
          } catch (error) {
            console.error("Payment confirmation error:", error);
            setPaymentDialog({
              open: true,
              type: "error",
              data: { message: "Payment successful but confirmation failed. Contact support." },
            });
            setError("Payment successful but confirmation failed. Contact support.");
          } finally {
            setProcessing(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on("payment.failed", function(response) {
        setProcessing(false);
        setPaymentDialog({
          open: true,
          type: "error",
          data: { message: response.error.description || "Payment failed" },
        });
        setError(response.error.description || "Payment failed");
      });

      razorpay.open();
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      setError(error.message || "Failed to process payment");
      setProcessing(false);
    }
  };

  // Handle place order based on payment method
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    if (paymentMethod === "cod") {
      await handleCODOrder();
    } else {
      await handleOnlinePayment();
    }
  };

  // Calculate totals with coupon discount
  const calculateTotals = () => {
    if (!cart?.items) return { 
      subtotal: 0, 
      discount: 0, 
      shipping: 0, 
      total: 0,
      couponCode: null 
    };
    
    const subtotal = cart.items.reduce((sum, item) => 
      sum + (item.product?.price || 0) * item.quantity, 0);
    
    // Get discount from cart (applied coupon)
    const discount = cart.discountAmount || 0;
    
    const shipping = subtotal > 499 ? 0 : 49;
    const total = subtotal + shipping - discount;
    
    return { 
      subtotal, 
      discount, 
      shipping, 
      total,
      couponCode: cart.couponCode 
    };
  };

  const totals = calculateTotals();

  const getButtonText = () => {
    if (processing) return "Processing...";
    
    switch (activeStep) {
      case 0:
        return "Continue to Delivery";
      case 1:
        return "Continue to Payment";
      case 2:
        if (paymentMethod === "cod") {
          return `Place Order (Pay ₹${totals.total} on Delivery)`;
        } else {
          return `Pay ₹${totals.total} Securely`;
        }
      default:
        return "Continue";
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="70vh"
      >
        <CircularProgress sx={{ color: '#D32F2F', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Loading your cart...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Progress Stepper */}
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 6,
          '& .MuiStepLabel-label': {
            fontWeight: '600',
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel 
              StepIconComponent={StepIconRed}
              sx={{
                '& .MuiStepLabel-label.Mui-active': {
                  color: '#D32F2F',
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: '#D32F2F',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {step.icon}
                <Typography 
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} lg={8}>
          <Slide in direction="up" timeout={500}>
            <div>
              {/* STEP 1: CART REVIEW */}
              {activeStep === 0 && (
                <WhiteCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={3}>
                      <ShoppingCart sx={{ color: '#D32F2F', mr: 2 }} />
                      <Typography variant="h5" fontWeight="bold">
                        Review Your Cart ({cart?.items?.length || 0} items)
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />

                    {/* Show applied coupon if any */}
                    {totals.couponCode && (
                      <Box mb={3} p={2} bgcolor="#E8F5E9" borderRadius="8px" display="flex" alignItems="center">
                        <LocalOffer sx={{ color: '#4CAF50', mr: 1 }} />
                        <Typography variant="body2" fontWeight="600" color="#4CAF50">
                          Coupon {totals.couponCode} applied: You saved ₹{totals.discount}
                        </Typography>
                      </Box>
                    )}

                    {cart?.items?.length > 0 ? (
                      <List disablePadding>
                        {cart.items.map((item, index) => (
                          <Fade in timeout={300 + index * 100} key={item._id}>
                            <ListItem 
                              sx={{ 
                                py: 3,
                                borderBottom: '1px solid #f0f0f0',
                                '&:last-child': { borderBottom: 'none' }
                              }}
                            >
                              <ListItemAvatar>
                                <Badge badgeContent={item.quantity} color="error">
                                  <Avatar 
                                    src={(() => {
                                      if (!item.product) return '';
                                      if (item.product.images?.[0]?.url) return item.product.images[0].url;
                                      if (typeof item.product.images?.[0] === 'string') return item.product.images[0];
                                      if (item.product.image) return item.product.image;
                                      return '';
                                    })()}
                                    sx={{ 
                                      width: 80, 
                                      height: 80,
                                      borderRadius: '12px'
                                    }}
                                  >
                                    {!item.product?.images?.[0] && !item.product?.image && 
                                      (item.product?.name?.charAt(0) || 'P')
                                    }
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              
                              <ListItemText
                                primary={
                                  <Typography variant="h6" fontWeight="600">
                                    {item.product?.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="textSecondary">
                                    Quantity: {item.quantity} | Price: ₹{item.product?.price}
                                  </Typography>
                                }
                                sx={{ ml: 2 }}
                              />
                              
                              <Typography variant="h6" fontWeight="bold" color="#D32F2F">
                                ₹{(item.product?.price || 0) * item.quantity}
                              </Typography>
                            </ListItem>
                          </Fade>
                        ))}
                      </List>
                    ) : (
                      <Box textAlign="center" py={6}>
                        <ShoppingCart sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                          Your cart is empty
                        </Typography>
                        <Button 
                          variant="outlined" 
                          sx={{ mt: 2, borderColor: '#D32F2F', color: '#D32F2F' }}
                          onClick={() => navigate("/productlisting")}
                        >
                          Start Shopping
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </WhiteCard>
              )}

              {/* STEP 2: ADDRESS SELECTION */}
              {activeStep === 1 && (
                <WhiteCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={3}>
                      <LocationOn sx={{ color: '#D32F2F', mr: 2 }} />
                      <Typography variant="h5" fontWeight="bold">
                        Select Delivery Address
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                      {addresses.length > 0 ? (
                        addresses.map((addr) => (
                          <Grid item xs={12} key={addr._id}>
                            <AddressCard
                              selected={selectedAddress === addr._id}
                              onClick={() => setSelectedAddress(addr._id)}
                            >
                              <Box display="flex" alignItems="center" mb={1}>
                                <Home sx={{ color: '#D32F2F', mr: 1 }} />
                                <Typography variant="h6" fontWeight="600">
                                  {addr.address_type || "Home"}
                                </Typography>
                                {addr.is_default && (
                                  <Chip 
                                    label="Default" 
                                    size="small" 
                                    sx={{ 
                                      ml: 2, 
                                      bgcolor: '#FFEBEE', 
                                      color: '#D32F2F',
                                      fontWeight: 'bold'
                                    }} 
                                  />
                                )}
                              </Box>
                              
                              <Typography variant="body1" paragraph>
                                {addr.address_line}
                              </Typography>
                              
                              <Typography variant="body2" color="textSecondary">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </Typography>
                              
                              <Typography variant="body2" color="textSecondary" mt={1}>
                                <Phone sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                {addr.phone}
                              </Typography>
                            </AddressCard>
                          </Grid>
                        ))
                      ) : (
                        <Grid item xs={12}>
                          <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="textSecondary" paragraph>
                              No addresses found. Please add an address to continue.
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                      
                      <Grid item xs={12}>
                        <Button
                          startIcon={<Add />}
                          variant="outlined"
                          fullWidth
                          sx={{
                            py: 2,
                            borderColor: '#D32F2F',
                            color: '#D32F2F',
                            borderRadius: '12px',
                            '&:hover': {
                              borderColor: '#B71C1C',
                              bgcolor: '#FFF5F5'
                            }
                          }}
                          onClick={() => navigate("/profile/addresses")}
                        >
                          Add New Address
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </WhiteCard>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {activeStep === 2 && (
                <WhiteCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={3}>
                      <Payment sx={{ color: '#D32F2F', mr: 2 }} />
                      <Typography variant="h5" fontWeight="bold">
                        Select Payment Method
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />

                    {/* Show applied coupon if any */}
                    {totals.couponCode && (
                      <Box mb={3} p={2} bgcolor="#E8F5E9" borderRadius="8px">
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <LocalOffer sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="body2" fontWeight="600" color="#4CAF50">
                              Coupon {totals.couponCode} applied
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="bold" color="#4CAF50">
                            -₹{totals.discount}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Grid container spacing={2}>
                      {paymentMethods.map((method) => (
                        <Grid item xs={12} key={method.id}>
                          <PaymentCard
                            selected={paymentMethod === method.id}
                            available={method.available}
                            onClick={() => method.available && setPaymentMethod(method.id)}
                          >
                            <Box display="flex" alignItems="center">
                              <Box sx={{ color: '#D32F2F', mr: 2 }}>
                                {method.icon}
                              </Box>
                              <Box flex={1}>
                                <Typography variant="h6" fontWeight="600">
                                  {method.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {method.description}
                                </Typography>
                              </Box>
                              <Radio
                                checked={paymentMethod === method.id}
                                onChange={() => method.available && setPaymentMethod(method.id)}
                                value={method.id}
                                name="payment-method"
                                sx={{ color: '#D32F2F', '&.Mui-checked': { color: '#D32F2F' } }}
                              />
                            </Box>
                          </PaymentCard>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Payment Method Specific Instructions */}
                    {paymentMethod === "cod" && (
                      <Box mt={3} p={3} bgcolor="#FFF5F5" borderRadius="12px">
                        <Box display="flex" alignItems="center" mb={1}>
                          <MonetizationOn sx={{ color: '#D32F2F', mr: 1 }} />
                          <Typography variant="h6" fontWeight="600">
                            Cash on Delivery Instructions
                          </Typography>
                        </Box>
                        <List dense>
                          <ListItem sx={{ py: 0.5 }}>
                            <Typography variant="body2">
                              • Pay ₹{totals.total} in cash when your order arrives
                            </Typography>
                          </ListItem>
                          <ListItem sx={{ py: 0.5 }}>
                            <Typography variant="body2">
                              • Exact change is preferred
                            </Typography>
                          </ListItem>
                          <ListItem sx={{ py: 0.5 }}>
                            <Typography variant="body2">
                              • You can inspect the items before payment
                            </Typography>
                          </ListItem>
                        </List>
                      </Box>
                    )}

                    {paymentMethod === "upi" && (
                      <Box mt={3} p={3} bgcolor="#E8F5E9" borderRadius="12px">
                        <Box display="flex" alignItems="center" mb={1}>
                          <QrCode sx={{ color: '#4CAF50', mr: 1 }} />
                          <Typography variant="h6" fontWeight="600">
                            UPI Payment
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          You'll be redirected to Razorpay to complete your UPI payment.
                        </Typography>
                      </Box>
                    )}

                    {paymentMethod === "card" && (
                      <Box mt={3} p={3} bgcolor="#E8F5E9" borderRadius="12px">
                        <Box display="flex" alignItems="center" mb={1}>
                          <CreditCard sx={{ color: '#4CAF50', mr: 1 }} />
                          <Typography variant="h6" fontWeight="600">
                            Card Payment
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          We accept Visa, Mastercard, RuPay, and American Express.
                        </Typography>
                      </Box>
                    )}

                    <Box mt={4} p={2} bgcolor="#FFF5F5" borderRadius="8px">
                      <Box display="flex" alignItems="center" mb={1}>
                        <Security sx={{ color: '#D32F2F', mr: 1 }} />
                        <Typography variant="body2" fontWeight="600">
                          Your Security is Our Priority
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        We never store your payment details. All transactions are processed securely.
                      </Typography>
                    </Box>
                  </CardContent>
                </WhiteCard>
              )}

              {/* STEP 4: ORDER CONFIRMATION */}
              {activeStep === 3 && (
                <WhiteCard>
                  <CardContent>
                    <Box textAlign="center" py={6}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          bgcolor: '#E8F5E9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          border: '3px solid #4CAF50'
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 60, color: '#4CAF50' }} />
                      </Box>
                      
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Order Confirmed! 🎉
                      </Typography>
                      
                      <Typography variant="body1" color="textSecondary" paragraph>
                        Thank you for your purchase. Your order has been successfully placed.
                      </Typography>
                      
                      {paymentMethod === "cod" ? (
                        <Box mb={3} p={2} bgcolor="#FFF3E0" borderRadius="8px">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <MonetizationOn sx={{ color: '#E65100' }} />
                            <Typography variant="body1" fontWeight="600" color="#E65100">
                              Pay ₹{totals.total} on Delivery
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Box mb={3} p={2} bgcolor="#E8F5E9" borderRadius="8px">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <CheckCircle sx={{ color: '#4CAF50' }} />
                            <Typography variant="body1" fontWeight="600" color="#4CAF50">
                              Payment Successful
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      
                      <Chip 
                        icon={<Timer />}
                        label="Estimated Delivery: 3-5 Business Days"
                        sx={{ 
                          bgcolor: '#FFF3E0', 
                          color: '#E65100',
                          fontWeight: '600',
                          mb: 3
                        }}
                      />
                      
                      <Box mt={4} display="flex" flexDirection="column" gap={2}>
                        <RedButton
                          onClick={() => navigate("/my-order")}
                          endIcon={<ArrowForward />}
                        >
                          Track Your Order
                        </RedButton>
                        
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/productlisting")}
                          sx={{
                            borderColor: '#D32F2F',
                            color: '#D32F2F',
                            '&:hover': {
                              borderColor: '#B71C1C',
                              bgcolor: '#FFF5F5'
                            }
                          }}
                        >
                          Continue Shopping
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </WhiteCard>
              )}
            </div>
          </Slide>
        </Grid>

        {/* Right Column - Order Summary */}
        <Grid item xs={12} lg={4}>
          <Slide in direction="left" timeout={700}>
            <WhiteCard sx={{ position: 'sticky', top: '20px' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Order Summary
                </Typography>
                
                <Divider sx={{ mb: 3 }} />

                {/* Order Items Preview */}
                {cart?.items?.slice(0, 3).map((item) => (
                  <Box key={item._id} display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      src={(() => {
                        if (!item.product) return '';
                        if (item.product.images?.[0]?.url) return item.product.images[0].url;
                        if (typeof item.product.images?.[0] === 'string') return item.product.images[0];
                        if (item.product.image) return item.product.image;
                        return '';
                      })()}
                      sx={{ width: 50, height: 50, borderRadius: '8px', mr: 2 }}
                    >
                      {!item.product?.images?.[0] && !item.product?.image && 
                        (item.product?.name?.charAt(0) || 'P')
                      }
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" noWrap>
                        {item.product?.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="600">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </Typography>
                  </Box>
                ))}
                
                {cart?.items?.length > 3 && (
                  <Typography variant="caption" color="textSecondary">
                    + {cart.items.length - 3} more items
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Price Breakdown */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="textSecondary">Subtotal</Typography>
                    <Typography fontWeight="600">₹{totals.subtotal}</Typography>
                  </Box>
                  
                  {/* Show discount if applied */}
                  {totals.discount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography color="textSecondary" sx={{ color: '#4CAF50' }}>
                        Discount ({totals.couponCode})
                      </Typography>
                      <Typography fontWeight="600" color="#4CAF50">
                        -₹{totals.discount}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="textSecondary">Shipping</Typography>
                    <Typography fontWeight="600" color={totals.shipping === 0 ? '#4CAF50' : 'inherit'}>
                      {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                    </Typography>
                  </Box>
                  
                  {totals.subtotal < 499 && (
                    <Typography variant="caption" color="#4CAF50">
                      Add ₹{499 - totals.subtotal} more for free shipping
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box display="flex" justifyContent="space-between" mb={4}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#D32F2F">
                    ₹{totals.total}
                  </Typography>
                </Box>

                {/* Show final amount after discount */}
                {totals.discount > 0 && (
                  <Box mb={3} p={2} bgcolor="#E8F5E9" borderRadius="8px">
                    <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>
                      You Saved
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="#4CAF50">
                      ₹{totals.discount} with coupon {totals.couponCode}
                    </Typography>
                  </Box>
                )}

                {/* Payment Method Display */}
                <Box mb={3} p={2} bgcolor="#FFF5F5" borderRadius="8px">
                  <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>
                    Payment Method
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {paymentMethod === "cod" ? (
                      <>
                        <MonetizationOn sx={{ color: '#D32F2F', mr: 1, fontSize: '20px' }} />
                        <Typography variant="body2" fontWeight="600">
                          Cash on Delivery
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Security sx={{ color: '#D32F2F', mr: 1, fontSize: '20px' }} />
                        <Typography variant="body2" fontWeight="600">
                          {paymentMethod === "upi" ? "UPI" : 
                           paymentMethod === "card" ? "Card" : 
                           paymentMethod === "netbanking" ? "Net Banking" : "Wallet"}
                        </Typography>
                      </>
                    )}
                  </Box>
                  {paymentMethod === "cod" && (
                    <Typography variant="caption" color="#4CAF50" display="block" mt={0.5}>
                      Pay ₹{totals.total} when your order arrives
                    </Typography>
                  )}
                  {paymentMethod !== "cod" && (
                    <Typography variant="caption" color="#4CAF50" display="block" mt={0.5}>
                      Secure online payment
                    </Typography>
                  )}
                </Box>

                {/* Navigation Buttons */}
                {activeStep < 3 && (
                  <Box>
                    <RedButton
                      fullWidth
                      size="large"
                      disabled={
                        (activeStep === 1 && !selectedAddress) ||
                        processing ||
                        (activeStep === 2 && !paymentMethod) ||
                        (cart?.items?.length === 0)
                      }
                      onClick={() => {
                        if (activeStep === 2) {
                          handlePlaceOrder();
                        } else {
                          setActiveStep((p) => p + 1);
                        }
                      }}
                    >
                      {processing ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                          Processing...
                        </Box>
                      ) : (
                        getButtonText()
                      )}
                    </RedButton>
                    
                    <Button
                      fullWidth
                      startIcon={<ArrowBack />}
                      sx={{ mt: 2, color: '#666' }}
                      onClick={() => {
                        if (activeStep === 0) {
                          navigate("/cart");
                        } else {
                          setActiveStep((p) => p - 1);
                        }
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                )}
              </CardContent>
            </WhiteCard>
          </Slide>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialog.open} 
        onClose={() => setPaymentDialog({ open: false, type: "", data: null })}
        PaperProps={{ sx: { borderRadius: '16px', p: 2 } }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          {paymentDialog.type === 'success' ? '🎉 Payment Successful' : 
           paymentDialog.type === 'processing' ? '⏳ Processing' : 
           '❌ Payment Failed'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center' }}>
            {paymentDialog.type === 'success' 
              ? `Payment ID: ${paymentDialog.data?.payment_id || 'N/A'}`
              : paymentDialog.data?.message || 'Something went wrong with the payment'}
          </DialogContentText>
          {paymentDialog.type === 'processing' && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={30} sx={{ color: '#D32F2F' }} />
            </Box>
          )}
        </DialogContent>
        {paymentDialog.type !== 'processing' && (
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              onClick={() => setPaymentDialog({ open: false, type: "", data: null })}
              variant="contained"
              sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' } }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          variant="filled"
          onClose={() => setError("")}
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          variant="filled"
          onClose={() => setSuccess("")}
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};


const RedButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D32F2F 30%, #B71C1C 90%)',
  color: 'white',
  fontWeight: 'bold',
  padding: '12px 32px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #B71C1C 30%, #D32F2F 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
  },
  '&:disabled': {
    background: '#e0e0e0',
    color: '#9e9e9e',
  },
}));

const WhiteCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
  },
}));

const StepIconRed = styled(StepIcon)(({ theme, ownerState }) => ({
  color: ownerState.completed || ownerState.active ? '#D32F2F' : '#e0e0e0',
  '& .MuiStepIcon-text': {
    fill: 'white',
    fontWeight: 'bold',
  },
}));

const AddressCard = styled(Paper)(({ theme, selected }) => ({
  padding: '20px',
  borderRadius: '12px',
  border: selected ? '2px solid #D32F2F' : '1px solid #e0e0e0',
  background: selected ? '#FFF5F5' : 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#D32F2F',
    transform: 'translateY(-2px)',
  },
}));

const PaymentCard = styled(Paper)(({ theme, selected, available }) => ({
  padding: '20px',
  borderRadius: '12px',
  border: selected ? '2px solid #D32F2F' : '1px solid #e0e0e0',
  background: selected ? '#FFF5F5' : 'white',
  cursor: available ? 'pointer' : 'default',
  opacity: available ? 1 : 0.6,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: available ? '#D32F2F' : '#e0e0e0',
    transform: available ? 'translateY(-2px)' : 'none',
  },
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAF50 30%, #388E3C 90%)',
  color: 'white',
  fontWeight: 'bold',
  '& .MuiChip-icon': {
    color: 'white',
  },
}));

export default CheckoutPage;