import { h, render } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';

import Filme from '../../../src/views/filme';
describe('Filme', () => {
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
	});

	beforeEach(() => {
		scratch.innerHTML = '';
	});

	afterAll(() => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	});


	describe('rederização', () => {
		it('verifica se existe o filme panel', () => {
			render(<Filme />, scratch);

			expect(scratch.innerHTML).to.contain('movie-viewer');
		});

	});
});
