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
} from "@mui/icons-material";
import axios from "axios";


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

      const response = await axios.get("https://ecommerce-server-fhna.onrender.com/api/addresses", {
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
          `https://ecommerce-server-fhna.onrender.com/api/addresses/${currentAddress._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSuccess("Address updated successfully!");
      } else {
        // Create new address
        response = await axios.post(
          "https://ecommerce-server-fhna.onrender.com/api/addresses",
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSuccess("Address added successfully!");
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
        `https://ecommerce-server-fhna.onrender.com/api/addresses/${addressId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess("Address deleted successfully!");
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
        `https://ecommerce-server-fhna.onrender.com/api/addresses/${addressId}/set-default`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess("Default address updated!");
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
        return <HomeIcon color="primary" />;
      case "work":
        return <WorkIcon color="secondary" />;
      default:
        return <OtherIcon color="action" />;
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

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            My Addresses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your delivery addresses
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          sx={{ borderRadius: 2 }}
        >
          Add New Address
        </Button>
      </Box>

      {/* Stats */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="primary" fontWeight="bold">
                {addresses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Addresses
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="secondary" fontWeight="bold">
                {addresses.filter(a => a.is_default).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Default Address
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {addresses.filter(a => a.is_active).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Addresses
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Address List */}
      {addresses.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2 }}>
          <LocationIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            No addresses saved
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add your first address for faster checkout
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAddress}
            sx={{ mt: 2 }}
          >
            Add Your First Address
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} key={address._id}>
              <Card 
                elevation={address.is_default ? 2 : 0} 
                sx={{ 
                  height: '100%',
                  border: address.is_default ? 2 : 1,
                  borderColor: address.is_default ? 'primary.main' : 'divider',
                  position: 'relative',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                {address.is_default && (
                  <Chip
                    icon={<StarIcon />}
                    label="Default"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 12, right: 12 }}
                  />
                )}
                
                <CardContent>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    {getAddressTypeIcon(address.address_type)}
                    <Box ml={2} flex={1}>
                      <Typography variant="h6" component="h2">
                        {address.name}
                      </Typography>
                      <Chip
                        label={getAddressTypeLabel(address.address_type)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ color: 'text.secondary' }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {address.address_line}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon fontSize="small" sx={{ mr: 1 }} />

                      <Typography variant="body2">
                        {address.city}, {address.state} - {address.pincode}
                      </Typography>
                    </Box>

                    {address.landmark && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <PinDropIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Landmark: {address.landmark}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {address.mobile}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <FlagIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {address.country}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                  <Box>
                    {!address.is_default && (
                      <Button
                        size="small"
                        onClick={() => handleSetDefault(address._id)}
                        startIcon={<CheckCircleIcon />}
                      >
                        Set as Default
                      </Button>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditAddress(address)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAddress(address._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  size="small"
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={2}
                  size="small"
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
                  >
                    <MenuItem value="home">
                      <HomeIcon fontSize="small" sx={{ mr: 1 }} />
                      Home
                    </MenuItem>
                    <MenuItem value="work">
                      <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                      Work
                    </MenuItem>
                    <MenuItem value="other">
                      <OtherIcon fontSize="small" sx={{ mr: 1 }} />
                      Other
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
                      color="primary"
                    />
                  }
                  label="Set as Default Address"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            startIcon={editMode ? <EditIcon /> : <AddIcon />}
          >
            {editMode ? "Update Address" : "Add Address"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars for notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Addresses;