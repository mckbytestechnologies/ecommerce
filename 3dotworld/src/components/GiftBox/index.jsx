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

  const segments = [
    "10% OFF", "NO LUCK", "5% OFF", "NEXT TIME",
    "20% OFF", "ALMOST", "10% OFF", "ALMOST"
  ];

  // Check localStorage on mount
  useEffect(() => {
    const hasPlayedToday = localStorage.getItem("giftBoxPlayed");
    const hideGiftBox = localStorage.getItem("hideGiftBox");
    if (hasPlayedToday === "true") setHasPlayed(true);
    if (hideGiftBox === "true") setIsVisible(false);
  }, []);

  // Show gift box after 3s
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Spin Wheel
  const spinWheel = () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    if (hasPlayed) {
      alert("You can spin only once!");
      return;
    }

    setSpinning(true);
    setShowPrize(false);

    const segmentAngle = 360 / segments.length; // 45°
    const segmentIndex = Math.floor(Math.random() * segments.length);
    const randomOffset = Math.random() * segmentAngle;
    const finalAngle = segmentIndex * segmentAngle + randomOffset;

    const fullSpins = 360 * 5;
    const newRotation = fullSpins + finalAngle;

    setWheelRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setPrize(segments[segmentIndex]);
      setShowPrize(true);
      localStorage.setItem("giftBoxPlayed", "true");
      setHasPlayed(true);
    }, 3000); // match CSS transition
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
  };

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
          </div>
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
                      {segments.map((seg, i) => (
                        <div
                          key={i}
                          className={`wheel-segment segment-${i}`}
                          style={{ transform: `rotate(${i * 45}deg)` }}
                        >
                          <div className="segment-content">
                            <span className="segment-text">{seg}</span>
                          </div>
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
                  {/* Only show form if prize is not shown */}
                  {!showPrize ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.3 }}
                    >
                      <div className="gift-header">
                        <h1 className="gift-title">TRY YOUR LUCK!</h1>
                        <p className="gift-subtitle">Spin the wheel & win exciting discounts</p>
                      </div>

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
                      </div>

                      <motion.button
                        onClick={spinWheel}
                        disabled={spinning || hasPlayed || !email.trim()}
                        className="spin-button"
                      >
                        {spinning ? (
                          <span className="spinning-text">
                            <span className="spinner"></span> SPINNING...
                          </span>
                        ) : hasPlayed ? '🎯 ALREADY PLAYED' : '🎰 SPIN THE WHEEL!'}
                      </motion.button>

                      <div className="skip-options">
                        <button onClick={handleClose} className="skip-btn">Maybe later</button>
                        <button onClick={handleClosePermanently} className="permanent-close-btn">Don't show again</button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Show prize only after spin */
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
                        <p>Your discount code has been sent to <strong>{email}</strong></p>
                        <button onClick={handleClose} className="close-prize-btn">CLAIM MY PRIZE</button>
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