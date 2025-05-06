"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const contacts_1 = require("./routes/contacts");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Request logging middleware
app.use((req, _, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.authRouter);
app.use('/api/contacts', contacts_1.contactsRouter);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔗 API URL: http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
