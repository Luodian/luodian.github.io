"use client";

import { useEffect, useRef } from "react";

type WebGpuBackdropProps = {
  className?: string;
  onReadyChange?: (ready: boolean) => void;
};

const VERTEX_SHADER = `
struct VertexOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOut {
  var positions = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -3.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(3.0, 1.0)
  );

  var out: VertexOut;
  let position = positions[vertexIndex];
  out.position = vec4<f32>(position, 0.0, 1.0);
  out.uv = position * 0.5 + vec2<f32>(0.5, 0.5);
  return out;
}
`;

const FRAGMENT_SHADER = `
struct VertexOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@group(0) @binding(0) var<uniform> u0: vec4<f32>;
@group(0) @binding(1) var<uniform> u1: vec4<f32>;

fn palette(t: f32) -> vec3<f32> {
  let pink = vec3<f32>(0.97, 0.83, 0.91);
  let blue = vec3<f32>(0.67, 0.76, 0.98);
  let lilac = vec3<f32>(0.79, 0.74, 0.93);
  let w = clamp(t, 0.0, 1.0);
  return mix(mix(pink, lilac, smoothstep(0.15, 0.6, w)), blue, smoothstep(0.45, 0.95, w));
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
  let resolution = max(u0.xy, vec2<f32>(1.0, 1.0));
  let time = u0.z;
  let intensity = u0.w;

  var uv = in.uv * 2.0 - vec2<f32>(1.0, 1.0);
  uv.x *= resolution.x / resolution.y;

  let drift = u1.xy;
  let scale = max(u1.z, 0.5);
  let flow1 = sin((uv.x * 2.6 + drift.x) * scale + time * 0.42);
  let flow2 = cos((uv.y * 3.1 + drift.y) * scale - time * 0.33);
  let flow3 = sin((uv.x + uv.y) * 2.2 * scale + time * 0.27);
  let blend = flow1 * 0.45 + flow2 * 0.35 + flow3 * 0.20;

  let grain = sin(uv.x * 18.0 + time * 0.17) * cos(uv.y * 15.0 - time * 0.11) * 0.05;
  let colorMix = smoothstep(-0.95, 0.95, blend + grain);
  let baseColor = palette(colorMix);

  let vignette = smoothstep(1.45, 0.18, length(uv));
  let alpha = (0.10 + 0.18 * colorMix) * vignette * intensity;

  return vec4<f32>(baseColor, clamp(alpha, 0.0, 0.38));
}
`;

export default function WebGpuBackdrop({ className, onReadyChange }: WebGpuBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let alive = true;
    let rafId = 0;
    let resizeHandler: (() => void) | null = null;
    let contextRef: { unconfigure?: () => void } | null = null;

    const setReady = (ready: boolean) => {
      if (alive) onReadyChange?.(ready);
    };

    const init = async () => {
      if (typeof window === "undefined") return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const navigatorWithGpu = navigator as Navigator & {
        gpu?: {
          requestAdapter: () => Promise<any>;
          getPreferredCanvasFormat?: () => string;
        };
        deviceMemory?: number;
      };

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion || !navigatorWithGpu.gpu) {
        setReady(false);
        return;
      }

      try {
        const adapter = await navigatorWithGpu.gpu.requestAdapter();
        if (!adapter || !alive) {
          setReady(false);
          return;
        }

        const device = await adapter.requestDevice();
        if (!device || !alive) {
          setReady(false);
          return;
        }

        const context = canvas.getContext("webgpu") as any;
        if (!context) {
          setReady(false);
          return;
        }

        const format = navigatorWithGpu.gpu.getPreferredCanvasFormat?.() ?? "bgra8unorm";
        context.configure({
          device,
          format,
          alphaMode: "premultiplied",
          usage: 0x0010,
        });
        contextRef = context;

        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: {
            module: device.createShaderModule({ code: VERTEX_SHADER }),
            entryPoint: "vs_main",
          },
          fragment: {
            module: device.createShaderModule({ code: FRAGMENT_SHADER }),
            entryPoint: "fs_main",
            targets: [
              {
                format,
                blend: {
                  color: {
                    srcFactor: "src-alpha",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add",
                  },
                  alpha: {
                    srcFactor: "one",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add",
                  },
                },
              },
            ],
          },
          primitive: { topology: "triangle-list" },
        });

        const uniform0 = new Float32Array([1, 1, 0, 0.92]);
        const uniform1 = new Float32Array([0, 0, 1, 0]);
        const uniformBufferUsage = 0x0040 | 0x0008;
        const uniform0Buffer = device.createBuffer({
          size: uniform0.byteLength,
          usage: uniformBufferUsage,
        });
        const uniform1Buffer = device.createBuffer({
          size: uniform1.byteLength,
          usage: uniformBufferUsage,
        });

        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: uniform0Buffer } },
            { binding: 1, resource: { buffer: uniform1Buffer } },
          ],
        });

        const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const cores = navigator.hardwareConcurrency ?? 8;
        const memory = navigatorWithGpu.deviceMemory ?? 8;
        const lowPower = coarsePointer || cores <= 4 || memory <= 4;
        const maxDpr = lowPower ? 1.2 : 1.8;
        const targetFps = lowPower ? 30 : 60;
        const frameGap = 1000 / targetFps;
        const start = performance.now();
        let lastFrame = 0;

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
          const width = Math.max(1, Math.floor(window.innerWidth * dpr));
          const height = Math.max(1, Math.floor(window.innerHeight * dpr));
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          uniform0[0] = width;
          uniform0[1] = height;
          uniform0[3] = lowPower ? 0.78 : 0.92;
          device.queue.writeBuffer(uniform0Buffer, 0, uniform0);
        };

        resize();
        resizeHandler = resize;
        window.addEventListener("resize", resize, { passive: true });

        const render = (now: number) => {
          if (!alive) return;
          rafId = window.requestAnimationFrame(render);
          if (now - lastFrame < frameGap) return;
          lastFrame = now;

          const time = (now - start) * 0.001;
          uniform0[2] = time;
          uniform1[0] = Math.sin(time * 0.11) * 0.33;
          uniform1[1] = Math.cos(time * 0.09) * 0.27;
          uniform1[2] = 0.9 + Math.sin(time * 0.05) * 0.08;
          device.queue.writeBuffer(uniform0Buffer, 0, uniform0);
          device.queue.writeBuffer(uniform1Buffer, 0, uniform1);

          const encoder = device.createCommandEncoder();
          const textureView = context.getCurrentTexture().createView();
          const pass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: textureView,
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: "clear",
                storeOp: "store",
              },
            ],
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bindGroup);
          pass.draw(3, 1, 0, 0);
          pass.end();
          device.queue.submit([encoder.finish()]);
        };

        rafId = window.requestAnimationFrame(render);
        setReady(true);
      } catch {
        setReady(false);
      }
    };

    init();

    return () => {
      alive = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      try {
        contextRef?.unconfigure?.();
      } catch {
        // no-op
      }
      onReadyChange?.(false);
    };
  }, [onReadyChange]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
