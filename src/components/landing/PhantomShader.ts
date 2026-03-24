import { Renderer, Program, Mesh, Triangle } from "ogl";

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Mouse influence — gentle pull
    vec2 mouse = uMouse * 0.3;
    vec2 p = uv * aspect * 3.0;

    // Flowing time
    float t = uTime * 0.15;

    // Layered phantom smoke
    float smoke1 = fbm(p + vec2(t * 0.7, t * 0.4) + mouse * 0.5);
    float smoke2 = fbm(p * 1.5 + vec2(-t * 0.5, t * 0.6) - mouse * 0.3);
    float smoke3 = fbm(p * 0.8 + vec2(t * 0.3, -t * 0.8) + mouse * 0.2);

    // Combine layers
    float smoke = smoke1 * 0.5 + smoke2 * 0.3 + smoke3 * 0.2;

    // Vignette — darker at edges
    float vignette = 1.0 - length((uv - 0.5) * 1.4);
    vignette = smoothstep(0.0, 0.7, vignette);

    // Vertical fade — stronger at bottom
    float vertFade = smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.6, uv.y);

    smoke *= vignette * vertFade;

    // Purple phantom palette
    vec3 deepVoid = vec3(0.02, 0.02, 0.04);   // near-black
    vec3 phantom  = vec3(0.35, 0.15, 0.55);    // deep purple
    vec3 wisp     = vec3(0.55, 0.30, 0.80);    // bright purple
    vec3 ethereal = vec3(0.70, 0.50, 0.90);    // light purple highlight

    // Color mapping
    vec3 col = deepVoid;
    col = mix(col, phantom, smoothstep(-0.2, 0.3, smoke));
    col = mix(col, wisp, smoothstep(0.2, 0.6, smoke) * 0.5);
    col = mix(col, ethereal, smoothstep(0.5, 0.8, smoke) * 0.2);

    // Subtle bright spots
    float highlight = smoothstep(0.55, 0.75, smoke) * vignette * 0.15;
    col += ethereal * highlight;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initPhantomShader(container: HTMLElement): () => void {
  const renderer = new Renderer({
    alpha: false,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio, 2),
  });
  const gl = renderer.gl;
  container.appendChild(gl.canvas);

  gl.canvas.style.width = "100%";
  gl.canvas.style.height = "100%";
  gl.canvas.style.display = "block";

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: [0, 0] },
      uResolution: { value: [window.innerWidth, window.innerHeight] },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  let mouseX = 0;
  let mouseY = 0;
  let animationId: number;
  let destroyed = false;

  function resize() {
    if (destroyed) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    program.uniforms.uResolution.value = [w, h];
  }

  function onMouseMove(e: MouseEvent) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function animate(t: number) {
    if (destroyed) return;
    program.uniforms.uTime.value = t * 0.001;
    program.uniforms.uMouse.value = [mouseX, mouseY];
    renderer.render({ scene: mesh });
    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove);
  resize();
  animationId = requestAnimationFrame(animate);

  return () => {
    destroyed = true;
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMouseMove);
    if (gl.canvas.parentNode) {
      gl.canvas.parentNode.removeChild(gl.canvas);
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
