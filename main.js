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
          await fetch(form.action, {
              method: 'POST',
              body: formData,
              mode: 'no-cors' 
          });
          
          statusText.style.color = "var(--white)";
          statusText.textContent = "> Inscription validée. Vérifiez votre boîte de réception.";
          form.reset();
      } catch (err) {
          statusText.style.color = "var(--orange)";
          statusText.textContent = "> Problème de connexion au serveur. Veuillez réessayer.";
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
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);

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

    // 2. Sommaire Interactif Flottant (Table of Contents)
    const headings = document.querySelectorAll('.article-container h2, .article-container h3');
    if (headings.length > 0) {
      const tocContainer = document.createElement('nav');
      tocContainer.className = 'toc-container';
      
      const tocTitle = document.createElement('div');
      tocTitle.className = 'toc-title';
      tocTitle.textContent = 'Sommaire';
      tocContainer.appendChild(tocTitle);

      const tocList = document.createElement('ul');
      tocList.className = 'toc-list';

      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = 'sec-' + index;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.className = 'toc-link';
        
        if (heading.tagName.toLowerCase() === 'h3') {
          a.classList.add('sub');
        }
        
        // Smooth scroll pour le sommaire
        a.addEventListener('click', (e) => {
          e.preventDefault();
          heading.scrollIntoView({ behavior: 'smooth' });
        });

        li.appendChild(a);
        tocList.appendChild(li);
      });

      tocContainer.appendChild(tocList);
      document.body.appendChild(tocContainer);

      // Surbrillance au scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocList.querySelectorAll('a').forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + entry.target.id) {
                link.classList.add('active');
              }
            });
          }
        });
      }, { rootMargin: '0px 0px -60% 0px', threshold: 0.1 });
      
      headings.forEach(h => observer.observe(h));
    }

    // 3. Barre de partage (avec bouton Copier)
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(document.title);
    const floatingShare = document.createElement('div');
    floatingShare.className = 'floating-share';
    floatingShare.innerHTML = `
      <span class="share-label">Partager</span>
      <button id="copy-link-btn" class="share-btn" title="Copier le lien">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        <span id="copy-tooltip" class="share-tooltip">Copier</span>
      </button>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" class="share-btn" title="Partager sur LinkedIn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
      <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" class="share-btn" title="Partager sur X (Twitter)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.332-4.38-.737-1.18.439-2.128 1.408-2.584 2.588-.456 1.18-.323 2.502.348 3.593-3.666-.23-6.938-1.988-9.014-4.834-.693 1.16-.628 2.65.174 3.734.802 1.085 2.11 1.624 3.424 1.45a5.55 5.55 0 0 1-2.484-1.63c-.02.046-.039.091-.059.138-.415 1.168-.184 2.535.59 3.518.775.983 2.016 1.472 3.23 1.272-1.077.857-2.392 1.3-3.734 1.258-.29 0-.58-.024-.87-.069 1.473.948 3.226 1.473 5.03 1.5 5.922 0 9.164-4.82 9.164-8.995v-.409c1.025-.756 1.83-1.688 2.37-2.766-.95.426-1.97.712-3.02.84 1.103-.655 1.916-1.69 2.29-2.92z"/></svg>
      </a>
    `;
    document.body.appendChild(floatingShare);

    const copyBtn = document.getElementById('copy-link-btn');
    const tooltip = document.getElementById('copy-tooltip');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        tooltip.textContent = "Copié !";
        tooltip.classList.add('visible');
        setTimeout(() => {
          tooltip.classList.remove('visible');
          setTimeout(() => tooltip.textContent = "Copier", 300); // Reset text after fade out
        }, 2000);
      });
    });
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