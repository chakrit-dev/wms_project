import React from 'react'

export function Badge({ children }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
      {children}
    </span>
  )
}
