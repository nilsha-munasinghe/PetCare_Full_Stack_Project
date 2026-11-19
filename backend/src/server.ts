import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/errors";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "PetCare API" }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
async function start(): Promise<void> {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be configured");
  }
  await connectDB();
  app.listen(port, () => console.log(`PetCare API running on port ${port}`));
}
start().catch((error: Error) => {
  console.error("Unable to start PetCare API:", error.message);
  process.exit(1);
});
