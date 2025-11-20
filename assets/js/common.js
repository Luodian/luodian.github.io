$(document).ready(function() {
    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
    });
    $('a.bibtex').click(function() {
        $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
    });

    // Nav hide on scroll down, show on scroll up
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const current = window.scrollY;
            const delta = current - lastScroll;
            const shouldHide = current > 120 && delta > 4;

            if (shouldHide) {
                navbar.classList.add('nav-hidden');
                navbar.classList.remove('nav-visible');
            } else {
                navbar.classList.add('nav-visible');
                navbar.classList.remove('nav-hidden');
            }
            lastScroll = current;
            ticking = false;
        };

        window.addEventListener('scroll', () => {});
        navbar.classList.add('nav-visible');
    }

    // Background particle field
    const initParticleField = () => {
        const canvas = document.createElement('canvas');
        canvas.className = 'bg-particles';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width = 0;
        let height = 0;
        let layers = [];
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const generateLayer = (count, depth) => {
            const arr = [];
            for (let i = 0; i < count; i++) {
                arr.push({
                    x: Math.random(),
                    y: Math.random(),
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 0.8,
                    depth
                });
            }
            return arr;
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            // Layered cloud: foreground, mid, far
            const density = width * height / 18000;
            layers = [
                generateLayer(Math.max(24, density * 0.25), 0.15),
                generateLayer(Math.max(36, density * 0.35), 0.4),
                generateLayer(Math.max(48, density * 0.4), 0.75)
            ];
        };

        let lastTime = 0;
        let drift = 0;
        const draw = (time) => {
            const t = time || 0;
            const dt = Math.min(32, t - lastTime);
            lastTime = t;
            drift += dt * 0.00005;

            ctx.clearRect(0, 0, width, height);

            // faint haze
            const trail = ctx.createLinearGradient(0, 0, 0, height);
            trail.addColorStop(0, 'rgba(8, 18, 28, 0.25)');
            trail.addColorStop(1, 'rgba(12, 24, 36, 0.3)');
            ctx.fillStyle = trail;
            ctx.fillRect(0, 0, width, height);

            layers.forEach((layer, idx) => {
                const depth = layer[0]?.depth || 0.2;
                const parallaxX = Math.sin(drift * (1 + depth)) * 12 * depth;
                const parallaxY = Math.cos(drift * (0.8 + depth)) * 8 * depth;
                const amp = 10 + depth * 12;
                const baseRadius = 0.6 + depth * 1.6;
                const colorFront = idx === 0 ? 'rgba(110, 234, 255, 0.95)' : 'rgba(72, 242, 194, 0.85)';
                const glow = idx === 2 ? 'rgba(120, 160, 255, 0.35)' : 'rgba(72, 242, 194, 0.25)';

                layer.forEach((p) => {
                    p.phase += (dt / 1000) * p.speed;
                    let px = (p.x * width + parallaxX + Math.cos(p.phase * 0.8) * 6 * depth) % width;
                    let py = (p.y * height + parallaxY + Math.sin(p.phase * 1.1) * amp) % height;
                    if (px < 0) px += width;
                    if (py < 0) py += height;

                    const radius = baseRadius + Math.sin(p.phase * 1.3) * (0.5 + depth);

                    ctx.beginPath();
                    ctx.fillStyle = glow;
                    ctx.arc(px, py, radius * 3, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.fillStyle = colorFront;
                    ctx.arc(px, py, radius, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(draw);
    };

    initParticleField();
});
