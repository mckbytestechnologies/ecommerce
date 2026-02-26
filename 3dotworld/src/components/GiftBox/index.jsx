import React, { useState, useEffect } from "react";
import { FaGift, FaTimes, FaCopy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./GiftBox.css";

const GiftBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [email, setEmail] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [prizeCoupon, setPrizeCoupon] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [wheelSegments, setWheelSegments] = useState([]);
  const [finalSegmentIndex, setFinalSegmentIndex] = useState(null);

  // Fetch available coupons from backend
  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://server-kzwj.onrender.com/api/coupons/active');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Active coupons response:', data);
        
        // Handle the response structure
        let coupons = [];
        if (data.data && Array.isArray(data.data)) {
          coupons = data.data;
        } else if (Array.isArray(data)) {
          coupons = data;
        }
        
        // Filter only percentage discount coupons for the wheel
        const validCoupons = coupons.filter(coupon => 
          coupon.discount_type === 'percentage' && 
          coupon.is_active !== false
        );
        
        setAvailableCoupons(validCoupons);
        
        // Generate wheel segments after getting coupons
        if (validCoupons.length > 0) {
          generateWheelSegments(validCoupons);
        }
      } else {
        console.error('Failed to fetch coupons');
        setError('Failed to load coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Generate wheel segments - exactly 6 segments for 6 coupons
  const generateWheelSegments = (coupons) => {
    if (!coupons || coupons.length === 0) return;

    // Create exactly 6 segments (one for each coupon)
    const segments = coupons.slice(0, 6).map(coupon => ({
      text: `${coupon.discount_value}% OFF`,
      coupon: coupon,
      isWinner: true
    }));

    console.log('Generated 6 wheel segments:', segments);
    setWheelSegments(segments);
  };

  // Check localStorage on mount
  useEffect(() => {
    const hasPlayedToday = localStorage.getItem("giftBoxPlayed");
    const hideGiftBox = localStorage.getItem("hideGiftBox");
    const playedDate = localStorage.getItem("giftBoxPlayedDate");
    const today = new Date().toDateString();
    
    console.log('LocalStorage check:', { hasPlayedToday, playedDate, today });
    
    // Check if played today
    if (hasPlayedToday === "true" && playedDate === today) {
      console.log('User has already played today');
      setHasPlayed(true);
      
      // Restore prize if available
      const savedPrize = localStorage.getItem("giftBoxPrize");
      if (savedPrize) {
        try {
          const parsed = JSON.parse(savedPrize);
          setPrize(parsed.segment);
          setPrizeCoupon(parsed.coupon);
          setEmail(parsed.email || "");
          setFinalSegmentIndex(parsed.segmentIndex);
          
          // Calculate wheel rotation based on saved segment
          if (parsed.segmentIndex !== undefined) {
            const segmentAngle = 360 / 6;
            const targetRotation = (360 - (parsed.segmentIndex * segmentAngle) - (segmentAngle / 2) + 360) % 360;
            setWheelRotation(targetRotation);
          }
        } catch (e) {
          console.error('Error parsing saved prize:', e);
        }
      }
    } else if (hasPlayedToday === "true" && playedDate !== today) {
      // Reset if it's a new day
      console.log('Resetting for new day');
      localStorage.removeItem("giftBoxPlayed");
      localStorage.removeItem("giftBoxPlayedDate");
      localStorage.removeItem("giftBoxPrize");
      setHasPlayed(false);
      setWheelRotation(0);
      setPrize(null);
      setPrizeCoupon(null);
      setShowPrize(false);
    } else {
      console.log('User has not played today');
      setHasPlayed(false);
      setWheelRotation(0);
    }
    
    if (hideGiftBox === "true") {
      setIsVisible(false);
    }
    
    // Fetch available coupons
    fetchAvailableCoupons();
  }, []);

  // Show gift box after 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show if not permanently hidden
      if (localStorage.getItem("hideGiftBox") !== "true") {
        setIsVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Spin Wheel
  const spinWheel = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    if (hasPlayed) {
      alert("You can spin only once per day!");
      return;
    }
    if (wheelSegments.length === 0 || availableCoupons.length === 0) {
      alert("No coupons available at the moment. Please try again later!");
      return;
    }

    setSpinning(true);
    setShowPrize(false);
    setError(null);
    setPrize(null);
    setPrizeCoupon(null);

    const segmentAngle = 360 / wheelSegments.length; // 60 degrees for 6 segments
    
    // Randomly select a winning segment
    const segmentIndex = Math.floor(Math.random() * wheelSegments.length);
    setFinalSegmentIndex(segmentIndex);
    
    // Calculate rotation to make the selected segment land at the pointer
    const targetSegmentCenter = (segmentIndex * segmentAngle) + (segmentAngle / 2);
    const targetRotation = (360 - targetSegmentCenter) % 360;
    
    // Add multiple full rotations for spinning effect (5-8 random rotations)
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 4));
    const newRotation = fullSpins + targetRotation;

    setWheelRotation(newRotation);

    const selectedSegment = wheelSegments[segmentIndex];
    
    setTimeout(() => {
      setSpinning(false);
      
      // Always a winner since all segments are coupons
      setPrize(selectedSegment.text);
      setPrizeCoupon(selectedSegment.coupon);
      setShowPrize(true);
      setHasPlayed(true);
      
      // Save to localStorage
      const today = new Date().toDateString();
      localStorage.setItem("giftBoxPlayed", "true");
      localStorage.setItem("giftBoxPlayedDate", today);
      localStorage.setItem("giftBoxPrize", JSON.stringify({
        segment: selectedSegment.text,
        coupon: selectedSegment.coupon,
        email: email,
        segmentIndex: segmentIndex
      }));
      
      // Send email with coupon
      sendCouponEmail(email, selectedSegment.coupon);
    }, 3000);
  };

  // Send coupon email
  const sendCouponEmail = async (email, coupon) => {
    try {
      // You can implement this endpoint later
      console.log('Sending email:', { email, coupon });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClose = () => setIsOpen(false);
  
  const handleClosePermanently = () => {
    setIsOpen(false);
    setIsVisible(false);
    localStorage.setItem("hideGiftBox", "true");
  };
  
  const handleOpen = () => {
    setIsOpen(true);
    setShowPrize(false);
    
    // Check if user has already played today before opening
    const hasPlayedToday = localStorage.getItem("giftBoxPlayed");
    const playedDate = localStorage.getItem("giftBoxPlayedDate");
    const today = new Date().toDateString();
    
    if (hasPlayedToday === "true" && playedDate === today) {
      setHasPlayed(true);
      // Restore prize view
      const savedPrize = localStorage.getItem("giftBoxPrize");
      if (savedPrize) {
        try {
          const parsed = JSON.parse(savedPrize);
          setPrize(parsed.segment);
          setPrizeCoupon(parsed.coupon);
          setEmail(parsed.email || "");
          setShowPrize(true);
        } catch (e) {
          console.error('Error parsing saved prize:', e);
        }
      }
    } else {
      setHasPlayed(false);
      setWheelRotation(0);
      setShowPrize(false);
      setPrize(null);
      setPrizeCoupon(null);
    }
    
    // Refresh coupons when opening
    fetchAvailableCoupons();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const segmentAngle = wheelSegments.length > 0 ? 360 / wheelSegments.length : 60;

  // Generate vibrant colors for segments
  const segmentColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFD93D', // Yellow
    '#6C5CE7', // Purple
    '#FF8C42', // Orange
    '#A8E6CF'  // Mint
  ];

  // Calculate max discount for display
  const maxDiscount = availableCoupons.length > 0 
    ? Math.max(...availableCoupons.map(c => c.discount_value)) 
    : 0;

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          className="gift-box-float"
        >
          <div className="gift-icon-container">
            <FaGift className="gift-icon" />
            <div className="gift-pulse"></div>
            {availableCoupons.length > 0 && (
              <span className="gift-badge">{availableCoupons.length}</span>
            )}
          </div>
          <div className="gift-tooltip">🎁 {availableCoupons.length} Gifts Waiting!</div>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gift-overlay"
              onClick={handleClose}
            />

            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="gift-modal"
            >
              <button onClick={handleClose} className="gift-close-btn">
                <FaTimes />
              </button>

              <div className="gift-modal-content">
                {/* Left Panel - Wheel */}
                <div className="modal-left-panel">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="wheel-decoration"
                  />
                  <div className="wheel-container">
                    <div
                      className="wheel"
                      style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: spinning ? "transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)" : "none"
                      }}
                    >
                      {wheelSegments.map((seg, i) => (
                        <div
                          key={i}
                          className="wheel-segment winning-segment"
                          style={{ 
                            transform: `rotate(${i * segmentAngle}deg)`,
                            background: segmentColors[i % segmentColors.length]
                          }}
                        >
                         
                        </div>
                      ))}
                      <div className="wheel-center">
                        <div className="wheel-center-text">SPIN<br/>&<br/>WIN</div>
                      </div>
                    </div>
                    <div className="wheel-pointer">
                      <div className="pointer-arrow"></div>
                    </div>
                  </div>
                  
                </div>

                {/* Right Panel */}
                <div className="modal-right-panel">
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <p>Loading amazing offers...</p>
                    </div>
                  ) : !showPrize ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.3 }}
                    >
                      <div className="gift-header">
                        <h1 className="gift-title">TRY YOUR LUCK!</h1>
                        <p className="gift-subtitle">
                          {availableCoupons.length > 0 
                            ? `Spin & win up to ${maxDiscount}% OFF`
                            : 'No coupons available'}
                        </p>
                      </div>

                      <div className="progress-bar-container">
                        <div className="progress-text">
                          <span>✨ {availableCoupons.length} prizes waiting</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${(availableCoupons.length / 6) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="gift-terms">
                        <p className="main-pitch">🎁 Everyone's a Winner!</p>
                        <div className="terms-list">
                          <p><span className="tick">✓</span> 100% winning chance</p>
                          <p><span className="tick">✓</span> Instant discount code</p>
                          <p><span className="tick">✓</span> Valid for 30 days</p>
                        </div>
                      </div>

                      <div className="email-input-container">
                        <div className="input-icon">✉️</div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="email-input"
                          placeholder="Enter your email"
                          disabled={spinning || hasPlayed || availableCoupons.length === 0}
                        />
                        <div className="input-hint">We'll send your coupon code here</div>
                      </div>

                      <motion.button
                        onClick={spinWheel}
                        disabled={spinning || hasPlayed || !email.trim() || availableCoupons.length === 0}
                        className="spin-button"
                      >
                        {spinning ? (
                          <span className="spinning-text">
                            <span className="spinner"></span> SPINNING...
                          </span>
                        ) : hasPlayed ? (
                          '🎯 YOU ALREADY PLAYED TODAY'
                        ) : availableCoupons.length === 0 ? (
                          '⏰ NO COUPONS AVAILABLE'
                        ) : (
                          '🎰 SPIN THE WHEEL!'
                        )}
                      </motion.button>

                      {/* Show available coupons preview */}
                      {availableCoupons.length > 0 && !hasPlayed && (
                        <div className="coupon-preview">
                          <p className="preview-title">🎁 Prizes on the wheel:</p>
                          <div className="preview-badges">
                            {availableCoupons.map((coupon, idx) => (
                              <span key={idx} className="coupon-badge" style={{background: segmentColors[idx % segmentColors.length]}}>
                                {coupon.discount_value}% OFF
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="skip-options">
                        <button onClick={handleClose} className="skip-btn">Maybe later</button>
                        <button onClick={handleClosePermanently} className="permanent-close-btn">Don't show again</button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Show prize after spin */
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                      className="prize-display"
                    >
                    <div className="coetti"></div>
                      <div className="prize-content">
                        <h3>🎉 CONGRATULATIONS! 🎉</h3>
                        
                        <div className="prize-amount">
                          {prize}
                        </div>
                        
                        {prizeCoupon && (
                          <>
                            <div className="coupon-code-display">
                              <span className="coupon-label">YOUR COUPON CODE:</span>
                              <div className="coupon-code-box">
                                <strong>{prizeCoupon.code}</strong>
                                <button 
                                  className={`copy-code-btn ${copiedCode === prizeCoupon.code ? 'copied' : ''}`}
                                  onClick={() => handleCopyCode(prizeCoupon.code)}
                                >
                                  <FaCopy /> {copiedCode === prizeCoupon.code ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            
                            {prizeCoupon.description && (
                              <p className="coupon-description">{prizeCoupon.description}</p>
                            )}
                            
                            <div className="coupon-meta">
                              {prizeCoupon.min_order_amount > 0 && (
                                <span>Min. Order: ₹{prizeCoupon.min_order_amount}</span>
                              )}
                              <span>Valid till: {formatDate(prizeCoupon.end_date)}</span>
                            </div>
                            
                            <p className="email-note">Code sent to <strong>{email}</strong></p>
                          </>
                        )}
                        
                        <button onClick={handleClose} className="close-prize-btn">
                          🎁 CLAIM & SHOP NOW
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GiftBox;