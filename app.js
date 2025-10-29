import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/inventory", (req, res) => res.render("inventory"));
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));

// 404 handler
app.use((req, res) => res.status(404).send("Page Not Found"));

// Start server on port 5050
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
