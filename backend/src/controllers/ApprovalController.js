const Booking = require("../models/Booking");

module.exports = {
  async create(req, res) {
    const { booking_id } = req.params;
    const booking = await Booking.findById(booking_id).populate("spot");

    booking.approved = true;

    // Configure for socket
    const bookingUserSocket = req.connectedUsers[booking.user];
    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit("booking_response", booking);
    }
    console.log(`Approved booking ${booking.id}`);

    await booking.save();

    return res.json(booking);
  }
};
