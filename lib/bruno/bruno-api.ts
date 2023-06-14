import { getSession } from 'next-auth/react'

import { GRAPHQL_AUTH_MODE, GraphQLAPIClass } from '@/lib/GraphQLAPI'

const graphqlEndpoint = process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT!

export const api = new GraphQLAPIClass({
  aws_appsync_graphqlEndpoint: graphqlEndpoint
})

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never

type ExtractData<T> = T extends { data: object } ? T['data'] : never

export async function graphql<T>({
  query,
  variables
}: {
  query: string
  variables?: ExtractVariables<T>
}): Promise<T | never> {
  const session = await getSession()

  const result = await api.graphql<ExtractData<T>>({
    query: query,
    variables: variables,
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: session?.access_token
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
