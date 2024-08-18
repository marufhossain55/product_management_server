# Focus element

## use the server code with

## How to run

- clone or download

  _Clone the Repository_

  ```bash
  git clone https://github.com/marufhossain55/product_management_server

  ```

- npm i
- env setup
- run (nodemon start or nodemon index.js)

## usages packages

- express
- cors
- dotenv
- mongodb (server)

## set up server with express

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
res.send('Hello from product management')
})

app.listen(port, () => {
console.log(Example app listening on port ${port})
})

## and need thing is included according to rules
