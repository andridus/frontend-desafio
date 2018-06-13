import { h, Component } from 'preact';
import { Router } from 'preact-router';

// PÁGINAS
import Menu from './menu';
import Populares from './populares';
import Favoritos from './favoritos';
import Filme from './filme';




export default class App extends Component {
	// DEFINIÇÕES DE ROTAS
	handleRoute = (e) => {
		this.currentUrl = e.url;

		//PEGA TEXTO DE BUSCA DA BARRA DE ENDEREÇOS, QUANDO HOUVER
		if(e.url.substr(0,10) == '/search?q=')
			this.setState({ query: e.url.substr(10)});
		else{
			this.setState({ query: null });
		}
	};

	componentDidMount(e){
		//FUNÇÃO ÚTIL PARA AJUSTE DE UI
		window.onresize = function(){
			window.subscriptions.screen.callback(window);
		}
		//FUNÇÃO PARA FUNCIONAMENTO DO INFINITE SCROLL
		window.onscroll = function () {
			window.subscriptions.scroll.callback(window, document);
		}
	}

	//RENDERIZA O COMPONENTE
	render() {
		return (
			<div id="app" >
					<Menu query={this.state.query} />
					<div class="page">
							<Router onChange={this.handleRoute}>
								<Populares path='/'/>
								<Populares path='/search' />
								<Favoritos path='/favoritos' />
								<Filme path='/filme/:id' />
							</Router>
					</div>
	
			</div>
		);
	}


}
