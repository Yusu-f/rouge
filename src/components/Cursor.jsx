import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('has-cursor')
    const dot = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      window.__rouge.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      window.__rouge.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onOver = (e) => {
      const hit = e.target.closest('[data-cursor], a, button, input, label')
      ring.classList.toggle('is-hover', !!hit)
    }
    const tick = () => {
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    raf = requestAnimationFrame(tick)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor-dot" />
      <div id="cursor-ring" />
    </>
  )
}
