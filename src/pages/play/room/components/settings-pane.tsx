import { Field, Formik } from 'formik'
import { isEqual } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { X } from 'react-feather'
import {
    CircleButton,
    MenuButton,
    MenuButtonList,
} from '../../../../components'
import { TickTenGameConfigModel } from '../../../../modules/game/tick-ten/models'
import { roomState } from '../../../../modules/rooms'
import { classNames } from '../../../../util'
import { ALL_LETTERS } from '../../../../util/misc/string-operations'
import { MessagesPaneWrapper } from '../../components/messages-pane'
import { userState } from '../../../../modules/user'

const Wrapper = MessagesPaneWrapper

export const SettingsPane: React.FC = observer(() => {
    const config = new TickTenGameConfigModel(roomState.room!.game_config)
    const room = roomState.room!
    const user = userState.user!

    const isAdmin = room.creator.id === user.id

    const saveSettings = (values: TickTenGameConfigModel) => {
        roomState.changeGameConfig({
            cardetGameConfig: {},
            tickTenGameConfig: {
                categories: values.categories,
                letters: values.selectedLetters,
                countdownInSeconds: values.countdownInSeconds,
            },
        })
    }

    const menuAction = React.useCallback((handler: () => void) => {
        return () => {
            handler()
        }
    }, [])

    return (
        <Wrapper>
            <Formik
                initialValues={config}
                enableReinitialize
                onSubmit={saveSettings}
            >
                {({ values, initialValues, handleSubmit }) => {
                    const noChanges = isEqual(initialValues, values)

                    return (
                        <>
                            <header className="justify-content-end align-items-center">
                                <CircleButton
                                    onClick={menuAction(() =>
                                        roomState.setIsSettingsPaneOpen(false),
                                    )}
                                >
                                    <X />
                                </CircleButton>
                            </header>
                            <main>
                                <span className="mb-2">Selected letters</span>
                                <div
                                    className="grid gap-2 w-full"
                                    style={{
                                        gridTemplateColumns:
                                            'repeat(auto-fit, minmax(2rem, 1fr))',
                                    }}
                                >
                                    {ALL_LETTERS.map((letter) => {
                                        const fieldName = `letters.${letter}`
                                        const value =
                                            values.containsLetter(letter)

                                        return (
                                            <div
                                                key={letter}
                                                className={classNames(
                                                    'flex bg-[#132026] relative items-center justify-center w-8 h-8 rounded-xl border-2 transition-colors',
                                                    value
                                                        ? 'border-[var(--green)] text-[var(--green)]'
                                                        : 'border-[#132026] text-[var(--understated-grey)]',
                                                )}
                                            >
                                                <Field
                                                    type="checkbox"
                                                    name={fieldName}
                                                    className="w-full h-full z-50 absolute top-0 left-0 opacity-0 bg-transparent"
                                                    disabled={!isAdmin}
                                                />
                                                <span>{letter}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </main>
                            <footer>
                                <form className="w-100" onSubmit={handleSubmit}>
                                    <MenuButtonList>
                                        <MenuButton
                                            type="submit"
                                            color="var(--blue)"
                                            disabled={noChanges || !isAdmin}
                                        >
                                            <span>Save settings</span>
                                        </MenuButton>
                                    </MenuButtonList>
                                </form>
                            </footer>
                        </>
                    )
                }}
            </Formik>
        </Wrapper>
    )
})
