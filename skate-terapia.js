// --- Ponto de Entrada Principal ---
// Garante que o script só será executado após o carregamento completo do HTML da página.
document.addEventListener('DOMContentLoaded', () => {
	// Seleciona o container principal onde o conteúdo do artigo será inserido.
	const container = document.getElementById('skate-terapia-content');

	// --- Função Utilitária para Processar Links ---
	// Esta função substitui placeholders (como {link_exemplo}) no texto por tags <a> de HTML reais.
	const parseLinks = (text, links) => {
		if (!text) return ''; // Retorna uma string vazia se o texto for nulo.
		if (!links) return text; // Retorna o texto original se não houver links para substituir.
		let parsed = text;
		for (const key in links) {
			const placeholder = `{${key}}`;
			parsed = parsed.split(placeholder).join(links[key]);
		}
		return parsed;
	};

	// --- Função de Renderização ---
	// Responsável por construir e inserir o conteúdo HTML na página a partir dos dados recebidos.
	const render = (items) => {
		container.innerHTML = ''; // Limpa o container para garantir que não haja conteúdo duplicado.
		items.forEach(item => {
			// Para cada item no array de dados, cria uma nova seção.
			const section = document.createElement('section');
			section.className = 'skate-therapy-section';

			// Se o item tiver um título, cria um elemento <h2> e o adiciona à seção.
			if (item.titulo) {
				const h2 = document.createElement('h2');
				h2.textContent = item.titulo;
				section.appendChild(h2);
			}

			// Se o item tiver um parágrafo, processa os links e o adiciona à seção.
			if (item.paragrafo) {
				const p = document.createElement('p');
				const html = parseLinks(item.paragrafo, item.links);
				p.innerHTML = html;
				section.appendChild(p);
			}

			// Se o item tiver uma imagem, cria os elementos <figure>, <img> e <figcaption> e os adiciona.
			if (item.imagem && item.imagem.src) {
				const figure = document.createElement('figure');
				figure.className = 'skate-therapy-figure';

				const img = document.createElement('img');
				img.src = item.imagem.src;
				img.alt = item.imagem.alt || '';
				img.className = 'skate-therapy-img';
				figure.appendChild(img);

				if (item.imagem.legenda) {
					const figcap = document.createElement('figcaption');
					figcap.innerHTML = item.imagem.legenda;
					figure.appendChild(figcap);
				}

				section.appendChild(figure);
			}

			// Adiciona a seção completa (com título, parágrafo, imagem, etc.) ao container principal.
			container.appendChild(section);
		});
	};

	// --- Função de Inicialização ---
	// Função assíncrona que busca os dados do arquivo JSON e inicia o processo de renderização.
	const init = async () => {
		try {
			// Tenta buscar o arquivo JSON com os dados do artigo.
			const res = await fetch('skate-terapia-data.json');
			if (!res.ok) throw new Error('Erro ao carregar skate-terapia-data.json'); // Lança um erro se a resposta não for bem-sucedida.
			const data = await res.json();
			render(data); // Se a busca for bem-sucedida, chama a função render para exibir os dados.
		} catch (err) {
			// Se ocorrer qualquer erro durante a busca ou processamento, exibe uma mensagem de erro no console e na página.
			console.error(err);
			container.innerHTML = '<p style="color:#c00;">Não foi possível carregar o conteúdo do Skate Terapia. Tente recarregar a página.</p>';
		}
	};

	init(); // Chama a função de inicialização para começar todo o processo.
});
