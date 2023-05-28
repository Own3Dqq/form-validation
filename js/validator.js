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
            validate: (value) => !isNaN(value) && Number.isInteger(+value),
            message: 'The field should has a integer',
            errorType: 'number',
        },
        maxLength() {
            // need to add maxLength option
        },
    },

    validate(config, form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new ValidationError('You should provide HTML Form');
        }

        let elements = form.elements;
        this.errors[form.name] = {};

        for (const [inputName, inputValidators] of Object.entries(config)) {
            if (!inputValidators.length) {
                continue;
            }

            if (!elements[inputName]) {
                throw new ValidationError(
                    `The [${inputName}] field doesn't exist in the [${form.name}]`
                );
            }

            const value = elements[inputName].value;
            let errors = this.errors[form.name];

            inputValidators.forEach(({ validate, errorType, message }) => {
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

export const { isNotEmpty, isNumber, maxLength } = Validator.validators;
