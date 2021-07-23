export const getUser = (): void => {
    localStorage.getItem('token')
}

export const saveUser = (token: string): void => {
    localStorage.setItem('token', token)
}