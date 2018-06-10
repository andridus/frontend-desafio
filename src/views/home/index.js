import { h, Component } from 'preact';
import xhr from 'xhr';

export default class Home extends Component {

	constructor(props){
		super(props);
		this.setState({r: null});
	}
	componentDidMount(){
		let that = this;
		xhr({
			method: 'get',
			uri: 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3bc186e4074d3467280a50b8b092de7c&language=pt-BR',
			headers: {
				'Content-Type':'application/json'
			}
		}, function(err, resp, body){
			if(resp.statusCode == 200){
				let result = JSON.parse(body)
				console.log(result)
				that.setState({ r: result })
				//console.log(err, resp, body)
			}
			
		})
			

	}
	render({}, {}) {
		return (
			<div>
				<h3 class="subtitle is-size-4 has-text-centered">
					Os filmes mais populares do momento
				</h3>
				<table class="table is-fullwidth">
					<ul class="lista-de-filmes">
						{this.state.r && this.state.r.results.map(x => {
							 return (
								 <li class="item-da-lista">
									 <figure class="image is-164x64">
										 <img src={'https://image.tmdb.org/t/p/w185_and_h278_bestv2'+x.poster_path} />
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
				</table>
			</div>
		);
	}
}
