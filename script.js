// --- Ponto de Entrada Principal ---
// Garante que o script só será executado após o carregamento completo do HTML da página.
document.addEventListener('DOMContentLoaded', () => { // O evento 'DOMContentLoaded' é acionado quando o documento HTML inicial foi completamente carregado e analisado.
    const timelineContainer = document.getElementById('timeline-container');
    const timelineLine = document.getElementById('timeline-line');
    const timelineMarker = document.getElementById('timeline-marker');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const homeButton = document.getElementById('home-button');
    const maneuversSection = document.getElementById('maneuvers');
    const searchResultContainer = document.getElementById('search-result-container');
    const mainContent = document.getElementById('main-content');
    const footer = document.querySelector('footer');

    // --- Armazenamento de Dados ---
    // Arrays para guardar os dados carregados dos arquivos JSON.
    let timelineData = [];
    let maneuversData = [];

    // --- Carregamento de Dados (JSON) ---
    const loadAllData = async () => { // Função assíncrona para carregar dados da timeline e das manobras.
        try {
            const [timelineRes, maneuversRes] = await Promise.all([
                fetch('data.json'),
                fetch('manobras.json')
            ]);
            timelineData = await timelineRes.json();
            maneuversData = await maneuversRes.json();
            
            renderTimeline(timelineData); // Após carregar, renderiza a timeline na página.
        } catch (error) {
            console.error('Erro ao carregar os dados iniciais:', error);
            if (timelineContainer) {
                timelineContainer.innerHTML = '<p>Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>';
            }
        }
    };

    // --- Função de Busca ---
    const handleSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return; // Se a busca estiver vazia, não faz nada.

        // 1. Busca por ID de manobra.
        const maneuverFound = maneuversData.find(m => m.id === searchTerm);
        if (maneuverFound) {
            window.location.href = `manobra.html?id=${searchTerm}`; // Redireciona para a página da manobra.
            return;
        }

        // 2. Busca pelo termo "skate terapia".
        if (searchTerm === 'skate terapia') {
            window.location.href = 'skate-terapia.html'; // Redireciona para a página do projeto.
            return;
        }

        // 3. Busca na timeline (por ano, título ou descrição).
        const timelineResult = timelineData.find(item => 
            item.ano.toString() === searchTerm || 
            item.titulo.toLowerCase().includes(searchTerm) ||
            item.descricao.toLowerCase().includes(searchTerm)
        );

        if (timelineResult) {
            displaySearchResult(timelineResult); // Se encontrar, exibe o resultado na própria página.
        } else {
            alert('Busca não encontrada. Tente um ano (ex: 1970), uma manobra da lista ou "skate terapia".');
        }
    };

    // --- Funções de Exibição de Resultado da Busca ---
    // Exibe um resultado de busca encontrado na timeline.
    const displaySearchResult = (item) => {
        // Esconde o conteúdo principal (timeline, etc.) e o rodapé.
        mainContent.classList.add('hidden');
        footer.classList.add('hidden');
        document.body.classList.add('search-active'); // Ativa o "modo de busca" no body para aplicar estilos CSS específicos.

        // Prepara a descrição, substituindo os placeholders de link pelos links reais.
        let description = item.descricao;
        if (item.links) {
            for (const key in item.links) {
                description = description.replace(`{${key}}`, item.links[key]);
            }
        }

        // Cria e insere o HTML do resultado no container apropriado.
        searchResultContainer.innerHTML = `
            <div class="search-result-view">
                <h1>${item.ano} - ${item.titulo}</h1>
                <p>${description}</p>
            </div>
        `;
        searchResultContainer.classList.remove('hidden');
    };

    // Esconde o resultado da busca e restaura a página ao estado normal.
    const hideSearchResult = () => {
        // Esconde o container do resultado da busca.
        searchResultContainer.classList.add('hidden');
        searchResultContainer.innerHTML = '';
        
        // Reexibe o conteúdo principal e o rodapé.
        mainContent.classList.remove('hidden');
        footer.classList.remove('hidden');
        document.body.classList.remove('search-active'); // Desativa o "modo de busca".
        searchInput.value = ''; // Limpa o campo de busca.
    };

    // --- Renderização da Timeline ---
    // Constrói os elementos HTML da timeline a partir dos dados carregados.
    const renderTimeline = (data) => {
        if (!timelineContainer) return; // Se o container da timeline não existir na página, interrompe a função.

        timelineContainer.innerHTML = ''; // Limpa o container para evitar duplicatas.
        data.forEach(item => {
            let description = item.descricao;
            if (item.links) {
                for (const key in item.links) {
                    const placeholder = `{${key}}`;
                    description = description.replace(placeholder, item.links[key]);
                }
            }

            // Cria um novo elemento 'div' para cada item da timeline.
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${item.posicao}`;
            timelineItem.dataset.year = item.ano;
            timelineItem.innerHTML = `
                <h2>${item.ano} - ${item.titulo}</h2>
                <p>${description}</p>
            `;
            timelineContainer.appendChild(timelineItem);
        });

        // Ajusta a altura da linha da timeline dinamicamente para que ela termine antes da próxima seção.
        if (timelineLine && maneuversSection) {
            const timelineVisualTop = timelineLine.parentElement.offsetTop;
            const maneuversTop = maneuversSection.offsetTop;
            timelineLine.style.height = `${maneuversTop - timelineVisualTop - 80}px`;
        }

        setupScrollListeners();
    };

    // --- Função Utilitária para Responsividade ---
    // Verifica se a largura da tela corresponde à de um dispositivo móvel (baseado no CSS).
    const isMobileView = () => {
        // Usa a mesma largura de quebra (breakpoint) definida no CSS (@media (max-width: 900px)).
        return window.innerWidth <= 900;
    };


    // --- Lógica de Animação com Scroll ---
    // Configura os listeners de rolagem para animar a timeline.
    const setupScrollListeners = () => {
        const items = document.querySelectorAll('.timeline-item');
        if (!items.length || !timelineMarker) return; // Se não houver itens ou marcador, não faz nada.

        window.addEventListener('scroll', () => {
            // Se o modo de busca estiver ativo, a animação de scroll é desativada.
            if (document.body.classList.contains('search-active')) return;

            // Em telas mobile, o marcador da timeline está oculto, então a lógica de animação não se aplica.
            if (isMobileView()) {
                items.forEach(item => item.classList.add('in-view')); // Garante que todos os itens fiquem visíveis.
                return;
            }

            // Calcula o progresso da rolagem ao longo da seção da timeline.
            const timelineVisualTop = timelineLine.parentElement.offsetTop;
            const scrollY = window.scrollY;
            const scrollStart = timelineVisualTop;
            const scrollEnd = maneuversSection.offsetTop - 400;

            let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
            progress = Math.max(0, Math.min(1, progress)); // Garante que o progresso fique entre 0 e 1.

            // Move o marcador amarelo ao longo da linha da timeline com base no progresso do scroll.
            const newMarkerTop = 120 + (progress * (timelineLine.offsetHeight - 40));
            timelineMarker.style.top = `${newMarkerTop}px`;

            // Adiciona a classe 'in-view' aos itens da timeline à medida que o marcador os "alcança".
            items.forEach(item => {
                if (newMarkerTop + 40 >= item.offsetTop - timelineVisualTop) {
                    item.classList.add('in-view');
                }
            });
        });

        // Dispara uma verificação inicial para o caso de a página já carregar em uma tela mobile.
        if (isMobileView()) {
            items.forEach(item => item.classList.add('in-view'));
        }
    };

    // --- Adiciona Event Listeners ---
    if (searchButton) searchButton.addEventListener('click', handleSearch);
    // Permite que a busca seja acionada ao pressionar a tecla "Enter".
    if (searchInput) searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') handleSearch();
    });
    // O botão "Home" tem dupla função: voltar ao topo ou sair do modo de busca.
    if (homeButton) homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (document.body.classList.contains('search-active')) {
            hideSearchResult(); // Se estiver no modo de busca, ele restaura a página.
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Caso contrário, rola suavemente para o topo.
        }
    });

    // --- Inicialização do Script ---
    loadAllData();
});