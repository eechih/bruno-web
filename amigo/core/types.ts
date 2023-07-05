export interface AWSConfig {
  Auth?: object
  API?: object
  Storage?: object
}

export interface ICredentials {
  accessKeyId: string
  sessionToken: string
  secretAccessKey: string
  identityId: string
  authenticated: boolean
  // Long term creds do not provide an expiration date
  expiration?: Date
}

export interface CredentialsOptions {
  userPoolId?: string
  userPoolWebClientId?: string
  userPoolWebClientSecret?: string
  identityPoolId?: string
  region?: string
  identityPoolRegion?: string
}
