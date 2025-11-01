// Form validation utility
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone?.replace(/\s/g, ''));
};

export const validateRequired = (value, fieldName) => {
    if (typeof value === 'string') {
        return !value.trim() ? `${fieldName} harus diisi` : '';
    }
    return !value ? `${fieldName} harus diisi` : '';
};

export const validateNumber = (value, fieldName, min = 0) => {
    if (!value) return `${fieldName} harus diisi`;
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} harus berupa angka`;
    if (num < min) return `${fieldName} minimal ${min}`;
    return '';
};

export const validateMinLength = (value, fieldName, minLength) => {
    if (!value || value.length < minLength) {
        return `${fieldName} minimal ${minLength} karakter`;
    }
    return '';
};

export const validateArrayNotEmpty = (array, fieldName) => {
    if (!array || array.length === 0) {
        return `Minimal 1 ${fieldName} harus ditambahkan`;
    }
    return '';
};

export const validateArrayItems = (array, requiredFields, fieldName) => {
    const errors = {};
    array.forEach((item, index) => {
        requiredFields.forEach((field) => {
            const key = `${index}.${field}`;
            if (!item[field] || (typeof item[field] === 'string' && !item[field].trim())) {
                errors[key] = `${field} harus diisi`;
            }
        });
    });
    return errors;
};

// Form state management helper
export const createFormState = (initialValues) => {
    const [formData, setFormData] = React.useState(initialValues);
    const [errors, setErrors] = React.useState({});
    const [touched, setTouched] = React.useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const setFieldError = (fieldName, error) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const clearFieldError = (fieldName) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        touched,
        setTouched,
        handleChange,
        setFieldError,
        clearFieldError,
    };
};
