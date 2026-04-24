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
    const response = await fetch(rootUrl + 'search-index.json');
    if (response.ok) {
      siteData = await response.json();
    } else {
      console.error("Erreur HTTP lors du chargement de l'index de recherche :", response.status);
    }
  } catch (error) { 
    console.error('Erreur réseau lors du fetch des données:', error); 
  }
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

  // --- NEWSLETTER FORM ---
  const newsletterForm = document.getElementById('api-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const statusText = document.getElementById('subscription-status');
      const btn = document.getElementById('submit-btn');
      
      btn.disabled = true;
      btn.textContent = "[ TRAITEMENT... ]";
      statusText.textContent = "";
      
      const formData = new FormData(form);
      
      try {
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            statusText.style.color = "var(--white)";
            statusText.textContent = "> Inscription validée. Vérifiez votre boîte de réception.";
            form.reset();
          } else {
            const data = await response.json().catch(() => ({}));
            statusText.style.color = "var(--orange)";
            statusText.textContent = data.message ? "> " + data.message : "> Erreur : l'email est invalide ou déjà inscrit.";
          }
      } catch (err) {
          statusText.style.color = "var(--orange)";
          statusText.textContent = "> Requête bloquée ou problème de réseau. Veuillez réessayer.";
      } finally {
          btn.disabled = false;
          btn.textContent = "S'abonner";
      }
    });
  }

  // --- BOUTON SCROLL-TO-TOP ---
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
  scrollToTopBtn.className = 'scroll-top-btn';
  scrollToTopBtn.setAttribute('aria-label', 'Remonter en haut');
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- OUTILS DE LECTURE & PARTAGE (Articles Uniquement) ---
  const isArticle = document.querySelector('.article-container') && !document.querySelector('.research-grid');
  if (isArticle) {
    // 1. Barre de progression de lecture
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height <= 0) {
          progressBar.style.width = "0%";
        } else {
          const scrolled = Math.min(100, Math.max(0, (winScroll / height) * 100));
          progressBar.style.width = scrolled + "%";
        }
      });
    }

    // 2. Barre de partage (avec bouton Copier)
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(document.title);
    const shareLi = document.getElementById('share-li');
    if (shareLi) shareLi.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    
    const shareTw = document.getElementById('share-tw');
    if (shareTw) shareTw.href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;

    const copyBtn = document.getElementById('copy-link-btn');
    const tooltip = document.getElementById('copy-tooltip');
    if (copyBtn && tooltip) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          tooltip.textContent = "Copié !";
          tooltip.classList.remove('opacity-0');
          tooltip.style.opacity = '1';
          setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
              tooltip.classList.add('opacity-0');
              tooltip.style.opacity = '';
              tooltip.textContent = "Copier";
            }, 300);
          }, 2000);
        });
      });
    }
  }

  // --- COOKIE BANNER (RGPD) ---
  if (!localStorage.getItem('cookieConsent')) {
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.innerHTML = `
      <div class="cookie-content">
        <h4>Gestion des Cookies</h4>
        <p>Nous utilisons des cookies pour assurer le bon fonctionnement du site (notamment pour la prise de rendez-vous Calendly) et analyser notre trafic de manière anonyme via Umami. En poursuivant votre navigation, vous acceptez l'utilisation de ces cookies.</p>
      </div>
      <div class="cookie-actions">
        <button id="btn-refuse-cookies" class="cookie-btn-refuse">Refuser</button>
        <button id="btn-accept-cookies" class="cookie-btn-accept">Accepter tout</button>
      </div>
    `;
    document.body.appendChild(cookieBanner);

    const closeBanner = (status) => {
      localStorage.setItem('cookieConsent', status);
      cookieBanner.style.opacity = '0';
      setTimeout(() => cookieBanner.remove(), 300);
    };

    document.getElementById('btn-accept-cookies').addEventListener('click', () => closeBanner('accepted'));
    document.getElementById('btn-refuse-cookies').addEventListener('click', () => closeBanner('refused'));
  }
});