export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin';
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}
