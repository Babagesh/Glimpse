let Data = {
    user: null,
}

export function updateUser(user) {
    return new Promise((Resolve, Reject) => {
        Data = user;
        Resolve()
    });
}

export function getUser(user) {
    return Data;
}