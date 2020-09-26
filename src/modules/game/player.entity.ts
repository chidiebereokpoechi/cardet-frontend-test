import { User } from '../user'
import { SerializedCard } from './card'

export interface Player extends User {
  cards: SerializedCard[]
}
