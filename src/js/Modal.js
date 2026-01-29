import { parseCoordinates } from "./utils";

export default class Modal {
    constructor(element) {
        this.element = element;
        this.input = element.querySelector('#manual-coords');
        this.okBtn = element.querySelector('#modal-ok');
        this.cancelBtn = element.querySelector('#modal-cancel');
    }

    show() {
        this.element.classList.remove('hidden');
        this.input.value = '';
        this.input.classList.remove('invalid');

        return new Promise((resolve, reject) => {
            const cleanup = () => {
                this.okBtn.removeEventListener('click', onOk);
                this.cancelBtn.removeEventListener('click', onCancel);
                this.element.classList.add('hidden');
            };

            const onOk = () => {
                const value = this.input.value;
                try {
                    parseCoordinates(value); 
                    cleanup();
                    resolve(value);
                } catch (e) {
                    this.input.classList.add('invalid');
                }
            };

            const onCancel = () => {
                cleanup();
                reject(new Error('User cancelled'));
            };

            this.okBtn.addEventListener('click', onOk);
            this.cancelBtn.addEventListener('click', onCancel);
        });
    }
}