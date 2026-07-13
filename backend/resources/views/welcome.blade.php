<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GuisedUp — Editorial Discovery</title>

    <!-- Fontshare CDN for Clash Display and Satoshi -->
    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@700&f[]=satoshi@500,700&f[]=cabinet-grotesk@800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,600&display=swap" rel="stylesheet">

    <style>
        /* Custom Reset and Variables */
        :root {
            --bg-color: #f2f2f2;
            --text-color: #111111;
            --text-secondary: #838282;
            --text-muted: #b6b5b5;
            --accent-gray: #1e1e1e;
            --font-headline: 'Clash Display', 'Cabinet Grotesk', sans-serif;
            --font-body: 'Satoshi', sans-serif;
            --font-serif: 'Playfair Display', Georgia, serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: var(--font-body);
            font-weight: 500;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }

        /* Utility Classes */
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        /* Typography */
        h1, h2, h3 {
            font-family: var(--font-headline);
            font-weight: 700;
            letter-spacing: -0.05em;
            line-height: 0.9;
        }

        .serif-italic {
            font-family: var(--font-serif);
            font-style: italic;
            font-weight: 400;
        }

        /* Header Navigation */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 80px;
            background-color: rgba(242, 242, 242, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 1000;
            border-bottom: 1px solid rgba(30, 30, 30, 0.05);
        }

        .header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
        }

        .logo {
            font-family: var(--font-headline);
            font-size: 24px;
            font-weight: 700;
            color: var(--text-color);
            text-decoration: none;
            letter-spacing: -0.03em;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 32px;
        }

        .nav-link {
            font-size: 14px;
            text-transform: uppercase;
            color: var(--text-color);
            text-decoration: none;
            letter-spacing: 0.05em;
            transition: color 120ms ease;
        }

        .nav-link:hover {
            color: var(--text-muted);
        }

        .contact-btn {
            font-size: 14px;
            text-transform: uppercase;
            color: var(--text-color);
            text-decoration: none;
            letter-spacing: 0.05em;
            padding: 10px 24px;
            border: 1px solid var(--accent-gray);
            border-radius: 9999px;
            transition: background-color 200ms ease, color 200ms ease;
        }

        .contact-btn:hover {
            background-color: var(--accent-gray);
            color: var(--bg-color);
        }

        /* Hero Section */
        .hero {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
            padding-top: 80px;
            position: relative;
            background-color: var(--bg-color);
        }

        /* Typographic Echo Stack */
        .echo-stack {
            position: relative;
            text-align: center;
            cursor: default;
            user-select: none;
            display: inline-block;
        }

        .echo-layer {
            font-family: var(--font-headline);
            font-size: 11vw;
            font-weight: 800;
            letter-spacing: -0.05em;
            line-height: 0.85;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .echo-layer.foreground {
            color: var(--text-color);
            position: relative;
            z-index: 10;
        }

        .echo-layer.background-1 {
            position: absolute;
            top: -0.04em;
            left: -0.04em;
            color: #bfbfbf;
            z-index: 9;
            pointer-events: none;
        }

        .echo-layer.background-2 {
            position: absolute;
            top: -0.08em;
            left: -0.08em;
            color: #c9c9c9;
            z-index: 8;
            pointer-events: none;
        }

        .echo-layer.background-3 {
            position: absolute;
            top: -0.12em;
            left: -0.12em;
            color: #d1d1d1;
            z-index: 7;
            pointer-events: none;
        }

        .echo-layer.background-4 {
            position: absolute;
            top: -0.16em;
            left: -0.16em;
            color: #d9d9d9;
            z-index: 6;
            pointer-events: none;
        }

        /* Philosophy Narrative Section */
        .philosophy {
            padding: 100px 0;
            background-color: var(--bg-color);
            border-top: 1px solid rgba(30, 30, 30, 0.05);
        }

        .hairline-divider {
            width: 1px;
            height: 100px;
            background-color: rgba(30, 30, 30, 0.1);
            margin: 0 auto 48px auto;
        }

        .quote-container {
            max-width: 900px;
            margin: 0 auto 80px auto;
            text-align: center;
        }

        .philosophy-quote {
            font-size: clamp(32px, 4vw, 56px);
            line-height: 1.1;
            margin-bottom: 24px;
        }

        .philosophy-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 32px;
            margin-top: 60px;
        }

        .philosophy-col h3 {
            font-size: 24px;
            margin-bottom: 16px;
            text-transform: uppercase;
        }

        .philosophy-col p {
            color: var(--text-secondary);
            font-size: 16px;
            line-height: 1.6;
        }

        /* Asymmetrical Showcase Grid */
        .showcase {
            padding: 120px 0;
            background-color: var(--bg-color);
            border-top: 1px solid rgba(30, 30, 30, 0.05);
        }

        .showcase-header {
            margin-bottom: 60px;
        }

        .showcase-header h2 {
            font-size: 48px;
            text-transform: uppercase;
        }

        /* 12-Column Grid for Showcase Items */
        .grid-12 {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 32px;
        }

        /* Showcase Card Styling */
        .showcase-card {
            position: relative;
            background-color: rgba(30, 30, 30, 0.02);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            transition: all 700ms cubic-bezier(0.77, 0, 0.175, 1);
        }

        .showcase-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(20%);
            transition: transform 700ms cubic-bezier(0.77, 0, 0.175, 1), filter 700ms cubic-bezier(0.77, 0, 0.175, 1);
        }

        .showcase-card:hover img {
            filter: grayscale(0%);
            transform: scale(1.05);
        }

        .card-info {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 24px;
            background: linear-gradient(to top, rgba(17,17,17,0.8) 0%, rgba(17,17,17,0) 100%);
            color: #ffffff;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 500ms cubic-bezier(0.77, 0, 0.175, 1), transform 500ms cubic-bezier(0.77, 0, 0.175, 1);
        }

        .showcase-card:hover .card-info {
            opacity: 1;
            transform: translateY(0);
        }

        .card-caption {
            font-family: var(--font-headline);
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }

        .card-author {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #dddddd;
        }

        /* Grid Item Variations */
        .item-1 {
            grid-column: span 8;
            height: 480px;
            border-radius: 4px;
        }

        .item-2 {
            grid-column: span 4;
            height: 480px;
            border-radius: 9999px; /* Pill-shaped */
        }

        .item-3 {
            grid-column: span 5;
            aspect-ratio: 1; /* Circular aspect-square */
            border-radius: 50%;
        }

        .item-4 {
            grid-column: span 7;
            height: 400px;
            border-radius: 4px;
        }

        @media (max-width: 900px) {
            .item-1, .item-2, .item-3, .item-4 {
                grid-column: span 12;
                height: 360px;
                border-radius: 8px;
            }
            .item-3 {
                aspect-ratio: auto;
                border-radius: 8px;
            }
        }

        /* Bespoke Service Cards */
        .services {
            padding: 100px 0;
            background-color: var(--bg-color);
            border-top: 1px solid rgba(30, 30, 30, 0.05);
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 32px;
        }

        .service-card {
            padding: 48px;
            border: 1px solid rgba(30, 30, 30, 0.1);
            background-color: transparent;
            transition: background-color 300ms ease, border-color 300ms ease;
            cursor: pointer;
        }

        .service-card:hover {
            background-color: #ffffff;
            border-color: transparent;
            box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }

        .icon-container {
            width: 64px;
            height: 64px;
            border: 1px solid var(--text-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 32px;
            transition: transform 500ms cubic-bezier(0.77, 0, 0.175, 1);
        }

        .service-card:hover .icon-container {
            transform: rotate(12deg);
        }

        .service-card h4 {
            font-family: var(--font-headline);
            font-size: 28px;
            margin-bottom: 16px;
            text-transform: uppercase;
        }

        .service-card p {
            color: var(--text-secondary);
            font-size: 15px;
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .service-cta {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: var(--font-body);
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            text-decoration: none;
            color: var(--text-color);
        }

        .service-cta span {
            transition: transform 200ms ease;
        }

        .service-card:hover .service-cta span {
            transform: translateX(6px);
        }

        /* Pill-Shaped Vertical Showcase Extra */
        .showcase-pill-section {
            padding: 100px 0;
            background-color: var(--bg-color);
            border-top: 1px solid rgba(30, 30, 30, 0.05);
        }

        .pill-showcase-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 60px;
        }

        .pill-container {
            position: relative;
            width: 320px;
            height: 500px;
            border-radius: 9999px;
            overflow: hidden;
            background-color: #333333;
            cursor: pointer;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }

        .pill-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 700ms cubic-bezier(0.77, 0, 0.175, 1);
        }

        .pill-container:hover img {
            transform: scale(1.08);
        }

        .pill-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: rgba(242, 242, 242, 0.95);
            border: 1px solid var(--accent-gray);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 400ms ease;
            z-index: 10;
        }

        .pill-container:hover .pill-overlay {
            opacity: 1;
        }

        .pill-overlay text {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-color);
            font-weight: 700;
        }

        /* Footer Section */
        .footer {
            background-color: var(--accent-gray);
            color: #f6f6f6;
            padding: 80px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 48px;
            opacity: 0.6;
        }

        .footer-col h5 {
            font-family: var(--font-headline);
            font-size: 16px;
            text-transform: uppercase;
            margin-bottom: 24px;
            color: #ffffff;
        }

        .footer-col p {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .footer-col ul {
            list-style: none;
        }

        .footer-col ul li {
            margin-bottom: 12px;
        }

        .footer-col ul li a {
            color: #f6f6f6;
            text-decoration: none;
            font-size: 14px;
            transition: opacity 150ms ease;
        }

        .footer-col ul li a:hover {
            opacity: 0.6;
        }

        /* Responsive Hero styling */
        @media (max-width: 600px) {
            .echo-layer {
                font-size: 14vw;
            }
        }
    </style>
</head>
<body>

    <!-- Header Navigation -->
    <header class="header">
        <div class="container header-container">
            <a href="#" class="logo">GUISED UP</a>
            <nav class="nav-links">
                <a href="#philosophy" class="nav-link">Narrative</a>
                <a href="#showcase" class="nav-link">Showcase</a>
                <a href="#services" class="nav-link">Discovery</a>
                <a href="#contact" class="contact-btn">App Access</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section with Typographic Echo Stack -->
    <section class="hero">
        <div class="echo-stack">
            <div class="echo-layer background-4">GUISED UP</div>
            <div class="echo-layer background-3">GUISED UP</div>
            <div class="echo-layer background-2">GUISED UP</div>
            <div class="echo-layer background-1">GUISED UP</div>
            <div class="echo-layer foreground">GUISED UP</div>
        </div>
    </section>

    <!-- Philosophy Narrative Section -->
    <section id="philosophy" class="philosophy">
        <div class="container">
            <div class="hairline-divider"></div>
            <div class="quote-container">
                <h2 class="philosophy-quote">
                    Photography is the art of <span class="serif-italic">guising</span> reality to reveal a deeper neural aesthetic.
                </h2>
            </div>

            <div class="philosophy-grid">
                <div class="philosophy-col">
                    <h3>01 / FILTERED</h3>
                    <p>Every post undergoes sophisticated visual alteration. Real-time shader adjustments, grain injection, and exposure polishing levels define our editorial approach.</p>
                </div>
                <div class="philosophy-col">
                    <h3>02 / EMBEDDED</h3>
                    <p>Captions are analyzed with multi-dimensional vector models. Discover relationships through similarity queries powered by in-database pgvector indexing.</p>
                </div>
                <div class="philosophy-col">
                    <h3>03 / RANKED</h3>
                    <p>Ditch chronological clutter. Our multi-factor ranking formula scores post engagement, follow status, and temporal decay to surface what matches your taste.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Asymmetrical Showcase Grid -->
    <section id="showcase" class="showcase">
        <div class="container">
            <div class="showcase-header">
                <h2>EDITORIAL DISPLAY</h2>
            </div>
            
            <div class="grid-12" id="showcase-grid">
                <!-- Fallback Static Cards (will be augmented by API) -->
                <div class="showcase-card item-1">
                    <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" alt="Showcase 1">
                    <div class="card-info">
                        <div class="card-caption">Neural Portraiture Study</div>
                        <div class="card-author">By Alice Smith</div>
                    </div>
                </div>

                <div class="showcase-card item-2">
                    <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800" alt="Showcase 2">
                    <div class="card-info">
                        <div class="card-caption">Analog Drift</div>
                        <div class="card-author">By Bob Jones</div>
                    </div>
                </div>

                <div class="showcase-card item-3">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800" alt="Showcase 3">
                    <div class="card-info">
                        <div class="card-caption">Geometric Landscape</div>
                        <div class="card-author">By Alice Smith</div>
                    </div>
                </div>

                <div class="showcase-card item-4">
                    <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200" alt="Showcase 4">
                    <div class="card-info">
                        <div class="card-caption">Brutalist Shadows</div>
                        <div class="card-author">By Bob Jones</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Bespoke Service Cards -->
    <section id="services" class="services">
        <div class="container">
            <div class="services-grid">
                <div class="service-card">
                    <div class="icon-container">■</div>
                    <h4>Filter Polish</h4>
                    <p>Apply calibrated levels of grain, aberration, and dynamic range to raw captures. Perfect the aesthetic before publishing.</p>
                    <a href="#" class="service-cta">Learn More <span>→</span></a>
                </div>

                <div class="service-card">
                    <div class="icon-container">▲</div>
                    <h4>Semantic Search</h4>
                    <p>Query posts using natural language concepts. Our 384-dimension embeddings retrieve contextually similar visual journals.</p>
                    <a href="#" class="service-cta">Learn More <span>→</span></a>
                </div>

                <div class="service-card">
                    <div class="icon-container">◆</div>
                    <h4>Ranked Discovery</h4>
                    <p>A feed calibrated to your social graph, engagement ratios, and recency decay. Experience premium curated timelines.</p>
                    <a href="#" class="service-cta">Learn More <span>→</span></a>
                </div>
            </div>
        </div>
    </section>

    <!-- Pill-Shaped Vertical Showcase Section -->
    <section class="showcase-pill-section">
        <div class="container">
            <div class="showcase-header" style="text-align: center;">
                <h2>FEATURED INSIGHT</h2>
            </div>
            <div class="pill-showcase-container">
                <div class="pill-container">
                    <img src="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&q=80&w=800" alt="Pill Showcase">
                    <div class="pill-overlay">
                        <text>Volume I</text>
                        <text style="font-size:9px; margin-top:4px; opacity:0.6;">Aesthetic</text>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h5>GUISED UP</h5>
                    <p>An editorial social system utilizing mathematical ranking and semantic vector representations.</p>
                    <p>© 2026 GuisedUp. All rights reserved.</p>
                </div>
                <div class="footer-col">
                    <h5>Platform</h5>
                    <ul>
                        <li><a href="#">Interactive Feed</a></li>
                        <li><a href="#">Semantic Search</a></li>
                        <li><a href="#">Shader Library</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h5>Architecture</h5>
                    <ul>
                        <li><a href="#">Laravel 13 API</a></li>
                        <li><a href="#">FastAPI Embedder</a></li>
                        <li><a href="#">PostgreSQL + pgvector</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h5>Contact</h5>
                    <p>General: info@guisedup.com</p>
                    <p>Engineering: dev@guisedup.com</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Dynamic Feed Loader Script -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            fetch('/api/feed?per_page=4')
                .then(response => response.json())
                .then(res => {
                    const data = res.data || res;
                    if (data && data.length > 0) {
                        const grid = document.getElementById('showcase-grid');
                        // Map the items to cards
                        let html = '';
                        data.forEach((post, index) => {
                            const itemClass = `item-${(index % 4) + 1}`;
                            const imgUrl = post.image_path.startsWith('/') 
                                ? `https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800` // fallback unsplash
                                : post.image_path;
                            const caption = post.caption || 'No Caption Provided';
                            const author = post.user ? post.user.name : 'Unknown User';

                            html += `
                                <div class="showcase-card ${itemClass}">
                                    <img src="${imgUrl}" alt="${caption}" onerror="this.src='https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800'">
                                    <div class="card-info">
                                        <div class="card-caption">${caption}</div>
                                        <div class="card-author">By ${author}</div>
                                    </div>
                                </div>
                            `;
                        });
                        grid.innerHTML = html;
                    }
                })
                .catch(err => console.log('Could not load dynamic feed, using static fallbacks.', err));
        });
    </script>
</body>
</html>
