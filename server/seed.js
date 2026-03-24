require('dotenv').config();
const mongoose = require('mongoose');
const Building = require('./models/Building');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Building.deleteMany({});
        
        const buildings = [
            // BAKU
            { title: "Hilton Baku", type: "hotel", brand: "Hilton", location: { address: "1B Azadlig Avenue", city: "Baku", country: "Azerbaijan" }, pricePerNight: 245, rating: 9.1, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"], amenities: ["Free WiFi", "Spa", "Pool"], isAvailable: true, maxGuests: 2 },
            { title: "JW Marriott Absheron", type: "hotel", brand: "Marriott", location: { address: "674 Azadlig Square", city: "Baku", country: "Azerbaijan" }, pricePerNight: 310, rating: 9.4, images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"], amenities: ["Luxury Spa", "Pool"], isAvailable: true, maxGuests: 2 },
            { title: "Old City Heritage", type: "hotel", brand: "Independent", location: { address: "Icherisheher, Kichik Qala 12", city: "Baku", country: "Azerbaijan" }, pricePerNight: 85, rating: 8.7, images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"], amenities: ["Breakfast", "Terrace"], isAvailable: true, maxGuests: 3 },
            { title: "Sea Breeze Resort", type: "resort", brand: "Sea Breeze", location: { address: "Nardaran", city: "Baku", country: "Azerbaijan" }, pricePerNight: 190, rating: 8.9, images: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80"], amenities: ["Beach", "Pool"], isAvailable: true, maxGuests: 4 },
            { title: "Flame Towers Apt", type: "apartment", brand: "Private", location: { address: "Mehdi Huseyn 1", city: "Baku", country: "Azerbaijan" }, pricePerNight: 120, rating: 9.0, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"], amenities: ["Kitchen", "Balcony"], isAvailable: true, maxGuests: 5 },
            { title: "Four Seasons Baku", type: "hotel", brand: "Four Seasons", location: { address: "1 Neftchilar Ave", city: "Baku", country: "Azerbaijan" }, pricePerNight: 400, rating: 9.7, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"], amenities: ["Spa", "Hammām"], isAvailable: true, maxGuests: 2 },
            { title: "Fairmont Flame Towers", type: "hotel", brand: "Fairmont", location: { address: "1A Mehdi Huseyn Street", city: "Baku", country: "Azerbaijan" }, pricePerNight: 280, rating: 9.3, images: ["https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80"], amenities: ["Sky View", "Pool"], isAvailable: true, maxGuests: 2 },
            { title: "Boutique 19 Hotel", type: "hotel", brand: "Boutique", location: { address: "Neftchilar Avenue 19", city: "Baku", country: "Azerbaijan" }, pricePerNight: 140, rating: 9.2, images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"], amenities: ["Breakfast", "WiFi"], isAvailable: true, maxGuests: 2 },
            
            // QUBA
            { title: "Quba Palace Hotel", type: "hotel", brand: "Luxury", location: { address: "Eski-Igryig village", city: "Quba", country: "Azerbaijan" }, pricePerNight: 160, rating: 9.0, images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"], amenities: ["Golf", "Lake View"], isAvailable: true, maxGuests: 4 },
            { title: "Macara Lake Park", type: "resort", brand: "Macara", location: { address: "Gachresh", city: "Quba", country: "Azerbaijan" }, pricePerNight: 110, rating: 8.6, images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"], amenities: ["Nature", "Lake"], isAvailable: true, maxGuests: 3 },
            
            // GABALA
            { title: "Tufandag Mountain Resort", type: "resort", brand: "Tufandag", location: { address: "Gabala", city: "Gabala", country: "Azerbaijan" }, pricePerNight: 130, rating: 9.1, images: ["https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80"], amenities: ["Ski", "Cable Car"], isAvailable: true, maxGuests: 2 },
            { title: "Chenot Palace Health Wellness", type: "hotel", brand: "Luxury", location: { address: "Gabala", city: "Gabala", country: "Azerbaijan" }, pricePerNight: 500, rating: 9.8, images: ["https://images.unsplash.com/photo-1544161515-4ad6ce6e8344?w=800&q=80"], amenities: ["Wellness", "Spa"], isAvailable: true, maxGuests: 2 },

            // OTHER
            { title: "Shamaxi Palace Sharadil", type: "hotel", brand: "Luxury", location: { address: "Sharadil", city: "Shamakhi", country: "Azerbaijan" }, pricePerNight: 145, rating: 8.9, images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"], amenities: ["Mountain View", "Pool"], isAvailable: true, maxGuests: 3 },
            { title: "Lankaran Springs Wellness", type: "resort", brand: "Springs", location: { address: "Haftoni", city: "Lankaran", country: "Azerbaijan" }, pricePerNight: 105, rating: 9.0, images: ["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80"], amenities: ["Thermal", "Forest"], isAvailable: true, maxGuests: 2 },
            { title: "Sheki Palace Hotel", type: "hotel", brand: "Independent", location: { address: "Akhundzadeh 3", city: "Sheki", country: "Azerbaijan" }, pricePerNight: 70, rating: 8.8, images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"], amenities: ["Caravanserai nearby", "Traditional"], isAvailable: true, maxGuests: 2 },
            { title: "Naftalan Hotel by Rixos", type: "hotel", brand: "Rixos", location: { address: "Shirvan Avenue", city: "Naftalan", country: "Azerbaijan" }, pricePerNight: 155, rating: 9.2, images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"], amenities: ["Oil Bath", "Spa"], isAvailable: true, maxGuests: 2 }
        ];

        await Building.insertMany(buildings);
        console.log("Seeded 16 buildings");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seed();
