import { GraphQLServer } from 'graphql-yoga'

// Demo Data
const users = [{
    id: '1',
    name: 'Baraa',
    email: 'baraa@example.com',
    age: 30
}, {
    id: '2',
    name: 'Farah',
    email: 'farah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
    age: 44
}]

const posts = [{
    id: '1',
    title: 'My first post',
    body: 'Awesome text for my first post!',
    published: true
}, {
    id: '2',
    title: 'Another post',
    body: 'Great stuff goes here.',
    published: false
}, {
    id: '3',
    title: 'Yet another post',
    body: 'More good text in here.',
    published: true
}]


// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: '123',
                name: 'Baraa',
                email: 'baraa@example.com'
            }
        },
        post() {
            return {
                id: '222',
                title: 'Awesome post!',
                body: 'Great text for the awesome post!!',
                published: true
            }
        },
        users(parent, args, ctx, info) {
            if(!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
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