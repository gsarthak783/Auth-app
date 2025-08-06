import { TokenStorage } from './types';

/**
 * Default localStorage-based token storage
 * Works in browsers and React Native with AsyncStorage polyfill
 */
export class LocalTokenStorage implements TokenStorage {
  private accessTokenKey: string;
  private refreshTokenKey: string;

  constructor(keyPrefix = 'auth') {
    this.accessTokenKey = `${keyPrefix}_access_token`;
    this.refreshTokenKey = `${keyPrefix}_refresh_token`;
  }

  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.accessTokenKey);
  }

  setAccessToken(token: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.accessTokenKey, token);
  }

  getRefreshToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.refreshTokenKey, token);
  }

  clearTokens(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}

/**
 * Memory-based token storage (tokens lost on page refresh)
 * Useful for server-side rendering or when localStorage is not available
 */
export class MemoryTokenStorage implements TokenStorage {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }
}

/**
 * Cookie-based token storage (for SSR or when you prefer cookies)
 * Note: Requires proper HTTPS and SameSite configuration in production
 */
export class CookieTokenStorage implements TokenStorage {
  private accessTokenKey: string;
  private refreshTokenKey: string;

  constructor(keyPrefix = 'auth') {
    this.accessTokenKey = `${keyPrefix}_access_token`;
    this.refreshTokenKey = `${keyPrefix}_refresh_token`;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  private setCookie(name: string, value: string, days = 7): void {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  getAccessToken(): string | null {
    return this.getCookie(this.accessTokenKey);
  }

  setAccessToken(token: string): void {
    this.setCookie(this.accessTokenKey, token, 1); // 1 day for access token
  }

  getRefreshToken(): string | null {
    return this.getCookie(this.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    this.setCookie(this.refreshTokenKey, token, 7); // 7 days for refresh token
  }

  clearTokens(): void {
    this.deleteCookie(this.accessTokenKey);
    this.deleteCookie(this.refreshTokenKey);
  }
} 