// Create and initialize canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Canvas setup

// Cursor position and color circles
let circles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX;
let targetY = mouseY;
let isTouch = false;

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.targetRadius = radius;
        this.color = color;
        this.alpha = 3;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (isTouch) {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
        
        this.radius += (this.targetRadius - this.radius) * 0.1;
        this.alpha *= 0.98;
        return this.alpha > 0.01;
    }
}


function handleInteraction(x, y, isTouch = false) {
    mouseX = x;
    mouseY = y;
    
    if (Math.random() > (isTouch ? 0.5 : 0.8)) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        circles.push(new Circle(
            x,
            y,
            Math.random() * (isTouch ? 70 : 50) + 20,
            color
        ));
    }
}

// Mouse event handlers
document.addEventListener('mousemove', (e) => {
    isTouch = false;
    handleInteraction(e.clientX, e.clientY);
});

// Touch event handlers
document.addEventListener('touchstart', (e) => {
    isTouch = true;
    if (e.touches[0]) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
    }
}, { passive: true });

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(248, 249, 250, 0.1)';
    ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), 
                      canvas.height / (window.devicePixelRatio || 1));
    
    circles = circles.filter(circle => {
        circle.draw();
        return circle.update();
    });
    
    requestAnimationFrame(animate);
}

// Initialize
function init() {
    setupCanvas();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setupCanvas();
        // Reset positions on resize
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
    });
}

// Start animation when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Custom cursor (only show on non-touch devices)
const cursor = document.querySelector('.cursor-follower');
if (cursor) {
    // Check if device has touch capability
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
    } else {
        let cursorX = 0;
        let cursorY = 0;

        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(updateCursor);
        }

        updateCursor();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    })
  })
})

// Navbar scroll effect
const navbar = document.querySelector(".navbar")
let lastScroll = 0

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll <= 0) {
    navbar.classList.remove("scroll-up")
    return
  }

  if (currentScroll > lastScroll && !navbar.classList.contains("scroll-down")) {
    navbar.classList.remove("scroll-up")
    navbar.classList.add("scroll-down")
  } else if (currentScroll < lastScroll && navbar.classList.contains("scroll-down")) {
    navbar.classList.remove("scroll-down")
    navbar.classList.add("scroll-up")
  }
  lastScroll = currentScroll
})

// animation to timeline items
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

document.querySelectorAll(".timeline-item").forEach((item) => {
  observer.observe(item)
})

