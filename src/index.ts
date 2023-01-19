import { HttpFunction } from '@google-cloud/functions-framework'

const test: HttpFunction = (req, res) => {
  res.send('Hello, World')
}

export {
  test,
}
