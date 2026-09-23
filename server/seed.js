const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL;

// Inline schemas to avoid import issues
const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, isVerified: Boolean });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const eventSchema = new mongoose.Schema({
    title: String, description: String, date: Date, location: String,
    category: String, totalSeats: Number, availableSeats: Number,
    ticketPrice: Number, image: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

const events = [
    {
        title: 'React & Next.js Summit 2025',
        description: 'Join thousands of developers at the biggest React conference of the year. Featuring keynotes from core team members, hands-on workshops, and networking with the best minds in the industry.',
        date: new Date('2025-11-15'),
        location: 'Bangalore International Convention Centre, Bangalore',
        category: 'Tech',
        totalSeats: 500,
        ticketPrice: 1499,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'Bollywood Night Live',
        description: 'An electrifying evening of Bollywood music performed live by top artists. Dance, sing, and lose yourself in the magic of Bollywood classics and new hits under the stars.',
        date: new Date('2025-12-05'),
        location: 'DY Patil Stadium, Mumbai',
        category: 'Music',
        totalSeats: 2000,
        ticketPrice: 799,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'Cloud & DevOps World Conference',
        description: 'Deep-dive into cloud architecture, DevOps best practices, Kubernetes, CI/CD pipelines and more. Learn from engineers at Google, AWS, and Microsoft in exclusive breakout sessions.',
        date: new Date('2025-11-28'),
        location: 'Hyderabad International Trade Expo, Hyderabad',
        category: 'Tech',
        totalSeats: 300,
        ticketPrice: 2499,
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'Startup Founders Meetup',
        description: 'Connect with 200+ early-stage and growth-stage startup founders. Pitch your idea, find co-founders, explore funding opportunities, and learn from entrepreneurs who have been through it all.',
        date: new Date('2025-11-20'),
        location: 'Nasscom, Pune',
        category: 'Business',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop'
    },
    {
        title: 'Electronic Music Festival — EDM Nights',
        description: 'Three nights of non-stop electronic music featuring world-class DJs from around the globe. Lasers, LED walls, and unforgettable beats await you at this massive outdoor festival.',
        date: new Date('2025-12-20'),
        location: 'Mahalaxmi Racecourse, Mumbai',
        category: 'Music',
        totalSeats: 5000,
        ticketPrice: 1999,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'Full Stack Bootcamp — Intensive Workshop',
        description: 'A 2-day intensive hands-on workshop covering Node.js, React, MongoDB, Docker and deployment. Bring your laptop, leave with a fully deployed web application. Limited to 40 seats.',
        date: new Date('2025-11-08'),
        location: 'CoWrks, Chennai',
        category: 'Workshop',
        totalSeats: 40,
        ticketPrice: 3999,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'AI & Machine Learning Expo',
        description: 'Explore the future of Artificial Intelligence at India\'s largest AI expo. Featuring demos, talks, and panel discussions on LLMs, computer vision, autonomous systems, and ethical AI.',
        date: new Date('2026-01-18'),
        location: 'HITEX Exhibition Centre, Hyderabad',
        category: 'Tech',
        totalSeats: 800,
        ticketPrice: 999,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
    },
    {
        title: 'Yoga & Wellness Retreat',
        description: 'A rejuvenating weekend retreat with expert yoga instructors, meditation sessions, and wellness workshops. Reconnect with yourself in a serene outdoor setting away from the city.',
        date: new Date('2025-12-12'),
        location: 'Rishikesh, Uttarakhand',
        category: 'Wellness',
        totalSeats: 60,
        ticketPrice: 4999,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099&auto=format&fit=crop'
    },
    {
        title: 'Stand-Up Comedy Night',
        description: 'An evening of non-stop laughter featuring five of India\'s best stand-up comedians. 90 minutes of pure comedy covering everything from everyday life to social satire.',
        date: new Date('2025-11-25'),
        location: 'Canvas Laugh Club, Delhi',
        category: 'Entertainment',
        totalSeats: 250,
        ticketPrice: 599,
        image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2071&auto=format&fit=crop'
    },
    {
        title: 'Photography Masterclass',
        description: 'Learn professional photography from a National Geographic photographer. Covers composition, lighting, post-processing in Lightroom, and portrait techniques. Bring your DSLR or mirrorless camera.',
        date: new Date('2025-12-01'),
        location: 'Studio 13, Kolkata',
        category: 'Workshop',
        totalSeats: 25,
        ticketPrice: 2999,
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074&auto=format&fit=crop'
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ MongoDB Connected');

        // Find or create a system admin user to attach as createdBy
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                name: 'Admin',
                email: 'admin@eventora.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('✅ Admin user created → email: admin@eventora.com | password: admin123');
        } else {
            console.log(`✅ Using existing admin: ${admin.email}`);
        }

        // Clear existing events
        await Event.deleteMany({});
        console.log('🗑️  Cleared existing events');

        // Insert new events with createdBy
        const eventsWithAdmin = events.map(e => ({ ...e, availableSeats: e.totalSeats, createdBy: admin._id }));
        const inserted = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Successfully seeded ${inserted.length} events!`);

        inserted.forEach(e => console.log(`   • [${e.category}] ${e.title} — ₹${e.ticketPrice === 0 ? 'FREE' : e.ticketPrice}`));

        await mongoose.disconnect();
        console.log('\n✅ Done! Open http://localhost:5174 to see the events.');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
