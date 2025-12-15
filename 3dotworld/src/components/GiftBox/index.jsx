import React, { useState, useEffect } from "react";
import { FaGift, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./GiftBox.css";

const GiftBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [email, setEmail] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);

  // Check localStorage on component mount
  useEffect(() => {
    const hasPlayedToday = localStorage.getItem("giftBoxPlayed");
    const hideGiftBox = localStorage.getItem("hideGiftBox");
    
    if (hasPlayedToday === "true") {
      setHasPlayed(true);
    }
    
    if (hideGiftBox === "true") {
      return;
    }
  }, []);

  // Show gift box after 3 seconds of page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const spinWheel = () => {
    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    if (hasPlayed) {
      alert("You can spin the wheel only once!");
      return;
    }

    setSpinning(true);
    setShowPrize(false);

    const finalAngle = Math.floor(Math.random() * 360); 
    const fullSpins = 360 * 5; 
    const newRotation = fullSpins + finalAngle; 
    
    setWheelRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      
      const normalizedAngle = (newRotation % 360);
      const segmentIndex = Math.floor((360 - (normalizedAngle % 360)) / 45) % 8;

      const prizesMap = [
        "20% OFF!",
        "5% OFF!",
        "No Luck!",
        "10% OFF!",
        "Almost There!",
        "Next time!",
        "20% OFF!",
        "Almost There!",
      ];
      
      const winningPrize = prizesMap[segmentIndex];
      setPrize(winningPrize);
      setShowPrize(true);
      
      localStorage.setItem("giftBoxPlayed", "true");
      setHasPlayed(true);
      
    }, 3000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClosePermanently = () => {
    setIsOpen(false);
    setIsVisible(false);
    localStorage.setItem("hideGiftBox", "true");
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Reset prize display when opening
    setShowPrize(false);
  };

  return (
    <>
      {/* Floating Gift Button - Left Side */}
      {isVisible && (
        <motion.div
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          className="gift-box-float"
        >
          <div className="gift-icon-container">
            <FaGift className="gift-icon" />
            <div className="gift-pulse"></div>
            
          </div>
          {/* <div className="gift-tooltip">Spin & Win!</div> */}
        </motion.div>
      )}

      {/* Modal Popup - Slides in from LEFT */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gift-overlay"
              onClick={handleClose}
            />
            
            {/* Modal Content - Comes from LEFT to RIGHT */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 100
              }}
              className="gift-modal"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="gift-close-btn"
              >
                <FaTimes />
              </button>

              {/* Main Content Container */}
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
                    {/* The Wheel */}
                    <div 
                      className="wheel"
                      style={{ 
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: spinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
                      }}
                    >
                      {/* 8 Segments */}
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i}
                          className={`wheel-segment segment-${i}`} 
                          style={{ transform: `rotate(${i * 45}deg)` }}
                        >
                          <div className="segment-content">
                            <span className="segment-text">
                              {["10% OFF", "NO LUCK", "5% OFF", "NEXT TIME", 
                                "20% OFF", "ALMOST", "10% OFF", "ALMOST"][i]}
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* Center Circle */}
                      <div className="wheel-center">
                        <div className="wheel-center-text">SPIN<br/>&<br/>WIN</div>
                      </div>
                    </div>
                    {/* The Pointer Pin */}
                    <div className="wheel-pointer">
                      <div className="pointer-arrow"></div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Form */}
                <div className="modal-right-panel">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Header */}
                    <div className="gift-header">
                      
                      <h1 className="gift-title">TRY YOUR LUCK!</h1>
                      <p className="gift-subtitle">Spin the wheel & win exciting discounts</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-container">
                      <p className="progress-text">🎯 75% offers claimed. Hurry up!</p>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="gift-terms">
                      <p className="main-pitch">
                        🎉 <strong>BIG DISCOUNTS</strong> waiting for you!
                      </p>
                      <div className="terms-list">
                        <p><span className="tick">✓</span> Spin only once per user</p>
                        <p><span className="tick">✓</span> Coupon valid for 1 hour</p>
                        <p><span className="tick">✓</span> Instant win confirmation</p>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="email-input-container">
                      <div className="input-icon">✉️</div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="email-input"
                        placeholder="you@example.com"
                        disabled={spinning || hasPlayed}
                      />
                      <div className="input-hint">We'll send your prize here</div>
                    </div>

                    {/* Spin Button */}
                    <motion.button
                      onClick={spinWheel}
                      disabled={spinning || hasPlayed || !email.trim()}
                      className="spin-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {spinning ? (
                        <span className="spinning-text">
                          <span className="spinner"></span> SPINNING...
                        </span>
                      ) : hasPlayed ? '🎯 ALREADY PLAYED' : '🎰 SPIN THE WHEEL!'}
                    </motion.button>

                    {/* Skip Options */}
                    <div className="skip-options">
                      <button onClick={handleClose} className="skip-btn">
                        Maybe later
                      </button>
                      <button onClick={handleClosePermanently} className="permanent-close-btn">
                        Don't show again
                      </button>
                    </div>
                  </motion.div>

                  {/* Prize Display - Animated Entry */}
                  {showPrize && prize && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                      className="prize-display"
                    >
                      <div className="confetti"></div>
                      <div className="prize-content">
                        <h3>🎉 CONGRATULATIONS! 🎉</h3>
                        <div className="prize-amount">{prize}</div>
                        <p className="prize-message">
                          Your discount code has been sent to <strong>{email}</strong>
                        </p>
                        <button onClick={handleClose} className="close-prize-btn">
                          CLAIM MY PRIZE
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