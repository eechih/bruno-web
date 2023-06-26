import awsExports from '@/aws-exports'
import { API, GRAPHQL_AUTH_MODE } from '@/lib/aws'

API.configure(awsExports)

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never

type ExtractData<T> = T extends { data: object } ? T['data'] : never

export async function graphql<T>({
  query,
  variables,
  authMode = GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
  authToken
}: {
  query: string
  variables?: ExtractVariables<T>
  authMode?: keyof typeof GRAPHQL_AUTH_MODE
  authToken?: string
}): Promise<T | never> {
  const result = await API.graphql<ExtractData<T>>({
    query,
    variables,
    authMode,
    authToken
  })

  if (result.errors) {
    throw result.errors[0]
  }

  if (!result.data) {
    throw new Error('No data returned')
  }

  return {
    variables,
    data: result.data
  } as T
}
