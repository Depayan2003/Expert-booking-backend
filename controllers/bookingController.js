const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Expert = require("../models/Expert");

// @desc   Create booking (prevent double booking)
// @route  POST /bookings
exports.createBooking = async (req, res) => {
    const { expertId, name, email, phone, date, time } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Lock and update slot atomically
        const expert = await Expert.findOneAndUpdate(
            {
                _id: expertId,
                slots: {
                    $elemMatch: {
                        date: date,
                        time: time,
                        isBooked: false
                    }
                }
            },
            {
                $set: {
                    "slots.$.isBooked": true
                }
            },
            {
                new: true,
                session
            }
        );

        if (!expert) {
            throw new Error("Slot already booked or not available");
        }

        // 2. Create booking
        const booking = await Booking.create(
            [{
                expertId,
                name,
                email,
                phone,
                date,
                time
            }],
            { session }
        );

        await session.commitTransaction();

        const io = req.app.get("io");

        if (io) {
            io.to(expertId).emit("slotBooked", {
                date,
                time
            });
        }

        session.endSession();

        res.status(201).json({
            message: "Booking successful",
            booking: booking[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({ message: error.message });
    }
};

// @desc   Get bookings by email
// @route  GET /bookings?email=
exports.getBookings = async (req, res) => {
    try {
        const { email } = req.query;

        const bookings = await Booking.find({ email }).populate("expertId");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update booking status
// @route  PATCH /bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};