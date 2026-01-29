export default class AudioRecorder {
    constructor(container, onSaveCallback) {
        this.startBtn = container.querySelector('#audio-start');
        this.ui = container.querySelector('#audio-recorder-ui');
        this.okBtn = container.querySelector('#audio-ok');
        this.cancelBtn = container.querySelector('#audio-cancel');
        this.timerEl = container.querySelector('#audio-timer');
        
        this.onSaveCallback = onSaveCallback;
        this.stream = null;
        this.recorder = null;
        this.chunks = [];
        this.timerInterval = null;
        this.seconds = 0;
    }

    init() {
        this.startBtn.addEventListener('click', () => this.startRecording());
        this.okBtn.addEventListener('click', () => this.stopRecording(true));
        this.cancelBtn.addEventListener('click', () => this.stopRecording(false));
    }

    async startRecording() {
        if (!navigator.mediaDevices) {
            alert('Media Devices API not supported');
            return;
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recorder = new MediaRecorder(this.stream);
            this.chunks = [];

            this.recorder.addEventListener('dataavailable', (evt) => {
                this.chunks.push(evt.data);
            });

            this.recorder.start();
            this.toggleUi(true);
            this.startTimer();
        } catch (e) {
            console.error(e);
            alert('Нет прав на доступ к микрофону');
        }
    }

    stopRecording(save) {
        if (this.recorder && this.recorder.state !== 'inactive') {
            this.recorder.stop();
            this.stream.getTracks().forEach(track => track.stop()); 
        }

        this.stopTimer();
        this.toggleUi(false);

        if (save) {

            setTimeout(() => {
                 const blob = new Blob(this.chunks, { type: 'audio/webm' });
                 this.onSaveCallback(blob);
            }, 100);
        }
    }

    toggleUi(isRecording) {
        if (isRecording) {
            this.startBtn.parentElement.classList.add('hidden'); 
            this.ui.classList.remove('hidden');
        } else {
            this.startBtn.parentElement.classList.remove('hidden');
            this.ui.classList.add('hidden');
        }
    }

    startTimer() {
        this.seconds = 0;
        this.timerEl.innerText = '00:00';
        this.timerInterval = setInterval(() => {
            this.seconds++;
            const min = Math.floor(this.seconds / 60).toString().padStart(2, '0');
            const sec = (this.seconds % 60).toString().padStart(2, '0');
            this.timerEl.innerText = `${min}:${sec}`;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }
}