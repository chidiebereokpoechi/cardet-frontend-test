import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import {
  MenuButtonList,
  MenuLinkButton,
  MenuPageWrapper,
} from '../../components'
import { User } from '../../modules/user'
import { UpdateUserModel } from '../../modules/user/models'
import { userState } from '../../modules/user/user.state'
import { ChangeNameBar } from './components'

let sub: Subscription | null = null

export const MainMenuPage = observer(() => {
  // eslint-disable-next-line
  const user = userState.user as User

  const changeName = React.useCallback(async (values: UpdateUserModel) => {
    sub?.unsubscribe()
    sub = userState.updateUser(values)
  }, [])

  return (
    <MenuPageWrapper>
      <header className="flex-column">
        <span>Cardet Cards</span>
        <ChangeNameBar name={user.name} changeName={changeName} />
      </header>
      <main>
        <div>
          <MenuButtonList>
            <MenuLinkButton color="#4D8275" to="/play">
              Play
            </MenuLinkButton>
            {/* <MenuLinkButton color="#744D82" to="/change-name">
              Change Name
            </MenuLinkButton> */}
            {/* <MenuLinkButton color="#744D82" to="/room">
              Rules
            </MenuLinkButton>
            <MenuLinkButton color="#4D5F82" to="/profile">
              Profile
            </MenuLinkButton> */}
          </MenuButtonList>
        </div>
      </main>
    </MenuPageWrapper>
  )
})
