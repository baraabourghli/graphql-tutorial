import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        title() {
            return 'Hat'
        },
        price() {
            return 3.99
        },
        releaseYear() {
            return null
        },
        rating() {
            return 4.5
        },
        inStock() {
            return false
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('server is up!')
})