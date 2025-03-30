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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clinics Management Server</title>
    </head>
    <body>
      <h1>Welcome to the Clinics Management Server</h1>
      <button 
        style="background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 4px; hover: background-color: darkgreen;" 
        onclick="window.location.href='/docs'">
        Go to Docs
      </button>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});