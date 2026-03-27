const mongoose = require('./server/node_modules/mongoose');
const Building = require('./server/models/Building');

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/booking_db');
        console.log('Connected to MongoDB');

        await Building.deleteMany({});
        console.log('Cleared existing buildings');

        const buildings = [
            {
                title: "Hilton Baku",
                type: "hotel",
                brand: "Hilton",
                location: { address: "1B Azadlig Avenue", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 245,
                rating: 9.1,
                images: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                ],
                amenities: ["Free WiFi", "Swimming Pool", "Spa", "Gym", "Bar", "24-hour front desk"],
                rooms: { bedrooms: 1, bathrooms: 1 },
                travelGroups: ["business", "couple", "family"],
                isAvailable: true,
                maxGuests: 2,
                minNights: 1
            },
            {
                title: "JW Marriott Absheron Baku",
                type: "hotel",
                brand: "Marriott",
                location: { address: "674 Azadlig Square", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 310,
                rating: 9.4,
                images: [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
                ],
                amenities: ["Luxury Spa", "Indoor Pool", "Fine Dining", "Concierge", "Valet Parking"],
                rooms: { bedrooms: 1, bathrooms: 1 },
                travelGroups: ["business", "couple"],
                isAvailable: true,
                maxGuests: 2,
                minNights: 1
            },
            {
                title: "Old City Heritage Hotel",
                type: "hotel",
                brand: "Independent",
                location: { address: "Icherisheher, Kichik Qala 12", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 85,
                rating: 8.7,
                images: [
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
                    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"
                ],
                amenities: ["Traditional Breakfast", "Terrace", "City View", "Free WiFi"],
                rooms: { bedrooms: 1, bathrooms: 1 },
                travelGroups: ["solo", "couple", "family"],
                isAvailable: true,
                maxGuests: 3,
                minNights: 1
            },
            {
                title: "Sea Breeze Resort & Residences",
                type: "resort",
                brand: "Sea Breeze",
                location: { address: "Nardaran district", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 190,
                rating: 8.9,
                images: [
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
                ],
                amenities: ["Private Beach", "Outdoor Pool", "Water Sports", "Restaurant", "Gardens"],
                rooms: { bedrooms: 2, bathrooms: 1 },
                travelGroups: ["family", "group"],
                isAvailable: true,
                maxGuests: 4,
                minNights: 2
            },
            {
                title: "Luxury Apartment near Flame Towers",
                type: "apartment",
                brand: "Private",
                location: { address: "Mehdi Huseyn Street 1", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 120,
                rating: 9.0,
                images: [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
                ],
                amenities: ["Kitchen", "Balcony", "Washing Machine", "Flame Tower View"],
                rooms: { bedrooms: 2, bathrooms: 2 },
                travelGroups: ["family", "group"],
                isAvailable: true,
                maxGuests: 5,
                minNights: 3
            },
            {
                title: "Backpackers Hostel Baku",
                type: "hostel",
                brand: "Backpackers",
                location: { address: "Mirza Ibrahimov 5", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 15,
                rating: 7.9,
                images: [
                    "https://images.unsplash.com/photo-1555854816-80dc122197db?w=800&q=80",
                    "https://images.unsplash.com/photo-1521783593447-5702b9bfd267?w=800&q=80"
                ],
                amenities: ["Shared Kitchen", "Locker", "Common Room", "Free WiFi"],
                rooms: { bedrooms: 1, bathrooms: 1 },
                travelGroups: ["solo", "group"],
                isAvailable: true,
                maxGuests: 1,
                minNights: 1
            },
            {
                title: "Caspian Sea Villa",
                type: "villa",
                brand: "Exclusive",
                location: { address: "Bilgah district", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 450,
                rating: 9.6,
                images: [
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
                ],
                amenities: ["Private Pool", "Garden", "Beach Access", "BBQ Area", "Cinema Room"],
                rooms: { bedrooms: 4, bathrooms: 3 },
                travelGroups: ["family", "group"],
                isAvailable: true,
                maxGuests: 8,
                minNights: 4
            },
            {
                title: "Four Seasons Hotel Baku",
                type: "hotel",
                brand: "Four Seasons",
                location: { address: "1 Neftchilar Avenue", city: "Baku", country: "Azerbaijan" },
                pricePerNight: 400,
                rating: 9.7,
                images: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
                ],
                amenities: ["Indoor Pool", "Turkish Hammam", "Terrace", "Restaurant"],
                rooms: { bedrooms: 1, bathrooms: 1 },
                travelGroups: ["couple", "business"],
                isAvailable: true,
                maxGuests: 2,
                minNights: 1
            }
        ];

        await Building.insertMany(buildings);
        console.log(`Successfully seeded ${buildings.length} buildings!`);
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
