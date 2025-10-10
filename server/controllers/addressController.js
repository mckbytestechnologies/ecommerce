import Address from "../models/Address.js";

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id, is_active: true })
      .sort("-is_default -createdAt");

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
  try {
    const {
      name,
      mobile,
      address_line,
      city,
      state,
      pincode,
      country,
      landmark,
      address_type,
      is_default,
    } = req.body;

    // If setting as default, remove default from other addresses
    if (is_default) {
      await Address.updateMany(
        { user: req.user.id, is_default: true },
        { is_default: false }
      );
    }

    const address = await Address.create({
      user: req.user.id,
      name,
      mobile,
      address_line,
      city,
      state,
      pincode,
      country: country || "India",
      landmark,
      address_type,
      is_default: is_default || false,
    });

    res.status(201).json({
      success: true,
      data: address,
      message: "Address created successfully",
    });
  } catch (error) {
    console.error("Create address error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cannot have multiple default addresses",
      });
    }

    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    let address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Address not found",
      });
    }

    // Check if user owns the address
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to update this address",
      });
    }

    // If setting as default, remove default from other addresses
    if (req.body.is_default) {
      await Address.updateMany(
        { user: req.user.id, is_default: true, _id: { $ne: req.params.id } },
        { is_default: false }
      );
    }

    address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: address,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Update address error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cannot have multiple default addresses",
      });
    }

    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Address not found",
      });
    }

    // Check if user owns the address
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to delete this address",
      });
    }

    // If deleting default address, set another address as default
    if (address.is_default) {
      const anotherAddress = await Address.findOne({
        user: req.user.id,
        _id: { $ne: req.params.id },
        is_active: true,
      });

      if (anotherAddress) {
        anotherAddress.is_default = true;
        await anotherAddress.save();
      }
    }

    await Address.findByIdAndUpdate(req.params.id, { is_active: false });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Address not found",
      });
    }

    // Check if user owns the address
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Not authorized to modify this address",
      });
    }

    // Remove default from other addresses
    await Address.updateMany(
      { user: req.user.id, is_default: true, _id: { $ne: req.params.id } },
      { is_default: false }
    );

    // Set this address as default
    address.is_default = true;
    await address.save();

    res.status(200).json({
      success: true,
      data: address,
      message: "Default address updated successfully",
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Server error",
    });
  }
};