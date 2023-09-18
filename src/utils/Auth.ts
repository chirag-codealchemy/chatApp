import { AuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import mongoPromise from './db.config'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/providers/oauth

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(mongoPromise, {
    collections: {
      Users: 'users',
      Accounts: 'accounts',
      // Sessions: 'sessions', // for DB sessions
      VerificationTokens: 'verificationTokens',
    },
    databaseName: 'chatApp',
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          // Find your user in the database using MongoDBAdapter
          if (
            authOptions?.adapter?.getUserByEmail &&
            authOptions?.adapter.createUser
          ) {
            const user = await authOptions?.adapter?.getUserByEmail(
              credentials?.email!,
            )
            // console.log('🚀 ~ file: Auth.ts:39 ~ authorize ~ user:', user)
            if (!user) {
              const user = await authOptions?.adapter.createUser({
                emailVerified: new Date(),
                email: credentials?.email!,
                image: 'https://picsum.photos/300/300',
                name: credentials?.email.split('@')[0],
                // @ts-ignore
                password: credentials?.password,
              })
              // console.log('🚀 ~ file: Auth.ts:52 ~ authorize ~ user:', user)
              return user
              // @ts-ignore
            } else if (user?.password === credentials?.password) {
              return user
            } else {
              return null
            }
          }
        } catch (error) {
          console.log('🚀 ~ file: Auth.ts:32 ~ authorize ~ error:', error)
        }
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // @ts-ignore
    async signIn({ account, profile }) {
      // console.log('🚀 ~ file: Auth.ts:71 ~ signIn ~ -----> :', account, profile)
      if (account?.provider === 'google') {
        // @ts-ignore
        if (!profile?.email_verified) return false

        // @ts-ignore
        const user = await authOptions?.adapter?.getUserByEmail(profile?.email!)

        // console.log('🚀 ~ file: Auth.ts:78 ~ signIn ~ user:', user)
        if (!user) {
          // @ts-ignore
          const newUser = await authOptions?.adapter?.createUser({
            emailVerified: new Date(),
            email: profile?.email!,
            image: profile?.image,
            name: profile?.name,
          })
          // console.log('🚀 ~ file: Auth.ts:89 ~ signIn ~ newUser:', newUser)
          return newUser
        }
        return user
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.accessToken = user.access_token
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken
      // @ts-ignore
      session.user.id = token.id

      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
