import { userService } from "../services";
import { User } from "../types";

interface AuthPageInterface {
  setUser: (user: User) => void
}

export function AuthPage(prop: AuthPageInterface) {

  const demoHandleSetUser = (userid: string) => {
    userService.get(userid).then(data => prop.setUser(data))
  }

  return (
    <div>
      <p>authenticating...</p>
      {/* temp */}
      <div>
        <button onClick={() => demoHandleSetUser('60e90fbd8aa6fe6b6731a4b5')}>admin</button><br />
        <button onClick={() => demoHandleSetUser('60e910478aa6fe6b6731a4b7')}>validator</button><br />
        <button onClick={() => demoHandleSetUser('60e910daa0c89859e0ff0b41')}>user</button><br />
        <button onClick={() => demoHandleSetUser('60e9230a48d39ee6d7a7a217')}>test user</button><br />
      </div>
    </div>
  )
}