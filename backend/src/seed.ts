import "dotenv/config";
import { connectDB } from "./config/db";
import Service from "./models/Service";
import Product from "./models/Product";

async function seed(): Promise<void> {
  await connectDB();
  const services = [
    { name: "General Health Checkup", description: "A friendly nose-to-tail wellness examination.", price: 2500, duration: 30 },
    { name: "Vaccination", description: "Routine vaccinations and preventive health support.", price: 3500, duration: 25 },
    { name: "Pet Grooming", description: "Bath, brush and basic grooming care.", price: 3000, duration: 60 },
    { name: "Dental Care", description: "Oral health assessment and dental hygiene guidance.", price: 4000, duration: 40 }
  ];
  for (const item of services) {
    await Service.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
  }
  const products = [
    { name: "Adult Dog Food 1kg", description: "Complete everyday nutrition for adult dogs.", category: "Food", price: 1800, stock: 20 },
    { name: "Adult Cat Food 1kg", description: "Balanced daily nutrition for adult cats.", category: "Food", price: 1950, stock: 20 },
    { name: "Training Treats", description: "Small bite-size treats for reward-based training.", category: "Treats", price: 850, stock: 30 }
  ];
  for (const item of products) {
    await Product.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
  }
  console.log("Default services and shop products are ready");
  await import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
}
seed().catch(async (error: Error) => {
  console.error(error);
  await import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
  process.exit(1);
});
