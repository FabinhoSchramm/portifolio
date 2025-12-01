/* ============================================
   PORTFÓLIO - SISTEMA INTERATIVO
   Gerenciamento de navegação, tema e formulários
   ============================================ */

// ============================================
// CONFIGURAÇÕES
// ============================================

const CONFIG = {
  email: "fabio.schramm.filho@gmail.com",
  whatsapp: "+5541995197994",
  pages: {
    index: "index.html",
    sobre: "sobre.html",
    portifolio: "portifolio.html",
    formacao: "formacao.html",
    contato: "contato.html",
  },
};

// ============================================
// UTILITÁRIOS
// ============================================

const isInPagesFolder = () => {
  const path = location.pathname || "";
  return path.includes("/pages/") || path.includes("\\pages\\");
};

const getActivePageName = () => {
  const fileName = location.pathname
    .split("/")
    .pop()
    .split("\\")
    .pop()
    .toLowerCase();

  return (
    Object.keys(CONFIG.pages).find((key) => CONFIG.pages[key] === fileName) ||
    "index"
  );
};

// ============================================
// AÇÕES DE CONTATO
// ============================================

/**
 * Abre o modal de email ao invés de abrir diretamente o cliente de email
 */
function enviarEmail() {
  abrirModal();
}

/**
 * Abre o modal de contato com animação e foco no primeiro campo
 */
function abrirModal() {
  const modal = document.getElementById("emailModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden"; // Previne scroll da página

    // Aguarda animação antes de focar
    setTimeout(() => {
      const firstInput = modal.querySelector("input");
      if (firstInput) firstInput.focus();
    }, 300);
  }
}

/**
 * Fecha o modal com animação e limpa o formulário
 */
function fecharModal() {
  const modal = document.getElementById("emailModal");
  if (modal) {
    modal.classList.add("closing");

    // Aguarda animação antes de remover classes
    setTimeout(() => {
      modal.classList.remove("show", "closing");
      document.body.style.overflow = ""; // Restaura scroll

      const form = document.getElementById("modalContactForm");
      if (form) form.reset();
    }, 300);
  }
}

function enviarWhatsApp() {
  const message = encodeURIComponent(
    "Olá! Vi seu portfólio e gostaria de conversar."
  );
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${message}`, "_blank");
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "Não informado",
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  // Constrói link mailto com todos os dados do formulário
  const mailtoLink = `mailto:${CONFIG.email}?subject=${encodeURIComponent(
    `Contato: ${data.subject}`
  )}&body=${encodeURIComponent(
    `Nome: ${data.name}\nEmail: ${data.email}\nTelefone: ${data.phone}\n\nMensagem:\n${data.message}`
  )}`;

  window.location.href = mailtoLink;
  alert("Obrigado pelo contato! Seu cliente de email será aberto.");
  event.target.reset();

  return false;
}

// ============================================
// NAVEGAÇÃO
// ============================================

const buildNavLink = (page, label) => {
  const inPages = isInPagesFolder();
  const isIndex = page === "index";
  const href = isIndex
    ? inPages
      ? "../index.html"
      : "index.html"
    : `${inPages ? "" : "pages/"}${CONFIG.pages[page]}`;
  const active = getActivePageName() === page ? "active" : "";

  return `<li class="nav-item"><a href="${href}" class="${active}">${label}</a></li>`;
};

/**
 * Gera HTML completo da navbar com menu responsivo e botões de tema
 * @returns {string} HTML da navegação completa
 */
const buildNavbarHTML = () => {
  const links = [
    ["index", "Menu Principal"],
    ["sobre", "Sobre"],
    ["portifolio", "Portfólio"],
    ["formacao", "Formação"],
    ["contato", "Contato"],
  ]
    .map(([page, label]) => buildNavLink(page, label))
    .join("");

  return `
    <nav class="site-nav" role="navigation" aria-label="Menu principal">
      <div class="nav-container">
        <button class="hamburger" id="hamburgerBtn" aria-label="Abrir menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <div class="nav-brand">
          <span class="brand-text">Portfólio</span>
        </div>
        <button id="themeToggle" class="theme-btn theme-btn-mobile" aria-label="Alternar tema">
          <span class="theme-icon">🌙</span>
        </button>
      </div>
      <div class="nav-overlay" id="navOverlay"></div>
      <ul class="nav-list" id="navList">
        ${links}
        <li class="nav-item theme-toggle-desktop">
          <button id="themeToggleDesktop" class="theme-btn" aria-label="Alternar tema">
            <span class="theme-icon">🌙</span>
          </button>
        </li>
      </ul>
    </nav>
  `;
};

const injectNavbar = () => {
  const root = document.getElementById("nav-root");
  const html = buildNavbarHTML();

  if (root) {
    root.innerHTML = html;
  } else {
    document.body.insertAdjacentHTML("afterbegin", html);
  }

  // Garante acessibilidade do primeiro link
  const firstLink = document.querySelector(".site-nav a");
  if (firstLink) firstLink.setAttribute("tabindex", "0");

  initThemeToggle();
  initHamburgerMenu();
};

// ============================================
// MENU HAMBÚRGUER
// ============================================

/**
 * Inicializa menu hambúrguer mobile com todas as interações
 * - Abre/fecha ao clicar no botão
 * - Fecha ao clicar no overlay ou em links
 * - Fecha com ESC e ao redimensionar para desktop
 * - Trap de foco quando aberto (acessibilidade)
 */
const initHamburgerMenu = () => {
  const hamburger = document.getElementById("hamburgerBtn");
  const navList = document.getElementById("navList");
  const overlay = document.getElementById("navOverlay");

  if (!hamburger || !navList) return;

  /** Abre menu com animação e foca primeiro link */
  const openMenu = () => {
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Fechar menu");
    hamburger.classList.add("active");
    navList.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.classList.add("menu-open"); // Previne scroll da página

    // Aguarda animação antes de focar
    setTimeout(() => {
      const firstLink = navList.querySelector("a");
      if (firstLink) firstLink.focus();
    }, 300);
  };

  /** Fecha menu e restaura estado inicial */
  const closeMenu = () => {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menu");
    hamburger.classList.remove("active");
    navList.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  };

  /** Toggle entre abrir e fechar */
  const toggleMenu = (e) => {
    e.stopPropagation();
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  };

  // Event listeners
  hamburger.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Fechar ao clicar em links
  const navLinks = navList.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navList.classList.contains("active")) {
      closeMenu();
    }
  });

  // Fecha menu automaticamente ao redimensionar para desktop (debounced)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navList.classList.contains("active")) {
        closeMenu();
      }
    }, 250);
  });

  // Trap de foco: mantém navegação por Tab dentro do menu (WCAG)
  navList.addEventListener("keydown", (e) => {
    if (!navList.classList.contains("active")) return;

    if (e.key === "Tab") {
      const focusableElements = navList.querySelectorAll(
        "a[href], button:not([disabled])"
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift+Tab no primeiro = vai pro último
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab no último = volta pro primeiro
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};

// ============================================
// GERENCIAMENTO DE TEMA
// ============================================

const THEME = {
  LIGHT: "light",
  DARK: "dark",
  STORAGE_KEY: "theme",
  ICONS: { light: "🌙", dark: "☀️" },
};

const getTheme = () => localStorage.getItem(THEME.STORAGE_KEY) || THEME.LIGHT;

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME.STORAGE_KEY, theme);
  updateThemeIcon(theme);
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
  setTheme(newTheme);
};

/**
 * Atualiza ícone do botão de tema baseado no tema atual
 * @param {string} theme - Tema ativo
 */
const updateThemeIcon = (theme) => {
  const icons = document.querySelectorAll(".theme-icon");
  icons.forEach((icon) => {
    icon.textContent = THEME.ICONS[theme];
  });
};

/** Inicializa sistema de tema aplicando tema salvo e configurando listeners */
const initThemeToggle = () => {
  setTheme(getTheme());

  // Botão mobile (navbar)
  const buttonMobile = document.getElementById("themeToggle");
  if (buttonMobile) buttonMobile.addEventListener("click", toggleTheme);

  // Botão desktop (dentro do menu)
  const buttonDesktop = document.getElementById("themeToggleDesktop");
  if (buttonDesktop) buttonDesktop.addEventListener("click", toggleTheme);
};

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa todas as funcionalidades do site quando DOM estiver pronto
 * - Injeta e configura navbar
 * - Atualiza ano do footer
 * - Configura modal de contato
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa navegação com tratamento de erro
  try {
    injectNavbar();
  } catch (error) {
    console.error("Erro ao inicializar navbar:", error);
  }

  // Atualiza ano automaticamente no footer
  const yearElement = document.getElementById("ano");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Configura modal de contato (se existir na página)
  const modal = document.getElementById("emailModal");
  if (modal) {
    // Fecha ao clicar no backdrop
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        fecharModal();
      }
    });

    // Fecha com tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        fecharModal();
      }
    });
  }
});
