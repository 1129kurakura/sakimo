/*
 * 共通の動き（ヘッダー・フッター・お問い合わせ・スクロールの演出）
 * u&me 公式サイトの仕組みをもとに、SAKIMO の紹介ページ用にしたものです。
 * 文章や連絡先を変えたいだけなら、このファイルではなく site-data.js を編集してください。
 */
(() => {
  const site = window.SITE;
  if (!site) {
    console.error('site-data.js が読み込めていません。書き間違い（カンマや引用符）がないか確認してください。');
    return;
  }

  const REVEAL_STAGGER_MS = 70;

  const isExternal = (url) => /^(https?:|mailto:)/.test(url);

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    [].concat(children).filter(Boolean).forEach((child) => node.append(child));
    return node;
  };

  const link = (url, attrs, children) =>
    el('a', { href: url, ...(isExternal(url) && !url.startsWith('mailto:') ? { target: '_blank', rel: 'noopener' } : {}), ...attrs }, children);

  const arrow = () => el('span', { class: 'arrow', 'aria-hidden': 'true', text: '→' });

  // kindchord のロゴ（kind を太く、chord を細く）
  const logo = () => ['kind', el('span', { class: 'logo__thin', text: 'chord' })];

  /* ---------- デモへのリンク（site-data.js の demo） ---------- */

  const fillDemoLinks = () => {
    document.querySelectorAll('[data-demo-link]').forEach((node) => node.setAttribute('href', site.demo));
  };

  /* ---------- お問い合わせ ---------- */

  const contactLinks = () => {
    const { email, x, form } = site.contact || {};
    return [
      form && { label: 'フォームから送る', url: form },
      email && { label: 'メールを送る', url: `mailto:${email}` },
      x && { label: 'X で連絡する', url: x },
    ].filter(Boolean);
  };

  const buildPendingDialog = () => {
    const closeButton = el('button', { type: 'button', class: 'button button--ghost', text: 'close' });
    const dialog = el('dialog', { class: 'dialog', 'aria-labelledby': 'pending-title' }, [
      el('p', { class: 'dialog__label', text: 'Contact' }),
      el('h2', { id: 'pending-title', class: 'dialog__title', text: 'お問い合わせ窓口は準備中です' }),
      el('p', { class: 'dialog__text', text: 'ただいま受付の準備をしています。公開まで、もうしばらくお待ちください。' }),
      closeButton,
    ]);
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    document.body.append(dialog);
    return dialog;
  };

  const buildContact = () => {
    const links = contactLinks();
    const actions = el('div', { class: 'contact__actions' });

    if (links.length === 0) {
      const dialog = buildPendingDialog();
      const button = el('button', { type: 'button', class: 'button button--light' }, ['お問い合わせ', arrow()]);
      button.addEventListener('click', () => dialog.showModal());
      actions.append(button);
    } else {
      links.forEach((item) => actions.append(link(item.url, { class: 'button button--light' }, [item.label, arrow()])));
    }
    actions.append(link(site.demo, { class: 'button button--ghost-light' }, ['デモを触る', arrow()]));

    return el('section', { class: 'contact', id: 'contact', 'aria-labelledby': 'contact-title' }, [
      el('div', { class: 'wrap contact__inner' }, [
        el('p', { class: 'label label--light', text: 'Contact' }),
        el('h2', { id: 'contact-title', class: 'contact__title', text: 'SAKIMOを、一緒に育ててくださる方を探しています。' }),
        el('p', {
          class: 'contact__text',
          text: '試してくださる学生や保護者の方、学校・自治体、セキュリティや子どもの安全に取り組む企業の方。実際に使ってもらいながら、一緒に形にしていける仲間を募集しています。',
        }),
        actions,
      ]),
    ]);
  };

  /* ---------- ヘッダー・フッター ---------- */

  const buildHeader = () => {
    const mount = document.getElementById('site-header');
    if (!mount) return;

    const list = el('ul', { class: 'nav__list', id: 'nav-list' }, site.nav.map((item) => el('li', {}, el('a', { href: item.url, text: item.label }))));
    const toggle = el('button', { type: 'button', class: 'nav__toggle', 'aria-expanded': 'false', 'aria-controls': 'nav-list' }, [
      el('span', { class: 'nav__toggle-text', text: 'menu' }),
    ]);
    const setOpen = (isOpen) => {
      mount.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.firstChild.textContent = isOpen ? 'close' : 'menu';
    };
    toggle.addEventListener('click', () => setOpen(!mount.classList.contains('is-open')));
    list.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    mount.append(
      el('div', { class: 'site-header__bar' }, [
        el('a', { class: 'logo', href: '#top', 'aria-label': 'kindchord｜SAKIMO のトップへ' }, logo()),
        el('nav', { class: 'nav', 'aria-label': 'メインナビゲーション' }, [toggle, list]),
      ]),
    );
  };

  const buildFooter = () => {
    const mount = document.getElementById('site-footer');
    if (!mount) return;

    const pageLinks = [
      ['課題', '#problem'],
      ['しくみ', '#solution'],
      ['漏洩の見守り', '#monitor'],
      ['キッズ見守り', '#kids'],
    ];
    const aboutLinks = [
      ['安心の約束', '#promise'],
      ['困ったときの相談先', '#help'],
      ['これから', '#future'],
    ];
    const list = (items) => el('ul', {}, items.map(([label, url]) => el('li', {}, el('a', { href: url, text: label }))));

    mount.append(
      buildContact(),
      el('div', { class: 'wrap footer__inner' }, [
        el('div', { class: 'footer__brand' }, [
          el('p', { class: 'logo logo--footer' }, logo()),
          el('p', { class: 'footer__note', text: 'SAKIMO は kindchord のプロダクトです。' }),
        ]),
        el('nav', { class: 'footer__nav', 'aria-label': 'フッターナビゲーション' }, [
          el('div', {}, [el('p', { class: 'footer__heading', text: 'SAKIMO' }), list(pageLinks)]),
          el('div', {}, [el('p', { class: 'footer__heading', text: 'ご案内' }), list(aboutLinks)]),
        ]),
        el('p', { class: 'footer__copy', text: `© ${new Date().getFullYear()} kindchord` }),
      ]),
    );
  };

  /* ---------- スクロールで現れる演出 ---------- */

  const setupReveal = () => {
    const targets = [...document.querySelectorAll('[data-reveal]')];
    const show = (node) => node.classList.add('is-visible');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(show);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, index) => {
            entry.target.style.transitionDelay = `${index * REVEAL_STAGGER_MS}ms`;
            show(entry.target);
            observer.unobserve(entry.target);
          });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((node) => observer.observe(node));
  };

  buildHeader();
  fillDemoLinks();
  buildFooter();
  setupReveal();
})();
