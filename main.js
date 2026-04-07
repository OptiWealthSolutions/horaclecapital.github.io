document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  if (menuToggle && menuClose && navLinks && navOverlay) {
    const openMenu = () => {
      navLinks.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Empêche le scroll du fond
    };

    const closeMenu = () => {
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Restaure le scroll
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    navOverlay.addEventListener('click', closeMenu); // Ferme si on clique sur le fond sombre
    
    // Ferme le menu si l'utilisateur clique sur un lien
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- RECHERCHE GLOBALE (NAVBAR) ---
  // Auto-injection de la barre de recherche dans les anciens rapports si elle n'existe pas
  if (navLinks && !document.querySelector('.nav-search')) {
    const searchHTML = `
      <form class="nav-search" id="global-search-form" action="#">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Rechercher..." aria-label="Rechercher sur le site" />
      </form>
    `;
    navLinks.insertAdjacentHTML('beforeend', searchHTML);
  }

  const globalSearchForms = document.querySelectorAll('.nav-search');
  
  // On déduit le chemin relatif vers la racine (pratique pour naviguer depuis un sous-dossier comme /reports/)
  const rootUrlMatch = document.querySelector('.logo-container a')?.getAttribute('href');
  const rootUrl = rootUrlMatch ? rootUrlMatch.replace('index.html', '') : '';

  // Injection du HTML du Modal de recherche
  const modalHTML = `
    <div class="search-modal-overlay" id="search-modal">
      <div class="search-modal">
        <div class="sm-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 12px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="sm-input" placeholder="Rechercher un rapport, un modèle..." autocomplete="off">
          <button class="sm-close" id="sm-close" aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="sm-body" id="sm-results"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const searchModal = document.getElementById('search-modal');
  const smInput = document.getElementById('sm-input');
  const smClose = document.getElementById('sm-close');
  const smResults = document.getElementById('sm-results');

  let siteData = [];
  let isFetching = false;

  async function fetchSiteData() {
    if (siteData.length > 0 || isFetching) return;
    
    if (window.location.protocol === 'file:') {
      console.warn("La recherche globale nécessite un serveur web pour fonctionner.");
      return;
    }

    isFetching = true;
    try {
      // Récupération simultanée du contenu des deux pages via leur URL relative
      const [reportsRes, researchRes] = await Promise.all([
        fetch(rootUrl + 'reports.html'),
        fetch(rootUrl + 'research.html')
      ]);
      
      const reportsText = await reportsRes.text();
      const researchText = await researchRes.text();
      
      const parser = new DOMParser();
      const reportsDoc = parser.parseFromString(reportsText, 'text/html');
      const researchDoc = parser.parseFromString(researchText, 'text/html');
      
      // Extraire les Rapports
      const reportPromises = Array.from(reportsDoc.querySelectorAll('.report-card, .report-card-featured')).map(async card => {
        const isFeatured = card.classList.contains('report-card-featured');
        const titleNode = isFeatured ? card.querySelector('.rcf-title') : card.querySelector('h3');
        const descNode = isFeatured ? card.querySelector('.rcf-desc') : card.querySelector('p');
        const linkNode = isFeatured ? card : card.querySelector('h3 a');
        const dateNode = isFeatured ? card.querySelector('.rcf-date') : card.querySelector('.report-date');
        
        if (titleNode && linkNode) {
          const url = linkNode.getAttribute('href');
          const shortDesc = descNode ? descNode.textContent.trim() : '';
          let fullText = shortDesc;
          
          // Fetch profond : On va chercher le texte complet à l'intérieur du rapport
          try {
            const articleRes = await fetch(rootUrl + url);
            if (articleRes.ok) {
              const articleHtml = await articleRes.text();
              const articleDoc = parser.parseFromString(articleHtml, 'text/html');
              const mainContainer = articleDoc.querySelector('.article-container');
              if (mainContainer) {
                fullText = mainContainer.textContent.replace(/\s+/g, ' ').trim();
              }
            }
          } catch (e) { console.warn("Impossible de scanner l'article", url); }

          siteData.push({ title: titleNode.textContent.trim(), desc: fullText, shortDesc: shortDesc, url: url, category: 'Rapport', date: dateNode ? dateNode.textContent.trim() : '' });
        }
      });
      
      // On attend que tous les rapports soient scannés en profondeur
      await Promise.all(reportPromises);

      // Extraire les Recherches & Vidéos
      researchDoc.querySelectorAll('.research-card').forEach(card => {
        const titleNode = card.querySelector('h3');
        const descNode = card.querySelector('.rc-desc');
        const linkNode = card.querySelector('h3 a');
        const tagNode = card.querySelector('.rc-tag');
        const dateNode = card.querySelector('.rc-date');

        if (titleNode && linkNode) {
          siteData.push({ title: titleNode.textContent.trim(), desc: descNode ? descNode.textContent.trim() : '', shortDesc: descNode ? descNode.textContent.trim() : '', url: linkNode.getAttribute('href'), category: tagNode ? tagNode.textContent.trim() : 'Recherche', date: dateNode ? dateNode.textContent.trim() : '' });
        }
      });
    } catch (error) { console.error('Erreur lors du fetch des données:', error); }
    isFetching = false;
  }

  function renderResults(query) {
    if (window.location.protocol === 'file:') {
      smResults.innerHTML = '<div class="sm-empty">Impossible de charger la recherche en local (file://).<br><br>Ouvrez ce site via un serveur (ex: Live Server) ou testez-le sur GitHub Pages.</div>';
      return;
    }
    
    if (!query.trim()) {
      smResults.innerHTML = '<div class="sm-empty">Entrez un mot-clé pour rechercher (ex: Macro, Taux, Modèle...)</div>';
      return;
    }

    const q = query.toLowerCase().trim();
    const filtered = siteData.filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));

    if (filtered.length === 0) {
      smResults.innerHTML = '<div class="sm-empty">Aucun résultat trouvé pour "'+query+'"</div>';
      return;
    }

    smResults.innerHTML = filtered.map(item => {
      const finalUrl = item.url.startsWith('http') ? item.url : rootUrl + item.url;
      
      // Surlignage intelligent et extrait pertinent
      let snippet = item.shortDesc;
      const lowerDesc = item.desc.toLowerCase();
      const matchIdx = lowerDesc.indexOf(q);
      
      // Si le mot est trouvé plus loin dans le texte profond (et pas dans le résumé)
      if (matchIdx !== -1 && !snippet.toLowerCase().includes(q)) {
        const start = Math.max(0, matchIdx - 60);
        const end = Math.min(item.desc.length, matchIdx + 60);
        snippet = (start > 0 ? '...' : '') + item.desc.substring(start, end) + '...';
      } else {
        snippet = snippet.length > 130 ? snippet.substring(0, 130) + '...' : snippet;
      }

      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${safeQ})`, 'gi');
      const highlightedTitle = item.title.replace(regex, '<strong style="color: var(--orange)">$1</strong>');
      const highlightedSnippet = snippet.replace(regex, '<strong style="color: var(--orange)">$1</strong>');

      return `
        <a href="${finalUrl}" class="sm-result" ${item.url.startsWith('http') ? 'target="_blank"' : ''}>
          <div class="sm-result-meta">
            <span class="sm-result-tag">${item.category}</span>
            ${item.date ? `<span>•</span><span>${item.date}</span>` : ''}
          </div>
          <h4>${highlightedTitle}</h4>
          <p>${highlightedSnippet}</p>
        </a>`;
    }).join('');
  }

  function openSearch(query = '') {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    smInput.value = query;
    setTimeout(() => smInput.focus(), 50); // Petit délai pour l'animation
    
    if (window.location.protocol !== 'file:') {
      smResults.innerHTML = '<div class="sm-loading"><div class="cs-pulse" style="display:inline-block; margin-right:12px; transform:translateY(1px);"></div>Recherche en cours...</div>';
      fetchSiteData().then(() => renderResults(smInput.value));
    } else renderResults('');
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  smClose.addEventListener('click', closeSearch);
  searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && searchModal.classList.contains('active')) closeSearch(); });
  smInput.addEventListener('input', (e) => renderResults(e.target.value));

  // Ecoute du formulaire de recherche de la Navbar
  globalSearchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim() !== '') {
        const navLinks = document.getElementById('nav-links');
        const navOverlay = document.getElementById('nav-overlay');
        if (navLinks) navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        
        openSearch(input.value.trim());
        input.value = '';
      }
    });
  });

  // Logique pour la page Research (Filtres et Recherche)
  const searchInput = document.getElementById('research-search');
  const filterButtons = document.querySelectorAll('.rt-filter');
  const researchCards = document.querySelectorAll('.research-card');
  const noResultsMsg = document.getElementById('no-results');

  if (searchInput && filterButtons.length > 0 && researchCards.length > 0) {
    const filterCards = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const activeFilter = document.querySelector('.rt-filter.active').getAttribute('data-filter');
      let visibleCount = 0;

      researchCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.rc-desc').textContent.toLowerCase();
        const category = card.getAttribute('data-category');

        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || category === activeFilter;

        if (matchesSearch && matchesFilter) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    searchInput.addEventListener('input', filterCards);
    filterButtons.forEach(btn => btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterCards();
    }));
  }
});