import { jwtVerify, SignJWT } from 'jose';

// Secret key for JWT signing and verification
// In a real app, this would be an environment variable
const JWT_SECRET = new TextEncoder().encode('your-secret-key-here');

// User type
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Generate a JWT token
export async function generateToken(user: User): Promise<string> {
  return new SignJWT({ 
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as User;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Mock function to validate credentials (in a real app, this would check against a database)
export async function validateCredentials(email: string, password: string): Promise<User | null> {
  // For demo purposes only - in a real app, you would check against a database
  if (email === 'admin@example.com' && password === 'admin123') {
    return {
      id: '1',
      name: 'Admin User',
      email,
      role: 'admin',
    };
  }
  return null;
}

// Set auth cookie
export function setAuthCookie(token: string): void {
  document.cookie = `adminToken=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict; Secure`;
}

// Remove auth cookie
export function removeAuthCookie(): void {
  document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Strict; Secure';
}

// Get auth cookie
export function getAuthCookie(): string | null {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('adminToken='));
  return authCookie ? authCookie.trim().substring('adminToken='.length) : null;
} 