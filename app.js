document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("characters");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const loadingSpinner = document.getElementById("loading");
  const noResultsMessage = document.getElementById("no-results");

  const API_URL = "https://api.disneyapi.dev/character";

  // Função para mostrar/esconder o spinner de loading
  function showLoading(isLoading ) {
    loadingSpinner.style.display = isLoading ? 'block' : 'none';
  }

  // Função para mostrar/esconder a mensagem de "sem resultados"
  function showNoResults(show) {
    noResultsMessage.style.display = show ? 'block' : 'none';
  }

  // Função para exibir os personagens na tela
  function displayCharacters(characters) {
    container.innerHTML = ""; // Limpa a tela
    showNoResults(characters.length === 0);

    characters.forEach((character, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      // Adiciona um delay na animação para cada card
      card.style.animationDelay = `${index * 0.05}s`;

      card.innerHTML = `
        <img src="${character.imageUrl || 'assets/static/placeholder.png'}" alt="${character.name}" onerror="this.onerror=null;this.src='assets/static/placeholder.png';">
        <h2>${character.name}</h2>
      `;
      container.appendChild(card);
    });
  }

  // Função genérica para fazer fetch na API
  async function fetchFromAPI(url) {
    showLoading(true);
    container.innerHTML = "";
    showNoResults(false);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // A API retorna um objeto com a chave 'data' para listas e buscas
      // ou diretamente o objeto se for um ID. Normalizamos para sempre ter 'data'.
      const characters = data.data ? (Array.isArray(data.data) ? data.data : [data.data]) : [];
      displayCharacters(characters);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
      showNoResults(true);
    } finally {
      showLoading(false);
    }
  }

  // Função para buscar personagens
  function searchCharacters() {
    const query = searchInput.value.trim();
    if (!query) {
      loadInitialCharacters();
      return;
    }
    fetchFromAPI(`${API_URL}?name=${encodeURIComponent(query)}`);
  }

  // Função para carregar personagens iniciais
  function loadInitialCharacters() {
    fetchFromAPI(`${API_URL}?page=1&pageSize=24`);
  }

  // Event Listeners
  searchButton.addEventListener('click', searchCharacters);
  searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      searchCharacters();
    }
  });

  // Carrega os personagens iniciais ao abrir a página
  loadInitialCharacters();
});
