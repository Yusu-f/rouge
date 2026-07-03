import * as THREE from 'three'
import { SHADES } from '../shades.js'

// r128 rules (hard-won on earlier sites, see BottleScene/CardScene notes):
// - renderer outputs sRGB but treats authored hex as linear -> convertSRGBToLinear()
//   every authored color, including inside per-frame lerps.
// - No envMaps on lit materials (renders black on alpha canvases in r128);
//   metals need part-metalness + explicit rim lights to read.
// - No transmission.

const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear()
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ss = (v, a, b) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t

// piecewise-linear keyframe helper: kf(u, [[u0,v0],[u1,v1],...])
function kf(u, pts) {
  if (u <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    if (u <= pts[i][0]) {
      const [u0, v0] = pts[i - 1]
      const [u1, v1] = pts[i]
      return lerp(v0, v1, ss(u, u0, u1))
    }
  }
  return pts[pts.length - 1][1]
}

const TAU = Math.PI * 2
const SHADE_BULLETS = SHADES.map((s) => lin(s.bullet))
const SHADE_ACCENTS = SHADES.map((s) => lin(s.accent))

export class TubeScene {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.setClearColor(0x000000, 0)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    this.camera.position.set(0, 0.35, 7.4)
    this.camera.lookAt(0, 0, 0)

    this.smoothMouse = { x: 0, y: 0 }
    this.disposed = false

    this.#lights()
    this.#tube()
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  #lights() {
    this.scene.add(new THREE.AmbientLight(lin('#3a2226'), 0.55))

    const key = new THREE.DirectionalLight(lin('#fff1e6'), 1.0)
    key.position.set(-4, 3, 4)
    this.scene.add(key)

    const rim = new THREE.DirectionalLight(lin('#ffe4d2'), 1.5)
    rim.position.set(2.5, 2.4, -4)
    this.scene.add(rim)

    const crimsonFill = new THREE.PointLight(lin('#b4243c'), 0.9, 30)
    crimsonFill.position.set(3.2, 0.6, 2.6)
    this.scene.add(crimsonFill)

    this.mouseLight = new THREE.PointLight(lin('#ff6c7e'), 0.55, 20)
    this.mouseLight.position.set(0, 0.5, 2.4)
    this.scene.add(this.mouseLight)
  }

  #tube() {
    const g = new THREE.Group()
    this.tube = g
    this.scene.add(g)

    // --- case: wrapped cylinder
    const tex = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}media/case_wrap.jpg`)
    tex.encoding = THREE.sRGBEncoding
    tex.wrapS = THREE.RepeatWrapping
    tex.offset.x = 0.5 // u=0 sits at +z (front): centre the logotype there
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
    const caseMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: lin('#ffffff'),
      metalness: 0.5,
      roughness: 0.32,
    })
    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.7, 64, 1), caseMat)
    caseMesh.position.y = -0.2
    g.add(caseMesh)

    // base bevel
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.42, 0.16, 64),
      new THREE.MeshStandardMaterial({ color: lin('#17090c'), metalness: 0.7, roughness: 0.3 }),
    )
    base.position.y = -1.62
    g.add(base)

    // accent ring at case top (morph target #2)
    this.ringMat = new THREE.MeshStandardMaterial({
      color: SHADE_ACCENTS[0].clone(),
      metalness: 0.85,
      roughness: 0.22,
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.387, 0.032, 20, 72), this.ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 1.15
    g.add(ring)

    // inner sleeve
    const sleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.27, 0.34, 48),
      new THREE.MeshStandardMaterial({ color: lin('#120709'), metalness: 0.8, roughness: 0.35 }),
    )
    sleeve.position.y = 1.25
    g.add(sleeve)

    // --- bullet: cylinder clamped against a slanted plane = chisel tip
    const bulletGeo = new THREE.CylinderGeometry(0.235, 0.235, 1.24, 64, 16, false)
    // local y in [-0.62, 0.62]; work in "base at 0" space
    const pos = bulletGeo.attributes.position
    const planeAt = (x) => 0.99 - 0.808 * x // chisel cut through (0.235, 0.8) and (-0.235, 1.18)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i) + 0.62 // -> [0, 1.24]
      const cap = planeAt(x)
      if (y > cap) pos.setY(i, cap - 0.62)
    }
    pos.needsUpdate = true
    bulletGeo.computeVertexNormals()

    this.bulletMat = new THREE.MeshPhysicalMaterial({
      color: SHADE_BULLETS[0].clone(),
      roughness: 0.42,
      metalness: 0.0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.35,
    })
    const bullet = new THREE.Mesh(bulletGeo, this.bulletMat)
    bullet.position.y = 0.62 // base of bullet at group origin
    this.bulletGroup = new THREE.Group()
    this.bulletGroup.add(bullet)
    this.bulletGroup.position.y = 0.32 // hidden pose; twist-up raises it
    g.add(this.bulletGroup)

    g.position.y = -0.45
  }

  resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.isMobile = w < 768
  }

  // called every frame with the shared state object
  update(state, dt) {
    if (this.disposed) return
    const { hero, showcase, film, spin } = state

    // --- smooth mouse
    const k = 1 - Math.exp(-dt * 6)
    this.smoothMouse.x += (state.mouse.x - this.smoothMouse.x) * k
    this.smoothMouse.y += (state.mouse.y - this.smoothMouse.y) * k
    this.mouseLight.position.set(this.smoothMouse.x * 3.2, 0.4 + this.smoothMouse.y * 2.0, 2.4)

    // --- pose from scroll choreography (later sections override earlier)
    let px = this.isMobile ? 0.62 : 1.55
    let py = this.isMobile ? -0.7 : -0.45
    let rotY = 0.35 + hero * 1.1
    let rotZ = 0.055
    let scale = this.isMobile ? 0.48 : 0.85
    let twist = ss(hero, 0.05, 0.72)

    if (showcase > 0.001) {
      twist = 1
      scale = this.isMobile ? 0.5 : 0.76
      const side = this.isMobile ? 0.45 : 1.45
      px = kf(showcase, [
        [0, this.isMobile ? 0.62 : 1.55],
        [0.2, -side],
        [0.5, side],
        [0.8, -side],
        [1, -side],
      ])
      // face-on (rotY multiple of TAU) exactly at callout peaks
      rotY = kf(showcase, [
        [0, 1.45],
        [0.2, TAU],
        [0.5, 2 * TAU],
        [0.8, 3 * TAU],
        [1, 3 * TAU + 0.5],
      ])
      rotZ = 0.05 + Math.sin(showcase * Math.PI * 3) * 0.05
      py = -0.45 + Math.sin(showcase * Math.PI * 2.2) * 0.12
    }

    if (film > 0.001) {
      // fly up and away as the film takes over
      py += ss(film, 0, 0.35) * 4.2
      rotZ += ss(film, 0, 0.35) * 0.35
    }

    if (spin > 0.001) {
      const enter = ss(spin, 0, 0.06)
      px = lerp(px, 0, enter)
      py = lerp(py, this.isMobile ? -0.2 : -0.45, enter)
      rotZ = lerp(rotZ, 0.02, enter)
      scale = lerp(scale, this.isMobile ? 0.6 : 0.78, enter)
      twist = 1
      const turns = 3
      rotY = spin * turns * TAU
      const sf = clamp01(spin) * turns // continuous shade float 0..3
      const ki = Math.min(2, Math.floor(sf))
      const frac = sf - ki
      const m = ss(frac, 0.35, 0.65)
      this.bulletMat.color.copy(SHADE_BULLETS[ki]).lerp(SHADE_BULLETS[ki + 1], m)
      this.ringMat.color.copy(SHADE_ACCENTS[ki]).lerp(SHADE_ACCENTS[ki + 1], m)
      const idx = Math.round(Math.min(3, sf))
      if (idx !== state.tierIndex) {
        state.tierIndex = idx
        window.dispatchEvent(new CustomEvent('rouge:shade', { detail: idx }))
      }
    } else if (state.tierIndex !== 0 && spin <= 0.001 && film <= 0.001 && showcase <= 0.001) {
      state.tierIndex = 0
    }

    // mouse-tracked tube attitude (on top of choreography)
    rotY += this.smoothMouse.x * 0.24
    const rotX = -this.smoothMouse.y * 0.12

    this.tube.position.set(px, py, 0)
    this.tube.rotation.set(rotX, rotY, rotZ)
    this.tube.scale.setScalar(scale)

    // twist-up: bullet rises + counter-rotates like a real mechanism
    this.bulletGroup.position.y = lerp(0.32, 1.3, twist)
    this.bulletGroup.rotation.y = (1 - twist) * -2.6

    // canvas opacity: hand over to the film, come back for the spin
    let op = 1
    op *= 1 - ss(film, 0.03, 0.3)
    if (spin > 0.001) {
      op = Math.max(op, ss(spin, 0, 0.05) * (1 - ss(spin, 0.955, 1)))
    }
    this.canvas.style.opacity = op.toFixed(3)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    window.removeEventListener('resize', this.resize)
    this.renderer.dispose()
  }
}
