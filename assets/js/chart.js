/**
 * chart.js
 * A tiny dependency-free radar (spider) chart renderer for canvas.
 * No charting library needed — keeps the bundle small and fast.
 */
const RadarChart = (() => {

  function draw(canvas, { labels, you, avg, max = 100 }) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth || 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 46;
    const n = labels.length;
    const angleStep = (Math.PI * 2) / n;

    const styles = getComputedStyle(document.documentElement);
    const gridColor = styles.getPropertyValue("--border-strong").trim() || "rgba(0,0,0,0.14)";
    const textColor = styles.getPropertyValue("--text-secondary").trim() || "#666";
    const accent = styles.getPropertyValue("--accent").trim() || "#FF8201";
    const tertiary = styles.getPropertyValue("--text-tertiary").trim() || "#999";

    function pointAt(index, value) {
      const angle = angleStep * index - Math.PI / 2;
      const r = (value / max) * radius;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    }

    function drawGrid() {
      ctx.clearRect(0, 0, size, size);
      const rings = 4;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let ring = 1; ring <= rings; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const [x, y] = pointAt(i % n, (max * ring) / rings);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // spokes
      for (let i = 0; i < n; i++) {
        const [x, y] = pointAt(i, max);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      // labels
      ctx.fillStyle = textColor;
      ctx.font = "600 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const lx = cx + (radius + 22) * Math.cos(angle);
        const ly = cy + (radius + 22) * Math.sin(angle);
        wrapText(ctx, labels[i], lx, ly, 70, 12);
      }
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(" ");
      let line = "";
      const lines = [];
      words.forEach(w => {
        const test = line + w + " ";
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line.trim());
          line = w + " ";
        } else {
          line = test;
        }
      });
      lines.push(line.trim());
      const startY = y - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
    }

    function toRgb(color) {
      // Resolves any CSS color (hex, named, rgb()) to "r,g,b" via a throwaway element.
      const probe = document.createElement("span");
      probe.style.color = color;
      document.body.appendChild(probe);
      const rgb = getComputedStyle(probe).color; // "rgb(r, g, b)"
      document.body.removeChild(probe);
      const m = rgb.match(/\d+/g);
      return m ? m.slice(0, 3).join(",") : "150,150,150";
    }

    function drawSeries(values, rgbTriplet, fillAlpha, strokeAlpha, progress) {
      ctx.beginPath();
      values.forEach((v, i) => {
        const [x, y] = pointAt(i, v * progress);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(${rgbTriplet},${fillAlpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${rgbTriplet},${strokeAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      values.forEach((v, i) => {
        const [x, y] = pointAt(i, v * progress);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbTriplet},${strokeAlpha})`;
        ctx.fill();
      });
    }

    const accentRgb = toRgb(accent);
    const tertiaryRgb = toRgb(tertiary);

    let start = null;
    const duration = 900;

    function frame(ts) {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      drawGrid();
      drawSeries(avg, tertiaryRgb, 0.10, 0.6, eased);
      drawSeries(you, accentRgb, 0.22, 1, eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  return { draw };
})();
