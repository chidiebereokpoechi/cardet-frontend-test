import { User } from '../../user/user.entity'
import { SerializedCard } from './card'

export interface Player extends User {
    cards: SerializedCard[]
}
