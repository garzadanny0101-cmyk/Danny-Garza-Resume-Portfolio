(() => {
  'use strict';
  const canvas = document.getElementById('ai-globe');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const stage = canvas.closest('[data-globe-stage]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 600;
  let height = 600;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let rotation = -0.45;
  let tilt = -0.13;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let visible = true;
  let lastTime = performance.now();

  const nodes = [
    { label: 'INTAKE', lat: 22, lon: -80, color: '#e8b84a' },
    { label: 'ROUTER', lat: 40, lon: -8, color: '#00dcff' },
    { label: 'RESEARCH', lat: 8, lon: 32, color: '#1568ff' },
    { label: 'TOOLS', lat: -28, lon: 62, color: '#00dcff' },
    { label: 'EVALUATION', lat: -12, lon: -35, color: '#8beeff' },
    { label: 'HUMAN REVIEW', lat: 42, lon: 90, color: '#e8b84a' },
  ];

  const routes = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]
  ];

  // Fibonacci sphere gives a dense, dependency-free holographic globe.
  const points = [];
  const count = 780;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(320, rect.width);
    height = Math.max(320, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rotatePoint(point, extraRadius = 1) {
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const x1 = point.x * cr - point.z * sr;
    const z1 = point.x * sr + point.z * cr;
    const y2 = point.y * ct - z1 * st;
    const z2 = point.y * st + z1 * ct;
    return { x: x1 * extraRadius, y: y2 * extraRadius, z: z2 * extraRadius };
  }

  function latLon(lat, lon) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return {
      x: -(Math.sin(phi) * Math.cos(theta)),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
    };
  }

  function project(point, radiusScale = 1) {
    const r = Math.min(width, height) * 0.39;
    return {
      x: width / 2 + point.x * r * radiusScale,
      y: height / 2 - point.y * r * radiusScale,
      z: point.z,
      r,
    };
  }

  function drawSphere() {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.39;
    const glow = ctx.createRadialGradient(centerX - radius * 0.25, centerY - radius * 0.3, radius * 0.05, centerX, centerY, radius * 1.3);
    glow.addColorStop(0, 'rgba(54,194,255,.24)');
    glow.addColorStop(.55, 'rgba(0,90,190,.09)');
    glow.addColorStop(1, 'rgba(0,10,30,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    const edge = ctx.createRadialGradient(centerX, centerY, radius * .55, centerX, centerY, radius);
    edge.addColorStop(0, 'rgba(0,24,56,.12)');
    edge.addColorStop(.78, 'rgba(0,78,156,.14)');
    edge.addColorStop(1, 'rgba(0,220,255,.38)');
    ctx.fillStyle = edge;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(85,224,255,.42)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawGrid() {
    const radius = Math.min(width, height) * 0.39;
    const cx = width / 2, cy = height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.lineWidth = .75;
    ctx.strokeStyle = 'rgba(75,181,255,.15)';

    // Latitude and longitude lines projected from 3D.
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = rotatePoint(latLon(lat, lon));
        if (p.z < -.05) { started = false; continue; }
        const s = project(p);
        if (!started) { ctx.moveTo(s.x, s.y); started = true; } else ctx.lineTo(s.x, s.y);
      }
      ctx.stroke();
    }
    for (let lon = -150; lon <= 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -89; lat <= 89; lat += 3) {
        const p = rotatePoint(latLon(lat, lon));
        if (p.z < -.05) { started = false; continue; }
        const s = project(p);
        if (!started) { ctx.moveTo(s.x, s.y); started = true; } else ctx.lineTo(s.x, s.y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPoints() {
    for (const point of points) {
      const p = rotatePoint(point);
      if (p.z < -.18) continue;
      const s = project(p);
      const alpha = Math.max(.08, (p.z + .2) / 1.2) * .78;
      const size = .6 + Math.max(0, p.z) * 1.3;
      ctx.fillStyle = `rgba(94,226,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function sphericalMix(a, b, t) {
    let x = a.x * (1 - t) + b.x * t;
    let y = a.y * (1 - t) + b.y * t;
    let z = a.z * (1 - t) + b.z * t;
    const len = Math.hypot(x, y, z) || 1;
    x /= len; y /= len; z /= len;
    const lift = 1 + Math.sin(Math.PI * t) * .18;
    return { x: x * lift, y: y * lift, z: z * lift };
  }

  function drawRoutes(time) {
    routes.forEach(([from, to], routeIndex) => {
      const a = latLon(nodes[from].lat, nodes[from].lon);
      const b = latLon(nodes[to].lat, nodes[to].lon);
      const samples = [];
      for (let i = 0; i <= 40; i += 1) {
        const raw = sphericalMix(a, b, i / 40);
        const p = rotatePoint(raw);
        if (p.z > -.12) samples.push(project(p));
      }
      if (samples.length < 2) return;
      ctx.strokeStyle = routeIndex % 3 === 0 ? 'rgba(232,184,74,.65)' : 'rgba(0,220,255,.55)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      samples.forEach((s, i) => i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y));
      ctx.stroke();

      const progress = ((time / 2200) + routeIndex * .17) % 1;
      const pulseIndex = Math.min(samples.length - 1, Math.floor(progress * samples.length));
      const pulse = samples[pulseIndex];
      if (pulse) {
        const gradient = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, 10);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(.22, routeIndex % 3 === 0 ? '#ffd97a' : '#00dcff');
        gradient.addColorStop(1, 'rgba(0,220,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawNodes(time) {
    nodes.forEach((node, index) => {
      const p = rotatePoint(latLon(node.lat, node.lon));
      if (p.z < -.15) return;
      const s = project(p);
      const pulse = 1 + Math.sin(time / 450 + index) * .18;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4.2 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = node.color;
      ctx.globalAlpha = .45;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 9 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  function frame(time) {
    const delta = Math.min(40, time - lastTime);
    lastTime = time;
    if (visible) {
      if (!dragging && !reduceMotion.matches) rotation += delta * .00011;
      ctx.clearRect(0, 0, width, height);
      drawSphere();
      drawGrid();
      drawRoutes(time);
      drawPoints();
      drawNodes(time);
    }
    requestAnimationFrame(frame);
  }

  function startDrag(event) {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  }
  function moveDrag(event) {
    if (!dragging || reduceMotion.matches) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    rotation += dx * .006;
    tilt = Math.max(-.75, Math.min(.75, tilt + dy * .004));
    lastX = event.clientX;
    lastY = event.clientY;
  }
  function endDrag(event) {
    dragging = false;
    canvas.releasePointerCapture?.(event.pointerId);
  }

  canvas.addEventListener('pointerdown', startDrag);
  canvas.addEventListener('pointermove', moveDrag);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('dblclick', () => { rotation = -.45; tilt = -.13; });
  window.addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  if ('IntersectionObserver' in window && stage) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .02 }).observe(stage);
  }
  resize();
  requestAnimationFrame(frame);
})();
