import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { userService } from '../services/dataService';
import { User } from '../models/User';
import { CreateUserInput } from '../models/Contact';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tag: z
    .string()
    .regex(
      /^@[a-z0-9_]{3,20}$/,
      'Tag must start with @ and contain 3-20 lowercase letters, numbers, or underscores'
    ),
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  tag: z
    .string()
    .regex(
      /^@[a-z0-9_]{3,20}$/,
      'Tag must start with @ and contain 3-20 lowercase letters, numbers, or underscores'
    )
    .optional(),
  password: z.string(),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  console.log('[SIGNUP] Signup request received:', req.body);
  try {
    // Validate request body
    const { email, password, tag } = signupSchema.parse(req.body);

    console.log('[SIGNUP] Signup request received:', { email, password, tag });

    // Check if user already exists with email or tag
    const existingUserByEmail = userService.getByEmail(email);
    const existingUserByTag = userService.getByTag(tag);

    console.log('[SIGNUP] Existing user by email:', existingUserByEmail);
    console.log('[SIGNUP] Existing user by tag:', existingUserByTag);

    if (existingUserByEmail || existingUserByTag) {
      const duplicateField = existingUserByEmail ? 'email' : 'tag';
      console.log(`❌ User already exists with ${duplicateField}`);
      res.status(400).json({
        message: `User already exists with this ${duplicateField}`,
      });
      return;
    }

    // Create user with provided hashed password
    const userInput: CreateUserInput = {
      email,
      password, // Using the provided hashed password
      tag,
    };
    const user = userService.create(userInput);
    console.log(`✅ User created with ID: ${user.id}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '24h' }
    );

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Invalid request format',
        errors: error.errors,
      });
      return;
    }
    res.status(500).json({ message: 'Failed to create user' });
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
    const user =
      loginType === 'email' ? userService.getByEmail(identifier) : userService.getByTag(identifier);

    if (!user) {
      console.log(`🔴 [LOGIN] User not found with ${loginType}:`, { identifier });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password (assuming it's already hashed)
    const typedUser = user as User & { password: string };
    if (password !== typedUser.password) {
      console.log(`🔴 [LOGIN] Invalid password for user with ${loginType}:`, { identifier });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '1min' }
    );

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
