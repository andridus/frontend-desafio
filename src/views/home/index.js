import { h, Component } from 'preact';
import xhr from 'xhr';

export default class Home extends Component {

	constructor(props){
		super(props);
		this.setState({r: [], p: 1, loading: false, image_size: 'w185_and_h278_bestv2'});
		this.recarrega_itens.bind(this);
		this.on_window_width_change.bind(this);
	}
	componentDidMount(){
		let that = this;
		this.on_window_width_change(window)
		window.subscriptions.screen.callback = (w) => {
			//console.log("aqui", data);
			console.log("here")
			this.on_window_width_change(w)
		}
		window.subscriptions.scroll.callback = (w, d) => {
			let outer_h = d.documentElement.offsetHeight;
			let inner_h = w.innerHeight;
			let height = outer_h - inner_h;
			if (w.scrollY > height - (278*2)){
					
					this.recarrega_itens(that.state.p+1)
			}
		}


		this.recarrega_itens(1)
		
	}
	on_window_width_change(w){
		console.log(w)
		if(w.innerWidth<500){
				this.setState({image_size: 'w500_and_h282_face'});
			}else{
				this.setState({image_size: 'w185_and_h278_bestv2'});
			}
	}
	recarrega_itens(p){
		const timeWindow = 500;
		let loading =  this.state.loading;
		let lastLoading = this.state.lastLoading || new Date().getTime()-timeWindow;
		let now = new Date().getTime();
		if (!loading && now - lastLoading>=timeWindow){
			let lastLoading1 = new Date().getTime();
			this.setState({ loading: true, lastLoading: lastLoading1});
			let that = this;
			xhr({
				method: 'get',
				uri: 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR&page=' + p,
				headers: {
					'Content-Type': 'application/json'
				}
			}, function (err, resp, body) {
				let lastLoading1 = new Date().getTime();
				that.setState({ loading: false, lastLoading: lastLoading1});
				if (resp.statusCode == 200) {
					let result = JSON.parse(body)
					let res = that.state.r;
					let res1 = res.concat(result.results)
					that.setState({ r: res1, p: p + 1 })
					//console.log(err, resp, body)
				}

			})
		}
		
	}
	render({}, {}) {
		let that = this;
		return (
			<div>
				<h3 class="subtitle is-size-4 has-text-centered">
					Mais populares
				</h3>
					<ul class="lista-de-filmes">
						{this.state.r && this.state.r.map(x => {
							 return (
								 <li class="item-da-lista">
									 <figure class="image">
										 <img src={'https://image.tmdb.org/t/p/'+that.state.image_size+x.poster_path} />
										 <div class="filme-conteudo">
											 <b class="title is-6">{x.title}</b>
											 <p class="is-size-7 has-text-gray">{x.overview.substr(0, 200)}...</p>
											 <div class="stars">
												 <div class="tag is-small is-warning ">
													 <i class="fa fa-star" style="margin-right: 5px;"> </i>{x.popularity}
												 </div>
											 	<div class="button is-light is-small">
												 	<u>Detalhes</u>
												</div>
												
											</div>
										 </div>
										 
									 </figure>
									 
								 </li>
							 )

						})}
						
					</ul>
			</div>
		);
	}
}
