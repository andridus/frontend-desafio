
import { h, render } from 'preact';
import './style/main';
import 'bulma/css/bulma.min.css';
function init() {
	let App = require('./views/app').default;
	render(<App />, document.body, document.body.lastChild);
}

console.log(global)

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').then(registration => {
			console.log('SW registered: ', registration);
		}).catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}
// register ServiceWorker via OfflinePlugin, for prod only:
//if (process.env.NODE_ENV==='production') {
//}
// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('./views/app', () => requestAnimationFrame(init) );
}
window.onload = function(){
	init();
}

