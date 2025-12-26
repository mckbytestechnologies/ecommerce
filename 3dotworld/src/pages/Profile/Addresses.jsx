import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Paper,
  Avatar,
  Badge,
  Fab,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  MoreHoriz as OtherIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  PinDrop as PinDropIcon,
  Flag as FlagIcon,
  ArrowBack as ArrowBackIcon,
  AddLocation as AddLocationIcon,
  EditLocation as EditLocationIcon,
  Verified as VerifiedIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Styled components for red theme
const RedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#dc2626',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '8px',
  padding: '10px 24px',
  '&:hover': {
    backgroundColor: '#b91c1c',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
  },
  '&:active': {
    backgroundColor: '#991b1b',
  },
}));

const RedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  fontWeight: '600',
  border: '1px solid #fecaca',
  '& .MuiChip-icon': {
    color: '#dc2626',
  },
}));

const WhiteCard = styled(Card)(({ theme, isdefault }) => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  border: isdefault === 'true' ? '2px solid #dc2626' : '1px solid #e5e7eb',
  boxShadow: isdefault === 'true' ? '0 4px 20px rgba(220, 38, 38, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.2)',
    borderColor: '#dc2626',
  },
}));

const RedDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: '#fecaca',
  margin: '16px 0',
}));

const AddressIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
}));

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    landmark: "",
    address_type: "home",
    is_default: false,
  });

  // Stepper state for new users
  const [activeStep, setActiveStep] = useState(0);

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/addresses", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAddresses(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses. Please try again.");
      
      if (err.response?.status === 401) {
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Open add address dialog
  const handleAddAddress = () => {
    setEditMode(false);
    setCurrentAddress(null);
    setActiveStep(0);
    setFormData({
      name: "",
      mobile: "",
      address_line: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      landmark: "",
      address_type: "home",
      is_default: false,
    });
    setOpenDialog(true);
  };

  // Open edit address dialog
  const handleEditAddress = (address) => {
    setEditMode(true);
    setCurrentAddress(address);
    setFormData({
      name: address.name,
      mobile: address.mobile,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || "India",
      landmark: address.landmark || "",
      address_type: address.address_type || "home",
      is_default: address.is_default || false,
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAddress(null);
    setActiveStep(0);
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = ["name", "mobile", "address_line", "city", "state", "pincode"];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        setError(`${field.replace('_', ' ')} is required`);
        return false;
      }
    }

    // Validate mobile number (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return false;
    }

    // Validate pincode (Indian format)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = getToken();
      let response;

      if (editMode && currentAddress) {
        // Update address
        response = await axios.put(
          `http://localhost:5000/api/addresses/${currentAddress._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSuccess("✓ Address updated successfully!");
      } else {
        // Create new address
        response = await axios.post(
          "http://localhost:5000/api/addresses",
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSuccess("✓ Address added successfully!");
      }

      if (response.data.success) {
        fetchAddresses();
        handleCloseDialog();
        
        // Dispatch event for header update
        window.dispatchEvent(new Event('addressUpdated'));
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err.response?.data?.message || "Failed to save address");
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = getToken();
      const response = await axios.delete(
        `http://localhost:5000/api/addresses/${addressId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess("✓ Address deleted successfully!");
        fetchAddresses();
        
        // Dispatch event for header update
        window.dispatchEvent(new Event('addressUpdated'));
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address");
    }
  };

  // Set address as default
  const handleSetDefault = async (addressId) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `http://localhost:5000/api/addresses/${addressId}/set-default`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess("✓ Default address updated!");
        fetchAddresses();
        
        // Dispatch event for header update
        window.dispatchEvent(new Event('addressUpdated'));
      }
    } catch (err) {
      console.error("Error setting default address:", err);
      setError("Failed to update default address");
    }
  };

  // Get address type icon
  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <HomeIcon />;
      case "work":
        return <WorkIcon />;
      default:
        return <OtherIcon />;
    }
  };

  // Get address type label
  const getAddressTypeLabel = (type) => {
    switch (type) {
      case "home":
        return "Home";
      case "work":
        return "Work";
      default:
        return "Other";
    }
  };

  // Get address type color
  const getAddressTypeColor = (type) => {
    switch (type) {
      case "home":
        return "#dc2626";
      case "work":
        return "#059669";
      default:
        return "#7c3aed";
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  // Handle step change
  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
          <CircularProgress sx={{ color: '#dc2626', mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your addresses...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header with gradient background */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
          borderRadius: '20px',
          p: { xs: 3, md: 4 },
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box position="absolute" top={-50} right={-50}>
          <LocationIcon sx={{ fontSize: 200, opacity: 0.1, transform: 'rotate(15deg)' }} />
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} flexDirection={{ xs: 'column', md: 'row' }} position="relative">
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              My Addresses
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your delivery addresses for faster checkout
            </Typography>
          </Box>
          
          <Fab
            variant="extended"
            onClick={handleAddAddress}
            sx={{
              mt: { xs: 2, md: 0 },
              bgcolor: 'white',
              color: '#dc2626',
              fontWeight: 'bold',
              px: 3,
              '&:hover': {
                bgcolor: '#fef2f2',
                transform: 'scale(1.05)',
              },
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add New Address
          </Fab>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #fecaca',
              bgcolor: 'white',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.1)',
                borderColor: '#dc2626',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Avatar sx={{ bgcolor: '#fee2e2', color: '#dc2626' }}>
                <LocationIcon />
              </Avatar>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="#dc2626">
              {addresses.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              Total Addresses
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #fecaca',
              bgcolor: 'white',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.1)',
                borderColor: '#dc2626',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Avatar sx={{ bgcolor: '#fee2e2', color: '#059669' }}>
                <StarIcon />
              </Avatar>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="#059669">
              {addresses.filter(a => a.is_default).length}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              Default Address
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #fecaca',
              bgcolor: 'white',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.1)',
                borderColor: '#dc2626',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Avatar sx={{ bgcolor: '#fee2e2', color: '#7c3aed' }}>
                <ShippingIcon />
              </Avatar>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="#7c3aed">
              {addresses.filter(a => a.is_active).length}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              Active Addresses
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #fecaca',
              bgcolor: 'white',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.1)',
                borderColor: '#dc2626',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Avatar sx={{ bgcolor: '#fee2e2', color: '#d97706' }}>
                <CheckCircleIcon />
              </Avatar>
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="#d97706">
              {addresses.length > 0 ? '100%' : '0%'}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              Setup Complete
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Address List */}
      {addresses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            bgcolor: 'white',
            borderRadius: '20px',
            border: '2px dashed #fecaca',
          }}
        >
          <AddLocationIcon sx={{ fontSize: 80, color: '#dc2626', mb: 3, opacity: 0.8 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
            No Addresses Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}>
            Add your first address to enjoy faster checkout and track your deliveries with ease.
          </Typography>
          <RedButton
            startIcon={<AddLocationIcon />}
            onClick={handleAddAddress}
            sx={{ px: 4, py: 1.5 }}
          >
            Add Your First Address
          </RedButton>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} lg={4} key={address._id}>
              <WhiteCard isdefault={address.is_default.toString()}>
                {address.is_default && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <VerifiedIcon sx={{ color: '#dc2626', fontSize: 20 }} />
                    <RedChip
                      label="Default"
                      size="small"
                      icon={<StarIcon />}
                    />
                  </Box>
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <AddressIcon sx={{ bgcolor: `${getAddressTypeColor(address.address_type)}15` }}>
                      {getAddressTypeIcon(address.address_type)}
                    </AddressIcon>
                    <Box ml={2}>
                      <Typography variant="h6" component="h2" fontWeight="bold">
                        {address.name}
                      </Typography>
                      <Chip
                        label={getAddressTypeLabel(address.address_type)}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: `${getAddressTypeColor(address.address_type)}15`,
                          color: getAddressTypeColor(address.address_type),
                          fontWeight: '600',
                          border: `1px solid ${getAddressTypeColor(address.address_type)}30`,
                        }}
                      />
                    </Box>
                  </Box>

                  <RedDivider />

                  <Box sx={{ color: 'text.secondary' }}>
                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <LocationIcon fontSize="small" sx={{ mr: 1.5, mt: 0.5, color: '#dc2626' }} />
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {address.address_line}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationIcon fontSize="small" sx={{ mr: 1.5, color: '#dc2626' }} />
                      <Typography variant="body2">
                        {address.city}, {address.state} - {address.pincode}
                      </Typography>
                    </Box>

                    {address.landmark && (
                      <Box display="flex" alignItems="center" mb={2}>
                        <PinDropIcon fontSize="small" sx={{ mr: 1.5, color: '#dc2626' }} />
                        <Typography variant="body2">
                          <strong>Landmark:</strong> {address.landmark}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" alignItems="center" mb={2}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1.5, color: '#dc2626' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {address.mobile}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <FlagIcon fontSize="small" sx={{ mr: 1.5, color: '#dc2626' }} />
                      <Typography variant="body2">
                        <strong>Country:</strong> {address.country}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Box>
                    {!address.is_default && (
                      <Button
                        size="small"
                        onClick={() => handleSetDefault(address._id)}
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          color: '#059669',
                          fontWeight: '600',
                          '&:hover': {
                            bgcolor: '#05966915',
                          },
                        }}
                      >
                        Set as Default
                      </Button>
                    )}
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditAddress(address)}
                      sx={{
                        bgcolor: '#3b82f615',
                        color: '#3b82f6',
                        '&:hover': {
                          bgcolor: '#3b82f6',
                          color: 'white',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAddress(address._id)}
                      sx={{
                        bgcolor: '#ef444415',
                        color: '#ef4444',
                        '&:hover': {
                          bgcolor: '#ef4444',
                          color: 'white',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </WhiteCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Add Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddAddress}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#dc2626',
          display: { xs: 'flex', md: 'none' },
          '&:hover': {
            bgcolor: '#b91c1c',
            transform: 'scale(1.1)',
          },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Address Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#dc2626',
            color: 'white',
            py: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            {editMode ? <EditLocationIcon /> : <AddLocationIcon />}
            <Typography variant="h5" fontWeight="bold">
              {editMode ? "Edit Address" : "Add New Address"}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4 }}>
          {!editMode && addresses.length === 0 && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Basic Info</StepLabel>
              </Step>
              <Step>
                <StepLabel>Address Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Confirmation</StepLabel>
              </Step>
            </Stepper>
          )}
          
          <Box component="form">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  size="small"
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Complete Address"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  size="small"
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  size="small"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Landmark (Optional)"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Address Type</InputLabel>
                  <Select
                    name="address_type"
                    value={formData.address_type}
                    onChange={handleInputChange}
                    label="Address Type"
                    sx={{ borderRadius: '10px' }}
                  >
                    <MenuItem value="home">
                      <Box display="flex" alignItems="center" gap={1}>
                        <HomeIcon fontSize="small" sx={{ color: '#dc2626' }} />
                        <span>Home</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="work">
                      <Box display="flex" alignItems="center" gap={1}>
                        <WorkIcon fontSize="small" sx={{ color: '#059669' }} />
                        <span>Work</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="other">
                      <Box display="flex" alignItems="center" gap={1}>
                        <OtherIcon fontSize="small" sx={{ color: '#7c3aed' }} />
                        <span>Other</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleInputChange}
                      sx={{
                        color: '#dc2626',
                        '&.Mui-checked': {
                          color: '#dc2626',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Set as Default Address
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{
              color: '#6b7280',
              fontWeight: '600',
              '&:hover': {
                bgcolor: '#f3f4f6',
              },
            }}
          >
            Cancel
          </Button>
          <RedButton 
            onClick={handleSubmit}
            startIcon={editMode ? <EditIcon /> : <AddIcon />}
            sx={{ px: 4 }}
          >
            {editMode ? "Update Address" : "Add Address"}
          </RedButton>
        </DialogActions>
      </Dialog>

      {/* Snackbars for notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ 
            width: '100%',
            bgcolor: '#fef2f2',
            color: '#dc2626',
            '& .MuiAlert-icon': {
              color: '#dc2626',
            },
            borderRadius: '12px',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            bgcolor: '#f0fdf4',
            color: '#059669',
            '& .MuiAlert-icon': {
              color: '#059669',
            },
            borderRadius: '12px',
            border: '1px solid #a7f3d0',
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Addresses;
