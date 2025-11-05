const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().trim(),
    lastName: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).optional(),
    role: Joi.string().valid('customer', 'admin', 'agent').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateUpdatePassword = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().min(1),
    newPassword: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateForgotPassword = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateVerifyOTP = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateResetPassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateBooking = (req, res, next) => {
  const schema = Joi.object({
    bookingType: Joi.string().valid('flight', 'hotel', 'package', 'car_rental').required(),
    flightId: Joi.when('bookingType', {
      is: 'flight',
      then: Joi.string().uuid().required(),
      otherwise: Joi.optional()
    }),
    hotelId: Joi.when('bookingType', {
      is: 'hotel',
      then: Joi.string().uuid().required(),
      otherwise: Joi.optional()
    }),
    packageId: Joi.when('bookingType', {
      is: 'package',
      then: Joi.string().uuid().required(),
      otherwise: Joi.optional()
    }),
    checkInDate: Joi.when('bookingType', {
      is: 'hotel',
      then: Joi.date().greater('now').required(),
      otherwise: Joi.optional()
    }),
    checkOutDate: Joi.when('bookingType', {
      is: 'hotel',
      then: Joi.date().greater(Joi.ref('checkInDate')).required(),
      otherwise: Joi.optional()
    }),
    flightDate: Joi.when('bookingType', {
      is: 'flight',
      then: Joi.date().greater('now').required(),
      otherwise: Joi.optional()
    }),
    passengers: Joi.array().items(Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      passportNumber: Joi.string().optional()
    })).optional(),
    adults: Joi.number().min(1).max(10).optional(),
    children: Joi.number().min(0).max(10).optional(),
    rooms: Joi.number().min(1).max(10).optional(),
    specialRequests: Joi.string().max(500).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateFlightSearch = (req, res, next) => {
  const schema = Joi.object({
    departure: Joi.string().length(3).uppercase().required(),
    arrival: Joi.string().length(3).uppercase().required(),
    date: Joi.date().greater('now').required(),
    passengers: Joi.number().min(1).max(10).default(1),
    class: Joi.string().valid('economy', 'business', 'first').default('economy')
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateHotelSearch = (req, res, next) => {
  const schema = Joi.object({
    city: Joi.string().min(2).required(),
    checkIn: Joi.date().greater('now').required(),
    checkOut: Joi.date().greater(Joi.ref('checkIn')).required(),
    guests: Joi.number().min(1).max(10).default(1),
    rooms: Joi.number().min(1).max(5).default(1),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    rating: Joi.number().min(1).max(5).optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateUpdatePassword,
  validateForgotPassword,
  validateVerifyOTP,
  validateResetPassword,
  validateBooking,
  validateFlightSearch,
  validateHotelSearch
};