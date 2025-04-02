import express, { Router, type Response, type Request } from "express";
import appRouter from "./routes";
import cookieParser from "cookie-parser";
import './db/mongodb_connection';
import { config } from "./config";
import session from "express-session";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// cookie setup
app.use(cookieParser(config.cookie.secret));

app.use(session({
  secret: config.cookie.secret, // the same sercet with cookieParser
  saveUninitialized : false,
  resave: false,
  
  cookie: {
    maxAge: config.cookie.maxAge,
    path: '/',
    secure: false,
    httpOnly: true,
    domain: '54.169.139.70'
  }
}))

app.use(cors({
  
  origin: 'http://localhost:3000',
  credentials: true,  
  allowedHeaders: ['Content-Type', 'Cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

app.use("/api", appRouter);



app.get("/", (req, res) => {
    console.log(req.session.phoneNumber);
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