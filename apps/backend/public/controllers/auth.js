"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    tag: zod_1.z
        .string()
        .regex(/^@[a-z0-9_]{3,20}$/, 'Tag must start with @ and contain 3-20 lowercase letters, numbers, or underscores'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    tag: zod_1.z
        .string()
        .regex(/^@[a-z0-9_]{3,20}$/, 'Tag must start with @ and contain 3-20 lowercase letters, numbers, or underscores')
        .optional(),
    password: zod_1.z.string(),
});
const signup = async (req, res) => {
    try {
        // Validate request body
        const { email, password, tag } = signupSchema.parse(req.body);
        // Check if user already exists with email or tag
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { tag }],
            },
        });
        if (existingUser) {
            const duplicateField = existingUser.email === email ? 'email' : 'tag';
            console.log(`❌ User already exists with ${duplicateField}`);
            res.status(400).json({
                message: `User already exists with this ${duplicateField}`,
            });
            return;
        }
        // Create user with provided hashed password
        const user = await prisma.user.create({
            data: {
                email,
                password, // Using the provided hashed password
                tag,
            },
        });
        console.log(`✅ User created with ID: ${user.id}`);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-this-in-production', { expiresIn: '24h' });
        // Return user data and token
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                tag: user.tag,
            },
            token,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: 'Invalid request format',
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({ message: 'Failed to create user' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, tag, password } = loginSchema.parse(req.body);
        // Determine if user is logging in with email or tag
        const loginType = email ? 'email' : 'tag';
        const identifier = email || tag;
        if (!identifier) {
            console.log('🔴 [LOGIN] No identifier provided');
            res.status(400).json({ error: 'Email or tag is required' });
            return;
        }
        // Find user by email or tag
        const user = await prisma.user.findFirst({
            where: loginType === 'email' ? { email: identifier } : { tag: identifier },
        });
        if (!user) {
            console.log(`🔴 [LOGIN] User not found with ${loginType}:`, { identifier });
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Verify password (assuming it's already hashed)
        if (password !== user.password) {
            console.log(`🔴 [LOGIN] Invalid password for user with ${loginType}:`, { identifier });
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-this-in-production', { expiresIn: '1min' });
        // Return user data with tag
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                tag: user.tag,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.log('🔴 [LOGIN] Validation error:', error.errors);
            res.status(400).json({ error: error.errors[0].message });
            return;
        }
        console.error('🔴 [LOGIN] Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
