# Desafio Front-end do Agenda Edu


## Introdução

Estamos muito felizes que você tenha chegado nessa etapa do nosso processo seletivo! Para essa fase desejamos que você resolva um desafio básico.


## Desafio

Nosso líder técnico Renan Gurgel deseja usar uma aplicação que liste os filmes mais populares do momento, para isso você deverá consumir a **API** do [TheMovieDB][tmdb-api-url], para essa aplicação será necessário na tela inicial mostrar uma listagem dos filmes mais populares, os mais populares sendo exibidos no topo da lista, utilizar o mecanismo de paginação fornecido pela **API**.

Cada item da lista deve levar para uma página de detalhes do filme, aonde deve ser mostrado todos os atributos importantes do filme, como por exemplo: `title`, `description`, `rating`, `etc`.

Deve ser possível realizar pesquisa por filmes em qualquer tela, a request de pesquisa deve ser disparada utilizando o processo de controle de fluxo **Debounce​** com um limite de tempo de **500ms**, esse controle deve ser feito devido ao limite de requests por segundo que a **API** impõe.

Sobre a limitação de requests por segundo da **API** do [TheMovieDB][tmdb-api-url], esse limite deve ser tratado e deve ser exibido um feedback visual não invasivo para o usuário indicando que não foi possível realizar a operação devido a limitação da **API** e solicite que ele tente novamente em alguns segundos.


## Requisitos

- Deve ser um PWA
- Sinta-se avontade para usar qualquer framework de view / controle de estado desejado
- Necessário o uso de rotas
- A lista de repositórios devem ser armazenadas em cache, para funcionamento offline. Caso não existam dados no cache, a API deve ser consultada. Utilizar a [Web API de cache][cache-api-url]
- Os repositórios favoritados devem ser salvos utilizando o API [Realtime Database do Firebase][firebase-database-url] e no cache, utilizando a [Web API de cache][cache-api-url], o carregamento dos favoritos devem seguir o mesmo padrão do carregamento de repositórios citado acima


## Requisitos bônus

**Esses requisitos não são obrigatórios, mas serão levados em consideração como pontos extras no momento da avaliação.**

- Boa qualidade de UI/UX
- Baixo tempo de renderização
- Renderização de listas on-demand, e.g: Dado que a lista tem 100 items, não renderizar a lista completa, renderizar apenas os items visíveis na tela e alguns extras para evitar engasgos de scroll.
- Testes unitários, pode utilizar qualquer framework de teste, e.g: [Jest][jest-url] ou [Mocha.js][mocha-url].


## Critérios de avaliação

- Organização do projeto: Avalia a estrutura do projeto, documentação e uso de controle de versão;
- Inovação tecnológica: Avalia o uso de tecnologias mais recentes, desde que estáveis;
- Coerência: Avalia se os requisitos foram atendidos;
- Boas práticas: Avalia se o projeto segue boas práticas de desenvolvimento, incluindo segurança e otimização;
- Controle de Qualidade: Avalia se o projeto possui qualidade assegurada por testes automatizados (por exemplo [Jest][jest-url] ou [Mocha.js][mocha-url]) e integração contínua (por exemplo [Travis][travis-ci-url]).


## Processo de submissão

O desafio deve ser entregue pelo [GitHub][github-url]. A aplicação deve estar hospedada no ([Heroku][heroku-url], [Firebase][firebase-url], [AWS][aws-url], [gh-pages][gh-pages-url], etc) As URLs devem ser enviadas por email.

Qualquer dúvida em relação ao desafio, responderemos por e-mail.

Bom trabalho!

[tmdb-api-url]: https://www.themoviedb.org/documentation/api
[reactjs-url]: https://reactjs.org/
[preactjs-url]: https://preactjs.com/
[angular-url]: https://angular.io/
[reduxjs-url]: https://redux.js.org/
[cache-api-url]: https://developer.mozilla.org/en-US/docs/Web/API/Cache
[jest-url]: https://facebook.github.io/jest/
[mocha-url]: https://mochajs.org/
[github-url]: https://github.com
[github-api-url]: https://developer.github.com/v3/
[heroku-url]: https://www.heroku.com/
[firebase-url]: https://www.firebase.com/
[aws-url]: https://aws.amazon.com/
[gh-pages-url]: https://pages.github.com/
[firebase-database-url]: https://firebase.google.com/docs/database/
[travis-ci-url]: https://travis-ci.com/
