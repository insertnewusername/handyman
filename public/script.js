// ====================================================
// script.js – Contact form with inline status messages
// ====================================================

// Hamburger menu toggle (unchanged)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// =============================================
// CONTACT FORM – professional inline messages
// =============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formFieldsWrapper = document.getElementById('formFieldsWrapper');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear any previous status
    formStatus.className = 'form-status';
    formStatus.textContent = '';
    formStatus.style.display = 'none';

    // Show loading state on button
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // ---- SUCCESS ----
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <i class="fas fa-check-circle icon"></i>
          <strong>Thank you!</strong> Your message has been sent. We'll get back to you soon.
        `;
        formStatus.style.display = 'block';

        // Hide the form fields (clean professional look)
        formFieldsWrapper.classList.add('hidden');

        // Reset form (just in case they come back later)
        contactForm.reset();

      } else {
        // ---- ERROR from Formspree ----
        let errorMsg = 'Something went wrong. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (_) { /* ignore */ }

        formStatus.className = 'form-status error';
        formStatus.innerHTML = `
          <i class="fas fa-exclamation-circle icon"></i>
          <strong>Oops!</strong> ${errorMsg}
        `;
        formStatus.style.display = 'block';

        // Keep form visible so user can retry
      }

    } catch (error) {
      // ---- NETWORK ERROR ----
      formStatus.className = 'form-status error';
      formStatus.innerHTML = `
        <i class="fas fa-exclamation-circle icon"></i>
        <strong>Network error.</strong> Please check your connection and try again.
      `;
      formStatus.style.display = 'block';
    }

    // Restore button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}