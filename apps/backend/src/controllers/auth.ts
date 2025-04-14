import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(), 
  password: z.string().min(8),
  tag: z
    .string()
    .regex(/^@[a-z0-9_]{3,20}$/, "Tag must start with @ and contain 3-20 lowercase letters, numbers, or underscores")
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  tag: z.string().regex(/^@[a-z0-9_]{3,20}$/, "Tag must start with @ and contain 3-20 lowercase letters, numbers, or underscores").optional(),
  password: z.string(),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📝 Received signup request:", { ...req.body, password: "[REDACTED]" });

    // Validate request body
    const { email, password, tag } = signupSchema.parse(req.body);
    console.log("✅ Validated signup input");

    // Check if user already exists with email or tag
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { tag },
        ],
      },
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email ? "email" : "tag";
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
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET ?? "your-super-secret-jwt-key-change-this-in-production",
      { expiresIn: "24h" }
    );
    console.log("✅ JWT token generated");

    // Return user data and token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        tag: user.tag,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error during signup:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid request format",
        errors: error.errors,
      });
      return;
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
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
      where: loginType === 'email' 
        ? { email: identifier }
        : { tag: identifier }
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
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET ?? "your-super-secret-jwt-key-change-this-in-production",
      { expiresIn: '1min' }
    );

    console.log(`✅ [LOGIN] User logged in successfully with ${loginType}:`, { identifier });

    // Return user data with tag
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        tag: user.tag,
      },
    });
  } catch (error) { 
    if (error instanceof z.ZodError) {
      console.log('🔴 [LOGIN] Validation error:', error.errors);
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('🔴 [LOGIN] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};