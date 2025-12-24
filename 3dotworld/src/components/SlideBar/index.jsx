import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Button,
  Divider,
  Collapse,
  Chip,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  FilterList,
  ClearAll,
  Search,
  AttachMoney,
  Star,
  Inventory,
  Category,
  Close,
  CheckCircle,
  Circle,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const FilterSection = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  marginBottom: '16px',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)',
  padding: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '2px solid #ffebee',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ffe5e5 0%, #ffd5d5 100%)',
  },
}));

const RedButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #D32F2F 30%, #B71C1C 90%)',
  color: 'white',
  fontWeight: 'bold',
  padding: '8px 20px',
  borderRadius: '8px',
  boxShadow: '0 3px 10px rgba(211, 47, 47, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #B71C1C 30%, #D32F2F 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(211, 47, 47, 0.3)',
  },
}));

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  margin: '4px',
  borderRadius: '20px',
  border: selected ? '2px solid #D32F2F' : '1px solid #e0e0e0',
  background: selected ? '#FFF5F5' : 'white',
  color: selected ? '#D32F2F' : '#666',
  fontWeight: selected ? '600' : '400',
  '&:hover': {
    borderColor: '#D32F2F',
    background: '#FFF5F5',
  },
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

const PriceInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D32F2F',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D32F2F',
      borderWidth: '2px',
    },
  },
}));

const SlideBar = ({ 
  filters = {}, 
  onFilterChange = () => {}, 
  categories = [],
  onResetFilters = () => {},
  onSearchChange = () => {}
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    availability: true,
    rating: true,
    search: true,
  });

  const [priceInputs, setPriceInputs] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || '',
  });

  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const ratings = [
    { value: 4, label: '4 ★ & above', icon: <Star sx={{ color: '#FFD700' }} /> },
    { value: 3, label: '3 ★ & above', icon: <Star sx={{ color: '#FFA500' }} /> },
    { value: 2, label: '2 ★ & above', icon: <Star sx={{ color: '#FF8C00' }} /> },
    { value: 1, label: '1 ★ & above', icon: <Star sx={{ color: '#FF6347' }} /> },
  ];

  // Update price inputs when filters change
  useEffect(() => {
    setPriceInputs({
      min: filters.minPrice || '',
      max: filters.maxPrice || '',
    });
    setSearchQuery(filters.search || '');
  }, [filters]);

  const handlePriceInputChange = (type, value) => {
    setPriceInputs(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handlePriceApply = () => {
    onFilterChange('minPrice', priceInputs.min);
    onFilterChange('maxPrice', priceInputs.max);
  };

  const handlePriceClear = () => {
    setPriceInputs({ min: '', max: '' });
    onFilterChange('minPrice', '');
    onFilterChange('maxPrice', '');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onFilterChange('search', searchQuery);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    onFilterChange('search', '');
  };

  const handleCategoryChange = (category) => {
    onFilterChange('category', category === filters.category ? '' : category);
  };

  const handleRatingChange = (rating) => {
    onFilterChange('minRating', rating === filters.minRating ? '' : rating);
  };

  const handleAvailabilityChange = (event) => {
    onFilterChange('inStock', event.target.value);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key] && filters[key] !== '' && key !== 'search'
  ).length;

  return (
    <Box sx={{ 
      bgcolor: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>
        {activeFilterCount > 0 && (
          <IconButton 
            onClick={onResetFilters}
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
            }}
            size="small"
          >
            <ClearAll />
          </IconButton>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Search Section */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('search')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search sx={{ color: '#D32F2F' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#333' }}>
                Search Products
              </Typography>
            </Box>
            {expandedSections.search ? <ExpandLess /> : <ExpandMore />}
          </SectionHeader>
          
          <Collapse in={expandedSections.search}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name or keyword..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      pr: 6,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D32F2F',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={handleSearchClear}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999',
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearchSubmit}
                sx={{
                  mt: 2,
                  background: '#D32F2F',
                  '&:hover': { background: '#B71C1C' },
                  borderRadius: '8px',
                }}
              >
                Search
              </Button>
            </Box>
          </Collapse>
        </FilterSection>

        {/* Categories Section */}
        {categories.length > 0 && (
          <FilterSection>
            <SectionHeader onClick={() => toggleSection('categories')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category sx={{ color: '#D32F2F' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#333' }}>
                  Categories
                </Typography>
              </Box>
              {expandedSections.categories ? <ExpandLess /> : <ExpandMore />}
            </SectionHeader>
            
            <Collapse in={expandedSections.categories}>
              <Box sx={{ p: 2 }}>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <CategoryChip
                    label="All Categories"
                    onClick={() => handleCategoryChange('')}
                    selected={!filters.category}
                    icon={!filters.category ? <CheckCircle sx={{ color: '#D32F2F', fontSize: 16 }} /> : <Circle sx={{ fontSize: 16 }} />}
                  />
                  {categories.map((category) => (
                    <CategoryChip
                      key={category}
                      label={category}
                      onClick={() => handleCategoryChange(category)}
                      selected={filters.category === category}
                      icon={filters.category === category ? <CheckCircle sx={{ color: '#D32F2F', fontSize: 16 }} /> : <Circle sx={{ fontSize: 16 }} />}
                    />
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </FilterSection>
        )}

        {/* Price Range Section */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('price')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ color: '#D32F2F' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#333' }}>
                Price Range
              </Typography>
            </Box>
            {expandedSections.price ? <ExpandLess /> : <ExpandMore />}
          </SectionHeader>
          
          <Collapse in={expandedSections.price}>
            <Box sx={{ p: 3 }}>
              <Slider
                value={[parseInt(priceInputs.min) || 0, parseInt(priceInputs.max) || 100000]}
                onChange={(e, newValue) => {
                  setPriceInputs({
                    min: newValue[0],
                    max: newValue[1],
                  });
                }}
                onChangeCommitted={handlePriceApply}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
                valueLabelFormat={formatPrice}
                sx={{ 
                  color: '#D32F2F',
                  height: 6,
                  '& .MuiSlider-thumb': {
                    height: 20,
                    width: 20,
                    backgroundColor: '#fff',
                    border: '2px solid #D32F2F',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(211, 47, 47, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <PriceInput
                  size="small"
                  fullWidth
                  label="Min Price"
                  value={priceInputs.min}
                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
                <PriceInput
                  size="small"
                  fullWidth
                  label="Max Price"
                  value={priceInputs.max}
                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePriceApply}
                  sx={{
                    background: '#D32F2F',
                    '&:hover': { background: '#B71C1C' },
                    borderRadius: '8px',
                  }}
                >
                  Apply Price
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handlePriceClear}
                  sx={{
                    borderColor: '#D32F2F',
                    color: '#D32F2F',
                    '&:hover': { borderColor: '#B71C1C', background: '#FFF5F5' },
                    borderRadius: '8px',
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Collapse>
        </FilterSection>

        {/* Availability Section */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('availability')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory sx={{ color: '#D32F2F' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#333' }}>
                Availability
              </Typography>
            </Box>
            {expandedSections.availability ? <ExpandLess /> : <ExpandMore />}
          </SectionHeader>
          
          <Collapse in={expandedSections.availability}>
            <Box sx={{ p: 2 }}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={filters.inStock || ''}
                  onChange={handleAvailabilityChange}
                >
                  <FormControlLabel
                    value=""
                    control={
                      <Radio 
                        size="small" 
                        sx={{ 
                          color: '#D32F2F',
                          '&.Mui-checked': { color: '#D32F2F' }
                        }} 
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: filters.inStock === '' ? 600 : 400 }}>
                        All Products
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="true"
                    control={
                      <Radio 
                        size="small" 
                        sx={{ 
                          color: '#D32F2F',
                          '&.Mui-checked': { color: '#D32F2F' }
                        }} 
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: filters.inStock === 'true' ? 600 : 400 }}>
                        In Stock Only
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Collapse>
        </FilterSection>

        {/* Ratings Section */}
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('rating')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: '#FFD700' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#333' }}>
                Customer Rating
              </Typography>
            </Box>
            {expandedSections.rating ? <ExpandLess /> : <ExpandMore />}
          </SectionHeader>
          
          <Collapse in={expandedSections.rating}>
            <Box sx={{ p: 2 }}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!filters.minRating}
                      onChange={() => handleRatingChange('')}
                      sx={{ 
                        color: '#D32F2F',
                        '&.Mui-checked': { color: '#D32F2F' }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: !filters.minRating ? 600 : 400 }}>
                      All Ratings
                    </Typography>
                  }
                />
                {ratings.map((rating) => (
                  <FormControlLabel
                    key={rating.value}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.minRating === rating.value}
                        onChange={() => handleRatingChange(rating.value)}
                        sx={{ 
                          color: '#D32F2F',
                          '&.Mui-checked': { color: '#D32F2F' }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {rating.icon}
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: filters.minRating === rating.value ? 600 : 400 }}>
                          {rating.label}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </Stack>
            </Box>
          </Collapse>
        </FilterSection>

        {/* Active Filters */}
        {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.minRating) && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#FFF5F5', borderRadius: '8px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#D32F2F', mb: 1 }}>
              Active Filters
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => handleCategoryChange('')}
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    color: '#D32F2F',
                    border: '1px solid #D32F2F',
                    '& .MuiChip-deleteIcon': { color: '#D32F2F' }
                  }}
                />
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Chip
                  label={`Price: ${filters.minPrice ? `₹${filters.minPrice}` : ''}${filters.minPrice && filters.maxPrice ? ' - ' : ''}${filters.maxPrice ? `₹${filters.maxPrice}` : ''}`}
                  onDelete={handlePriceClear}
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    color: '#D32F2F',
                    border: '1px solid #D32F2F',
                    '& .MuiChip-deleteIcon': { color: '#D32F2F' }
                  }}
                />
              )}
              {filters.inStock && (
                <Chip
                  label="In Stock Only"
                  onDelete={() => handleAvailabilityChange({ target: { value: '' } })}
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    color: '#D32F2F',
                    border: '1px solid #D32F2F',
                    '& .MuiChip-deleteIcon': { color: '#D32F2F' }
                  }}
                />
              )}
              {filters.minRating && (
                <Chip
                  label={`${filters.minRating} ★ & above`}
                  onDelete={() => handleRatingChange('')}
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    color: '#D32F2F',
                    border: '1px solid #D32F2F',
                    '& .MuiChip-deleteIcon': { color: '#D32F2F' }
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Reset All Button */}
        {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.minRating || filters.search) && (
          <Box sx={{ mt: 2 }}>
            <RedButton
              fullWidth
              startIcon={<ClearAll />}
              onClick={onResetFilters}
              sx={{
                borderRadius: '8px',
                fontSize: '0.875rem',
              }}
            >
              Reset All Filters
            </RedButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SlideBar;