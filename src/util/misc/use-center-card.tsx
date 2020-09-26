import { useLayoutEffect, useState } from 'react'
import { rootState } from '../../modules/root'

export const useCenterCard = () => {
  const center_card = rootState.center_card.current

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useLayoutEffect(() => {
    if (center_card) {
      const { left, top } = center_card.getBoundingClientRect()
      setX(left)
      setY(top)
    }
  }, [center_card])

  return { x, y }
}
