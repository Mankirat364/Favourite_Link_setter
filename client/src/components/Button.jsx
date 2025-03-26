import React from 'react'

const Button = ({title,styles,icon}) => {
  return (
    <button className={styles}>
        {title} {icon}
    </button>
  )
}

export default Button
