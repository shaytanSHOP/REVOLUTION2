document.addEventListener('DOMContentLoaded', () => {
    // Обработка появления/исчезновения шапки при скролле
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    const header = document.querySelector('.glass-header');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
            // Скроллим вниз
            if (!isScrollingDown) {
                header.style.transform = 'translateY(-100%)';
                isScrollingDown = true;
            }
        } else {
            // Скроллим вверх
            if (isScrollingDown) {
                header.style.transform = 'translateY(0)';
                isScrollingDown = false;
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Инициализация AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Настройка Canvas для цветов
    const canvas = document.getElementById('flowerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Установка размеров canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = 190;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Класс для цветка
    class Flower {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 15 + 5;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            this.petals = Math.floor(Math.random() * 2) + 5;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                '#ffffff', // белый
                '#ffb3ba', // светло-розовый
                '#bae1ff', // светло-голубой
                '#e6c3ff'  // светло-сиреневый
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            ctx.beginPath();
            for (let i = 0; i < this.petals; i++) {
                const angle = (i * Math.PI * 2) / this.petals;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                
                ctx.ellipse(
                    x, y,
                    this.size/2, this.size/3,
                    angle,
                    0, Math.PI * 2
                );
            }
            
            ctx.fillStyle = this.color;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(0, 0, this.size/4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff9c4';
            ctx.fill();
            
            ctx.restore();
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }

        isOffscreen() {
            return this.y > canvas.height || 
                   this.x < -20 || 
                   this.x > canvas.width + 20;
        }
    }

    const flowers = [];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.1 && flowers.length < 50) {
            flowers.push(new Flower());
        }

        for (let i = flowers.length - 1; i >= 0; i--) {
            flowers[i].update();
            flowers[i].draw();

            if (flowers[i].isOffscreen()) {
                flowers.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Интерактивность с цветами при движении мыши
    canvas.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (mouseY < canvas.height) {
            flowers.forEach(flower => {
                const dx = mouseX - flower.x;
                const dy = mouseY - flower.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    flower.x -= Math.cos(angle) * 2;
                    flower.y -= Math.sin(angle) * 2;
                    flower.rotation += 0.1;
                }
            });

            if (Math.random() < 0.1) {
                const newFlower = new Flower();
                newFlower.x = mouseX;
                newFlower.y = 0;
                flowers.push(newFlower);
            }
        }
    });

    // Эффект при клике
    canvas.addEventListener('click', (e) => {
        if (e.clientY < canvas.height) {
            for (let i = 0; i < 8; i++) {
                const newFlower = new Flower();
                newFlower.x = e.clientX;
                newFlower.y = e.clientY;
                newFlower.speedX = Math.cos(i * Math.PI / 4) * 3;
                newFlower.speedY = Math.sin(i * Math.PI / 4) * 3;
                newFlower.size = Math.random() * 10 + 5;
                flowers.push(newFlower);
            }
        }
    });

    // Переключение темы
    const themeArea = document.querySelector('.theme-area');
    themeArea.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Мобильные касания
    let touchStartY;
    canvas.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
        if (touchStartY) {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            
            if (Math.abs(deltaY) > 10) {
                flowers.push(new Flower());
            }
        }
    });

    canvas.addEventListener('touchend', () => {
        touchStartY = null;
    });
});