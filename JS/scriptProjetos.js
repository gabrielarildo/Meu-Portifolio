// ── Partículas ──
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => { resize(); createParticles(); });
})();

// ── Reveal on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ── Filtro de tecnologias ──
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");
const emptyState = document.getElementById("empty-state");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Atualiza botão ativo
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    let visible = 0;

    cards.forEach(card => {
      const tags = card.dataset.tags || "";
      const match = filter === "all" || tags.split(",").includes(filter);

      if (match) {
        card.classList.remove("hidden");
        visible++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Mostra/esconde empty state
    emptyState.style.display = visible === 0 ? "block" : "none";
  });
});

// ── Contador animado nos stats ──
function animateCount(el, target, duration = 800) {
  const start = performance.now();
  const isPercent = String(target).includes("%");
  const num = parseInt(target);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.round(eased * num);
    el.textContent = isPercent ? current + "%" : current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Anima os stats quando a página carrega
window.addEventListener("load", () => {
  document.querySelectorAll(".stat-num").forEach(el => {
    const original = el.textContent.trim();
    el.textContent = "0";
    setTimeout(() => animateCount(el, original, 900), 300);
  });
});

// ── Link ativo na navbar ──
document.querySelectorAll(".navbar a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});