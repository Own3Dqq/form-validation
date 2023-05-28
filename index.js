import { Validator, isNotEmpty, isNumber, maxLength } from './js/validator.js';

const humanFormConfigs = {
    'first-name': [isNotEmpty /* maxLength(16) */],
    'last-name': [isNotEmpty /* maxLength(16) */],
    age: [isNotEmpty, isNumber],
};

const init = function () {
    let form = document.human;
    let elements = form.elements;
    let sendDtn = form.querySelector('.btn-send');

    sendDtn.onclick = function (event) {
        event.preventDefault();

        [...form.elements].forEach((el) => {
            if (el.type !== 'submit') {
                let messageError = form.querySelector(
                    `[data-for="${el.name}"]`
                );
                messageError.innerHTML = '';
                el.classList.remove('error');
            }
        });

        let isValid = Validator.validate(humanFormConfigs, form);

        if (!isValid) {
            console.log(Validator.getErrors(form.name));
            Object.entries(Validator.getErrors(form.name)).forEach(
                ([name, error]) => {
                    let messageError = form.querySelector(
                        `[data-for="${name}"]`
                    );
                    form.elements[name].classList.add('error');
                    messageError.innerHTML = Object.values(error)
                        .map((message) => `<span>${message}</span>`)
                        .join('<br>');
                }
            );

            return;
        }
    };

    form.addEventListener('input', function (event) {
        let target = event.target;
        if (!humanFormConfigs[target.name]) return;

        let isValid = Validator.validate(
            { [target.name]: humanFormConfigs[target.name] },
            form
        );
        let errors = Object.values(
            Validator.getErrors(form.name)?.[target.name] || {}
        );
        let messageError = form.querySelector(`[data-for="${target.name}"]`);

        if (!isValid) {
            target.classList.add('error');
            messageError.innerHTML = errors
                .map((message) => `<span>${message}</span>`)
                .join('<br>');

            return;
        }
        target.classList.remove('error');
        messageError.innerHTML = '';
    });
};

document.addEventListener('DOMContentLoaded', init);
