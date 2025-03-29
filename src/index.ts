import express, { Router, type Response, type Request } from "express";
import appRouter from "./routes";
import cookieParser from "cookie-parser";
import './db/mongodb_connection';
import { config } from "./config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// cookie setup
app.use(cookieParser(config.cookie.secret));

app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.send("Hello, Bun + Express");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});