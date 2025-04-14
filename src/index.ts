import express, { Router, type Response, type Request } from 'express';
import appRouter from './routes';
import cookieParser from 'cookie-parser';
import './db/mongodb_connection';
import { config } from './config';
import session from 'express-session';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// cookie setup
app.use(cookieParser(config.cookie.secret));

app.use(
  session({
    secret: config.cookie.secret, // the same sercet with cookieParser
    saveUninitialized: false,
    resave: false,

    cookie: {
      maxAge: config.cookie.maxAge,
      path: '/',
      secure: false,
      httpOnly: true,
      domain: '*',
      sameSite: 'lax',
    },
  }),
);

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Cookie', 'Access-Control-Allow-Credentials', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Swagger documentation route with options
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Clinics Management API Documentation',
  }),
);

app.use('/api', appRouter);

app.get('/set', (req, res) => {
  req.session.phoneNumber = '0337170203p';
  res.send('Hello World');
});

app.get('/get', (req, res) => {
  console.log(req.session.phoneNumber);
  res.send('Hello World' + req.session.phoneNumber);
});

app.get('/', (req, res) => {
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
        onclick="window.location.href='/api-docs'">
        Go to API Documentation
      </button>
      <button 
        style="background-color: blue; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 4px; margin-left: 10px; hover: background-color: darkblue;" 
        onclick="window.location.href='/swagger.json'">
        View Swagger JSON
      </button>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation is available at http://localhost:${PORT}/api-docs`);
});
