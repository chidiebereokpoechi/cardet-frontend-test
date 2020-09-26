import { motion } from 'framer-motion'
import React from 'react'
import { GiLaurelCrown } from 'react-icons/gi'

export const TurnCrown: React.FC = () => {
  return (
    <motion.div
      layoutId="turn-crown"
      transition={{ duration: 0.1 }}
      style={{ color: 'yellow', marginRight: 10 }}
    >
      <GiLaurelCrown />
    </motion.div>
  )
}
