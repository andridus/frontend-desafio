import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Menu extends Component {
	render() {
		return (
			<div>
				<nav class="navbar is-warning" role="navigation" aria-label="main navigation">
					<div class="container">
						<div class="navbar-brand ">
							<Link class="navbar-item" href="/">
								<img src="/images/logo.png" alt="Frontend-desafio" />
								<h1 class="is-size-5">
									VêFilme
								</h1>
							</Link>
							<Link href="/profile" class="navbar-item">
								<i class="fa fa-star-alt" style="margin-right:5px"> </i> Favoritos
							</Link>
						</div>
					</div>
				</nav>
				<nav class="navbar is-white" role="navigation" aria-label="main navigation">
					<div class="container">
						<div class="control el-control has-icons-right">
							<input class="el-input" type="text" placeholder="Digite o nome do filme" />
							<span class="el-icon icon is-medium is-right">
								<i class="fas fa-search"></i>
							</span>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}
