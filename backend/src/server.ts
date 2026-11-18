import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/errors";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "PetCare API" }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
connectDB().then(() => app.listen(port, () => console.log(`PetCare API running on ${port}`)))
  .catch((error: Error) => { console.error(error); process.exit(1); });
