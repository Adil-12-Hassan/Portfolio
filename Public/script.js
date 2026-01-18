"use strict";

// ==================== HEADER ====================
const navLinks = document.querySelectorAll('.nav-links li a');

// ==================== SECTIONS ====================
const heroText = document.querySelector('.hero-text');
const aboutText = document.querySelector('.about-text');
const experienceSection = document.getElementById('experience');
const projectsSection = document.getElementById('projects');
const contactSection = document.getElementById('contact');

// ==================== BUTTONS ====================
const hireBtn = document.querySelector('.btn-dark');
const experienceBtn = document.querySelector('.btn-orange');
const viewProjectsBtn = document.querySelector('.about-text .btn-orange');

// ==================== CARDS ====================
const cards = document.querySelectorAll('.card');

// ==================== FORM ====================
const form = document.querySelector('form');
const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
const emailInput = document.querySelector('input[placeholder="Email Address"]');
const subjectInput = document.querySelector('input[placeholder="Subject"]');
const messageInput = document.querySelector('textarea[placeholder="Your Message"]');

// ==================== SOCIAL ====================
const socialLinks = document.querySelectorAll('.social-links a');

// ==================== ACTIVE NAV ====================
function setActiveLink() {
    let current = '';

    document.querySelectorAll('section').forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==================== SCROLL REVEAL ====================
const revealElements = [
    heroText,
    aboutText,
    experienceSection,
    projectsSection,
    contactSection
];

revealElements.forEach(el => el.classList.add('reveal'));

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
}

// ==================== BUTTON ACTIONS ====================
hireBtn.addEventListener('click', () => {
    contactSection.scrollIntoView({ behavior: 'smooth' });
});

experienceBtn.addEventListener('click', () => {
    experienceSection.scrollIntoView({ behavior: 'smooth' });
});

viewProjectsBtn.addEventListener('click', () => {
    projectsSection.scrollIntoView({ behavior: 'smooth' });
});

// ==================== CARD HOVER ====================
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ==================== FORM SUBMIT ====================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!fullNameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
        alert('Please fill all fields');
        return;
    }

    const data = {
        name: fullNameInput.value,
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value
    };

    try {
        const res = await fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert('Message sent successfully ✅');
            form.reset();
        } else {
            alert('Failed ❌');
        }
    } catch (err) {
        console.error(err);
        alert('Server error ❌');
    }
});

// ==================== SOCIAL CLICK ====================
socialLinks.forEach(link => {
    link.addEventListener('click', () => {
        link.style.transform = 'scale(0.9)';
        setTimeout(() => link.style.transform = 'scale(1)', 150);
    });
});

// ==================== SCROLL EVENTS ====================
window.addEventListener('scroll', () => {
    setActiveLink();
    revealOnScroll();
});

revealOnScroll();
