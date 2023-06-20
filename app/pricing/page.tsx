'use client'

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  NotAuthorizedException
} from '@aws-sdk/client-cognito-identity-provider'
import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'

const REGION_NAME = 'us-east-1'
// const USER_POOL_ID = 'us-east-1_RjkpVltDT'
const CLIENT_ID = '71835ev9kvsehmtervjhqvvl12'
const CLIENT_SECRET = 'oka0lpkms7epqatkhqmdpu0m8949dalc3tjm1aphe0jpobinia2'

export default function Page() {
  const session = useSession()
  console.log('session', session)

  const getUser = async () => {
    console.log('getUser')
    const client = new CognitoIdentityProviderClient({
      region: REGION_NAME
    })

    const command = new GetUserCommand({
      AccessToken: session.data?.accessToken ?? ''
    })

    console.log('command', command)
    try {
      const response = await client.send(command)
      console.log(response)
    } catch (error) {
      console.error(error)
      if (error instanceof NotAuthorizedException) {
        const err = error as NotAuthorizedException
        console.log('NotAuthorizedException')
        console.log(err.name)
        console.log(err.message)
      }
    }
  }

  const refreshToken = async () => {
    console.log('refreshToken')
    const client = new CognitoIdentityProviderClient({
      region: REGION_NAME
    })

    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,

      AuthFlow: AuthFlowType.REFRESH_TOKEN,
      AuthParameters: {
        REFRESH_TOKEN: session.data?.refreshToken ?? '',
        SECRET_HASH: CLIENT_SECRET
      }
    })

    try {
      const response = await client.send(command)
      console.log(response.AuthenticationResult)
      console.log(response)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      Pricing
      <Button onClick={refreshToken}>[Refresh Token]</Button>
      <Button onClick={getUser}>[Get User]</Button>
    </>
  )
}
