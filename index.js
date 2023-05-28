import {
    Validator,
    isNotEmpty,
    maxLength,
    minLength,
    checkPassword,
    checkEmail,
    checkConfirmPassword,
} from './js/validator.js';

const humanFormConfigs = {
    'user-name': [isNotEmpty, minLength(4), maxLength(16)],
    'user-email': [isNotEmpty, checkEmail()],
    'user-password': [isNotEmpty, checkPassword()],
    'user-password-confirm': [isNotEmpty, checkConfirmPassword()],
};

const init = function () {
    const btnPass = document.querySelectorAll('.js-btn-password');
    const form = document.human;
    const { elements } = form;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        [...form.elements].forEach((el) => {
            if (el.type !== 'submit') {
                const messageError = form.querySelector(
                    `[data-for="${el.name}"]`
                );
                messageError.innerHTML = '';
                el.classList.remove('error');
            }
        });

        const isValid = Validator.validate(humanFormConfigs, form);

        if (!isValid) {
            Object.entries(Validator.getErrors(form.name)).forEach(
                ([name, error]) => {
                    const messageError = form.querySelector(
                        `[data-for="${name}"]`
                    );
                    form.elements[name].classList.add('error');
                    messageError.innerHTML = Object.values(error)
                        .map((message) => `<span>${message}</span>`)
                        .join('<br>');
                }
            );
        }
    });

    form.addEventListener('input', function (event) {
        const { target } = event;
        if (!humanFormConfigs[target.name]) return;

        const isValid = Validator.validate(
            { [target.name]: humanFormConfigs[target.name] },
            form
        );
        const errors = Object.values(
            Validator.getErrors(form.name)?.[target.name] || {}
        );
        const messageError = form.querySelector(`[data-for="${target.name}"]`);

        if (!isValid) {
            target.classList.add('error');
            target.classList.add('error-border');
            messageError.innerHTML = errors
                .map((message) => `<span>${message}</span>`)
                .join('<br>');

            return;
        }

        target.classList.remove('error');
        target.classList.add('correctly-border');
        messageError.innerHTML = '';
    });

    btnPass.forEach((btn) => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            const target = this.getAttribute('data-target');
            const inputPass = document.querySelector(target);

            if (inputPass.getAttribute('type') === 'password') {
                inputPass.setAttribute('type', 'text');
                btn.classList.add('active');
            } else {
                inputPass.setAttribute('type', 'password');
                btn.classList.remove('active');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', init);
