import '../css/style.css';
import Timeline from './Timeline';

const container = document.querySelector('#timeline-widget');
const timeline = new Timeline(container);
timeline.init();