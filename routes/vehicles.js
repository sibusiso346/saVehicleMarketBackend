const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { authenticateToken: auth } = require('../middleware/auth');
const { validateVehicle } = require('../middleware/validation');

// Get all vehicles with pagination and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      brand,
      category,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel_type,
      transmission,
      condition
    } = req.query;

    const offset = (page - 1) * limit;
    const searchCriteria = {
      brand,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minYear: minYear ? parseInt(minYear) : undefined,
      maxYear: maxYear ? parseInt(maxYear) : undefined,
      fuel_type,
      transmission,
      condition,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const vehicles = await Vehicle.search(searchCriteria);
    const totalCount = await Vehicle.count(searchCriteria);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
});

// Create new vehicle (protected route)
router.post('/', auth, validateVehicle, async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle',
      error: error.message
    });
  }
});

// Update vehicle (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.update(id, req.body);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
});

// Delete vehicle (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
});

// Get vehicles by brand
router.get('/brand/:brand', async (req, res) => {
  try {
    const { brand } = req.params;
    const vehicles = await Vehicle.findByBrand(brand);

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles by brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles by brand',
      error: error.message
    });
  }
});

// Get vehicles by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const vehicles = await Vehicle.findByCategory(category);

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles by category',
      error: error.message
    });
  }
});

// Get vehicles by price range
router.get('/price/:minPrice/:maxPrice', async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.params;
    const vehicles = await Vehicle.findByPriceRange(
      parseFloat(minPrice),
      parseFloat(maxPrice)
    );

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles by price range:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles by price range',
      error: error.message
    });
  }
});

// Get vehicles by year range
router.get('/year/:minYear/:maxYear', async (req, res) => {
  try {
    const { minYear, maxYear } = req.params;
    const vehicles = await Vehicle.findByYearRange(
      parseInt(minYear),
      parseInt(maxYear)
    );

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles by year range:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles by year range',
      error: error.message
    });
  }
});

module.exports = router;
