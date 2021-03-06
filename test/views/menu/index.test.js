import { h, render } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';

import Menu from '../../../src/views/menu';

describe('Menu', () => {
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
		it('verifica se existe a página principal Nav', () => {
			render(<Menu />, scratch);

			expect(scratch.innerHTML).to.contain('nav');
		});

	});
});
