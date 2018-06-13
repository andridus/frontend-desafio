import { h, Component } from 'preact';
import xhr from 'xhr';
import { Link } from 'preact-router';
import { Notification } from 'element-react';


//CONSTANTES TAMANHO DOS POSTES, QUANDO NECESSÁRIO
const IMAGE_MOVIE_SIZE_WIDTH = 185
const IMAGE_MOVIE_SIZE_HEIGHT = 278;

export default class Favoritos extends Component {

	constructor(props) {
		super(props);
		let that = this;
	
		// ESTADO INICIAL DO COMPONENT
		this.setState(
			{ r: [], // DADOS, I.E, FILMES
				p: 1, // PAGINA ATUAL
				loading: true, //BIT PARA DEFINIR ESTADO DE CARREGAMENTO DE DADOS
				sort: 'popularity', //ORDEM DE VISUALIZAÇÃO
				image_size: '200px', // TAMANHO BASE DE UM POSTER
				image_size_url: 'w185_and_h278_bestv2', // TAMANHO PADRÃO DOS POSTERS 
				keywords: props.q //VARIÁVEL DE PESQUISA DE FILMES (VISIVEL EM QUALQUER TELA)
			}
		);


		//DEFINE CONTEXTO DAS FUNÇÕES COM 'THIS'
		this.on_window_width_change.bind(this);
		this.on_handler_desfavoritar.bind(this);
		this.get_favoritos.bind(this);
		
	}

	// ACONTECE QUANDO O COMPONENTE É MONTADO NA TELA
	componentDidMount() {
		let that = this;
		// APLICA FUNÇÃO DE AJUSTE DE TAMANHO DOS POSTERS
		this.on_window_width_change(window);

		//RECEBE CALLBACKS DE FUNÇÕES ÚTEIS
		window.subscriptions.search.callback = (s) => {
			that.setState({ r: [], keywords: s });
			this.recarrega_itens(1);
		};
		window.subscriptions.screen.callback = (w) => {
			// ALTERA ESTADO BASEADO NA MUDANÇA DO TAMANHO DA TELA
			this.on_window_width_change(w)
		}

		//RECARREGA FAVORITOS
		this.get_favoritos()


	}
	on_window_width_change(w) {
		if (w.innerWidth < 500) {
			// MUDA O TIPO DE IMAGEM DO FILME SE A TELA FOR MENOR DO QUE 500PX
			this.setState({ image_size: '100%', image_size_url: 'w500_and_h282_face' });
		} else {
			// SCRIPT PARA AJUSTAR AS IMAGENS DO FILME DA TELA, (para caber na tela)
			let container = document.querySelector('.container');
			if (container) {
				let tam_width = container.offsetWidth / (IMAGE_MOVIE_SIZE_WIDTH + 5);
				let trunc_tam = Math.trunc(tam_width);
				let mantissa = tam_width - trunc_tam;
				let new_tam = IMAGE_MOVIE_SIZE_WIDTH + ((mantissa / trunc_tam) * (IMAGE_MOVIE_SIZE_WIDTH));
				this.setState({ image_size: new_tam + "px", image_size_url: 'w185_and_h278_bestv2' });
			}

			// FIM DO SCRIPT para caber na tela
		}

	}
	get_favoritos() {
		let that = this;
		//FAZ UMA BUSCA NO BANCO DE DADOS DO FIREBASE
		xhr({
			method: 'get',
			uri: 'https://frontend-desafio.firebaseio.com/favoritos.json',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			if (resp.statusCode == 200) {
				let fav = JSON.parse(body);
				//CONVERTE O RESULTADO EM JS ARRAY
				if (fav) {
					let res1 = Object.keys(fav).map(key => {
						let _res = fav[key];
						_res.fbid = key;
						return _res;
					});
					//DEFINE ESTADO COM  RESULTADO 
					that.setState({ r: res1 , loading: false});
				}else{
					//DEFINE ESTADO COM RESULTADO VAZIO
					that.setState({ r: [], loading: false });
				}
			} else {
				//DEFINE ESTADO COM RESULTADO VAZIO
				that.setState({ r: [], loading: false});
			}

		})

	}
	//EVENTO QUANDO CLICAR EM DESFAVORITAR
	on_handler_desfavoritar(filme) {
		let that = this;

		let filmes = this.state.r;

		//DEFINE 'EM REMOÇÃO' O FILME CLICADO DA LISTA DE FILMES FAVORITOS
		let idx = filmes.indexOf(filme);
		filmes[idx].removendo = true;
		that.setState({ r: filmes });

		//ENVIA COMANDO PARA DELETAR DO FIREBASE O FILME
		xhr({
			method: 'delete',
			uri: 'https://frontend-desafio.firebaseio.com/favoritos/' + filme.fbid + '.json',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {
			if (resp.statusCode == 200) {
				//REMOVE O FILME DA LISTA DE FILMES FAVORITOS
				filmes = filmes.filter(x => {
					return x.id != filme.id;
				});
				//ATUALIZA FAVORITOS
				that.get_favoritos();
			}

			// CASO O SISTEMA ESTIVER OFFLINE
			if(resp.statusCode == 0){
				Notification.error({
					title: 'Erro!',
					message: <p>Não é possível retirar o filme dos favoritos. Talvez seja necessário a conexão com a internet</p>
				});
				filmes[idx].removendo = false;
				that.setState({ r: filmes });
			}
			
		})

	}
	render({ }, { }) {
		let that = this;
		return (
			<div class="container is-gapless">
				<div class="subtitle has-text-centered" style="margin-top: 10px;color:#FFF">
					Favoritos
				</div>
				<ul class="lista-de-filmes">
					{this.state.r && this.state.r.map(x => {
						return (
							<li class="item-da-lista" >
								<figure class="image" style={"width: " + that.state.image_size}>
									<img src={'https://image.tmdb.org/t/p/' + that.state.image_size_url + x.poster_path} style={"width: " + that.state.image_size} />

									<div class="movie-vote">
										{x.vote_average}
									</div>
									<div class="filme-conteudo">
										<b class="title is-6">{x.title}</b>
										<p class="has-text-gray">{x.overview.substr(0, 130)}...</p>
										<div class="stars">
											<div class="button is-small is-danger " onClick={(e) => {
												this.on_handler_desfavoritar(x);
											}
											}>
												<i class="fa fa-trash" style="margin-right: 5px;"> </i>Remover dos Favoritos
													</div>
											<br />
											<Link href={"/filme/" + x.id} class="button is-light is-small">
												<i class="fa fa-star-alt" style="margin-right:5px"> </i> <u>Detalhes</u>
											</Link>

										</div>
									</div>

								</figure>

							</li>
						)
					})}
				</ul>
				{this.state.loading && <div class="item-da-lista-loading has-text-white" style={"width: 100%"}>
					<div class="loading-spinner1">
						<i class="fa fa-spinner fa-spin"></i>
						<p>
							Carregando filmes Favoritos
								</p>
					</div>
				</div>}
				{!this.state.loading && !this.state.r.length && <div class="item-da-lista-loading has-text-white" style={"width: 100%" }>
					<div class="loading-spinner1">
						<i class="fa fa-star fa-2x"></i>
						<p>
							Não foi adicionado nenhum filme à lista de favoritos
					  </p>
					</div>
				</div>}
			</div>
		);
	}
}
