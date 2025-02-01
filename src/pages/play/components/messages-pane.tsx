import { Field, Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { X, Send } from 'react-feather'
import { RiArrowRightCircleFill } from 'react-icons/ri'
import styled from 'styled-components'
import { CircleButton, MenuPageWrapper } from '../../../components'
import { roomState } from '../../../modules/rooms'
import { Message } from '../../../modules/rooms/message'
import { userState } from '../../../modules/user/user.state'

export const MessagesPaneWrapper = styled(MenuPageWrapper)`
    height: var(--vh);
    width: var(--vw);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(0.5rem);
    position: absolute;
    z-index: 999;
    display: flex;
    flex-direction: column;

    > main {
        flex: 1;
        overflow-y: auto; // Enable vertical scrolling
        padding: 1.75rem;
    }

    .message-bubble {
        display: flex;
        margin-bottom: 0.5rem;
        max-width: 100%;
        word-wrap: break-word;
        word-break: break-word;
        text-overflow: clip;
        /* line-break: anywhere; */

        .text-section {
            display: flex;
            flex-direction: column;
            background: #2f2f37;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
        }

        .message-author {
            font-weight: bold;
            font-size: 50%;
            color: #dadadc;
        }
    }

    .message-bubble.right {
        flex-direction: row-reverse;

        .text-section {
            background: #8e0f3c;
            margin: 0;
            justify-content: flex-end;
            text-align: right;
        }
    }
`

const PictureCircle = styled.div`
    background: #f8c94f;
    height: 2rem;
    width: 2rem;
    border-radius: 100%;
`

const MessageBubble: React.FC<Message> = observer(({ user, message }) => {
    const is_current_user = React.useMemo(
        () => user.id === userState.user!.id,
        [user.id],
    )

    return (
        <div className={'message-bubble' + (is_current_user ? ' right' : '')}>
            <div className="text-section">
                <small className="message-author">{user.name}</small>
                <span className="message-text">{message}</span>
            </div>
        </div>
    )
})

const StyledForm = styled.form`
    font-size: 1rem;
    display: grid;
    grid-template-columns: 1fr 50px;
    gap: 1rem;
    width: 100%;

    .message-input {
        background: transparent;
        border: 3px solid white;
        border-radius: 1rem;
        color: white;
        padding: 0.5rem 1rem;
        color: white;
        font-weight: bold;
        user-select: text;
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

    .submit-button:not(:disabled) {
        background: white;
        color: black;
    }
`

export const MessagesPane: React.FC = observer(() => {
    const closeMessagesPane = React.useCallback(() => {
        return roomState.setMessagesPaneOpen(false)
    }, [])

    const createMessage = React.useCallback(
        ({ message }: { message: string }, helpers: FormikHelpers<any>) => {
            if (message) {
                helpers.resetForm()
                return roomState.createMessage(message)
            }
        },
        [],
    )

    // Ref to track the last message
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    // Ref to track the main container
    const mainContainerRef = useRef<HTMLDivElement | null>(null)

    // Scroll to the last message when messages update
    useEffect(() => {
        if (lastMessageRef.current && mainContainerRef.current) {
            // Scroll the last message into view within the main container
            lastMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }
    }, [roomState.room?.messages]) // Trigger effect when messages change

    return (
        <MessagesPaneWrapper>
            <header className="justify-content-between align-items-center">
                <CircleButton onClick={closeMessagesPane}>
                    <X />
                </CircleButton>
            </header>
            <main ref={mainContainerRef}>
                {/* Attach ref to the main container */}
                {roomState.room?.messages.map((message, i) => {
                    const isLastMessage =
                        i === roomState.room!.messages.length - 1
                    return (
                        <div
                            key={i}
                            className="w-100"
                            ref={isLastMessage ? lastMessageRef : null} // Attach ref to the last message
                        >
                            <MessageBubble {...message} />
                        </div>
                    )
                })}
            </main>
            <footer>
                <Formik
                    enableReinitialize
                    initialValues={{ message: '' }}
                    onSubmit={createMessage}
                >
                    {({ handleSubmit, isValid }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <Field className="message-input" name="message" />
                            <button
                                disabled={!isValid}
                                className="submit-button"
                                type="submit"
                            >
                                <Send />
                            </button>
                        </StyledForm>
                    )}
                </Formik>
            </footer>
        </MessagesPaneWrapper>
    )
})
