import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const DB_FILE = path.resolve(process.cwd(), "db.json");

// Initial Data
const INITIAL_DATA = {
  users: [
    { id: "1", name: "Serafin", username: "serafin", password: "12345", role: "Administrador", email: "serafin@pos.com", avatar: "S", avatarType: 'initial', theme: 'light' },
    { id: "2", name: "Cajero 1", username: "cajero1", password: "123", role: "Cajero", email: "cajero1@pos.com", avatar: "C", avatarType: 'initial', theme: 'light' }
  ],
  services: [
    { id: '1', name: 'Copias', price: 100 },
    { id: '2', name: 'Impresiones', price: 200 },
    { id: '3', name: 'Tratamiento de textos', price: 1000 },
    { id: '4', name: 'Redactar instancias', price: 1500 },
    { id: '5', name: 'Escáner', price: 500 },
    { id: '6', name: 'Plastificación A3', price: 1000 },
    { id: '7', name: 'Plastificación A4', price: 500 },
    { id: '8', name: 'Plastificación A5', price: 500 },
    { id: '9', name: 'Encuadernación', price: 3000 },
    { id: '10', name: 'Tarjetas de Bach', price: 5000 },
    { id: '11', name: 'Tarjetas de visita', price: 3000 },
    { id: '12', name: 'Currículo vitae', price: 1500 },
    { id: '13', name: 'Sistema Operativo', price: 25000 },
    { id: '14', name: 'Instalación de Office', price: 10000 },
  ],
  transactions: [],
  expenses: [],
  dailyRecords: []
};

// Database Helper
const getDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
};

const saveDb = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // --- API Routes ---

  // Daily Records
  app.get("/api/daily-records", (req, res) => {
    const db = getDb();
    res.json(db.dailyRecords || []);
  });

  app.post("/api/daily-records", (req, res) => {
    const db = getDb();
    const newRecord = { ...req.body, id: Date.now().toString() };
    if (!db.dailyRecords) db.dailyRecords = [];
    db.dailyRecords.push(newRecord);
    saveDb(db);
    res.json(newRecord);
  });

  // Users
  app.get("/api/users", (req, res) => {
    const db = getDb();
    res.json(db.users);
  });

  app.post("/api/register", (req, res) => {
    const db = getDb();
    const { name, username, password, phone } = req.body;
    
    if (db.users.find((u: any) => u.username === username)) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      username,
      password,
      phone,
      role: "Cajero", // Default role for new registrations
      avatar: name.charAt(0).toUpperCase(),
      email: `${username}@pos.com`
    };

    db.users.push(newUser);
    saveDb(db);
    res.json(newUser);
  });

  app.post("/api/login", (req, res) => {
    const db = getDb();
    const { username, password } = req.body;
    const user = db.users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  });

  app.put("/api/users/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    const updatedUser = req.body;
    db.users = db.users.map((u: any) => u.id === id ? { ...u, ...updatedUser } : u);
    saveDb(db);
    res.json(updatedUser);
  });

  app.delete("/api/users/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.users = db.users.filter((u: any) => u.id !== id);
    saveDb(db);
    res.sendStatus(204);
  });

  app.post("/api/recover-password", (req, res) => {
    const db = getDb();
    const { phone } = req.body;
    const user = db.users.find((u: any) => u.phone === phone);
    if (user) {
      // In a real app, send SMS here. For demo, we return the password or a code.
      res.json({ success: true, message: "Código enviado", password: user.password });
    } else {
      res.status(404).json({ error: "Número de teléfono no encontrado" });
    }
  });

  // Services
  app.get("/api/services", (req, res) => {
    const db = getDb();
    res.json(db.services);
  });

  app.post("/api/services", (req, res) => {
    const db = getDb();
    const newService = { ...req.body, id: Date.now().toString() };
    db.services.push(newService);
    saveDb(db);
    res.json(newService);
  });

  app.put("/api/services/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.services = db.services.map((s: any) => s.id === id ? req.body : s);
    saveDb(db);
    res.json(req.body);
  });

  app.delete("/api/services/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.services = db.services.filter((s: any) => s.id !== id);
    saveDb(db);
    res.sendStatus(204);
  });

  // Transactions
  app.get("/api/transactions", (req, res) => {
    const db = getDb();
    res.json(db.transactions);
  });

  app.post("/api/transactions", (req, res) => {
    const db = getDb();
    const newTransaction = { ...req.body, id: Date.now().toString() };
    db.transactions.push(newTransaction);
    saveDb(db);
    res.json(newTransaction);
  });

  app.put("/api/transactions/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.transactions = db.transactions.map((t: any) => t.id === id ? req.body : t);
    saveDb(db);
    res.json(req.body);
  });

  app.delete("/api/transactions/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.transactions = db.transactions.filter((t: any) => t.id !== id);
    saveDb(db);
    res.sendStatus(204);
  });

  // Expenses
  app.get("/api/expenses", (req, res) => {
    const db = getDb();
    res.json(db.expenses);
  });

  app.post("/api/expenses", (req, res) => {
    const db = getDb();
    const newExpense = { ...req.body, id: Date.now().toString() };
    db.expenses.push(newExpense);
    saveDb(db);
    res.json(newExpense);
  });

  app.put("/api/expenses/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.expenses = db.expenses.map((e: any) => e.id === id ? req.body : e);
    saveDb(db);
    res.json(req.body);
  });

  app.delete("/api/expenses/:id", (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.expenses = db.expenses.filter((e: any) => e.id !== id);
    saveDb(db);
    res.sendStatus(204);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
