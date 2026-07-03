import { useEffect, useRef } from 'react'

// 2D overlay: pigment specks + rose petals that repel near the cursor and
// gently attract at mid range. Sits above the WebGL tube, below the DOM copy.
export default function ParticleField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let W = 0
    let H = 0
    let running = true

    const petalImgs = []
    for (let i = 0; i < 6; i++) {
      const img = new Image()
      img.src = `/media/petal_${i}.png`
      petalImgs.push(img)
    }

    const isMobile = window.innerWidth < 768
    const N_PIGMENT = isMobile ? 22 : 46
    const N_PETALS = isMobile ? 6 : 11
    const parts = []
    const rand = (a, b) => a + Math.random() * (b - a)

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < N_PIGMENT; i++) {
      parts.push({
        kind: 'pigment',
        x: rand(0, 1) * W,
        y: rand(0, 1) * H,
        vx: rand(-0.08, 0.08),
        vy: rand(-0.05, 0.12),
        r: rand(0.8, 2.6),
        a: rand(0.25, 0.7),
        hue: rand(345, 360),
      })
    }
    for (let i = 0; i < N_PETALS; i++) {
      parts.push({
        kind: 'petal',
        img: i % 6,
        x: rand(0, 1) * W,
        y: rand(0, 1) * H,
        vx: rand(-0.1, 0.1),
        vy: rand(0.04, 0.16),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.004, 0.004),
        s: rand(26, 62),
        a: rand(0.5, 0.95),
      })
    }

    let mx = -9999
    let my = -9999
    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }
    // click: little pigment burst
    const onClick = (e) => {
      for (let i = 0; i < 9; i++) {
        const ang = rand(0, Math.PI * 2)
        const sp = rand(0.8, 3.4)
        parts.push({
          kind: 'pigment',
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          r: rand(0.7, 2.2),
          a: 0.9,
          hue: rand(345, 360),
          life: 1,
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)

    let last = performance.now()
    let timeoutId = null
    const step = (now) => {
      if (!running) return
      const dt = Math.min(2.5, (now - last) / 16.7)
      last = now
      const st = window.__rouge

      ctx.clearRect(0, 0, W, H)
      // hand the stage to the film when it takes over
      const dim = 1 - Math.min(1, Math.max(0, (st.film - 0.05) * 3)) * 0.92
      ctx.globalAlpha = dim

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        // cursor forces: repel < 130px, soft attract 130..320px
        const dx = p.x - mx
        const dy = p.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < 130 * 130) {
          const d = Math.sqrt(d2) || 1
          const f = ((130 - d) / 130) * (p.kind === 'petal' ? 0.35 : 0.6)
          p.vx += (dx / d) * f * dt
          p.vy += (dy / d) * f * dt
        } else if (d2 < 320 * 320) {
          const d = Math.sqrt(d2)
          const f = 0.012 * (1 - d / 320)
          p.vx -= (dx / d) * f * dt
          p.vy -= (dy / d) * f * dt
        }
        // drift + drag
        p.vx += Math.sin(now * 0.0003 + p.y * 0.01) * 0.004 * dt
        p.vx *= 0.985
        p.vy *= 0.985
        if (p.kind === 'petal') p.vy += 0.006 * dt
        else p.vy += 0.002 * dt
        p.x += p.vx * dt * 1.6
        p.y += p.vy * dt * 1.6
        if (p.rot !== undefined) p.rot += (p.vr + p.vx * 0.002) * dt * 1.6

        // burst particles decay
        if (p.life !== undefined) {
          p.life -= 0.012 * dt
          if (p.life <= 0) {
            parts.splice(i, 1)
            continue
          }
        }

        // wrap
        const m = 80
        if (p.x < -m) p.x = W + m
        if (p.x > W + m) p.x = -m
        if (p.y > H + m) {
          p.y = -m
          p.x = Math.random() * W
        }
        if (p.y < -m - 1) p.y = H + m

        const alpha = p.a * (p.life !== undefined ? p.life : 1)
        if (p.kind === 'pigment') {
          ctx.globalAlpha = dim * alpha
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
          grad.addColorStop(0, `hsla(${p.hue}, 75%, 55%, 1)`)
          grad.addColorStop(1, `hsla(${p.hue}, 75%, 40%, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const img = petalImgs[p.img]
          if (img.complete && img.naturalWidth) {
            ctx.globalAlpha = dim * alpha * 0.9
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rot)
            const h = (p.s * img.naturalHeight) / img.naturalWidth
            ctx.drawImage(img, -p.s / 2, -h / 2, p.s, h)
            ctx.restore()
          }
        }
      }
      ctx.globalAlpha = 1
      schedule()
    }
    // rAF freezes entirely in fully hidden tabs; race a timeout fallback.
    // The `done` token guarantees exactly one of the pair advances the loop.
    const schedule = () => {
      let done = false
      const go = (t) => {
        if (done || !running) return
        done = true
        step(t)
      }
      timeoutId = setTimeout(() => go(performance.now()), 120)
      requestAnimationFrame((t) => {
        clearTimeout(timeoutId)
        go(t)
      })
    }
    schedule()

    window.__rouge.particles = { parts }

    return () => {
      running = false
      clearTimeout(timeoutId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[36]"
      aria-hidden="true"
    />
  )
}
