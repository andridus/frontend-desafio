import { h, render } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';

import Menu from '../../../src/views/menu';

describe('Menu', () => {
	let scratch;

	beforeAll(() => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
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
