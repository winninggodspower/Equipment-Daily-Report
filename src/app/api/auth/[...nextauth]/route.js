import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

let ADMIN_EMAIL = process.env.ADMIN_EMAIL 
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                const user = {id: '1', name: "J Smith", email: "admin@gmail.com"}

                if (credentials.username === ADMIN_EMAIL || credentials.password === ADMIN_PASSWORD) {
                    return user;
                }
                else {
                    // Return null if user data could not be retrieved
                    return null
                }

            }
        })
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }