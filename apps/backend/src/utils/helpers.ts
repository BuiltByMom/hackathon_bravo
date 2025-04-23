export function getNewChallenge(): string {
  return Math.random().toString(36).substring(2);
}
export function convertChallenge(challenge: string): string {
  return btoa(challenge).replace(/=/g, '');
}
