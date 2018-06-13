import { h, Component } from 'preact';
import { Link, route } from 'preact-router';

export default class Menu extends Component {
	componentWillReceiveProps(props){

		// RECEBE TERMOS DE PESQUISA
		if(props.query)
			this.setState({ query: decodeURI(props.query) })
		else
			this.setState({ query: null })
	}
	render() {
		return (
			<div>
				<div class="top-bar">
					<nav class="navbar is-warning" role="navigation" aria-label="main navigation">
						<div class="container">
							<div class="navbar-brand ">
								<Link class="navbar-item" href="/">
									<img src="/images/logo.png" 
									alt="Frontend-desafio" />
									<h1 class="is-size-5">
										WeLove<b>Movies</b>
									</h1>
								</Link>
								<Link href="/" class="navbar-item" title="Filmes">
									<i class="fa fa-film" style="margin-right:5px"> </i> 
									<span class="is-hidden-mobile">Filmes</span>
								</Link>
								<Link href="/favoritos" class="navbar-item" title="favoritos">
									<i class="fa fa-star" style="margin-right:5px"> </i> 
									
									<span class="is-hidden-mobile">Favoritos</span>
								</Link>
							</div>
						</div>
					</nav>
					<nav class="navbar is-white" role="navigation" aria-label="main navigation">
						<div class="container">
							<div class="control el-control has-icons-right">
								<input class="el-input" value={this.state.query} type="text" placeholder="Digite o nome do filme" onChange={(e)=>{
									route('/search?q=' + encodeURI(e.target.value));
								}} />
								<span class="el-icon icon is-medium is-right">
									<i class="fas fa-search"></i>
								</span>
							</div>
						</div>
					</nav>
				</div>
			<div class="top-bar-fix"></div>
			</div>
		);
	}
}
