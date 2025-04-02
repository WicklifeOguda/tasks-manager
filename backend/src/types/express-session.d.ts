import 'express-session';

declare module 'express-session' {
  interface SessionData {
    // custom properties
    userId?: string;
    testValue?: string;
    
  }
}