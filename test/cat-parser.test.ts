import * as fs from 'fs'
import { join } from 'path'
import { parse } from './cat-parser'

test('parse post', () => {
  const post = fs.readFileSync(
    join(__dirname, 'posts_3421536928111978.txt'),
    'utf8'
  )
  const lines = parse(post)
  console.log('lines', lines)
})
