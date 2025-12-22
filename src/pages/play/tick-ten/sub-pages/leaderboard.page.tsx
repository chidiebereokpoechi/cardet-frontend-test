import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { HelpCircle, SkipForward } from 'react-feather'
import {
    CircleButton,
    MenuButton,
    MenuButtonList,
    UserPin,
} from '../../../../components'
import { useTickTenGame } from '../../../../util'
import { PlayerList } from '../../components'
import { User } from '../../../../modules/user'
import { userState } from '../../../../modules/user/user.state'

let subscription: Subscription | undefined

export const LeaderboardPage = observer(() => {
    const user = userState.user as User
    const { game } = useTickTenGame()

    const playerScores = game.players
        .map((player) => ({
            ...player,
            score: game.leaderboard[player.id] || 0,
        }))
        .sort((a, b) => b.score - a.score)

    const startNextTurn = () => {
        subscription?.unsubscribe()
        subscription = game.startNextTurn()
    }

    return (
        <>
            <main className="grid grid-cols-1 gap-1 overflow-hidden">
                <span>Leaderboard</span>
                <div className="w-100 flex flex-col h-full">
                    <PlayerList className="mt-3 flex flex-1 overflow-y-auto">
                        {map(playerScores, ({ name, id, score }) => (
                            <div className="flex flex-row" key={id}>
                                <UserPin name={name} you={user.id === id} />
                                <span>{score}</span>
                            </div>
                        ))}
                    </PlayerList>
                </div>
            </main>
            <footer>
                <div className="w-full">
                    <MenuButtonList>
                        <MenuButton
                            color="var(--green)"
                            onClick={startNextTurn}
                        >
                            <span>Next letter</span>
                        </MenuButton>
                    </MenuButtonList>
                </div>
            </footer>
        </>
    )
})
