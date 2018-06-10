import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Menu extends Component {
	render() {
		return (
			<nav class="navbar is-warning" role="navigation" aria-label="main navigation">
				<div class="container">
					<div class="navbar-brand ">
						<Link class="navbar-item" href="/">
							<img src="/images/logo.png" alt="Frontend-desafio" />
							<h1 class="is-size-5">
								VêFilme
							</h1>
						</Link>
						<div class="control has-icons-right">
							<input class="input is-large" type="text" placeholder="Buscar filme" />
							<span class="icon is-medium is-right">
								<i class="fas fa-search"></i>
							</span>
						</div>
						<a role="button" class={"navbar-burger " + (this.state.menu_ativo ? "is-active": "")} onClick={e => {this.setState({menu_ativo: !this.state.menu_ativo })}} aria-label="menu" aria-expanded="false">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div class={"navbar-menu is-primary " + (this.state.menu_ativo ? "is-active": "")}>
						<div class="navbar-start">
							
						</div>
						<div class="navbar-end">
							<Link href="/profile" class="navbar-item">
								Profile
							</Link>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
