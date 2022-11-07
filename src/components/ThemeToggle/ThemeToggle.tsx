import React from 'react'
import moonSvg from '../../assets/moon.svg'
import sunSvg from '../../assets/sun.svg'

import styles from './ThemeToggle.module.css'

interface Props {
  darkTheme: string
  handleToggleTheme: () => void
}

const ThemeToggle = ({ darkTheme, handleToggleTheme }: Props) => {
  return (
    <button className={styles.toggle} onClick={handleToggleTheme}>
      {darkTheme === 'true' ? <img src={moonSvg} alt='moon' /> : <img src={sunSvg} alt='moon' />}
    </button>
  )
}

export default ThemeToggle
