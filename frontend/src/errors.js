export class InvalidEndpointError extends Error {
    constructor(endpoint, options) {
        super(`${endpoint} is not a valid endpoint!`, options);
    }
}

export class InvalidStringError extends Error {
    constructor(variable, options) {
        super(`${variable} is not a valid string!`, options);
    }
}