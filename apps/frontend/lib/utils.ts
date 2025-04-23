import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


    import { fido2Get, fido2Create } from '@ownid/webauthn';

export function cl(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export async function registerStart(username: string) {
  console.log('registerStart', username);
  const publicKey = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/passkey/register/start`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  }); 
  const fidoData = await fido2Create(publicKey, username);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/passkey/register/finish`, {
    method: 'POST',
    body: JSON.stringify(fidoData),
  });
  console.log(response);
} 

export async function loginStart(username: string) {
  console.log('loginStart', username);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/passkey/login/start`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  const options = (await response.json()) as PublicKeyCredentialRequestOptions;
  const assertion = await fido2Get(options, username);
  await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/passkey/login/finish`, {
    method: 'POST',
    body: JSON.stringify(assertion),
  });
  console.log('Login successful');
}