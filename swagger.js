const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })

const doc = {
    info: {
        title: 'Rec an Dec API',
        description: 'API para la aplicacion de gestion de egresos e ingresos Rec an Dec',
        contact: {
            name: "Igna Garcia", 
            url: "https://ignagarcia.vercel.app/", 
            email: "gnachoxp@gmail.com"
        }
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [{}],
    definitions: [{}]
}

const output = './doc/swagger.json'
const endpoints = ['./src/app.js']

console.log(`Generating ${output} of ${endpoints}`)
swaggerAutogen(output, endpoints, doc).then( () => {
    require('./server.js')
})