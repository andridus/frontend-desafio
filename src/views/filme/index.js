import { h, Component } from 'preact';
import xhr from 'xhr';
import { Notification } from 'element-react';

//CONSTANTES TAMANHO DOS POSTES, QUANDO NECESSÁRIO
const IMAGE_MOVIE_SIZE_WIDTH = 185
const IMAGE_MOVIE_SIZE_HEIGHT = 278;

export default class Filme extends Component {

	constructor(props){
		super(props);
		this.setState({ loading: false, filme_id: props.id, image_size: '200px', image_size_url: 'w300_and_h450_bestv2'});
		this.carrega_filme.bind(this);
		this.carrega_cast.bind(this);
		this.carrega_videos.bind(this);
		
	}
	componentDidMount(){
		let that = this;
		//CHAMA FUNÇÃO QUE CARREGA OS DADOS BÁSICOS DO FILME
		that.carrega_filme(that.state.filme_id);
		
		this.on_window_width_change(window);
		window.subscriptions.screen.callback = (w) => {
			// ALTERA ESTADO BASEADO NA MUDANÇA DO TAMANHO DA TELA
			this.on_window_width_change(w)
		}
		window.subscriptions.search.callback(null);
	}
	on_window_width_change(w) {
		if (w.innerWidth < 550) {
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
				this.setState({ image_size: new_tam + "px", image_size_url: 'w300_and_h450_bestv2' });
			}

			// FIM DO SCRIPT para caber na tela
		}

	}

	// FUNÇÃO PARA CARREGAR DADOS BÁSICO DO FILME
	carrega_filme(id){
		let that = this;

		xhr({
				method: 'get',
				uri: 'https://api.themoviedb.org/3/movie/'+id+'?api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR',
				headers: {
					'Content-Type': 'application/json'
				}
			}, function (err, resp, body) {
				

				//CASO RECEBA O DADO 
				if (resp.statusCode == 200) {
					let result = JSON.parse(body)
					that.setState({ r: result })

					//INICIA O CARREGAMENTO DO CASTING DO FILME
					that.carrega_cast(id, result)
				}
				//CASO ESTEJA SEM CCONEXAO COM INTERNET E SEM CACHE
				if(resp.statusCode == 0){
					Notification.error({
						title: 'Erro!',
						message: <p>Não é possível acessar o filme . Talvez seja necessário a conexão com a internet</p>
					});
				}

			})
		
	}
	//CARREGA O CASTING DO FILME
	carrega_cast(id, result) {
		let that = this;

		xhr({
			method: 'get',
			uri: 'https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {
			//CASO RECEBA O DADO 
			if (resp.statusCode == 200) {
				let result1 = JSON.parse(body);
				//PEGA APENAS OS 9 PRIMEIROS RESULTADOS
				result.casting = result1.cast.slice(0, 8);
				//PEGA APENAS O DIRETOR E O ESCRITOR
				result.crew = result1.crew.filter((c) => {
					return c.job == "Director" || c.job == "Writer"
				});

				that.setState({ r: result })

				//PEGA OS VIDEOS(TRAILERS) DO FILME
				that.carrega_videos(id, result)
			}	
			//CASO ESTEJA SEM CCONEXAO COM INTERNET E SEM CACHE
			if (resp.statusCode == 0) {
				Notification.error({
					title: 'Erro!',
					message: <p>Não é possível acessar o filme . Talvez seja necessário a conexão com a internet</p>
				});
			}

		})

	}

	
	
	carrega_videos(id, result) {
		let that = this;
		xhr({
			method: 'get',
			uri: 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			//CASO RECEBA O DADO
			if (resp.statusCode == 200) {
				let result1 = JSON.parse(body)
				//PEGA O PRIMEIRO VIDEO PARA SER O TRAILER
				if(result1.results.length>0) result.trailer = result1.results[0]; 

				that.setState({ r: result })
				//CARREGA AS IMAGENS
				that.carrega_images( id, result)

			}

			//CASO ESTEJA SEM CCONEXAO COM INTERNET E SEM CACHE
			if (resp.statusCode == 0) {
				Notification.error({
					title: 'Erro!',
					message: <p>Não é possível acessar o filme . Talvez seja necessário a conexão com a internet</p>
				});
			}

		})

	}

	//CARREGA AS IMAGES DO FILME
	carrega_images(id, result) {
		let that = this;
		that.setState({ loading: true });
		xhr({
			method: 'get',
			uri: 'https://api.themoviedb.org/3/movie/' + id + '/images?api_key=3bc186e4074d3467280a50b8b092de7c',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			//CASO RECEBA O DADO
			if (resp.statusCode == 200) {
				let result1 = JSON.parse(body)
				let arr = result1.backdrops.concat(result1.posters);
				//PEGA APENAS OS 20 PRIMEIROS POSTERS
				result.images = arr.slice(0, 19);
				that.setState({ r: result })
			}
			//CASO ESTEJA SEM CCONEXAO COM INTERNET E SEM CACHE
			if (resp.statusCode == 0) {
				Notification.error({
					title: 'Erro!',
					message: <p>Não é possível acessar o filme . Talvez seja necessário a conexão com a internet</p>
				});
			}

		})

	}

	//FUNÇÃO PARA PEGAR APENAS O 'ANO' DE UMA DATA
	pega_ano(data){
		let d = new Date(data);
		return d.getUTCFullYear();
	}
	// FECHAR O VISUALIZADOR DE TRAILER
	close_viewer(e){
		this.setState({viewing: null})
	}

	render({}, {}) {
		let that = this;
		let r = this.state.r;


		// VERIFICA SE O FILME TEM POSTER, SE NÃO COLOCA A IMAGEM PADRÃO
		let image = null
		if(r){
			image = r.poster_path
			if (image == null) {
				image = '/images/no_poster_' + that.state.image_size_url + '.png'
			} else {
				image = 'https://image.tmdb.org/t/p/' + that.state.image_size_url + image
			}
		}
		

		return (
			<div>
				<div class={'movie-viewer' + (this.state.viewing?'':'-hide')} onClick={this.close_viewer.bind(this)}>
					<iframe class="video-youtube" width="560" height="315" src={'https://www.youtube.com/embed/'+this.state.viewing} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
				</div>
				{r &&
					<div>
						<div class="container">
							<div class="filme-panel" >
								<div class="container">
									<div class="panel-content">
										<div class="panel-poster" >
											<img  src={image}  />
											{r.trailer && <div class="button is-dark" onClick={(e)=>{
												this.setState({ viewing: r.trailer.key})
											}}>
											Trailer
											</div>}
										</div>
										<h3 class="title is-size-3">
											{r.title} <br />
										<i class="subtitle">{r.original_title} ({this.pega_ano(r.release_date)})</i>
										</h3>
										<b>Sinopse</b>
										<p class="subtitle is-size-5">
											{r.overview}
										</p>
										<p>
											<b > Equipe Técnica</b>
											<ul class="movie-crew">
												{r.crew && r.crew.map((cc)=>{
													return  <li>
														<b>{cc.name}</b>
														<br />
														<i>{cc.job}</i>
													</li>
												})}
											</ul>
										</p>
									</div>
									<div class="is-clearfix"></div>
								</div>
							</div>
						</div>
						<div class="container" style="padding: 15px">
							<div class="columns">
								<div class="column">
									<div class="movie-cast">
										<b > Elenco</b>
										<ul >
											{r.casting && r.casting.map(c => {
												return (<li>
													<figure class="image is-64x64">
														<img title={c.name} src={c.profile_path ? 'https://image.tmdb.org/t/p/w138_and_h175_face/' + c.profile_path : '/images/no_image.png'} />
													</figure>
													<div class="movie-character">
														<b>{c.name}</b>
														<br />
														<i>{c.character}</i>
													</div>
												</li>)
											})}
										</ul>
									</div>
								</div>
								<div class="column">
									<ul class="movie-images">
											{r.images && r.images.map((i)=>{
												return (
													<li>
														<img src={'https://image.tmdb.org/t/p/w138_and_h175_face/' + i.file_path } />
													</li>
												)
											})}
									</ul>
								</div>
							</div>
						</div>
					</div>
					}
				{<div class="item-da-lista-loading has-text-white" style={"width: 100%"}>
					<div class="loading-spinner1">
						<i class="fa fa-spinner fa-spin fa-2x"></i>
						<p>
							Aguarde, carregando informações
					  </p>
					</div>
				</div>}
					
				</div>
		);
	}
}
