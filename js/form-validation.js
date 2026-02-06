/* ============================================
   Form Validation: Contact Form
   ============================================ */

const FormValidation = {
  form: null,
  fields: {},

  rules: {
    name: {
      required: true,
      minLength: 2,
      message: 'Please enter your name (at least 2 characters).'
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address.'
    },
    phone: {
      required: false,
      pattern: /^[+]?[\d\s\-().]{7,20}$/,
      message: 'Please enter a valid phone number.'
    },
    subject: {
      required: true,
      message: 'Please select a subject.'
    },
    message: {
      required: true,
      minLength: 10,
      message: 'Please enter a message (at least 10 characters).'
    }
  },

  init() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;

    // Collect field references
    Object.keys(this.rules).forEach((name) => {
      const input = this.form.querySelector(`[name="${name}"]`);
      const group = document.getElementById(`field-${name}`);
      const error = group ? group.querySelector('.form-error') : null;

      if (input && group) {
        this.fields[name] = { input, group, error };
      }
    });

    this.bindEvents();
  },

  bindEvents() {
    // Real-time validation on blur
    Object.keys(this.fields).forEach((name) => {
      const { input } = this.fields[name];

      input.addEventListener('blur', () => {
        this.validateField(name);
      });

      // Clear error on input
      input.addEventListener('input', () => {
        const { group } = this.fields[name];
        if (group.classList.contains('field--error')) {
          this.validateField(name);
        }
      });
    });

    // Submit handler
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  validateField(name) {
    const rule = this.rules[name];
    const { input, group, error } = this.fields[name];
    const value = input.value.trim();

    // Remove existing states
    group.classList.remove('field--error', 'field--valid');
    if (error) error.textContent = '';

    // Skip validation for optional empty fields
    if (!rule.required && value === '') {
      return true;
    }

    // Required check
    if (rule.required && value === '') {
      this.setError(name, rule.message);
      return false;
    }

    // Min length check
    if (rule.minLength && value.length < rule.minLength) {
      this.setError(name, rule.message);
      return false;
    }

    // Pattern check
    if (rule.pattern && value !== '' && !rule.pattern.test(value)) {
      this.setError(name, rule.message);
      return false;
    }

    // Valid
    this.setValid(name);
    return true;
  },

  setError(name, message) {
    const { group, error } = this.fields[name];
    group.classList.add('field--error');
    group.classList.remove('field--valid');
    if (error) error.textContent = message;
  },

  setValid(name) {
    const { group, error } = this.fields[name];
    group.classList.add('field--valid');
    group.classList.remove('field--error');
    if (error) error.textContent = '';
  },

  handleSubmit() {
    let isFormValid = true;

    // Validate all fields
    Object.keys(this.fields).forEach((name) => {
      const valid = this.validateField(name);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      // Focus the first field with an error
      const firstError = this.form.querySelector('.field--error input, .field--error select, .field--error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Form is valid - show success
    this.showSuccess();
  },

  showSuccess() {
    const successEl = document.getElementById('formSuccess');
    if (!successEl) return;

    // Hide the form
    this.form.style.display = 'none';

    // Show success message
    successEl.hidden = false;
    successEl.style.display = 'block';

    // Scroll to success message
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// FormValidation is available globally
