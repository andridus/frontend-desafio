import { h, render } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';

import App from '../../src/views/app';

describe('App', () => {
	let scratch;

	beforeAll(() => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);

		//PREDEFINIÇÃO DE CALLBACKS PARA EVENTOS ENTRE PÁGINAS
		global.subscriptions = window.subscriptions || {};
		global.subscriptions.screen = window.subscriptions.screen || {};
		global.subscriptions.scroll = window.subscriptions.scroll || {};
		global.subscriptions.search = window.subscriptions.search || {};
		// INICIALIZAÇÃO DE CALLBACKS
		global.subscriptions.screen.callback = (w) => { };
		global.subscriptions.scroll.callback = (w, d) => { };
		global.subscriptions.search.callback = (s) => { }
		//GLOBAL DEBOUNCE
		global.debounce = function (func, wait, immediate) {
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
	});
	beforeEach(() => {
		scratch.innerHTML = '';
	});

	afterAll(() => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	});


	describe('routing', () => {
		it('should render the homepage', () => {
			render(<App />, scratch);

			expect(scratch.innerHTML).to.contain('app');
		});

	});
});
