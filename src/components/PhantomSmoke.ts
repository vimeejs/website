import { Renderer, Program, Mesh, Triangle } from "ogl";

const vertexShader = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = /* glsl */ `
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

// --- Cheap value noise ---

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

// --- fBm (3 octaves) ---

float fbm(vec2 p) {
    float v = 0.0;
    v += 0.5 * noise(p); p *= 2.0;
    v += 0.25 * noise(p); p *= 2.0;
    v += 0.125 * noise(p);
    return v;
}

void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    float t = uTime;

    // Single-pass domain warp for organic smoke
    vec2 q = vec2(
        fbm(p * 1.5 + vec2(0.0, t * 0.08)),
        fbm(p * 1.5 + vec2(5.2, t * 0.06))
    );
    float smoke = fbm(p * 1.5 + 3.0 * q + vec2(t * 0.04, 0.0));

    // Remap
    smoke = smoothstep(0.1, 0.9, smoke);

    // Color gradient: deep purple -> phantom highlight
    vec3 deep   = vec3(0.02, 0.01, 0.05);
    vec3 mid    = vec3(0.08, 0.05, 0.18);
    vec3 pale   = vec3(0.22, 0.18, 0.32);
    vec3 bright = vec3(0.40, 0.34, 0.52);

    vec3 color = mix(deep, mid, smoothstep(0.0, 0.35, smoke));
    color = mix(color, pale, smoothstep(0.35, 0.65, smoke));
    color = mix(color, bright, smoothstep(0.65, 1.0, smoke));

    // Vignette
    vec2 vig = uv * 2.0 - 1.0;
    color *= 1.0 - dot(vig * 0.5, vig * 0.5);

    gl_FragColor = vec4(color, 1.0);
}
`;

export function initPhantomSmoke(container: HTMLElement): () => void {
  const renderer = new Renderer({
    dpr: 1,
    alpha: false,
  });

  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;

  // Style canvas
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.zIndex = "-1";
  canvas.style.pointerEvents = "none";
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  container.appendChild(canvas);

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [canvas.width, canvas.height] },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  // --- Resize ---
  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
  }

  resize();
  window.addEventListener("resize", resize);

  // --- Animation loop ---
  let animationId: number;

  function animate(t: number) {
    animationId = requestAnimationFrame(animate);
    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
  }

  animationId = requestAnimationFrame(animate);

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
    canvas.remove();
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  };
}
