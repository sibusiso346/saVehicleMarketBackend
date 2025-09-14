const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    first_name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required'
    }),
    last_name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    user_level: Joi.string().valid('user', 'admin', 'moderator').optional().messages({
      'any.only': 'User level must be one of: user, admin, moderator'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  updateProfile: Joi.object({
    first_name: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters'
    }),
    last_name: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters'
    }),
    user_level: Joi.string().valid('user', 'admin', 'moderator').optional().messages({
      'any.only': 'User level must be one of: user, admin, moderator'
    })
  }),

  changePassword: Joi.object({
    current_password: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    new_password: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
  }),

  vehicle: Joi.object({
    vehicle_title: Joi.string().min(3).max(255).required().messages({
      'string.min': 'Vehicle title must be at least 3 characters long',
      'string.max': 'Vehicle title must not exceed 255 characters',
      'any.required': 'Vehicle title is required'
    }),
    category: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 100 characters',
      'any.required': 'Category is required'
    }),
    brand: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Brand must be at least 2 characters long',
      'string.max': 'Brand must not exceed 100 characters',
      'any.required': 'Brand is required'
    }),
    model: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Model must be at least 1 character long',
      'string.max': 'Model must not exceed 100 characters',
      'any.required': 'Model is required'
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be at least 1900',
      'number.max': 'Year cannot be in the future',
      'any.required': 'Year is required'
    }),
    price: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be positive',
      'any.required': 'Price is required'
    }),
    condition: Joi.string().valid('new', 'used', 'refurbished', 'damaged').required().messages({
      'any.only': 'Condition must be one of: new, used, refurbished, damaged',
      'any.required': 'Condition is required'
    }),
    mileage: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Mileage must be a number',
      'number.integer': 'Mileage must be an integer',
      'number.min': 'Mileage cannot be negative'
    }),
    fuel_type: Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid', 'lpg', 'cng').optional().messages({
      'any.only': 'Fuel type must be one of: petrol, diesel, electric, hybrid, lpg, cng'
    }),
    transmission: Joi.string().valid('manual', 'automatic', 'semi-automatic', 'cvt').optional().messages({
      'any.only': 'Transmission must be one of: manual, automatic, semi-automatic, cvt'
    }),
    engine: Joi.string().max(100).optional().messages({
      'string.max': 'Engine description must not exceed 100 characters'
    }),
    color: Joi.string().max(50).optional().messages({
      'string.max': 'Color must not exceed 50 characters'
    }),
    body: Joi.string().max(50).optional().messages({
      'string.max': 'Body type must not exceed 50 characters'
    }),
    reference: Joi.string().max(100).optional().messages({
      'string.max': 'Reference must not exceed 100 characters'
    })
  })
};

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

// Specific validation functions
const validateVehicle = validate(schemas.vehicle);

module.exports = {
  validate,
  schemas,
  validateVehicle
};
