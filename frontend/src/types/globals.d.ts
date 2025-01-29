export { }

// Create a type for the roles
export type Roles = 'customer' | 'vendor' | 'admin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
