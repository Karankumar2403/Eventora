const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {
        const query = {};

        // Search by title (case-insensitive regex)
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.ticketPrice !== undefined) {
            query.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    const { title, description, date, location, category, ticketPrice, totalSeats, image } = req.body;
    try {
        const seats = parseInt(totalSeats, 10);
        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            totalSeats: seats,
            availableSeats: seats,   // default availableSeats = totalSeats
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: req.user._id  // set from authenticated user
        });
        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    const { title, description, date, location, category, ticketPrice, totalSeats, availableSeats, image } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, image },
            { new: true, runValidators: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
