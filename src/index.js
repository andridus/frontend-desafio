
import { h, render } from 'preact';
import './style/main';
import 'bulma/css/bulma.min.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'element-theme-default';

function init() {
	let App = require('./views/app').default;
	render(<App />, document.body, document.body.lastChild);
}

//GLOBAL DEBOUNCE
global.debounce = function(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

//PREDEFINIÇÃO DE CALLBACKS PARA EVENTOS ENTRE PÁGINAS
global.subscriptions = window.subscriptions || {};
global.subscriptions.screen = window.subscriptions.screen || {};
global.subscriptions.scroll = window.subscriptions.scroll || {};
global.subscriptions.search = window.subscriptions.search || {};
// INICIALIZAÇÃO DE CALLBACKS
global.subscriptions.screen.callback = (w) => { };
global.subscriptions.scroll.callback = (w, d) => { };
global.subscriptions.search.callback = (s) => { }

let config = {
	apiKey: "<API_KEY>",
	authDomain: "frontend-desafio.firebaseapp.com",
	databaseURL: "https://frontend-desafio.firebaseio.com",
	projectId: "frontend-desafio"
};


firebase.initializeApp(config);

//INICIALIZA SERVICE WORKER
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').then(registration => {
			console.log('SW registered: ', registration);
		}).catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}

// DEFINIR HWR NO MODO DESENVOLVIMENTO:
if (module.hot) {
	module.hot.accept('./views/app', () => requestAnimationFrame(init) );
}

window.onload = function(){
	init();
}

