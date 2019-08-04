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


const db = {
    users,
    posts,
    comments
}

export { db as default }