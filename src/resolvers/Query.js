const Query = {
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
    users(parent, args, {
        db
    }, info) {
        if (!args.query) {
            return db.users
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, {
        db
    }, info) {
        if (!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent, args, {
        db
    }, info) {
        return db.comments
    }
}

export { Query as default }