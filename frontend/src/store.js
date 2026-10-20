import { useEffect, useState } from 'react'

export function useLocal(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      if (s !== null) return JSON.parse(s)
    } catch {}
    return typeof initial === 'function' ? initial() : initial
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key, v])
  return [v, setV]
}
