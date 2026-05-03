/**
 * Signup API Route
 * Creates a new user account with hashed password
 */

import { hash } from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword }: SignupRequest =
      await req.json();

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return Response.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed',
      },
      { status: 500 }
    );
  }
}
