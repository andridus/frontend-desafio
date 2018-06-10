import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Menu from './menu';
import Home from './home';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Menu />
				<div class="container">
					
					<div class="column">
						<div class="page">
							<Router onChange={this.handleRoute}>
								<Home path='/'/>
							</Router>
						</div>
					</div>
				</div>				
			</div>
		);
	}
}
