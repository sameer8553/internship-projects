// ======================================
// 1. CART FUNCTIONALITY
// ======================================

let cartCount = 0;

// Get all add to cart buttons
let addButtons = document.querySelectorAll('.btn-add');

// Loop through each button
addButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Get product name
        let product = this.getAttribute('data-product');
        
        // Increase cart count
        cartCount = cartCount + 1;
        
        // Update cart display
        document.getElementById('cartCount').textContent = cartCount;
        
        // Show message
        alert(product + ' added to cart! ✅');
    });
});

// ======================================
// 2. TOGGLE PRODUCTS
// ======================================

let toggleBtn = document.getElementById('toggleBtn');
let productGrid = document.getElementById('productGrid');
let isVisible = true;

toggleBtn.addEventListener('click', function() {
    if (isVisible) {
        productGrid.style.display = 'none';
        isVisible = false;
        this.innerHTML = '<i class="bi bi-eye"></i> Show Products';
    } else {
        productGrid.style.display = 'flex';
        isVisible = true;
        this.innerHTML = '<i class="bi bi-eye"></i> Hide Products';
    }
});

// ======================================
// 3. CONTACT FORM VALIDATION
// ======================================

// Get form elements
let form = document.getElementById('contactForm');
let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let subjectInput = document.getElementById('subject');
let messageInput = document.getElementById('message');
let nameError = document.getElementById('nameError');
let emailError = document.getElementById('emailError');
let formMsg = document.getElementById('formMsg');

// Validate name
function validateName() {
    let name = nameInput.value.trim();
    if (name.length < 2) {
        nameError.classList.add('show');
        return false;
    } else {
        nameError.classList.remove('show');
        return true;
    }
}

// Validate email
function validateEmail() {
    let email = emailInput.value.trim();
    // Check if email has @ and .
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        emailError.classList.add('show');
        return false;
    } else {
        emailError.classList.remove('show');
        return true;
    }
}

// Check on blur
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);

// Check while typing
nameInput.addEventListener('input', function() {
    if (this.value.trim().length >= 2) {
        nameError.classList.remove('show');
    }
});

emailInput.addEventListener('input', function() {
    let email = this.value.trim();
    if (email.indexOf('@') !== -1 && email.indexOf('.') !== -1) {
        emailError.classList.remove('show');
    }
});

// Form submit
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page refresh
    
    // Validate
    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    
    if (isNameValid && isEmailValid) {
        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let subject = subjectInput.value.trim() || 'No subject';
        let message = messageInput.value.trim() || 'No message';
        
        // Show success message
        formMsg.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show">
                <i class="bi bi-check-circle"></i> 
                <strong>Thank you ${name}!</strong> Your message has been sent.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Clear form
        nameInput.value = '';
        emailInput.value = '';
        subjectInput.value = '';
        messageInput.value = '';
        
        // Remove errors
        nameError.classList.remove('show');
        emailError.classList.remove('show');
        
        // Log to console
        console.log('Form submitted!');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Subject:', subject);
        console.log('Message:', message);
        
    } else {
        // Show error
        formMsg.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> 
                Please fix the errors above.
            </div>
        `;
    }
});

// ======================================
// 4. SMOOTH SCROLL FOR NAV LINKS
// ======================================

document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        let href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            let target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

console.log('ShopVerse Loaded Successfully! 🛍️');