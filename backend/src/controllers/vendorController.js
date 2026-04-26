const { VendorProfile, Hotel, Flight, CarRental, Booking, Payment, PayoutRequest, Review } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });

    // Total Bookings for this vendor's services
    const hotelIds = (await Hotel.findAll({ where: { vendorId: vendor.id }, attributes: ['id'] })).map(h => h.id);
    const flightIds = (await Flight.findAll({ where: { vendorId: vendor.id }, attributes: ['id'] })).map(f => f.id);
    const carIds = (await CarRental.findAll({ where: { vendorId: vendor.id }, attributes: ['id'] })).map(c => c.id);

    const bookingsCount = await Booking.count({
      where: {
        [Op.or]: [
          { hotelId: { [Op.in]: hotelIds } },
          { flightId: { [Op.in]: flightIds } },
          { carRentalId: { [Op.in]: carIds } }
        ]
      }
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBookings: bookingsCount,
          totalRevenue: vendor.totalRevenue,
          payoutBalance: vendor.payoutBalance,
          rating: vendor.rating
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });

    await vendor.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Vendor profile updated successfully',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

exports.requestPayout = async (req, res, next) => {
  try {
    const { amount, bankName, accountNumber, accountHolderName } = req.body;
    const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });

    if (parseFloat(amount) > parseFloat(vendor.payoutBalance)) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const payout = await PayoutRequest.create({
      vendorId: vendor.id,
      amount,
      bankName,
      accountNumber,
      accountHolderName
    });

    // Deduct from balance
    await vendor.update({ payoutBalance: parseFloat(vendor.payoutBalance) - parseFloat(amount) });

    res.status(201).json({
      success: true,
      message: 'Payout request submitted successfully',
      data: payout
    });
  } catch (error) {
    next(error);
  }
};

exports.getVendorBookings = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
    
    const hotelIds = (await Hotel.findAll({ where: { vendorId: vendor.id }, attributes: ['id'] })).map(h => h.id);
    const flightIds = (await Flight.findAll({ where: { vendorId: vendor.id }, attributes: ['id'] })).map(f => f.id);

    const bookings = await Booking.findAll({
      where: {
        [Op.or]: [
          { hotelId: { [Op.in]: hotelIds } },
          { flightId: { [Op.in]: flightIds } }
        ]
      },
      include: ['User'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyHotels = async (req, res) => {
  const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
  const hotels = await Hotel.findAll({ where: { vendorId: vendor.id } });
  res.json({ success: true, data: hotels });
};

exports.getMyFlights = async (req, res) => {
  const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
  const flights = await Flight.findAll({ where: { vendorId: vendor.id } });
  res.json({ success: true, data: flights });
};
