import { parseCoordinates, formatDate } from './utils';
import Modal from './Modal';
import AudioRecorder from './AudioRecorder';

export default class Timeline {
    constructor(container) {
        this.container = container;
        this.postsList = container.querySelector('#posts-list');
        this.input = container.querySelector('#text-input');
        this.modal = new Modal(document.querySelector('#modal'));
        this.audioRecorder = new AudioRecorder(container, this.handleAudio.bind(this));
    }

    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.input.value.trim()) {
                this.handleTextPost(this.input.value);
                this.input.value = '';
            }
        });

        this.audioRecorder.init();
    }

    async getPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    async getCoordsOrAskUser() {
        try {
            return await this.getPosition();
        } catch (e) {
            console.log('Geo API failed, asking user:', e);
            const userCoords = await this.modal.show();
            return parseCoordinates(userCoords);
        }
    }

    async handleTextPost(text) {
        try {
            const coords = await this.getCoordsOrAskUser();
            this.createPost({ type: 'text', content: text, coords });
        } catch (e) {
            console.error('Post creation cancelled', e);
        }
    }

    async handleAudio(audioBlob) {
        try {
            const coords = await this.getCoordsOrAskUser();
            const audioUrl = URL.createObjectURL(audioBlob);
            this.createPost({ type: 'audio', content: audioUrl, coords });
        } catch (e) {
            console.error('Audio creation cancelled', e);
        }
    }

    createPost({ type, content, coords }) {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        
        const time = formatDate(Date.now());
        const coordsStr = `[${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}]`;

        let contentHtml = '';
        if (type === 'text') {
            contentHtml = `<div class="post-content">${content}</div>`;
        } else if (type === 'audio') {
            contentHtml = `<audio controls src="${content}"></audio>`;
        }

        postEl.innerHTML = `
            ${contentHtml}
            <div class="post-meta">
                <span>${coordsStr}</span>
                <span>${time}</span>
            </div>
        `;

        this.postsList.insertBefore(postEl, this.postsList.firstChild);
    }
}