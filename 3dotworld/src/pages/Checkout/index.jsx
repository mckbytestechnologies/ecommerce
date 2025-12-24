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
  Radio,
  RadioGroup,
  FormControlLabel,
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
} from "@mui/material";
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  Add,
  LocalShipping,
  ArrowForward,
  Home,
  CreditCard,
  Security,
  Timer,
  VerifiedUser,
  MonetizationOn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Styled Components
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

const PaymentCard = styled(Paper)(({ theme, selected }) => ({
  padding: '20px',
  borderRadius: '12px',
  border: selected ? '2px solid #D32F2F' : '1px solid #e0e0e0',
  background: selected ? '#FFF5F5' : 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#D32F2F',
  },
}));

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

  const steps = [
    { label: "Review Cart", icon: <ShoppingCart /> },
    { label: "Delivery", icon: <LocationOn /> },
    { label: "Payment", icon: <Payment /> },
    { label: "Confirmation", icon: <CheckCircle /> },
  ];

  const paymentMethods = [
    {
      id: "cod",
      title: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: <MonetizationOn />,
      available: true,
      note: "No online payment required"
    },
    {
      id: "card",
      title: "Credit/Debit Card",
      description: "Pay securely with your card",
      icon: <CreditCard />,
      available: false,
      note: "Coming Soon"
    },
    {
      id: "upi",
      title: "UPI",
      description: "Pay using any UPI app",
      icon: <VerifiedUser />,
      available: false,
      note: "Coming Soon"
    },
  ];

  const getToken = () =>
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  /* ---------------------------------- LOAD DATA ---------------------------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          navigate("/auth");
          return;
        }

        const [cartRes, addrRes] = await Promise.all([
          axios.get("https://ecommerce-server-fhna.onrender.com/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://ecommerce-server-fhna.onrender.com/api/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCart(cartRes.data.data || { items: [], total: 0 });
        setAddresses(addrRes.data.data || []);

        const defaultAddr = addrRes.data.data?.find((a) => a.is_default);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      } catch (err) {
        setError("Failed to load checkout data");
        console.error("Load data error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  /* ---------------------------------- PLACE ORDER ---------------------------------- */

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    try {
      setProcessing(true);
      const token = getToken();

      const orderData = {
        shippingAddressId: selectedAddress,
        paymentMethod,
        couponCode: cart?.couponCode || "",
      };

      const res = await axios.post(
        "https://ecommerce-server-fhna.onrender.com/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccess("🎉 Order placed successfully!");
        setActiveStep(3);
        setCart({ items: [], total: 0 });
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  /* ---------------------------------- CALCULATIONS ---------------------------------- */

  const calculateTotals = () => {
    if (!cart?.items) return { subtotal: 0, shipping: 0, total: 0 };
    
    const subtotal = cart.items.reduce((sum, item) => 
      sum + (item.product?.price || 0) * item.quantity, 0);
    
    const shipping = subtotal > 499 ? 0 : 49;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
  };

  const totals = calculateTotals();

  /* ---------------------------------- BUTTON TEXT ---------------------------------- */

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
          return `Pay ₹${totals.total} Now`;
        }
      default:
        return "Continue";
    }
  };

  /* ---------------------------------- RENDER ---------------------------------- */

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
                                    src={item.product?.images?.[0]}
                                    sx={{ 
                                      width: 80, 
                                      height: 80,
                                      borderRadius: '12px'
                                    }}
                                  />
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
                                    Size: Medium | Color: Red
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
                      {addresses.map((addr) => (
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
                              📱 {addr.phone}
                            </Typography>
                          </AddressCard>
                        </Grid>
                      ))}
                      
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

                    <Grid container spacing={2}>
                      {paymentMethods.map((method) => (
                        <Grid item xs={12} key={method.id}>
                          <PaymentCard
                            selected={paymentMethod === method.id}
                            onClick={() => method.available && setPaymentMethod(method.id)}
                            sx={{ opacity: method.available ? 1 : 0.6 }}
                          >
                            <Box display="flex" alignItems="center" mb={1}>
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
                                {method.note && (
                                  <Typography variant="caption" color="#4CAF50" display="block" mt={0.5}>
                                    {method.note}
                                  </Typography>
                                )}
                              </Box>
                              {!method.available && (
                                <Chip 
                                  label="Coming Soon" 
                                  size="small" 
                                  sx={{ bgcolor: '#f5f5f5' }} 
                                />
                              )}
                            </Box>
                          </PaymentCard>
                        </Grid>
                      ))}
                    </Grid>

                    {/* COD Instructions */}
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
                          <ListItem sx={{ py: 0.5 }}>
                            <Typography variant="body2">
                              • Delivery agent will provide a receipt
                            </Typography>
                          </ListItem>
                        </List>
                      </Box>
                    )}

                    <Box mt={4} p={2} bgcolor="#FFF5F5" borderRadius="8px">
                      <Box display="flex" alignItems="center" mb={1}>
                        <Security sx={{ color: '#D32F2F', mr: 1 }} />
                        <Typography variant="body2" fontWeight="600">
                          Secure Payment Guarantee
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        Your payment information is encrypted and secure. We do not store any credit card details.
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
                      
                      {paymentMethod === "cod" && (
                        <Box mb={3} p={2} bgcolor="#FFF3E0" borderRadius="8px">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <MonetizationOn sx={{ color: '#E65100' }} />
                            <Typography variant="body1" fontWeight="600" color="#E65100">
                              Pay ₹{totals.total} on Delivery
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
                      src={item.product?.images?.[0]}
                      sx={{ width: 50, height: 50, borderRadius: '8px', mr: 2 }}
                    />
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
                        <CreditCard sx={{ color: '#D32F2F', mr: 1, fontSize: '20px' }} />
                        <Typography variant="body2" fontWeight="600">
                          Card Payment
                        </Typography>
                      </>
                    )}
                  </Box>
                  {paymentMethod === "cod" && (
                    <Typography variant="caption" color="#4CAF50" display="block" mt={0.5}>
                      Pay ₹{totals.total} when your order arrives
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
                        (activeStep === 2 && !paymentMethod)
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

export default CheckoutPage;