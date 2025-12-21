import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { MenuLinkButton, MenuPageWrapper } from '../../components'
import { User } from '../../modules/user/user.entity'
import { UpdateUserModel } from '../../modules/user/models'
import { userState } from '../../modules/user/user.state'
import { ChangeNameBar } from './components'

let sub: Subscription | null = null

export const MainMenuPage = observer(() => {
    const user = userState.user as User

    const changeName = React.useCallback((values: UpdateUserModel) => {
        sub?.unsubscribe()
        sub = userState.updateUser(values)
        return sub
    }, [])

    return (
        <MenuPageWrapper>
            <header className="flex-column">
                <img src="/logo.png" alt="GameHub logo" className="logo" />
                <span className="mt-3">GameHub</span>
            </header>
            <main>
                <span>Who are you?</span>
                <div className="mt-3 w-100">
                    <ChangeNameBar name={user.name} changeName={changeName} />
                </div>
            </main>
            <footer>
                <MenuLinkButton color="#4D8275" to="/play">
                    Play
                </MenuLinkButton>
            </footer>
        </MenuPageWrapper>
    )
})
