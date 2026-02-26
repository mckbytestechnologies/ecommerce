import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Paper,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  CheckCircle as VerifiedIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const ReviewList = ({ reviews, productId, user, onReviewUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const handleMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleLikeToggle = async (reviewId) => {
    try {
      const token = getToken();
      if (!token) {
        // Show login prompt
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/reviews/${reviewId}/like`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        onReviewUpdate();
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = getToken();
      const response = await axios.delete(
        `http://localhost:5000/api/reviews/${selectedReview._id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        onReviewUpdate();
        handleMenuClose();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'with-images' && (!review.images || review.images.length === 0)) return false;
    if (filter !== 'all' && filter !== 'with-images' && review.rating !== parseInt(filter)) return false;
    if (search && !review.comment.toLowerCase().includes(search.toLowerCase()) && 
        !review.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return (b.likes || 0) - (a.likes || 0);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      default: // recent
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const reviewsPerPage = 5;
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (reviews.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No reviews yet
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Be the first to share your thoughts about this product!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Review Summary */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight="bold" color="primary">
                {averageRating}
              </Typography>
              <Rating value={parseFloat(averageRating)} readOnly precision={0.1} />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <Box key={rating} display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    {rating} star{rating !== 1 ? 's' : ''}
                  </Typography>
                  <Box flex={1} ml={2} mr={2}>
                    <Box 
                      sx={{ 
                        height: 8, 
                        backgroundColor: 'grey.200', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: rating >= 4 ? 'success.main' : 
                                         rating >= 3 ? 'warning.main' : 'error.main',
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ minWidth: 40 }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Paper>

      {/* Filters and Search */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3} alignItems="center">
        <TextField
          size="small"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="all">All Reviews</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
            <MenuItem value="with-images">With Images</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="helpful">Most Helpful</MenuItem>
            <MenuItem value="rating-high">Highest Rating</MenuItem>
            <MenuItem value="rating-low">Lowest Rating</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reviews List */}
      <Box>
        {paginatedReviews.map((review) => (
          <Paper key={review._id} elevation={0} sx={{ p: 3, mb: 2, bgcolor: 'background.default' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={review.user?.avatar}>
                  {review.user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {review.user?.name || 'Anonymous'}
                    {review.user?.verified && (
                      <VerifiedIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Box>
              
              {user && user._id === review.user?._id && (
                <IconButton size="small" onClick={(e) => handleMenuClick(e, review)}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            {/* Rating and Title */}
            <Box mt={2} display="flex" alignItems="center" gap={2}>
              <Rating value={review.rating} readOnly size="small" />
              {review.title && (
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.title}
                </Typography>
              )}
            </Box>

            {/* Review Body */}
            <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
              {review.comment}
            </Typography>

            {/* Pros & Cons */}
            {(review.pros || review.cons) && (
              <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                {review.pros && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="success.main" fontWeight="bold">
                      PROS
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.pros}
                    </Typography>
                  </Grid>
                )}
                {review.cons && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="error" fontWeight="bold">
                      CONS
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.cons}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {review.images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 },
                    }}
                    onClick={() => window.open(img, '_blank')}
                  />
                ))}
              </Box>
            )}

            {/* Review Metadata */}
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Typography variant="caption" color="textSecondary">
                Product Usage: {getUsageLabel(review.productUsage)}
              </Typography>
              <Chip
                size="small"
                label={`${review.likes || 0} helpful`}
                icon={<ThumbUpIcon />}
                onClick={() => handleLikeToggle(review._id)}
                variant={review.userLiked ? 'filled' : 'outlined'}
                color={review.userLiked ? 'primary' : 'default'}
              />
            </Box>

            <Divider sx={{ mt: 2 }} />
          </Paper>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Edit/Delete Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          // Open edit modal (you'll need to pass a function from parent)
          handleMenuClose();
        }}>
          Edit Review
        </MenuItem>
        <MenuItem onClick={handleDeleteReview} sx={{ color: 'error.main' }}>
          Delete Review
        </MenuItem>
      </Menu>
    </Box>
  );
};

const getUsageLabel = (usage) => {
  const labels = {
    'less-than-month': 'Less than a month',
    '1-6-months': '1-6 months',
    '6-12-months': '6-12 months',
    '1-2-years': '1-2 years',
    'more-than-2-years': 'More than 2 years',
  };
  return labels[usage] || usage;
};

export default ReviewList;