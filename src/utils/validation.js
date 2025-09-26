export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateForm = (formData) => {
    const errors = {};

    if (!validateRequired(formData.fullName)) {
        errors.fullName = 'Full name is required';
    }

    if (!validateRequired(formData.email)) {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.phone)) {
        errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
    }

    if (!validateRequired(formData.message)) {
        errors.message = 'Message is required';
    }

    return errors;
};