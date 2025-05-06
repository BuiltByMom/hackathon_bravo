export type Contact = {
  id: string;
  userId: string;
  name: string;
  email: string;
  tag: string;
};

export interface Wallet {
  id: string;
  address: string;
  passkey: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  type: 'crypto' | 'nft' | 'token';
  name: string;
  amount: string;
  symbol?: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  assetId: string;
  recipientEmail: string;
  status: 'pending' | 'claimed' | 'expired';
  createdAt: string;
  claimedAt?: string;
}

export interface SendRequest {
  email: string;
  assetId: string;
  amount: number;
}

export interface SendResponse {
  id: string;
  magicLink: string;
}

export interface ClaimResponse {
  id: string;
  type: string;
  amount: string;
  walletAddress: string;
}

export interface SignupRequest {
  email: string;
  tag: string;
  password: string;
}

export interface LoginRequest {
  email?: string;
  tag?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    tag: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export interface LogoutRequest {
  token: string;
}

export interface AuthError {
  message: string;
  status: number;
}

// User related types
export type User = {
  id: string;
  email: string;
  tag: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateUserInput = {
  email: string;
  tag: string;
  password: string;
};

export type LoginInput = {
  email?: string;
  tag?: string;
  password: string;
};

// Auth related types
export type AuthResponse = {
  token: string;
  userId: string;
};

export type SignupResponse = {
  message: string;
  userId: string;
};

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

// Error types
export type ApiError = {
  error: string;
  status: number;
};

// Request types
export type AuthenticatedRequest = {
  userId: string;
};

// Validation types
export type ValidationError = {
  field: string;
  message: string;
};

// Environment types
export type Environment = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
};
