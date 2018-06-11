import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Menu from './menu';
import Populares from './populares';
import Favoritos from './favoritos';
import Filme from './filme';

//CALLBACKS PARA EVENTOS ENTRE PÁGINAS
window.subscriptions = window.subscriptions || {};
window.subscriptions.screen = window.subscriptions.screen || {};
window.subscriptions.scroll = window.subscriptions.scroll || {};
window.subscriptions.screen.callback = (w) => {};
window.subscriptions.scroll.callback = (w, d) => {};


export default class App extends Component {
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	componentDidMount(e){
		window.onresize = function(){
			window.subscriptions.screen.callback(window);
		}
		window.onscroll = function () {
			window.subscriptions.scroll.callback(window, document);
		}
	}

	render() {
		return (
			<div id="app" >
				<Menu />
				
					<div class="page">
							<Router onChange={this.handleRoute}>
								<Populares path='/'/>
								<Favoritos path='/favoritos' />
								<Filme path='/filme/:id' />
							</Router>
					</div>
	
			</div>
		);
	}
}
