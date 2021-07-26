// TODO: Rewrite this to production

const UserIdKey = 'userid'

export const setUser = (userid: string): void => {
    localStorage.setItem(UserIdKey, userid)
}

export const getUser = (): string | null => {
    return localStorage.getItem(UserIdKey)
}

export const removeUser = (): void => {
    localStorage.removeItem(UserIdKey)
}