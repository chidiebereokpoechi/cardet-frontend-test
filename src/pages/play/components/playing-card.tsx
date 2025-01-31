import { HTMLMotionProps, motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Card, CardType, CardValue } from '../../../modules/game'

const Wrapper = styled(motion.div)`
    width: var(--card-width);
    height: var(--card-height);
    border-radius: 0.125rem;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.35), 0 0 0 8px rgba(0, 0, 0, 0.05) inset,
        0 0 0 6px rgba(255, 255, 255, 0.1) inset,
        0 0 0 3px rgba(255, 255, 255, 0.45) inset;
    overflow: visible;
    color: white;
    padding: 0.5rem 1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 1px;
    cursor: pointer;

    .order {
        position: absolute;
        top: -10px;
        right: -10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        width: 20px;
        border-radius: 100%;
        background: white;
        font-size: 70%;
        font-weight: bold;
        color: black;
        text-shadow: none;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.35);
        border: 1px solid #45505d;
    }

    .value {
        display: flex;
        font-weight: 700;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        text-transform: uppercase;
    }
`

interface Props {
    id?: Card['id']
    type?: Card['type']
    value?: Card['value']
    onClick?: HTMLMotionProps<'div'>['onClick']
    selected?: number
}

export const PlayingCard = observer(
    ({ id, type, value, onClick, selected }: Props) => {
        const background = useMemo(() => {
            if (type === undefined) return ['#080808', '#363d44'] // Grey

            switch (type) {
                case CardType.ALPHA:
                    return ['#d13e44', '#d13e74'] // Red
                case CardType.BRAVO:
                    return ['#d24929', '#f58634'] // Orange
                case CardType.CHARLIE:
                    return ['#ebb400', '#ffac14'] // Yellow
                case CardType.DELTA:
                    return ['#3b9e2a', '#1fbf5f'] // Green
                case CardType.ECHO:
                    return ['#38a9ff', '#6057fe'] // Blue
                case CardType.FOXTROT:
                    return ['#3f326d', '#3c209e'] // Purple
                case CardType.ANY:
                    return ['#080808', '#363d44'] // Grey
            }
        }, [type])

        const display: (
            | [string | number]
            | [string | number, number]
        )[] = React.useMemo(() => {
            if (value === undefined) return [['']]

            switch (value) {
                case CardValue.ANY:
                    return [['?'], ['Any', 6]]
                case CardValue.PICK_TWO:
                    return [['+2'], ['Pick', 6]]
                case CardValue.PICK_THREE:
                    return [['+3'], ['Pick', 6]]
                case CardValue.GENERAL_MARKET:
                    return [['G'], ['Gen', 6]]
                case CardValue.BLOCK:
                    return [['B'], ['Block', 6]]
                case CardValue.FREEZE:
                    return [['F'], ['Freeze', 6]]
                case CardValue.ZERO:
                    return [[0], ['Zero', 6]]
                case CardValue.ONE:
                    return [[1], ['One', 6]]
                case CardValue.TWO:
                    return [[2], ['Two', 6]]
                case CardValue.THREE:
                    return [[3], ['Three', 6]]
                case CardValue.FOUR:
                    return [[4], ['Four', 6]]
                case CardValue.FIVE:
                    return [[5], ['Five', 6]]
                case CardValue.SIX:
                    return [[6], ['Six', 6]]
                default:
                    return [['']]
            }
        }, [value])

        return (
            <Wrapper
                initial={{
                    opacity: 1,
                    zIndex: 0,
                }}
                style={{
                    background: Array.isArray(background)
                        ? `linear-gradient(${background[0]}, ${background[1]})`
                        : background,
                }}
                layoutId={id}
                transition={{ duration: 0.1 }}
                onClick={onClick}
            >
                {selected !== undefined && (
                    <span className="order">{selected + 1}</span>
                )}
                {value !== undefined && (
                    <div className="value">
                        {display.map(([displayValue, fontSize], i) => (
                            <motion.span
                                key={i}
                                initial={{ fontSize: fontSize ?? 20 }}
                            >
                                {displayValue}
                            </motion.span>
                        ))}
                    </div>
                )}
            </Wrapper>
        )
    },
)
