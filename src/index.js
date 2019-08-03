import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo Data
let users = [{
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

let posts = [{
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

let comments = [{
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

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)
            
            if(emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error('User not found')
            }

            const deleteUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id

                if(match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)

            return deleteUsers[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post && post.published)
            
            if(!userExists) {
                throw new Error('User not found')
            }

            if (!postExists) {
                throw new Error('Post not found')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment
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