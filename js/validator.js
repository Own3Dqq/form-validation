import ValidationError from './validation-error.js';

export const Validator = {
    errors: {},
    validators: {
        isNotEmpty: {
            validate: (value) => value !== '',
            message: "The field can't be empty",
            errorType: 'required',
        },
        isNumber: {
            validate: (value) => !Number.isNaN(value) && Number.isInteger(+value),
            message: 'The field should has a integer',
            errorType: 'number',
        },
        maxLength(value) {
            const validate = (valueInput) => {
                return valueInput.length < value;
            };

            const message = 'You have exceeded the maximum value';
            const errorType = 'TypeError';

            return { validate, message, errorType };
        },
        minLength(minValue = 3) {
            const validate = (valueInput) => {
                return valueInput.length >= minValue;
            };

            const message = `The field must be between ${minValue} and 25 characters.`;
            const errorType = 'TypeError';

            return { validate, message, errorType };
        },
        checkPassword() {
            const validate = (value) => {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
                return passwordRegex.test(value);
            };
            const message =
                'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 numbers, and 1 special character in (!@#$%^&*)';
            const errorType = 'TypeError';
            return { validate, message, errorType };
        },
        checkEmail() {
            const validate = (value) => {
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/;
                return emailRegex.test(value);
            };
            const message = 'Email address is invalid';
            const errorType = 'ValidationError';

            return { validate, message, errorType };
        },
        checkConfirmPassword() {
            const validate = (value) => {
                const btnPass = document.querySelector('.js-password-input').value;
                return btnPass === value;
            };

            const message = 'Password a not equal';
            const errorType = 'ValidationError';
            return { validate, message, errorType };
        },
    },

    validate(config, form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new ValidationError('You should provide HTML Form');
        }

        const { elements } = form;
        this.errors[form.name] = {};

        for (const [inputName, inputValidators] of Object.entries(config)) {
            if (!inputValidators.length) {
                continue;
            }

            if (!elements[inputName]) {
                throw new ValidationError(`The [${inputName}] field doesn't exist in the [${form.name}]`);
            }

            const { value } = elements[inputName];

            const errors = this.errors[form.name];

            inputValidators.forEach(({ validate, message, errorType }) => {
                if (!validate(value)) {
                    errors[inputName] = {
                        ...errors[inputName],
                        [errorType]: message,
                    };
                }
            });
        }

        // this.errors[form.name] = errors;

        return !this.hasError(form.name);
    },

    hasError(formName) {
        return !!Object.keys(this.errors[formName]).length;
    },

    getErrors(formName) {
        return this.errors[formName];
    },
};

export const { isNotEmpty, isNumber, maxLength, minLength, checkPassword, checkEmail, checkConfirmPassword } =
    Validator.validators;
