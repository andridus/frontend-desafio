import { h, Component } from 'preact';
import xhr from 'xhr';
import { Link } from 'preact-router';


const IMAGE_MOVIE_SIZE_WIDTH = 185
const IMAGE_MOVIE_SIZE_HEIGHT = 278;
export default class Populares extends Component {

	constructor(props){
		super(props);
		this.setState({r: [], p: 1, loading: false, image_size:'200px', image_size_url: 'w185_and_h278_bestv2',});
		this.recarrega_itens.bind(this);
		this.on_window_width_change.bind(this);
		this.get_approximately_start_rows.bind(this);
	}
	componentDidMount(){
		let that = this;
		this.on_window_width_change(window);

		window.subscriptions.screen.callback = (w) => {
			// ALTERA ESTADO BASEADO NA MUDANÇA DO TAMANHO DA TELA
			this.on_window_width_change(w)
		}
		window.subscriptions.scroll.callback = (w, d) => {
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
	recarrega_itens(p, func){
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
			
			xhr({
				method: 'get',
				uri: 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR&page=' + p,
				headers: {
					'Content-Type': 'application/json'
				}
			}, function (err, resp, body) {
				
				//ATUALIZA TEMPO LIMITE PARA AGORA
				let lastLoading1 = new Date().getTime();
				that.setState({ loading: false, lastLoading: lastLoading1});

				if (resp.statusCode == 200) {
					let result = JSON.parse(body)
					let res = that.state.r;
					let res1 = res.concat(result.results)
					that.setState({ r: res1, p: p + 1 })
					if(func) func();
				}

			})
		}
		
	}
	render({}, {}) {
		let that = this;
		return (
			<div class="container is-gapless">
				<h3 class="subtitle is-size-4 has-text-centered">
					Mais populares
				</h3>
					<ul class="lista-de-filmes">
						{this.state.r && this.state.r.map(x => {
							 return (
								 <li class="item-da-lista" >
									 <figure class="image" style={"width: "+that.state.image_size}>
										 <img src={'https://image.tmdb.org/t/p/'+that.state.image_size_url+x.poster_path} style={"width: "+that.state.image_size} />
										 <div class="filme-conteudo">
											 <b class="title is-6">{x.title}</b>
											 <p class="is-size-7 has-text-gray">{x.overview.substr(0, 200)}...</p>
											 <div class="stars">
													<div class="tag is-small is-warning ">
														<i class="fa fa-star" style="margin-right: 5px;"> </i>{x.popularity}
													</div>
													<Link href={"/filme/"+x.id} class="button is-light is-small">
														<i class="fa fa-star-alt" style="margin-right:5px"> </i> Detalhes
													</Link>
												
											</div>
										 </div>
										 
									 </figure>
									 
								 </li>
							 )

						})}

						{this.state.loading && <li  class="item-da-lista-loading" style={"width: "+that.state.image_size}>
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
