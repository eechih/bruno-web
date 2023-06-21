import logger from 'loglevel'

const env = process.env.NODE_ENV

if (env === 'production') {
  logger.setDefaultLevel('info')
} else {
  logger.setDefaultLevel('debug')
}

export default logger
