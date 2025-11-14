import { useEffect, useRef } from "react";
import "./particlebg.css";

export default function ParticleBackground({
  count = 90,               // original 90
  speedMultiplier = 1.25,   // requested ~1.25x faster
  distanceMultiplier = 1.5, // requested ~1.5x farther travel/connection
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const resizeTimer = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(window.devicePixelRatio || 1, 1);
    // connection distance from original (190) scaled
    const BASE_CONN = 190;
    const connDist = BASE_CONN * distanceMultiplier;
    const connDistSq = connDist * connDist;
    const cellSize = connDist; // grid cell size ~ connection distance

    let width = Math.max(1, Math.floor(window.innerWidth));
    let height = Math.max(1, Math.floor(window.innerHeight));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale coordinate system

    // Particle factory
    const particles = new Array(count).fill(0).map(() => {
      const speedBase = 0.4; // original base
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedBase * speedMultiplier,
        vy: (Math.random() - 0.5) * speedBase * speedMultiplier,
        radius: Math.random() * 2 + 1,
      };
    });

    // Grid helper: map key `row,col` -> array of particle indexes (use index in particles)
    function buildGrid() {
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);
      const grid = new Array(rows);
      for (let r = 0; r < rows; r++) {
        grid[r] = new Array(cols);
        for (let c = 0; c < cols; c++) grid[r][c] = [];
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const col = Math.floor(p.x / cellSize);
        const row = Math.floor(p.y / cellSize);
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
          grid[row][col].push(i);
        }
      }
      return { grid, rows: grid.length, cols: grid[0].length };
    }

    function animate() {
      // update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // wrap-around (cheaper & smoother than bounce with multipliers)
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }

      // Clear once
      ctx.clearRect(0, 0, width, height);

      // draw particles (set shared properties outside tight loops where possible)
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.92;

      // Slightly reduce shadowBlur to improve perf but keep glow
      ctx.fillStyle = "#5ee7ff";
      ctx.shadowColor = "#5ee7ff";
      ctx.shadowBlur = 8;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Build spatial grid and draw connections by checking neighbors only
      const { grid, rows, cols } = buildGrid();

      // Batch all connection lines into a single path, then stroke once
      ctx.shadowBlur = 0; // turn off shadow for lines (cheaper)
      ctx.lineWidth = 0.35;
      ctx.strokeStyle = "rgba(125, 249, 255, 0.18)";
      ctx.beginPath();

      // For each cell, compare particles inside cell with those in neighbor cells
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          if (!cell || cell.length === 0) continue;

          // check neighboring cells including self
          for (let pi = 0; pi < cell.length; pi++) {
            const idx = cell[pi];
            const p = particles[idx];

            // neighbor cell offsets
            for (let nr = Math.max(0, r - 1); nr <= Math.min(rows - 1, r + 1); nr++) {
              for (let nc = Math.max(0, c - 1); nc <= Math.min(cols - 1, c + 1); nc++) {
                const neigh = grid[nr][nc];
                if (!neigh) continue;
                for (let pj = 0; pj < neigh.length; pj++) {
                  const jdx = neigh[pj];
                  if (jdx <= idx) continue; // avoid double-check & self
                  const other = particles[jdx];
                  const dx = p.x - other.x;
                  const dy = p.y - other.y;
                  const distSq = dx * dx + dy * dy;
                  if (distSq <= connDistSq) {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                  }
                }
              }
            }
          }
        }
      }

      ctx.stroke();

      // request next frame
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    // handle resize with debounce
    function handleResize() {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        dpr = Math.max(window.devicePixelRatio || 1, 1);
        width = Math.max(1, Math.floor(window.innerWidth));
        height = Math.max(1, Math.floor(window.innerHeight));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // ensure particles remain in bounds (optional)
        for (let i = 0; i < particles.length; i++) {
          particles[i].x = Math.min(Math.max(particles[i].x, 0), width);
          particles[i].y = Math.min(Math.max(particles[i].y, 0), height);
        }
      }, 120);
    }

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer.current);
    };
  }, [count, speedMultiplier, distanceMultiplier]);

  return <canvas ref={canvasRef} className="particle-bg" />;
}
