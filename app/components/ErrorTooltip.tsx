import React from 'react'

export default function ErrorTooltip({...props}) {
  return (
    <span className="error-tooltip" style={props.error === true ? {opacity: '1', top: '-55px'} : {}}>
      {props.tip}
    </span>
  )
}
