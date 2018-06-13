import { h, render } from 'preact';
import { expect } from 'chai';
import Favoritos from '../../../src/views/favoritos';

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
			render(<Favoritos />, scratch);

			expect(scratch.innerHTML).to.contain('div');
		});

	});
});
