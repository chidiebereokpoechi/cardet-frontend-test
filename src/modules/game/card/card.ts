import { every, shuffle } from 'lodash'
import { CardType } from './card-type'
import { CardValue } from './card-value'

export class Card {
  public readonly id: string
  public readonly type: CardType
  public readonly value: CardValue
  public readonly name: string

  private constructor(card: Card) {
    this.id = card.id
    this.type = card.type
    this.value = card.value
    this.name = card.name
  }

  public static create(card: Card) {
    return new Card(card)
  }

  public static matches(bottom: Card, top: Card) {
    return (
      bottom.type === top.type ||
      bottom.value === top.value ||
      bottom.value === CardValue.ANY ||
      top.value === CardValue.ANY
    )
  }

  public static canStack(cards: Card[]) {
    if (cards.length === 0) return true
    return every(cards, { value: cards[0].value })
  }

  public static shuffleCards(cards: Card[]) {
    return shuffle(cards)
  }
}
