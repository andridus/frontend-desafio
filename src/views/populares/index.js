import { h, Component } from 'preact';
import xhr from 'xhr';
import { Link } from 'preact-router';
import { Notification } from 'element-react';

const IMAGE_MOVIE_SIZE_WIDTH = 185
const IMAGE_MOVIE_SIZE_HEIGHT = 278;
export default class Populares extends Component {

	constructor(props){
		super(props);
		let that = this;
		this.setState({ r: [], p: 1, loading: false, sort: 'popularity', image_size: '200px', image_size_url: 'w185_and_h278_bestv2', keywords: props.q, favoritos: { ids: [], fbid: [] }});
		this.recarrega_itens.bind(this);
		this.on_window_width_change.bind(this);
		this.get_approximately_start_rows.bind(this);
		this.get_favoritos.bind(this);
		this.on_handler_favoritar.bind(this);
		this.on_handler_desfavoritar.bind(this);
		
	}
	componentWillReceiveProps(props){
		this.setState({ r: [], p: 1, loading: false, keywords: props.q });
		this.recarrega_itens(1);
	}
	componentDidMount(){
		let that = this;
		this.on_window_width_change(window);
		

		
		
		global.subscriptions.search.callback = (s) => {
			that.setState({ r: [], keywords: s});
			this.recarrega_itens(1);
		};
		global.subscriptions.screen.callback = (w) => {
			// ALTERA ESTADO BASEADO NA MUDANÇA DO TAMANHO DA TELA
			this.on_window_width_change(w)
		}
		global.subscriptions.scroll.callback = (w, d) => {
			// ESENCIAL PARA O INFINITE SCROLL
			// VERIFICA SE FALTA POUCO PARA CHEGAR NO FINAL
			let one_image = document.querySelector('.item-da-lista');
			if(one_image){
				let image_height = one_image.offsetHeight;
				let outer_h = d.documentElement.offsetHeight;
				let inner_h = w.innerHeight;
				let height = outer_h - inner_h;
				if (w.scrollY > height - (image_height*2)){
						
						this.recarrega_itens(that.state.p+1)
				}
			}
			
		}

		this.get_approximately_start_rows();
		
		
	}
	get_approximately_start_rows(){
		//AJUSTA PARA CARREGAR INICIALMENTE A QUANTIDADE DE FILMES QUE LOTARIAM A TELA
		let that = this;
		let in_rows = Math.ceil(window.innerHeight/IMAGE_MOVIE_SIZE_HEIGHT);
		let in_columns = Math.trunc(window.innerWidth/(IMAGE_MOVIE_SIZE_WIDTH+20));
		let expected_total = in_columns*in_rows;
		if(expected_total>20){
			this.recarrega_itens(1, function(){
			setTimeout(() => {
				that.recarrega_itens(2);
			}, 500);
		})
		}else{
			this.recarrega_itens(1);
		}
		
	}
	on_window_width_change(w){
		if(w.innerWidth<500){
				// MUDA O TIPO DE IMAGEM DO FILME SE A TELA FOR MENOR DO QUE 500PX
				this.setState({image_size:'100%', image_size_url: 'w500_and_h282_face'});
			}else{
				// SCRIPT PARA AJUSTAR AS IMAGENS DO FILME DA TELA, (para caber na tela)
				let container = document.querySelector('.container');
				if(container){
					let tam_width = container.offsetWidth/(IMAGE_MOVIE_SIZE_WIDTH+5);
					let trunc_tam = Math.trunc(tam_width); 
					let mantissa = tam_width - trunc_tam;
					let new_tam = IMAGE_MOVIE_SIZE_WIDTH + ((mantissa/trunc_tam)*(IMAGE_MOVIE_SIZE_WIDTH));
					this.setState({image_size: new_tam+"px", image_size_url: 'w185_and_h278_bestv2'});
				}
				
				// FIM DO SCRIPT para caber na tela
			}
			
	}
	recarrega_itens(p, func, sort){
		let that = this;
		const timeWindow = 500;//TEMPO LIMITE EM MILISEGUNDOS PARA UMA NOVA SOLICITAÇÃO DE RECARREGAR DADOS
		
		//DADOS INICIAIS DO throttle
		let loading =  this.state.loading; 
		let lastLoading = this.state.lastLoading || new Date().getTime()-timeWindow; 
		let now = new Date().getTime();
		
		if (!loading && now - lastLoading>=timeWindow){
			// SÓ ENTRA NESSA ETAPA SE JÁ NÃO ESTIVER CARREGANDO DADOS OU SE O TEMPO LIMITE ENTRE UMA REQUISIÇÃO E OUTRA JÁ SE ESGOTOU.

			//ATUALIZA TEMPO LIMITE PARA AGORA
			let lastLoading1 = new Date().getTime();
			this.setState({ loading: true, lastLoading: lastLoading1});
			let sort =this.state.sort;
			switch(sort){
				case 'popularity':
					sort = "popularity.desc"
				break;
				case 'votes':
					sort = "vote_average.desc&vote_count.gte=20"
					break;
				default:
					sort = "popularity.desc"
					break;
			}
			let keywords = this.state.keywords;
			let url = 'https://api.themoviedb.org/3/discover/movie?sort_by=' + sort + '&api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR&page=' + p;
			if(keywords){
				keywords = encodeURI(keywords);
				url = 'https://api.themoviedb.org/3/search/movie?api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR&query='+keywords+'&page='+p
			}
			global.debounce(
				xhr({
					method: 'get',
					uri: url,
					headers: {
						'Content-Type': 'application/json'
					}
				}, function (err, resp, body) {

					//ATUALIZA TEMPO LIMITE PARA AGORA
					let lastLoading1 = new Date().getTime();
					that.setState({ loading: false, lastLoading: lastLoading1 });

					if (resp.statusCode == 200) {
						let result = JSON.parse(body)
						let res = that.state.r;
						let favoritos = that.state.favoritos;

						let results = result.results;
						let res1 = res.concat(results)
						that.setState({ r: res1, p: p + 1 });
						that.get_favoritos();
						if (func) func();
					}

				}), 500
			)
			
		}
		
	}
	get_favoritos() {
		let that = this;
		xhr({
			method: 'get',
			uri: 'https://frontend-desafio.firebaseio.com/favoritos.json',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			if (resp.statusCode == 200) {
				let fav = JSON.parse(body);
				if (fav) {
					let ids = Object.keys(fav).map(key => {
						return fav[key].id;
					});
					let fbids = Object.keys(fav).map(key => {
						return key;
					});

					let results1 = that.state.r;
					let results = results1.map((r1) => {
						let idx = ids.indexOf(r1.id);
						if (idx != -1) {
							r1.fbid = fbids[idx];
						}
						return r1;
					});
					that.setState({ favoritos: { ids: ids, fbids: fbids } });
				} else {
					that.setState({ favoritos: { ids: [], fbid: [] } });
				}
			}

		})

	}
	on_handler_favoritar(filme){
		let that = this;
		let filmes = this.state.r;
		let idx = filmes.indexOf(filme);
		let dados = JSON.stringify(filme);
		filmes[idx].favoritando = true;
		that.setState({ r: filmes });
		xhr({
			method: 'post',
			uri: 'https://frontend-desafio.firebaseio.com/favoritos.json',
			body: dados,
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			
			if (resp.statusCode == 200) {
				let id = JSON.parse(body);
				filmes[idx].fbid = id.name;
				filmes[idx].favoritando = null;
				that.setState({ r: filmes });
			}
			if(resp.statusCode == 0){
				Notification.error({
					title: 'Erro!',
					message: <p>Não é possível adicionar o filme dos favoritos. Talvez seja necessário a conexão com a internet</p>
				});
				filmes[idx].favoritando = null;
				that.setState({ r: filmes });
			}

		})

	}
	
	on_handler_desfavoritar(filme) {
		let that = this;
		let filmes = this.state.r;
		let idx = filmes.indexOf(filme);
		filmes[idx].desfavoritando = true;
		that.setState({ r: filmes });
		xhr({
			method: 'delete',
			uri: 'https://frontend-desafio.firebaseio.com/favoritos/'+filme.fbid+'.json',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			if (resp.statusCode == 200) {
				filmes[idx].fbid = null;
				filmes[idx].desfavoritando = false;
				that.setState({ r: filmes });
			}
			if (resp.statusCode == 0) {
				Notification.error({
					title: 'Erro!',
					message: <p>Não é possível retirar o filme dos favoritos.<br /> Talvez seja necessário a conexão com a internet</p>
				});
			
				filmes[idx].desfavoritando = false;
				that.setState({ r: filmes });
			}

		})

	}
	render({}, {}) {
		let that = this;
		return (
			<div class="container is-gapless">
				<div class="title has-text-centered">
					<div class="control has-icons-right" style="width:150px; margin:auto;">
						<select class="input" value={this.state.sort} onChange={(e)=>{

							this.setState({r: [], p: 1, sort: e.target.value})
							this.recarrega_itens(1, null)
						}} >
							<option value="popularity"> Popularidade</option>
							<option value="votes"> Pontuação</option>
						</select>
						<span class="el-icon icon is-right">
							<i class="fas fa-arrow-down" style="margin-top:-20px;margin-right:-15px;"></i>
						</span>
					</div>
				</div>
					<ul class="lista-de-filmes">
						{this.state.r && this.state.r.map(x => {
							let image = x.poster_path 
							if (image == null){
								image = '/images/no_poster_' + that.state.image_size_url+'.png'
							}else{
								image = 'https://image.tmdb.org/t/p/' + that.state.image_size_url + image
							}
							 return (
								 <li class="item-da-lista" >
									 <figure class="image" style={"width: "+that.state.image_size}>
										 <img src={image} style={"width: "+that.state.image_size} />
										
										 <div class="movie-vote">
										 	{x.vote_average}
										 </div>
										 <div class="filme-conteudo">
											 <b class="title is-6">{x.title}</b>
											 <p class="has-text-gray">{x.overview.substr(0, 130)}...</p>
											 <div class="stars">
												 {x.fbid && <div class="button is-small is-danger " onClick={(e) => {
													 this.on_handler_desfavoritar(x);
												 }}>
													 {x.desfavoritando && <span><i class="fa fa-spinner fa-spin " style="margin-right: 5px;"> </i>Removendo dos favoritos</span>}
													 {!x.desfavoritando && <span><i class="fa fa-trash" style="margin-right: 5px;"> </i>Remover dos Favoritos</span>}
													 
													</div>}
													{!x.fbid && <div class="button is-small is-warning " onClick={(e) => {
													 this.on_handler_favoritar(x);
													 } }>
													 		{x.favoritando && <span><i class="fa fa-spinner fa-spin " style="margin-right: 5px;"> </i>Favoritando</span>}
													 		{!x.favoritando && <span><i class="fa fa-star" style="margin-right: 5px;"> </i>Favoritar</span>}
													</div>
													} 
													
													<br />
													<Link href={"/filme/"+x.id} class="button is-light is-small">
														<i class="fa fa-star-alt" style="margin-right:5px"> </i> <u>Detalhes</u>
													</Link>
												
											</div>
										 </div>
										 
									 </figure>
									 
								 </li>
							 )

						})}

						{this.state.loading && <li  class="item-da-lista-loading has-text-white" style={"width: "+that.state.image_size}>
							<div class="loading-spinner1">
								<i class="fa fa-spinner fa-spin"></i>
								<p>
									Carregando filmes
								</p>
							</div>
						</li>}
					</ul>
			</div>
		);
	}
}
