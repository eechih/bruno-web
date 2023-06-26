import logger from '@/lib/logger'
import { AWSConfig } from './types'

export const parseAWSExports = (config: any): AWSConfig => {
  const awsConfig: AWSConfig = {}

  // Auth
  if (config['aws_cognito_identity_pool_id'] || config['aws_user_pools_id']) {
    awsConfig.Auth = {
      userPoolId: config['aws_user_pools_id'],
      userPoolWebClientId: config['aws_user_pools_web_client_id'],
      userPoolWebClientSecret: config['aws_user_pools_web_client_secret'],
      region: config['aws_cognito_region'],
      identityPoolId: config['aws_cognito_identity_pool_id'],
      identityPoolRegion: config['aws_cognito_region']
    }
  }

  // Storage
  if (config['aws_user_files_s3_bucket']) {
    awsConfig.Storage = {
      bucket: config['aws_user_files_s3_bucket'],
      region: config['aws_user_files_s3_bucket_region']
    }
  }

  logger.debug('parse config', config, 'to awsConfig', awsConfig)
  return awsConfig
}
