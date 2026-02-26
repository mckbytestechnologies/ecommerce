import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  IconButton,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ReviewForm = ({ productId, open, onClose, onReviewSubmit, editMode, reviewToEdit }) => {
  const [formData, setFormData] = useState({
    rating: editMode ? reviewToEdit?.rating || 5 : 5,
    title: editMode ? reviewToEdit?.title || '' : '',
    comment: editMode ? reviewToEdit?.comment || '' : '',
    pros: editMode ? reviewToEdit?.pros || '' : '',
    cons: editMode ? reviewToEdit?.cons || '' : '',
    productUsage: editMode ? reviewToEdit?.productUsage || 'less-than-month' : 'less-than-month',
  });
  
  const [images, setImages] = useState(editMode ? reviewToEdit?.images || [] : []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/api/upload/review', formData, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.url;
      } catch (err) {
        console.error('Upload failed:', err);
        return null;
      }
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
    setImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.rating || formData.rating < 1) {
      setError('Please select a rating');
      return false;
    }
    if (!formData.comment.trim()) {
      setError('Review comment is required');
      return false;
    }
    if (formData.comment.length < 10) {
      setError('Review must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const token = getToken();
      const endpoint = editMode 
        ? `http://localhost:5000/api/reviews/${reviewToEdit._id}`
        : 'http://localhost:5000/api/reviews';
      
      const method = editMode ? 'put' : 'post';
      
      const response = await axios[method](endpoint, {
        productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        pros: formData.pros,
        cons: formData.cons,
        productUsage: formData.productUsage,
        images,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        onReviewSubmit();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {editMode ? 'Edit Review' : 'Write a Review'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
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
            onChange={(_, value) => setFormData(prev => ({ ...prev, rating: value }))}
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
            style={{ display: 'none' }}
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
              {uploading ? 'Uploading...' : 'Add Photos'}
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
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'white' },
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
          {loading ? 'Submitting...' : editMode ? 'Update Review' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;