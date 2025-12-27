import { observer } from 'mobx-react'
import React from 'react'
import { RefreshCcw, Volume2, VolumeX, X } from 'react-feather'
import { CircleButton, MenuButton, MenuButtonList } from '../../../components'
import { sound_manager, useCardetGame } from '../../../util'
import { MessagesPaneWrapper } from './messages-pane'
import { RoomState, roomState } from '../../../modules/rooms'

const Wrapper = MessagesPaneWrapper

export const PlayMenu: React.FC = observer(() => {
    const { manager, game } = useCardetGame()

    const menuAction = React.useCallback(
        (handler: () => void) => {
            return () => {
                handler()
                manager.closeMenu()
            }
        },
        [manager],
    )

    const toggleMute = React.useCallback(() => {
        if (sound_manager.muted) {
            return sound_manager.unMute()
        }

        sound_manager.mute()
    }, [])

    return (
        <Wrapper>
            <header className="justify-content-end align-items-center">
                <CircleButton onClick={menuAction(() => manager.closeMenu())}>
                    <X />
                </CircleButton>
            </header>
            <main onClick={menuAction(() => manager.closeMenu())} />
            <footer>
                <div className="w-100">
                    <MenuButtonList>
                        <MenuButton
                            onClick={menuAction(toggleMute)}
                            color="#744D82"
                            icon={sound_manager.muted ? Volume2 : VolumeX}
                        >
                            <span>
                                {sound_manager.muted ? 'Unmute' : 'Mute'} audio
                            </span>
                        </MenuButton>
                        <MenuButton
                            onClick={menuAction(() =>
                                manager.getGameState(true),
                            )}
                            color="#4d5f82"
                            icon={RefreshCcw}
                        >
                            <span>Refresh</span>
                        </MenuButton>
                        <MenuButton
                            onClick={menuAction(() => manager.endGame())}
                            color="#b12946"
                            icon={X}
                        >
                            <span>
                                {roomState.room!.room_state ===
                                RoomState.PLAYING
                                    ? 'Back to lobby'
                                    : 'End game'}
                            </span>
                        </MenuButton>
                    </MenuButtonList>
                </div>
            </footer>
        </Wrapper>
    )
})
