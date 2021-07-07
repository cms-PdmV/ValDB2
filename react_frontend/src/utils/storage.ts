export const getUser = () => {
    localStorage.getItem('token')
}

export const saveUser = (token: string) => {
    localStorage.setItem('token', 'testtoken')
}