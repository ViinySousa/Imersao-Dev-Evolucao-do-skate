# 🛹 A Evolução do Skate - Timeline Interativa

Este projeto vai além de uma simples página estática. O objetivo foi criar uma **Single Page Application (SPA)** simulada, onde a arquitetura de dados é separada da interface.
A aplicação guia o usuário por uma linha do tempo histórica, oferece tutoriais de manobras e destaca o projeto social **Skate Terapia**, demonstrando como o esporte atua na inclusão e saúde mental.

* ## ⚙️ Destaques Técnicos & Funcionalidades:

O diferencial deste projeto está na lógica com **JavaScript**

* **Busca Inteligente (Smart Search):** O campo de busca não é apenas um filtro de texto. Implementei uma lógica condicional que detecta a intenção do usuário:
    * *Digitar um ano (ex: 1970):* Filtra a timeline histórica.
    * *Digitar uma manobra (ex: Ollie):* Redireciona para a página de detalhes sobre a manobra.
    * *Digitar "Skate Terapia":* Leva ao conteúdo do projeto social.
* **Consumo de Dados (Mock API):** Todo o conteúdo (história, manobras e blog) é carregado dinamicamente via `fetch API` consumindo arquivos JSON (`data.json`, `manobras.json`), facilitando a manutenção e escalabilidade.
* **Manipulação do DOM:** Renderização dinâmica de elementos HTML baseada nos dados recebidos.
* **Navegação via URL:** Uso de `URLSearchParams` para carregar o conteúdo correto na página de detalhes da manobra (`manobra.html?id=kickflip`).

* ## 🛠️ Tecnologias Utilizadas

 * 🟧 **HTML5**
 * 🎨 **CSS3**
 * ⚡ **JavaScript**
 * 📋 **JSON**

* ## 🎨 Layout e Responsividade

O projeto é totalmente responsivo, adaptando a timeline e os cards de manobras para dispositivos móveis, tablets e desktops.

## 👨‍💻 Autor

**Viny Sousa**
*Estudante de Front-end & UI/UX Design em transição de carreira.*
