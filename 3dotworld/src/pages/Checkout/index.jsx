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
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
  ArrowBack,
  Add,
  LocalShipping,
} from "@mui/icons-material";
import axios from "axios";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const steps = ["Cart", "Address", "Payment", "Done"];

  const getToken = () =>
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  /* ---------------------------------- LOAD DATA ---------------------------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        if (!token) return navigate("/auth");

        const cartRes = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const addrRes = await axios.get(
          "http://localhost:5000/api/addresses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCart(cartRes.data.data || {});
        setAddresses(addrRes.data.data || []);

        const defaultAddr = addrRes.data.data?.find((a) => a.is_default);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      } catch (err) {
        setError("Failed to load checkout data");
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
      setLoading(true);
      const token = getToken();

      const orderData = {
        shippingAddressId: selectedAddress, // ✅ IMPORTANT FIX
        paymentMethod,
        couponCode: cart?.couponCode || "",
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSuccess("Order placed successfully!");
        setActiveStep(3);
        setCart({ items: [] });
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- RENDER ---------------------------------- */

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ---------------- CART ---------------- */}
      {activeStep === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6">
              <ShoppingCart /> Cart Items
            </Typography>
            <Divider sx={{ my: 2 }} />

            {cart?.items?.map((item) => (
              <Box key={item._id} display="flex" mb={2}>
                <Avatar src={item.product?.images?.[0]} />
                <Box ml={2}>
                  <Typography>{item.product?.name}</Typography>
                  <Typography variant="body2">
                    Qty: {item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ---------------- ADDRESS ---------------- */}
      {activeStep === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6">
              <LocationOn /> Delivery Address
            </Typography>
            <Divider sx={{ my: 2 }} />

            <RadioGroup
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              {addresses.map((addr) => (
                <Paper key={addr._id} sx={{ p: 2, mb: 2 }}>
                  <FormControlLabel
                    value={addr._id}
                    control={<Radio />}
                    label={`${addr.address_line}, ${addr.city}`}
                  />
                </Paper>
              ))}
            </RadioGroup>

            <Button
              startIcon={<Add />}
              onClick={() => navigate("/profile/addresses")}
            >
              Add Address
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ---------------- PAYMENT ---------------- */}
      {activeStep === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6">
              <Payment /> Payment Method
            </Typography>
            <Divider sx={{ my: 2 }} />

            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>

            <Box mt={3}>
              <Typography variant="body2">
                <LocalShipping /> Estimated delivery: 3-5 days
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ---------------- SUCCESS ---------------- */}
      {activeStep === 3 && (
        <Box textAlign="center" mt={6}>
          <CheckCircle color="success" sx={{ fontSize: 80 }} />
          <Typography variant="h4" mt={2}>
            Order Confirmed 🎉
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            onClick={() => navigate("/my-order")}
          >
            View Orders
          </Button>
        </Box>
      )}

      {/* ---------------- NAV BUTTONS ---------------- */}
      {activeStep < 3 && (
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              activeStep === 0
                ? navigate("/cart")
                : setActiveStep((p) => p - 1)
            }
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              activeStep === 2
                ? handlePlaceOrder()
                : setActiveStep((p) => p + 1)
            }
          >
            {activeStep === 2 ? "Place Order" : "Continue"}
          </Button>
        </Box>
      )}

      {/* ---------------- ALERTS ---------------- */}
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckoutPage;
