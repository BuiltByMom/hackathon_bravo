import { v4 as uuidv4 } from "uuid"

export function generateWalletAddress(): string {
  // In a real application, this would generate a proper blockchain wallet address
  // For now, we'll just return a mock address
  return `0x${uuidv4().replace(/-/g, "")}`
}

export function generatePasskey(): string {
  // In a real application, this would generate a proper passkey
  // For now, we'll just return a UUID
  return uuidv4()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateMagicLink(baseUrl: string, id: string): string {
  return `${baseUrl}/claim/${id}`
}

export function mockSendEmail(to: string, subject: string, body: string): void {
  // In a real application, this would send an actual email
  // For now, we'll just log to the console
  console.log("=== Mock Email ===")
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`) 
  console.log("================")
} 