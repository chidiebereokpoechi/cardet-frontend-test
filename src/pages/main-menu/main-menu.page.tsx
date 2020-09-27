import { observer } from 'mobx-react'
import React from 'react'
import {
  MenuButtonList,
  MenuLinkButton,
  MenuPageWrapper,
} from '../../components'
import { userState } from '../../modules/user/user.state'

export const MainMenuPage = observer(() => {
  // eslint-disable-next-line
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
