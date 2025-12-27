import { Field, Formik, useFormik } from 'formik'
import { isEqual } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Plus, Share, X } from 'react-feather'
import styled from 'styled-components'
import {
    CircleButton,
    MenuButton,
    MenuButtonList,
} from '../../../../components'
import { Category } from '../../../../modules/game/tick-ten'
import { TickTenGameConfigModel } from '../../../../modules/game/tick-ten/models'
import { roomState } from '../../../../modules/rooms'
import { userState } from '../../../../modules/user'
import { classNames } from '../../../../util'
import { ALL_LETTERS } from '../../../../util/misc/string-operations'
import { MessagesPaneWrapper } from '../../components/messages-pane'

const Wrapper = styled(MessagesPaneWrapper)`
    .name-input {
        padding: 0.5rem 1rem;
        background: #121518;
        border-radius: 1rem;
        color: white;
        font-weight: bold;
        user-select: text;
        height: 3rem;
        border: 3px solid #121518;
        border-color: white;
        color: white;
    }

    .name-input.identical {
        border-color: var(--green);
        color: var(--green);
    }

    input:disabled {
        background: #121518;
        border-color: var(--understated-grey);
        color: var(--understated-grey);
        cursor: not-allowed;
    }

    .submit-button {
        background: white;
        color: #2b2e33;
        border-radius: 1rem;
        border: none;
        outline: none;
        height: var(--button-height) !important;
        width: var(--button-height) !important;
        appearance: none;
        padding: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .submit-button.identical {
        color: var(--green);
    }

    .submit-button:disabled {
        background: #121518;
        color: var(--understated-grey);
    }
`

const CategoryInput: React.FC<{
    config: TickTenGameConfigModel
    add: (category: string) => void
}> = ({ config, add }) => {
    const validateConfig = (values: { category: string }) => {
        const errors: Record<string, string> = {}
        const { category } = values

        if (category.length > 0 && category.length < 3) {
            errors.category = 'Category must be at least 3 characters long'
        }

        if (config.categories.length === 0) {
            errors.category = 'At least one category is required'
        }

        return errors
    }

    const formik = useFormik({
        initialValues: {
            category: '',
        },
        validate: validateConfig,
        onSubmit: (values, helpers) => {
            add(values.category)
            helpers.setFieldValue('category', '')
        },
    })

    const isEmpty = formik.values.category.length === 0
    const disableButton = isEmpty

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex">
                <input
                    type="text"
                    className={classNames('flex-1 name-input')}
                    placeholder="Category"
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                />
                <button
                    disabled={disableButton}
                    tabIndex={-1}
                    className={classNames(
                        'submit-button ml-3',
                        disableButton
                            ? 'cursor-not-allowed'
                            : 'hover:scale-105 transition-transform',
                    )}
                    type="submit"
                >
                    <Plus />
                </button>
            </div>
            <div className="flex items-center mt-2">
                {formik.errors.category && (
                    <span className="text-[var(--red)] text-xs ml-1">
                        {formik.errors.category}
                    </span>
                )}
            </div>
        </form>
    )
}

export const SettingsPane: React.FC = observer(() => {
    const room = roomState.room!
    const gameConfig = room.game_config
    const isAdmin = roomState.amIAdmin
    const config = new TickTenGameConfigModel(gameConfig)

    const saveSettings = (values: TickTenGameConfigModel) => {
        roomState.changeGameConfig({
            cardetGameConfig: {},
            tickTenGameConfig: {
                categories: [...values.categories],
                letters: values.selectedLetters,
                countdownInSeconds: values.countdownInSeconds,
            },
        })
    }

    const shareRoomLink = async () => {
        const roomUrl = '/play/join-room?code=' + room.id

        if ('share' in navigator) {
            try {
                ;(navigator as any).clipboard.writeText(roomUrl)
                await (navigator as any).share({
                    title: 'Join My Room',
                    text: 'Click the link below to join my room!',
                    url: roomUrl,
                })
            } catch (error) {
                console.error('Error sharing room link:', error)
            }
        } else {
            // Fallback: Copy to clipboard if Web Share API is unavailable
            ;(navigator as any).clipboard.writeText(roomUrl)
            alert('Room link copied to clipboard!')
        }
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
                onSubmit={() => {}}
            >
                {({ values, setFieldValue }) => {
                    const noChanges = isEqual(
                        {
                            categories: gameConfig.tickTenGameConfig.categories,
                            letters: gameConfig.tickTenGameConfig.letters,
                        },
                        {
                            categories: values.categories,
                            letters: values.selectedLetters,
                        },
                    )

                    const addCategory = (category: string) => {
                        values.addCategory(category)
                        setFieldValue('categories', values.categories)
                    }

                    const removeCategory = (category: Category) => {
                        values.removeCategory(category)
                        setFieldValue('categories', values.categories)
                    }

                    return (
                        <>
                            <header className="justify-content-end align-items-center">
                                <div
                                    className="grid items-center w-full gap-8 grid-cols-[var(--button-height) 1fr var(--button-height)]"
                                    style={{
                                        gridTemplateColumns:
                                            '1fr var(--button-height)',
                                    }}
                                >
                                    <div>
                                        <span>Settings</span>
                                    </div>
                                    <CircleButton
                                        onClick={menuAction(() =>
                                            roomState.setIsSettingsPaneOpen(
                                                false,
                                            ),
                                        )}
                                    >
                                        <X />
                                    </CircleButton>
                                </div>
                            </header>
                            <main className="grid grid-cols-1 gap-8">
                                <div className="grid gap-3 place-items-center w-full">
                                    <span className="flex w-full">
                                        Selected letters
                                    </span>
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
                                </div>
                                <div className="grid gap-3 w-full">
                                    <span>Categories</span>
                                    <div className="flex w-full flex-wrap -mb-2">
                                        {[...values.categories].map(
                                            (category) => (
                                                <div
                                                    key={category}
                                                    className="inline-flex flex-nowrap items-center h-10 mb-2 mr-2 bg-[#132026] rounded-lg"
                                                >
                                                    <span className="inline-flex text-[.83rem] text-[var(--understated-grey)] px-2.5 text-white">
                                                        {category}
                                                    </span>
                                                    {isAdmin &&
                                                        values.categories
                                                            .length > 1 && (
                                                            <button
                                                                className={classNames(
                                                                    ' bg-[#132026] h-10 rounded-lg p-2.5 !pl-0 rounded-l-[0] transition-colors flex items-center justify-center text-[var(--understated-grey)] hover:text-white',
                                                                )}
                                                                onClick={() =>
                                                                    removeCategory(
                                                                        category,
                                                                    )
                                                                }
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    {isAdmin && (
                                        <CategoryInput
                                            config={values}
                                            add={addCategory}
                                        />
                                    )}
                                </div>
                            </main>
                            {isAdmin && (
                                <footer>
                                    <div className="w-100">
                                        <MenuButtonList>
                                            <MenuButton
                                                color="#d1a33e"
                                                onClick={shareRoomLink}
                                            >
                                                <span>Share link to join</span>
                                            </MenuButton>
                                            <MenuButton
                                                type="button"
                                                color="var(--blue)"
                                                disabled={noChanges}
                                                onClick={() =>
                                                    saveSettings(values)
                                                }
                                            >
                                                <span>Save settings</span>
                                            </MenuButton>
                                        </MenuButtonList>
                                    </div>
                                </footer>
                            )}
                        </>
                    )
                }}
            </Formik>
        </Wrapper>
    )
})
