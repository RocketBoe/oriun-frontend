import CredentialsProvider from "next-auth/providers/credentials";
import { apiLogin } from "../../userLogin";
import { signOut } from "next-auth/react";

export const options = {
  pages: {
    signOut: "/PreguntasFrecuentes",   
    newUser: "/Convocatorias",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        entered_name: {
          label: "Name",
          type: "text",
          placeholder: "your-username",
        },
        entered_password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      // After retrieving the user object (which may contain user data) next js creates for us a session
      // object which is stored in a session cookie, where the user data is encrypted.
      async authorize(credentials) {
        try {
          // look for the user
          const user = await apiLogin.postUser(
            credentials.entered_name,
            credentials.entered_password
          );

          console.log("successfully gotten user tokens");
          console.log(user.data);

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // For persisting the role on the server side
    async jwt({ token, user }) {
      if (user) {
        token.access = user.data.access;
        token.refresh = user.data.refresh;
        token.type_user = user.data.type_user;
      }
      return token;
    },

    async session({ session, token }) {
      session.access = token.access;
      session.refresh = token.refresh;
      session.type_user = token.type_user;
      return session;
    },
  },
};

// After getting the user data we get the access & refresh tokens
// which should be used to:

// 1. the access token should be used to put it on the headers of our requests such that
// the server knows we are authenticated.
// 2. the refresh token should be used to put it on the request which allows us to get a new
// access token for continuing using the application

// It is worthwhile knowing that next js also has its own tokens.
// 1. next-auth.sesion-token : which allows accessing session data and knowing if the user is still logged
// in in a browser, client side session management.
// 2. next-auth.csfr-token: which protect us from cross side scripting attacks.

// pages: {
//   signIn: '/auth/signin',
//   signOut: '/auth/signout',
//   error: '/auth/error', // Error code passed in query string as ?error=
//   verifyRequest: '/auth/verify-request', // (used for check email message)
//   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
// }
