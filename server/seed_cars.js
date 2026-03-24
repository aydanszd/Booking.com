require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./models/Car');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Car.deleteMany({});
        
        const cars = [
            {
                title: "Toyota Camry",
                category: "economy",
                brand: "Toyota",
                model: "Camry 2024",
                supplier: "LocalRent",
                location: { city: "Baku", country: "Azerbaijan" },
                transmission: "automatic",
                seats: 5,
                mileage: 1000,
                pricePerDay: 55,
                images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80"],
                features: ["AC", "Bluetooth", "USB", "Child Seat"],
                rating: 8.8,
                isAvailable: true
            },
            {
                title: "Mercedes-Benz S-Class",
                category: "luxury",
                brand: "Mercedes",
                model: "S500",
                supplier: "Premium Cars",
                location: { city: "Baku", country: "Azerbaijan" },
                transmission: "automatic",
                seats: 5,
                mileage: 500,
                pricePerDay: 250,
                images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80"],
                features: ["Massage Seats", "Panoramic Roof", "Autopilot", "Nappa Leather"],
                rating: 9.9,
                isAvailable: true
            },
            {
                title: "Hyundai Tucson",
                category: "suv",
                brand: "Hyundai",
                model: "Tucson 2023",
                supplier: "Avis",
                location: { city: "Baku", country: "Azerbaijan" },
                transmission: "automatic",
                seats: 5,
                mileage: 2000,
                pricePerDay: 75,
                images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"],
                features: ["AWD", "CarPlay", "Lane Assist"],
                rating: 9.1,
                isAvailable: true
            },
            {
                title: "Kia Rio",
                category: "economy",
                brand: "Kia",
                model: "Rio",
                supplier: "Budget",
                location: { city: "Baku", country: "Azerbaijan" },
                transmission: "manual",
                seats: 5,
                pricePerDay: 40,
                images: ["https://images.unsplash.com/photo-1623126526131-0663445e9974?w=800&q=80"],
                features: ["Economy", "Reliable"],
                rating: 8.5,
                isAvailable: true
            },
            {
                title: "BMW X5",
                category: "suv",
                brand: "BMW",
                model: "X5 M",
                supplier: "Hertz",
                location: { city: "Baku", country: "Azerbaijan" },
                transmission: "automatic",
                seats: 5,
                pricePerDay: 180,
                images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"],
                features: ["M-Package", "Night Vision", "Heads-up Display"],
                rating: 9.5,
                isAvailable: true
            },
            {
                title: "Chevrolet Orlando",
                category: "van",
                brand: "Chevrolet",
                model: "Orlando",
                supplier: "Family Rent",
                location: { city: "Baku", country: "Azerbaijan" },
                transmission: "automatic",
                seats: 7,
                pricePerDay: 90,
                images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80"],
                features: ["7 Seats", "Large Trunk", "Rear Camera"],
                rating: 8.7,
                isAvailable: true
            }
        ];

        await Car.insertMany(cars);
        console.log("Seeded 6 cars");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seed();
