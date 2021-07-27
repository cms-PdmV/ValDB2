import { useEffect } from "react";
import { ReactElement } from "react";
import { userService } from "../services";
import { getUser, setUser } from "../storages/user";
import { User } from "../types";

interface AuthPageInterface {
  setUser: (user: User) => void
}

export function AuthPage(prop: AuthPageInterface): ReactElement {

  useEffect(() => {
    const storedUser = getUser()
    if (storedUser) {
      handleSetUser(storedUser)
    }
  }, [])

  const handleSetUser = (userid: string) => {
    userService.get(userid).then(data => {
      if (data.id) {
        setUser(data.id)
        prop.setUser(data)
      }
    })
  }

  return (
    <div>
      <p>authenticating...</p>
      {/* temp */}
      <div>
        <button onClick={() => handleSetUser('60ffe0a2273e27d0a613a3d8')}>admin</button><br />
        <button onClick={() => handleSetUser('60ffe192273e27d0a613a3dc')}>validator</button><br />
        <button onClick={() => handleSetUser('60ffe228273e27d0a613a3e0')}>user</button><br />
        <button onClick={() => handleSetUser('60ffe346273e27d0a613a3e3')}>test user</button><br />
      </div>
    </div>
  )
}