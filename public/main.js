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

  // On déduit le chemin relatif vers la racine
  let rootUrl = '/';
  const logoLink = document.querySelector('.logo-container a');
  if (logoLink) {
    const href = logoLink.getAttribute('href');
    if (href && href !== '/') {
      rootUrl = href.endsWith('/') ? href : href + '/';
    }
  }

  // --- RECHERCHE GLOBALE (NAVBAR) ---
  const globalSearchForms = document.querySelectorAll('.nav-search');
  
  function forceCloseMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');
    if (navLinks) navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  // Ecoute du formulaire de recherche de la Navbar
  globalSearchForms.forEach(form => {
    const input = form.querySelector('input');
    if (input) {
      const triggerSearch = (e) => {
        const query = input.value;
        input.value = '';
        input.blur();
        forceCloseMobileMenu();
        openSearch(query);
      };
      input.addEventListener('focus', triggerSearch);
      input.addEventListener('click', triggerSearch);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const query = input ? input.value.trim() : '';
      forceCloseMobileMenu();
      openSearch(query);
      if (input) input.value = '';
    });
  });

  // Injection du HTML du Modal de recherche
  const modalHTML = `
    <div class="search-modal-overlay" id="search-modal" style="z-index: 10000;">
      <div class="search-modal">
        <div class="sm-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 12px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="sm-input" placeholder="Rechercher un rapport, un modèle..." autocomplete="off">
          <div class="hidden md:block text-[10px] text-dim border border-border px-1.5 py-0.5 rounded ml-2">ESC</div>
          <button class="sm-close" id="sm-close" aria-label="Fermer" style="margin-left: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="sm-body" id="sm-results"></div>
        <div class="sm-footer hidden md:flex p-3 border-t border-border bg-bg-2 gap-4 text-[10px] text-dim uppercase tracking-widest">
            <span><strong>↑↓</strong> pour naviguer</span>
            <span><strong>Enter</strong> pour ouvrir</span>
            <span><strong>Cmd+K</strong> pour chercher</span>
        </div>
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
    
    isFetching = true;
    try {
      const indexPath = rootUrl === '/' ? 'search-index.json' : rootUrl + 'search-index.json';
      const response = await fetch(indexPath);
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

  let selectedIdx = -1;

  function renderResults(query) {
    selectedIdx = -1;
    if (!query.trim()) {
      smResults.innerHTML = '<div class="sm-empty">Entrez un mot-clé pour rechercher (ex: Macro, Taux, Modèle...)</div>';
      return;
    }

    const q = query.toLowerCase().trim();
    const filtered = siteData.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.shortDesc.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );

    const escapeHTML = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    if (filtered.length === 0) {
      smResults.innerHTML = '<div class="sm-empty">Aucun résultat trouvé pour "' + escapeHTML(query) + '"</div>';
      return;
    }

    smResults.innerHTML = filtered.map((item, idx) => {
      let finalUrl = item.url;
      if (!item.url.startsWith('http')) {
         finalUrl = (rootUrl + item.url).replace(/\/+/g, '/');
      }
      
      let snippet = item.shortDesc || '';
      const lowerDesc = (item.desc || '').toLowerCase();
      const matchIdx = lowerDesc.indexOf(q);
      
      if (matchIdx !== -1 && !snippet.toLowerCase().includes(q)) {
        const start = Math.max(0, matchIdx - 60);
        const end = Math.min(item.desc.length, matchIdx + 60);
        snippet = (start > 0 ? '...' : '') + item.desc.substring(start, end) + '...';
      } else {
        snippet = snippet.length > 130 ? snippet.substring(0, 130) + '...' : snippet;
      }

      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${safeQ})`, 'gi');
      
      const highlightedTitle = escapeHTML(item.title).replace(regex, '<strong style="color: var(--blue-3)">$1</strong>');
      const highlightedSnippet = escapeHTML(snippet).replace(regex, '<strong style="color: var(--blue-3)">$1</strong>');

      return `
        <a href="${finalUrl}" class="sm-result" data-idx="${idx}" ${item.url.startsWith('http') ? 'target="_blank"' : ''}>
          <div class="sm-result-meta">
            <span class="sm-result-tag">${escapeHTML(item.category)}</span>
            ${item.date ? `<span>•</span><span>${escapeHTML(item.date)}</span>` : ''}
          </div>
          <h4>${highlightedTitle}</h4>
          <p>${highlightedSnippet}</p>
        </a>`;
    }).join('');
  }

  function updateSelection(newIdx) {
    const results = smResults.querySelectorAll('.sm-result');
    results.forEach(r => r.classList.remove('selected'));
    
    if (newIdx >= 0 && newIdx < results.length) {
      selectedIdx = newIdx;
      results[selectedIdx].classList.add('selected');
      results[selectedIdx].scrollIntoView({ block: 'nearest' });
    }
  }

  // Keyboard navigation for results
  smInput.addEventListener('keydown', (e) => {
    const results = smResults.querySelectorAll('.sm-result');
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = (selectedIdx + 1) % results.length;
      updateSelection(selectedIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = (selectedIdx - 1 + results.length) % results.length;
      updateSelection(selectedIdx);
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      results[selectedIdx].click();
    }
  });

  function openSearch(query = '') {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    smInput.value = query;
    setTimeout(() => smInput.focus(), 50);
    
    if (window.location.protocol !== 'file:') {
      smResults.innerHTML = '<div class="sm-loading"><div class="cs-pulse" style="display:inline-block; margin-right:12px; transform:translateY(1px);"></div>Recherche en cours...</div>';
      fetchSiteData().then(() => renderResults(smInput.value));
    } else renderResults('');
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (smClose) smClose.addEventListener('click', closeSearch);
  if (searchModal) searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) closeSearch(); });
  if (smInput) smInput.addEventListener('input', (e) => renderResults(e.target.value));

  // Logique pour la page Research (Filtres et Recherche)
  const searchInput = document.getElementById('research-search');
  const filterButtons = document.querySelectorAll('.rt-filter');
  const researchCards = document.querySelectorAll('.research-item');
  const noResultsMsg = document.getElementById('no-results');

  if (searchInput && filterButtons.length > 0 && researchCards.length > 0) {
    const filterCards = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const activeFilter = document.querySelector('.rt-filter.active').getAttribute('data-filter');
      let visibleCount = 0;

      researchCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.research-description').textContent.toLowerCase();
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
    newsletterForm.addEventListener('submit', () => {
      const btn = newsletterForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "[ TRAITEMENT... ]";
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
    const isEN = (document.documentElement.lang || 'fr').toLowerCase().startsWith('en');
    const cookieText = isEN ? {
      title: 'Cookie Management',
      body: "We use cookies to ensure the proper functioning of the site (notably for Calendly appointment booking) and to analyze our traffic anonymously via Umami. By continuing to browse, you accept the use of these cookies.",
      refuse: 'Decline',
      accept: 'Accept all',
    } : {
      title: 'Gestion des Cookies',
      body: "Nous utilisons des cookies pour assurer le bon fonctionnement du site (notamment pour la prise de rendez-vous Calendly) et analyser notre trafic de manière anonyme via Umami. En poursuivant votre navigation, vous acceptez l'utilisation de ces cookies.",
      refuse: 'Refuser',
      accept: 'Accepter tout',
    };
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner';
    cookieBanner.innerHTML = `
      <div class="cookie-content">
        <h4>${cookieText.title}</h4>
        <p>${cookieText.body}</p>
      </div>
      <div class="cookie-actions">
        <button id="btn-refuse-cookies" class="cookie-btn-refuse">${cookieText.refuse}</button>
        <button id="btn-accept-cookies" class="cookie-btn-accept">${cookieText.accept}</button>
      </div>
    `;
    document.body.appendChild(cookieBanner);

    const closeBanner = (status) => {
      localStorage.setItem('cookieConsent', status);
      cookieBanner.style.opacity = '0';
      setTimeout(() => cookieBanner.remove(), 300);
    };

    if (document.getElementById('btn-accept-cookies')) document.getElementById('btn-accept-cookies').addEventListener('click', () => closeBanner('accepted'));
    if (document.getElementById('btn-refuse-cookies')) document.getElementById('btn-refuse-cookies').addEventListener('click', () => closeBanner('refused'));
  }

  // --- REVEAL ANIMATIONS (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- SUPABASE AUTHENTICATION ---
  const SUPABASE_URL = 'https://svodjiuypokuvubwfkom.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_CanU4tYA8yh9_9Tbgib4Kw_ecQJtXcp';

  let supabaseClient;
  try {
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (err) {
    console.error("Error initializing Supabase client:", err);
  }

  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const authModalClose = document.getElementById('auth-modal-close');
  const authSwitchBtn = document.getElementById('auth-switch-btn');
  const authModalTitle = document.getElementById('auth-modal-title');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authSwitchText = document.getElementById('auth-switch-text');
  const authError = document.getElementById('auth-error');
  
  const githubAuthBtn = document.getElementById('github-auth-btn');
  const confirmPasswordInput = document.getElementById('auth-confirm-password');
  
  const userNav = document.getElementById('user-nav');
  const logoutBtn = document.getElementById('logout-btn');

  const paywallLoginBtn = document.getElementById('paywall-login-btn');
  const paywallSignupBtn = document.getElementById('paywall-signup-btn');

  let isLogin = true;

  const updateAuthUI = async (user) => {
    const premiumContent = document.getElementById('premium-content');
    const paywall = document.getElementById('paywall');
    const printBtn = document.getElementById('print-btn');
    const emailPdfBtn = document.getElementById('email-pdf-btn');

    if (user) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (signupBtn) signupBtn.classList.add('hidden');
      if (userNav) userNav.classList.remove('hidden');
      
      try {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        const isPremiumUser = profile && profile.plan === 'premium';
        const headerSubscribeBtn = document.getElementById('header-subscribe-btn');
        const allCtaSubscribeBtns = document.querySelectorAll('#cta-subscribe-btn');
        const stripeUrl = `https://buy.stripe.com/live_4gw9Bf06L7nRe7S3ce?client_reference_id=${user.id}`;

        if (headerSubscribeBtn) {
          if (!isPremiumUser) {
            headerSubscribeBtn.classList.remove('hidden');
            headerSubscribeBtn.onclick = () => window.location.href = stripeUrl;
          } else {
            headerSubscribeBtn.classList.add('hidden');
          }
        }

        allCtaSubscribeBtns.forEach(btn => {
          if (!isPremiumUser) {
            btn.href = stripeUrl;
          } else {
            btn.textContent = "Accéder à ma recherche";
            btn.href = "/research";
          }
        });
        
        if (premiumContent) {
          if (isPremiumUser) {
            premiumContent.classList.remove('hidden');
            if (paywall) paywall.classList.add('hidden');
            if (printBtn) printBtn.classList.remove('hidden');
            
            if (emailPdfBtn) {
              emailPdfBtn.classList.remove('hidden');
              emailPdfBtn.onclick = async () => {
                emailPdfBtn.disabled = true;
                const originalText = emailPdfBtn.innerHTML;
                emailPdfBtn.innerHTML = "Envoi...";
                const pdfStoragePath = emailPdfBtn.dataset.pdfStoragePath || null;

                try {
                  const { error } = await supabaseClient.functions.invoke('send-premium-pdf', {
                    body: {
                      articleTitle: document.querySelector('h1')?.textContent,
                      articleUrl: window.location.href,
                      pdfStoragePath: pdfStoragePath,
                      userEmail: user.email
                    }
                  });
                  if (error) throw error;
                  emailPdfBtn.innerHTML = "Envoyé !";
                  setTimeout(() => {
                    emailPdfBtn.innerHTML = originalText;
                    emailPdfBtn.disabled = false;
                  }, 3000);
                } catch (err) {
                  emailPdfBtn.innerHTML = "Erreur";
                  setTimeout(() => {
                    emailPdfBtn.innerHTML = originalText;
                    emailPdfBtn.disabled = false;
                  }, 3000);
                }
              };
            }
          } else {
            premiumContent.classList.add('hidden');
            if (paywall) paywall.classList.remove('hidden');
            if (printBtn) printBtn.classList.add('hidden');
            if (emailPdfBtn) emailPdfBtn.classList.add('hidden');
            const paywallTitle = paywall.querySelector('h3');
            if (paywallTitle) paywallTitle.textContent = "Abonnez-vous pour accéder à cette recherche";
            const signupBtn = document.getElementById('paywall-signup-btn');
            if (signupBtn) {
              signupBtn.textContent = "S'abonner maintenant";
              signupBtn.onclick = () => window.location.href = stripeUrl;
            }
          }
        } else {
          // Public article, always show print button
          if (printBtn) printBtn.classList.remove('hidden');
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (signupBtn) signupBtn.classList.remove('hidden');
      if (userNav) userNav.classList.add('hidden');
      if (premiumContent) {
        premiumContent.classList.add('hidden');
        if (paywall) paywall.classList.remove('hidden');
        if (printBtn) printBtn.classList.add('hidden');
      } else {
        // Public article, show print button even if not logged in
        if (printBtn) printBtn.classList.remove('hidden');
      }
    }
  };

  // --- INACTIVITY LOGOUT (15 MIN) ---
  let inactivityTimer;
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async () => {
      if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
          await supabaseClient.auth.signOut();
          window.location.href = '/?reason=inactivity';
        }
      }
    }, INACTIVITY_LIMIT);
  };

  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(name => {
    document.addEventListener(name, resetInactivityTimer, true);
  });
  resetInactivityTimer();

  if (supabaseClient) {
    window.supabaseClient = supabaseClient;
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      updateAuthUI(session?.user);
    });
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      updateAuthUI(session?.user);
    });
  }

  const openAuthModal = (mode = 'login') => {
    if (!authModal) return;
    isLogin = mode === 'login';
    if (authModalTitle) authModalTitle.textContent = isLogin ? 'Connexion' : 'S\'inscrire';
    if (authSubmitBtn) authSubmitBtn.textContent = isLogin ? 'Se connecter' : 'Créer un compte';
    if (authSwitchText) authSwitchText.textContent = isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?';
    if (authSwitchBtn) authSwitchBtn.textContent = isLogin ? 'S\'inscrire' : 'Se connecter';
    
    if (confirmPasswordInput) {
      if (isLogin) confirmPasswordInput.classList.add('hidden');
      else confirmPasswordInput.classList.remove('hidden');
      confirmPasswordInput.required = !isLogin;
    }

    if (authError) authError.classList.add('hidden');
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    if (authModal) authModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });
  if (signupBtn) signupBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('signup'); });
  if (paywallLoginBtn) paywallLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });
  if (paywallSignupBtn) paywallSignupBtn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('signup'); });
  if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
  
  if (authSwitchBtn) {
    authSwitchBtn.addEventListener('click', () => {
      openAuthModal(isLogin ? 'signup' : 'login');
    });
  }

  window.addEventListener('open-auth-modal', (e) => {
    openAuthModal(e.detail.mode || 'login');
  });

  if (githubAuthBtn && supabaseClient) {
    githubAuthBtn.addEventListener('click', async () => {
      const siteUrl = window.location.origin.includes('localhost') ? window.location.origin : 'https://horaclecapital.com';
      await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: siteUrl + '/account' }
      });
    });
  }

  if (authForm && supabaseClient) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('auth-email');
      const passwordInput = document.getElementById('auth-password');
      if (!emailInput || !passwordInput) return;
      const email = emailInput.value;
      const password = passwordInput.value;
      
      if (!isLogin && confirmPasswordInput && password !== confirmPasswordInput.value) {
        authError.textContent = "Les mots de passe ne correspondent pas.";
        authError.classList.remove('hidden');
        return;
      }

      if (authError) authError.classList.add('hidden');
      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'Traitement...';

      try {
        const siteUrl = window.location.origin.includes('localhost') ? window.location.origin : 'https://horaclecapital.com';
        let result;
        if (isLogin) result = await supabaseClient.auth.signInWithPassword({ email, password });
        else result = await supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: siteUrl + '/account' } });

        if (result.error) {
          authError.textContent = result.error.message;
          authError.classList.remove('hidden');
          authSubmitBtn.disabled = false;
          authSubmitBtn.textContent = isLogin ? 'Se connecter' : 'Créer un compte';
        } else {
          if (!isLogin && result.data?.user && !result.data.session) {
            authError.textContent = "Vérifiez votre boîte mail pour confirmer votre compte.";
            authError.style.color = "var(--blue-3)";
            authError.classList.remove('hidden');
            authSubmitBtn.disabled = false;
            authSubmitBtn.textContent = 'En attente...';
          } else {
            closeAuthModal();
            authSubmitBtn.disabled = false;
            if (result.data?.session) updateAuthUI(result.data.session.user);
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
        authSubmitBtn.disabled = false;
      }
    });
  }

  const heroCard = document.querySelector('.hero-visual-card');
  const heroVisual = document.querySelector('.hero-visual');
  if (heroCard && heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      heroCard.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'rotateY(-6deg) rotateX(3deg)';
    });
  }

  // --- FEEDBACK FORM SUBMISSION ---
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const status = document.getElementById('fb-status');
      const submitBtn = document.getElementById('fb-submit');
      const formData = new FormData(feedbackForm);
      
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "ENVOI EN COURS...";
      status.textContent = "";

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          status.style.color = "var(--blue-3)";
          status.textContent = "> Merci ! Votre feedback a été envoyé avec succès.";
          feedbackForm.reset();
          
          setTimeout(() => {
            const modal = document.getElementById('fb-modal');
            if (modal) {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            }
          }, 3000);
        } else {
          status.style.color = "var(--orange)";
          status.textContent = "> Erreur : " + (data.message || "Impossible d'envoyer le feedback.");
        }
      } catch (err) {
        console.error("Feedback error:", err);
        status.style.color = "var(--orange)";
        status.textContent = "> Erreur réseau. Veuillez réessayer plus tard.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});