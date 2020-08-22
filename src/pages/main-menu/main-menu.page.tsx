import { observer } from 'mobx-react'
import React from 'react'
import {
  MenuButtonList,
  MenuLinkButton,
  MenuPageWrapper,
  UserPin,
} from '../../components'
import { User } from '../../modules/user'
import { userState } from '../../modules/user/user.state'

export const MainMenuPage = observer(() => {
  const { user } = userState
  return (
    <MenuPageWrapper>
      <header>
        <span>Let's play</span>
      </header>
      <main>
        <div>
          <MenuButtonList>
            <MenuLinkButton color="#4D8275" to="/play">
              Play
            </MenuLinkButton>
            <MenuLinkButton color="#744D82" to="/room">
              Rules
            </MenuLinkButton>
            <MenuLinkButton color="#4D5F82" to="/profile">
              Profile
            </MenuLinkButton>
          </MenuButtonList>
        </div>
      </main>
      <footer>
        <UserPin {...(user as User)} />
      </footer>
    </MenuPageWrapper>
  )
})
