import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import { RefreshCcw, X } from 'react-feather'
import { GoMute, GoUnmute, GoX } from 'react-icons/go'
import styled from 'styled-components'
import { CircleButton, MenuButton, MenuButtonList } from '../../../components'
import { sound_manager, useGame } from '../../../util'

const Wrapper = styled(motion.div)`
  height: var(--vh);
  width: var(--vw);
  position: absolute;
  background: black;
  z-index: 999;

  header {
    padding: 1rem 2rem;
    display: flex;
    width: 100%;
  }

  main {
    padding: 2rem;
  }
`

export const PlayMenu: React.FC = observer(() => {
  const { manager, game } = useGame()

  const menuAction = React.useCallback(
    (handler: () => void) => {
      return () => {
        handler()
        manager.closeMenu()
      }
    },
    [manager]
  )

  const toggleMute = React.useCallback(() => {
    if (sound_manager.muted) {
      return sound_manager.unMute()
    }

    sound_manager.mute()
  }, [])

  return (
    <Wrapper layoutId="play-menu">
      <header className="justify-content-between align-items-center">
        <CircleButton onClick={menuAction(() => manager.getGameState())}>
          <RefreshCcw />
        </CircleButton>
        <CircleButton onClick={menuAction(() => manager.closeMenu())}>
          <X />
        </CircleButton>
      </header>
      <main>
        <MenuButtonList>
          <MenuButton
            onClick={menuAction(toggleMute)}
            color="#744D82"
            icon={sound_manager.muted ? GoUnmute : GoMute}
          >
            <span>{sound_manager.muted ? 'Unmute' : 'Mute'} audio</span>
          </MenuButton>
          <MenuButton
            onClick={menuAction(() => manager.endGame())}
            color="#4D5F82"
            icon={GoX}
          >
            <span>{game.game_over ? 'Back to lobby' : 'End game'}</span>
          </MenuButton>
        </MenuButtonList>
      </main>
    </Wrapper>
  )
})
