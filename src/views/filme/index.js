import { h, Component } from 'preact';
import xhr from 'xhr';
import { Link } from 'preact-router';


const IMAGE_MOVIE_SIZE_WIDTH = 185
const IMAGE_MOVIE_SIZE_HEIGHT = 278;
export default class Filme extends Component {

	constructor(props){
		super(props);
		this.setState({ loading: false, filme_id: props.id, image_size: '200px', image_size_url: 'w300_and_h450_bestv2'});
		this.carrega_filme.bind(this);
		this.carrega_cast.bind(this);
		
	}
	componentDidMount(){
		this.carrega_filme(this.state.filme_id);
		this.on_window_width_change(window);
		window.subscriptions.screen.callback = (w) => {
			// ALTERA ESTADO BASEADO NA MUDANÇA DO TAMANHO DA TELA
			this.on_window_width_change(w)
		}
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
	carrega_filme(id){
		let that = this;
		that.setState({ loading: true});
		xhr({
				method: 'get',
				uri: 'https://api.themoviedb.org/3/movie/'+id+'?api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR',
				headers: {
					'Content-Type': 'application/json'
				}
			}, function (err, resp, body) {
				

				if (resp.statusCode == 200) {
					let result = JSON.parse(body)
					that.carrega_cast(id, result);
				}

			})
		
	}
	carrega_cast(id, result) {
		let that = this;
		that.setState({ loading: true });
		xhr({
			method: 'get',
			uri: 'https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR',
			headers: {
				'Content-Type': 'application/json'
			}
		}, function (err, resp, body) {

			//ATUALIZA TEMPO LIMITE PARA AGORA
			that.setState({ loading: false });

			if (resp.statusCode == 200) {
				let result1 = JSON.parse(body)
				result.casting = result1.cast.slice(0,5);
				console.log(result)
				that.setState({ r: result })
			}

		})

	}
	pega_ano(data){
		let d = new Date(data);
		return d.getUTCFullYear();
	}
	render({}, {}) {
		let that = this;
		let r = this.state.r;
		return (
			<div>
				{r &&
					<div>
						<div class="filme-panel" >
							<div class="panel-top-back">
							</div>
							<div class="container is-gapless">
								<div class="panel-content">
								<img class="panel-poster" src={'https://image.tmdb.org/t/p/' + that.state.image_size_url+'/'+r.poster_path}  />
									<h3 class="title is-size-3">
										{r.title} <br />
									<i class="subtitle">{r.original_title} ({this.pega_ano(r.release_date)})</i>
									</h3>
									<b>Sinopse</b>
									<p class="subtitle is-size-5">
										{r.overview}
									</p>
									<div class="">
										<h5 class="is-size-5">Elenco</h5>
										<ul class="movie-cast">
											{r.casting.map(c => {
												return (<li>
													<figure class="image is-64x64">
														{c.profile_path && <img title={c.name} src={'https://image.tmdb.org/t/p/w138_and_h175_face/' + c.profile_path} />}

													</figure>
												</li>)
											})}

										</ul>
									</div>
									<div class="is-clearfix"></div>
								</div>
							
							</div>
						</div>
					</div>
				}
				{!r && <div>
					<h3 class="subtitle is-size-4 has-text-centered">
						Aguarde...
					</h3>
				</div>}
				
					
			</div>
		);
	}
}
