/* =========================================
   KARSAKALA - SCRIPT (CLEANED & SECURED)
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. DYNAMIC SCROLL PARTICLES & PROGRESS BAR
    ===================================== */
    const particleContainer = document.getElementById("particles");
    const progressBar = document.getElementById("scrollProgressBar");

    if (particleContainer) {
        const canvas = document.createElement("canvas");
        particleContainer.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        let particles = [];
        let scrollY = window.scrollY;
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const particleCount = window.innerWidth < 600 ? 60 : 130;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                baseHue: 200,
                opacity: Math.random() * 0.6 + 0.2
            });
        }

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("scroll", () => {
            scrollY = window.scrollY;
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (progressBar) {
                progressBar.style.width = scrolled + "%";
            }
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scrollFactor = Math.min(scrollY / 1000, 2);

            particles.forEach((p) => {
                p.x += p.speedX * (1 + scrollFactor * 1.5);
                p.y += p.speedY * (1 + scrollFactor * 1.5);

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    p.x -= dx * 0.003;
                    p.y -= dy * 0.003;
                }

                const currentHue = (p.baseHue + scrollFactor * 80) % 360;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (1 + scrollFactor * 0.3), 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${currentHue}, 100%, 55%, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    /* =====================================
       2. LOGO SHATTER EFFECT (PURE PARTICLES SPREAD)
    ===================================== */
    const logoImg = document.getElementById("logoImg");
    const shatterCanvas = document.getElementById("logoShatterCanvas");

    if (logoImg && shatterCanvas) {
        const sCtx = shatterCanvas.getContext("2d");
        let pixels = [];
        let isLoaded = false;

        logoImg.onload = () => {
            initShatter();
            isLoaded = true;
        };

        if (logoImg.complete) {
            initShatter();
            isLoaded = true;
        }

                function initShatter() {
            const displayWidth = 280;
            const displayHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * displayWidth || 280;

            const dpr = window.devicePixelRatio || 1;
            shatterCanvas.width = displayWidth * dpr;
            shatterCanvas.height = displayHeight * dpr;
            shatterCanvas.style.width = displayWidth + "px";
            shatterCanvas.style.height = displayHeight + "px";

            sCtx.scale(dpr, dpr);

            const offCanvas = document.createElement("canvas");
            const offCtx = offCanvas.getContext("2d");
            offCanvas.width = displayWidth;
            offCanvas.height = displayHeight;
            offCtx.drawImage(logoImg, 0, 0, displayWidth, displayHeight);

            const imgData = offCtx.getImageData(0, 0, displayWidth, displayHeight);
            pixels = [];

            const centerX = displayWidth / 2;
            const centerY = displayHeight / 2;
            const maxRadius = Math.min(centerX, centerY);

            const step = 3;
            for (let y = 0; y < displayHeight; y += step) {
                for (let x = 0; x < displayWidth; x += step) {
                    const index = (y * displayWidth + x) * 4;
                    const alpha = imgData.data[index + 3];

                    if (alpha > 40) {
                        const dx = x - centerX;
                        const dy = y - centerY;
                        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                        
                        let fadeAlpha = alpha / 255;
                        if (distFromCenter > maxRadius * 0.75) {
                            fadeAlpha *= Math.max(0, (maxRadius - distFromCenter) / (maxRadius * 0.25));
                        }

                        if (fadeAlpha > 0.05) {
                            pixels.push({
                                origX: dx,
                                origY: dy,
                                x: dx,
                                y: dy,
                                vx: (Math.random() - 0.5) * 14,
                                vy: (Math.random() - 0.5) * 14,
                                color: `rgba(${imgData.data[index]}, ${imgData.data[index+1]}, ${imgData.data[index+2]}, ${fadeAlpha})`
                            });
                        }
                    }
                }
            }
        }

        function renderShatter() {
            if (!isLoaded || pixels.length === 0) {
                requestAnimationFrame(renderShatter);
                return;
            }

            sCtx.clearRect(0, 0, shatterCanvas.width, shatterCanvas.height);
            
            sCtx.save();
            const currentW = shatterCanvas.style.width ? parseFloat(shatterCanvas.style.width) : 280;
            const currentH = shatterCanvas.style.height ? parseFloat(shatterCanvas.style.height) : 280;
            sCtx.translate(currentW / 2, currentH / 2);

            const scrollProgress = Math.min(window.scrollY / 380, 1);

            pixels.forEach((p) => {
                const targetX = p.origX + p.vx * scrollProgress * 90;
                const targetY = p.origY + p.vy * scrollProgress * 90;

                p.x += (targetX - p.x) * 0.1;
                p.y += (targetY - p.y) * 0.1;

                sCtx.fillStyle = p.color;
                const size = Math.max(1, 2.2 * (1 - scrollProgress * 0.5));
                sCtx.fillRect(p.x, p.y, size, size);
            });

            sCtx.restore();
            requestAnimationFrame(renderShatter);
        }

        renderShatter();

    }

    /* =====================================
       3. FAQ ACCORDION INTERACTION
    ===================================== */
    const faqList = document.getElementById("faqList");

    function setupFaqAccordion() {
        const faqItems = document.querySelectorAll(".faq-item");
        
        faqItems.forEach(item => {
            const question = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");

            question.onclick = () => {
                const isActive = item.classList.contains("active");

                faqItems.forEach(i => {
                    i.classList.remove("active");
                    const a = i.querySelector(".faq-answer");
                    if (a) a.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add("active");
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            };
        });
    }
    setupFaqAccordion();

    /* =====================================
       4. ADMIN MODAL & PASSWORD PROTECTION
    ===================================== */
    const adminModal = document.getElementById("adminModal");
    const openBtn1 = document.getElementById("openAdminModalNav");
    const openBtn2 = document.getElementById("openAdminModalBtn");
    const closeBtn = document.getElementById("closeAdminModal");
    const addFaqForm = document.getElementById("addFaqForm");

    function toggleModal(showModal) {
        if (showModal) {
            adminModal.classList.add("active");
        } else {
            adminModal.classList.remove("active");
        }
    }

    if (openBtn1) openBtn1.onclick = () => toggleModal(true);
    if (openBtn2) openBtn2.onclick = () => toggleModal(true);
    if (closeBtn) closeBtn.onclick = () => toggleModal(false);

    if (addFaqForm) {
        addFaqForm.onsubmit = (e) => {
            e.preventDefault();
            const passwordInput = document.getElementById("adminPassword").value;
            const qVal = document.getElementById("faqQuestionInput").value;
            const aVal = document.getElementById("faqAnswerInput").value;

            const CORRECT_PASSWORD = "karsakala2026";

            if (passwordInput !== CORRECT_PASSWORD) {
                alert("Kata sandi admin salah! Akses ditolak.");
                return;
            }

            const newItem = document.createElement("div");
            newItem.className = "faq-item";
            newItem.innerHTML = `
                <div class="faq-question">
                    <span>${qVal}</span>
                    <span class="faq-toggle-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>${aVal}</p>
                </div>
            `;

            faqList.appendChild(newItem);
            setupFaqAccordion();

            addFaqForm.reset();
            toggleModal(false);
            alert("Berhasil! FAQ baru telah ditambahkan.");
        };
    }

    /* =====================================
       5. INTERACTIVE CATEGORY FILTERING
    ===================================== */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".aspirasi-cards .card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            cards.forEach(card => {
                if (filter === "all" || card.getAttribute("data-category") === filter) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });

    /* =====================================
       6. ANIMATED COUNTERS (ON SCROLL)
    ===================================== */
    const counters = document.querySelectorAll(".counter");
    let animated = false;

    window.addEventListener("scroll", () => {
        const statSection = document.querySelector(".extra-elements");
        if (statSection && !animated) {
            const rect = statSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute("data-target");
                    let count = 0;
                    const speed = target / 30;

                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                animated = true;
            }
        }
    });

    /* =====================================
       7. BACK TO TOP BUTTON
    ===================================== */
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.onclick = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }

    /* =====================================
       8. SMOOTH SCROLL & NAVIGATION
    ===================================== */
    const buttons = document.querySelectorAll('a[href^="#"]');
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const targetId = button.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* =====================================
       9. MOBILE MENU
    ===================================== */
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector(".navbar nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("mobile-open");
        });
    }

    /* =====================================
       10. FORM SUBMISSION (AJAX)
    ===================================== */
    const aspirasiForm = document.getElementById("aspirasiForm");
    const formStatus = document.getElementById("formStatus");

    if (aspirasiForm) {
        aspirasiForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(aspirasiForm);
            formStatus.textContent = "Mengirim pesan...";

            try {
                const response = await fetch(aspirasiForm.action, {
                    method: aspirasiForm.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = "Aspirasi berhasil dikirim! Terima kasih atas masukannya.";
                    formStatus.style.color = "#00ff88";
                    aspirasiForm.reset();
                } else {
                    formStatus.textContent = "Gagal mengirim pesan. Cek kembali form.";
                    formStatus.style.color = "#ff4d4d";
                }
            } catch (error) {
                formStatus.textContent = "Terjadi kesalahan koneksi.";
                formStatus.style.color = "#ff4d4d";
            }
        });
    }
});
