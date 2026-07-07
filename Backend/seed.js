/**
 * Threadora — Database Seed Script
 * Run: node seed.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env.development") });

const DB_URI = process.env.DB_URI;
if (!DB_URI) { console.error("DB_URI missing"); process.exit(1); }

const attributeSchema = new mongoose.Schema({ key: String, value: String }, { _id: false });
const variantSchema = new mongoose.Schema({
  name: String,
  description: { type: String, default: "" },
  images: { type: [String], default: [] },
  price: { amount: Number, currency: { type: String, default: "INR" } },
  stock: { type: Number, default: 0 },
  attributes: { type: [attributeSchema], default: [] },
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  price: { amount: Number, currency: { type: String, default: "INR" } },
  category: String,
  colourShown: { type: String, default: "" },
  styleCode: { type: String, default: "" },
  stock: Number,
  variants: { type: [variantSchema], default: [] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, default: "seller" },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const User    = mongoose.models.User    || mongoose.model("User", userSchema);

const shoeImg = (n) => `https://picsum.photos/seed/shoe${n}/900/900`;
const teeImg  = (n) => `https://picsum.photos/seed/tee${n}/900/900`;
const jogImg  = (n) => `https://picsum.photos/seed/jog${n}/900/900`;
const jackImg = (n) => `https://picsum.photos/seed/jack${n}/900/900`;

async function seed() {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");

  const deleted = await Product.deleteMany({});
  console.log(`Deleted ${deleted.deletedCount} products`);

  let seller = await User.findOne({ email: "seed.seller@threadora.com" });
  if (!seller) {
    seller = await User.create({
      fullName: "Threadora Store",
      email: "seed.seller@threadora.com",
      phone: "9999999999",
      password: "Seed@1234",
      role: "seller",
    });
    console.log("Created seed seller");
  }
  const s = seller._id;

  const products = [
    {
      name: "Nike Court Vision Low",
      description: "The fastness style of 80s basketball meets the fast-paced culture of today game, with the Nike Court Vision Low. The crisp upper was inspired by old-school basketball sneakers, and its classic rubber cupsole has been featured on iconic silhouettes of the past.",
      images: [shoeImg(1), shoeImg(2), shoeImg(3), shoeImg(4), shoeImg(5), shoeImg(6)],
      price: { amount: 7095, currency: "INR" },
      category: "Mens Shoes",
      colourShown: "Grey Fog/White/Black",
      styleCode: "HV0927-087",
      stock: 50,
      seller: s,
      variants: [
        { name: "UK 6 (EU 40)", price: { amount: 7095, currency: "INR" }, stock: 8,  attributes: [{ key: "UK Size", value: "6" }, { key: "EU Size", value: "40" }] },
        { name: "UK 7",         price: { amount: 7095, currency: "INR" }, stock: 12 },
        { name: "UK 8",         price: { amount: 7095, currency: "INR" }, stock: 10 },
        { name: "UK 9",         price: { amount: 7095, currency: "INR" }, stock: 5  },
        { name: "UK 10",        price: { amount: 7095, currency: "INR" }, stock: 0  },
        { name: "UK 11",        price: { amount: 7295, currency: "INR" }, stock: 3  },
      ],
    },
    {
      name: "Nike Court Shot",
      description: "The Nike Court Shot is a low-cut sneaker with a premium leather upper and a classic basketball heritage. A versatile silhouette perfect for everyday wear.",
      images: [shoeImg(7), shoeImg(8), shoeImg(9), shoeImg(10)],
      price: { amount: 6295, currency: "INR" },
      category: "Mens Shoes",
      colourShown: "Black/Gum Brown/White",
      styleCode: "DM7590-001",
      stock: 40,
      seller: s,
      variants: [
        { name: "UK 6",  price: { amount: 6295, currency: "INR" }, stock: 6  },
        { name: "UK 7",  price: { amount: 6295, currency: "INR" }, stock: 10 },
        { name: "UK 8",  price: { amount: 6295, currency: "INR" }, stock: 8  },
        { name: "UK 9",  price: { amount: 6295, currency: "INR" }, stock: 4  },
        { name: "UK 10", price: { amount: 6295, currency: "INR" }, stock: 0  },
      ],
    },
    {
      name: "Nike Air Max Excee",
      description: "The Nike Air Max Excee carries on the legacy of the Air Max line with a visible Air unit for lightweight cushioning. Its chunky design and bold colourway make it a statement piece.",
      images: [shoeImg(11), shoeImg(12), shoeImg(13), shoeImg(14)],
      price: { amount: 6522, currency: "INR" },
      category: "Mens Shoes",
      colourShown: "White/Royal Blue/Tan",
      styleCode: "CD4165-109",
      stock: 60,
      seller: s,
      variants: [
        { name: "UK 6",  price: { amount: 6522, currency: "INR" }, stock: 10 },
        { name: "UK 7",  price: { amount: 6522, currency: "INR" }, stock: 15 },
        { name: "UK 8",  price: { amount: 6522, currency: "INR" }, stock: 12 },
        { name: "UK 9",  price: { amount: 6522, currency: "INR" }, stock: 8  },
        { name: "UK 10", price: { amount: 6522, currency: "INR" }, stock: 4  },
      ],
    },
    {
      name: "Nike LD-1000",
      description: "Drawing inspiration from the 1970s running silhouettes, the Nike LD-1000 is a retro-forward sneaker built for the modern runner who appreciates heritage styling.",
      images: [shoeImg(15), shoeImg(16), shoeImg(17), shoeImg(18)],
      price: { amount: 6522, currency: "INR" },
      category: "Mens Shoes",
      colourShown: "Vintage Green/Sail/Earth",
      styleCode: "FJ5481-300",
      stock: 35,
      seller: s,
      variants: [
        { name: "UK 6",  price: { amount: 6522, currency: "INR" }, stock: 5 },
        { name: "UK 7",  price: { amount: 6522, currency: "INR" }, stock: 8 },
        { name: "UK 8",  price: { amount: 6522, currency: "INR" }, stock: 7 },
        { name: "UK 9",  price: { amount: 6522, currency: "INR" }, stock: 0 },
        { name: "UK 10", price: { amount: 6522, currency: "INR" }, stock: 2 },
      ],
    },
    {
      name: "Nike Air Force 1 Mid",
      description: "Debuted in 1982, the Air Force 1 was the first basketball shoe to use Nike Air cushioning. The mid-cut silhouette offers additional ankle support and timeless style.",
      images: [shoeImg(19), shoeImg(20), shoeImg(21), shoeImg(22)],
      price: { amount: 8995, currency: "INR" },
      category: "Mens Shoes",
      colourShown: "White/White/White",
      styleCode: "CW2289-111",
      stock: 30,
      seller: s,
      variants: [
        { name: "UK 6",  price: { amount: 8995, currency: "INR" }, stock: 4 },
        { name: "UK 7",  price: { amount: 8995, currency: "INR" }, stock: 9 },
        { name: "UK 8",  price: { amount: 8995, currency: "INR" }, stock: 7 },
        { name: "UK 9",  price: { amount: 8995, currency: "INR" }, stock: 3 },
      ],
    },
    {
      name: "Nike Blazer Mid 77",
      description: "The Nike Blazer Mid 77 Vintage delivers that old-school hoops style with a 70s-inspired midsole and premium suede overlays.",
      images: [shoeImg(23), shoeImg(24), shoeImg(25), shoeImg(26)],
      price: { amount: 7495, currency: "INR" },
      category: "Womens Shoes",
      colourShown: "White/Black/Sail",
      styleCode: "BQ6806-101",
      stock: 45,
      seller: s,
      variants: [
        { name: "UK 4", price: { amount: 7495, currency: "INR" }, stock: 8  },
        { name: "UK 5", price: { amount: 7495, currency: "INR" }, stock: 12 },
        { name: "UK 6", price: { amount: 7495, currency: "INR" }, stock: 10 },
        { name: "UK 7", price: { amount: 7495, currency: "INR" }, stock: 6  },
        { name: "UK 8", price: { amount: 7495, currency: "INR" }, stock: 0  },
      ],
    },
    {
      name: "Nike Air Max 270",
      description: "The Nike Air Max 270 features Nikes biggest heel Air unit yet for unmatched all-day comfort. The sleek lifestyle design pairs effortlessly with any outfit.",
      images: [shoeImg(27), shoeImg(28), shoeImg(29)],
      price: { amount: 11995, currency: "INR" },
      category: "Womens Shoes",
      colourShown: "Pink Foam/White/Berry",
      styleCode: "AH6789-601",
      stock: 25,
      seller: s,
      variants: [
        { name: "UK 4", price: { amount: 11995, currency: "INR" }, stock: 5 },
        { name: "UK 5", price: { amount: 11995, currency: "INR" }, stock: 8 },
        { name: "UK 6", price: { amount: 11995, currency: "INR" }, stock: 6 },
        { name: "UK 7", price: { amount: 11995, currency: "INR" }, stock: 3 },
      ],
    },
    {
      name: "Nike Sportswear Club Fleece",
      description: "Our classic crewneck made with a soft medium-weight fleece. Relaxed fit silhouette with a brushed interior for warmth and comfort.",
      images: [teeImg(1), teeImg(2), teeImg(3)],
      price: { amount: 2995, currency: "INR" },
      category: "Mens Tops",
      colourShown: "Carbon Heather/White",
      styleCode: "BV2667-063",
      stock: 100,
      seller: s,
      variants: [
        { name: "XS", price: { amount: 2995, currency: "INR" }, stock: 15 },
        { name: "S",  price: { amount: 2995, currency: "INR" }, stock: 25 },
        { name: "M",  price: { amount: 2995, currency: "INR" }, stock: 30 },
        { name: "L",  price: { amount: 2995, currency: "INR" }, stock: 20 },
        { name: "XL", price: { amount: 2995, currency: "INR" }, stock: 10 },
      ],
    },
    {
      name: "Nike Dri-FIT Running Tee",
      description: "Engineered with Dri-FIT technology this lightweight running tee wicks away sweat to keep you dry and comfortable during your run.",
      images: [teeImg(4), teeImg(5), teeImg(6)],
      price: { amount: 1995, currency: "INR" },
      category: "Mens Tops",
      colourShown: "Dark Teal/Reflective Silver",
      styleCode: "DD1992-381",
      stock: 80,
      seller: s,
      variants: [
        { name: "S",  price: { amount: 1995, currency: "INR" }, stock: 20 },
        { name: "M",  price: { amount: 1995, currency: "INR" }, stock: 25 },
        { name: "L",  price: { amount: 1995, currency: "INR" }, stock: 20 },
        { name: "XL", price: { amount: 1995, currency: "INR" }, stock: 15 },
      ],
    },
    {
      name: "Nike Phenom Elite Running Tights",
      description: "Built for long-distance runs these tights offer targeted support and ventilation exactly where you need it. Four-way stretch fabric moves with your body.",
      images: [jogImg(1), jogImg(2), jogImg(3)],
      price: { amount: 4495, currency: "INR" },
      category: "Mens Bottoms",
      colourShown: "Black/Reflective Silver",
      styleCode: "BV4756-011",
      stock: 60,
      seller: s,
      variants: [
        { name: "S",  price: { amount: 4495, currency: "INR" }, stock: 12 },
        { name: "M",  price: { amount: 4495, currency: "INR" }, stock: 18 },
        { name: "L",  price: { amount: 4495, currency: "INR" }, stock: 15 },
        { name: "XL", price: { amount: 4495, currency: "INR" }, stock: 8  },
      ],
    },
    {
      name: "Nike Windrunner Jacket",
      description: "The iconic Windrunner jacket has been a Nike staple since 1978. The signature chevron across the chest and colourblock design make it instantly recognisable.",
      images: [jackImg(1), jackImg(2), jackImg(3), jackImg(4)],
      price: { amount: 8995, currency: "INR" },
      category: "Mens Jackets",
      colourShown: "University Blue/White/Midnight Navy",
      styleCode: "DA0001-456",
      stock: 30,
      seller: s,
      variants: [
        { name: "S",   price: { amount: 8995, currency: "INR" }, stock: 6  },
        { name: "M",   price: { amount: 8995, currency: "INR" }, stock: 10 },
        { name: "L",   price: { amount: 8995, currency: "INR" }, stock: 8  },
        { name: "XL",  price: { amount: 8995, currency: "INR" }, stock: 4  },
        { name: "XXL", price: { amount: 8995, currency: "INR" }, stock: 0  },
      ],
    },
  ];

  const inserted = await Product.insertMany(products);
  console.log(`Seeded ${inserted.length} products:`);
  inserted.forEach((p) => console.log(`  [${p.category}] ${p.name} — ${p._id}`));

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
