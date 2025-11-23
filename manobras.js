// Função auto-executável para carregar os dados da manobra
(async () => {
    const contentDiv = document.getElementById('maneuver-content');
    
    // Pega o 'id' da manobra da URL (ex: manobra.html?id=kickflip)
    const params = new URLSearchParams(window.location.search);
    const maneuverId = params.get('id');

    if (!maneuverId) {
        contentDiv.innerHTML = '<h1>Manobra não encontrada.</h1><a href="index.html" class="back-link">Voltar para a Timeline</a>';
        return;
    }

    try {
        const response = await fetch('manobras.json');
        const maneuvers = await response.json();
        const maneuver = maneuvers.find(m => m.id === maneuverId);

        // Função para converter URL do YouTube para formato de incorporação
        const getEmbedUrl = (videoUrl) => {
            if (!videoUrl) return null; // Retorna nulo se a URL não existir
            try {
                const urlObj = new URL(videoUrl);
                const videoId = urlObj.searchParams.get('v');
                if (urlObj.hostname.includes('youtube.com') && videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            } catch (e) {
                console.error("URL de vídeo inválida:", videoUrl);
            }
            return null; // Retorna nulo em caso de erro ou URL inválida
        };

        if (maneuver) {
            const embedUrl = getEmbedUrl(maneuver.videoUrl);
            document.title = maneuver.nome; // Atualiza o título da aba
            contentDiv.innerHTML = `
                <h1>${maneuver.nome}</h1>
                ${maneuver.criador ? `<p><strong>Criador:</strong> ${maneuver.criador}</p>` : ''}
                <p>${maneuver.descricao}</p>
                ${embedUrl ? `
                    <div class="video-container">
                        <iframe src="${embedUrl}" title="Demonstração da manobra ${maneuver.nome}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                ` : ''}
                <a href="index.html" class="back-link">← Voltar para a Timeline</a>
            `;
        } else {
            contentDiv.innerHTML = '<h1>Manobra não encontrada.</h1><a href="index.html" class="back-link">Voltar para a Timeline</a>';
        }
    } catch (error) {
        console.error('Erro ao carregar dados da manobra:', error);
        contentDiv.innerHTML = '<h1>Erro ao carregar.</h1><a href="index.html" class="back-link">Voltar para a Timeline</a>';
    }
})();