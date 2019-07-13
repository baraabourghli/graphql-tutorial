const message = 'some message from myModule.js'

const name = 'Baraa'

const location = 'Kuala Lumpur'

const getGreeting = (name) => {
    return `Welcome to the course ${name}`
}

export { message, name, getGreeting, location as default }