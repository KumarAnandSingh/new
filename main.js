// Main JavaScript for studyify.in
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.querySelector('.fa-moon').parentElement;
    const body = document.body;
    const cards = document.querySelectorAll('.bg-white');
    
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        cards.forEach(card => {
            card.classList.toggle('dark-card');
            card.classList.toggle('bg-white');
        });
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
        
        // Save preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        cards.forEach(card => {
            card.classList.add('dark-card');
            card.classList.remove('bg-white');
        });
        darkModeToggle.querySelector('i').classList.remove('fa-moon');
        darkModeToggle.querySelector('i').classList.add('fa-sun');
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.fa-bars').parentElement;
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu fixed inset-0 bg-gray-800 bg-opacity-90 z-50 flex flex-col items-center justify-center transform translate-x-full transition-transform duration-300 ease-in-out';
    mobileMenu.innerHTML = `
        <button class="absolute top-4 right-4 text-white text-2xl">&times;</button>
        <nav class="flex flex-col space-y-6 text-center">
            <a href="#" class="text-white text-xl hover:text-indigo-400">Home</a>
            <a href="#" class="text-white text-xl hover:text-indigo-400">AI Tools</a>
            <a href="#" class="text-white text-xl hover:text-indigo-400">Tutorials</a>
            <a href="#" class="text-white text-xl hover:text-indigo-400">Productivity</a>
            <a href="#" class="text-white text-xl hover:text-indigo-400">Community</a>
            <a href="#" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 mt-4">Sign In</a>
        </nav>
    `;
    document.body.appendChild(mobileMenu);
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('translate-x-full');
    });
    
    mobileMenu.querySelector('button').addEventListener('click', function() {
        mobileMenu.classList.add('translate-x-full');
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput.value) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-md';
            successMessage.textContent = 'Thank you for subscribing!';
            this.appendChild(successMessage);
            emailInput.value = '';
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                mobileMenu.classList.add('translate-x-full');
            }
        });
    });
});
