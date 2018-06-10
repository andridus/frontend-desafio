import { h, render } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';

import App from '../../src/views/app';

describe('App', () => {
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


	describe('routing', () => {
		it('should render the homepage', () => {
			render(<App />, scratch);

			expect(scratch.innerHTML).to.contain('Home');
		});

		it('should render /header', async () => {
			render(<App />, scratch);
			route('/header');

			await sleep(1);

			expect(scratch.innerHTML).to.contain('header');
		});
	});
});
