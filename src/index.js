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
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'Another post',
    body: 'Great stuff goes here.',
    published: false,
    author: '2'
}, {
    id: '3',
    title: 'Yet another post',
    body: 'More good text in here.',
    published: true,
    author: '1'
}]

const comments = [{
    id: '1',
    text: 'My first comment',
    author: '1',
    post: '1'
}, {
    id: '2',
    text: 'Another comment',
    author: '2',
    post: '1'
}, {
    id: '3',
    text: 'Yet another comment',
    author: '2',
    post: '2'
}, {
    id: '4',
    text: 'Final comment',
    author: '3',
    post: '3'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
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