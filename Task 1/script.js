/**
 * JavaScript for Portfolio Website
 * Form validation with proper error messages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Get form elements ---
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const subjectInput = document.getElementById('subjectLine');
    const messageInput = document.getElementById('messageText');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const feedbackDiv = document.getElementById('formFeedback');

    // --- Helper function to show error ---
    function showError(element, errorDiv) {
        element.classList.add('is-invalid');
        errorDiv.classList.add('show');
    }

    // --- Helper function to hide error ---
    function hideError(element, errorDiv) {
        element.classList.remove('is-invalid');
        errorDiv.classList.remove('show');
    }

    // --- Validate name (at least 2 characters) ---
    function validateName() {
        const name = nameInput.value.trim();
        if (name.length < 2) {
            showError(nameInput, nameError);
            return false;
        } else {
            hideError(nameInput, nameError);
            return true;
        }
    }

    // --- Validate email (basic format) ---
    function validateEmail() {
        const email = emailInput.value.trim();
        // Simple email pattern: something@something.something
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showError(emailInput, emailError);
            return false;
        } else {
            hideError(emailInput, emailError);
            return true;
        }
    }

    // --- Add real-time validation events ---
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function() {
        if (this.value.trim().length >= 2) {
            hideError(nameInput, nameError);
        }
    });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (pattern.test(this.value.trim())) {
            hideError(emailInput, emailError);
        }
    });

    // --- Form submit handler ---
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload

        // Validate both fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();

        // If both are valid, show success message
        if (isNameValid && isEmailValid) {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim() || 'No subject';
            const message = messageInput.value.trim() || 'No message';

            // Show success feedback
            feedbackDiv.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                    <i class="bi bi-check-circle"></i> 
                    <strong>Thanks, ${name}!</strong> Your message has been sent. 
                    <small>(Demo submission)</small>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;

            // Optionally log to console (for demo)
            console.log('Form submitted successfully!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);

            // Reset form fields (optional)
            // form.reset();

            // Remove any previous error states
            hideError(nameInput, nameError);
            hideError(emailInput, emailError);

            // Scroll to feedback
            feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } else {
            // If validation fails, show a general warning
            feedbackDiv.innerHTML = `
                <div class="alert alert-danger mt-3" role="alert">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Please fix the errors above before submitting.
                </div>
            `;
        }
    });

    // --- Extra: If user clicks inside feedback, remove it ---
    feedbackDiv.addEventListener('click', function() {
        this.innerHTML = '';
    });

    // --- Smooth scroll for nav links (optional enhancement) ---
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    console.log('Portfolio script loaded successfully!');
});