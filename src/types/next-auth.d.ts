import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      auth_token: string;
      first_name: string;
      last_name: string;
      phone: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    auth_token: string;
    first_name: string;
    last_name: string;
    phone: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    auth_token: string;
    role: string;
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  }
}
