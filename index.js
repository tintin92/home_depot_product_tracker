require("dotenv").config();
const axios = require("axios");
const mysql = require("mysql2/promise");
const cheerio = require("cheerio")
U

console.log('Connecting with:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD.length + ' characters',
  database: process.env.DB_NAME
});

// Url for product on HD
const url =
  "https://www.homedepot.com/p/Milwaukee-M18-FUEL-PACKOUT-18-Volt-Lithium-Ion-Cordless-2-5-Gal-Wet-Dry-Vacuum-and-M18-5-0-Ah-Lithium-Ion-XC-Battery-Pack-0970-20-48-11-1850/326520830";

// User agent to mimic a browser
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};

// Create MySQL connection
const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
  });
};
// 
// const price = $("span.sui-font-display").text().trim();
// Schedule the next scrape
const scheduleNextScrape = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(Math.floor(Math.random() * 24));
  tomorrow.setMinutes(Math.floor(Math.random() * 60));
  tomorrow.setSeconds(0);
  tomorrow.setMilliseconds(0);

  const delay = tomorrow.getTime() - now.getTime();
  console.log(`🕒 Next scrape scheduled at: ${tomorrow.toLocaleString()}`);

  setTimeout(scrapePrice, delay);
};

// Scrape and save to database 
const scrapePrice = async () => {
  try {
    const response = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(response.data);

    const title = $("h1.sui-h4-bold").text().trim();
    const price = $("span.sui-font-display").text().trim();   
    const timestamp = new Date();

    const conn = await getConnection();
    await conn.execute(
      'INSERT INTO price_logs (timestamp, product_name, price, product_url) VALUES (?, ?, ?, ?)',
      [timestamp, title, price, url]
    );
    await conn.end();

    console.log(`✔ Saved ${title} @ ${price} on ${timestamp.toISOString()}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  scheduleNextScrape();
};

// Start
scrapePrice();