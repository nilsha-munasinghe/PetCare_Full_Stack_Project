import "dotenv/config";
import { connectDB } from "./config/db";
import Service from "./models/Service";

async function seed() {
  await connectDB();
  const defaults = [
    { name: "General Health Checkup", description: "A friendly nose-to-tail wellness examination.", price: 2500, duration: 30 },
    { name: "Vaccination", description: "Routine vaccinations and preventive health support.", price: 3500, duration: 25 },
    { name: "Pet Grooming", description: "Bath, brush and basic grooming care.", price: 3000, duration: 60 },
    { name: "Dental Care", description: "Oral health assessment and dental hygiene guidance.", price: 4000, duration: 40 }
  ];
  for (const item of defaults) await Service.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
  console.log("Default services added");
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
