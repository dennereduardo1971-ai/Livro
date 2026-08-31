(() => {
  const LUGARES = __LUGARES__;
  const RIO = __RIO__;
  const CAPITULOS = __CAPITULOS__;
  const POR_ID = new Map(LUGARES.map((l) => [l.id, l]));
  const REDUZIR = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const guardar = (c, v) => { try { localStorage.setItem(c, v); } catch (e) {} };
  const lerChave = (c, p) => { try { const v = localStorage.getItem(c); return v === null ? p : v; } catch (e) { return p; } };
  const progresso = {
    ler: () => Number(lerChave('cais:progresso', 0)) || 0,
    definir: (n) => guardar('cais:progresso', String(Math.max(0, Math.min(CAPITULOS.length, n)))),
    concluir(n) { if (n > this.ler()) this.definir(n); },
  };
  const marcador = {
    ler: (n) => Number(lerChave('cais:marcador:capitulo-' + n, 0)) || 0,
    guardar: (n, f) => guardar('cais:marcador:capitulo-' + n, f.toFixed(4)),
  };

  /* --- tema e corpo de texto ------------------------------------- */
  document.documentElement.dataset.tema = lerChave('cais:tema', 'claro');
  const fonteSalva = lerChave('cais:fonte', null);
  if (fonteSalva) document.documentElement.style.setProperty('--tamanho-leitura', fonteSalva + 'px');

  /* --- navegação -------------------------------------------------- */
  const secoes = [...document.querySelectorAll('section[data-rota]')];
  const mostrar = (rota) => {
    secoes.forEach((s) => (s.hidden = s.dataset.rota !== rota));
    scrollTo({ top: 0, behavior: 'instant' });
    if (rota === 'capitulos') pintarLista();
    if (rota === 'estado') pintarEstado();
    if (rota === 'glossario' || rota === 'tempo') pintarTrancas();
    if (rota === 'mapa') { pintarMapas(); acenderInicial(); }
  };
  document.querySelectorAll('[data-ir]').forEach((b) => (b.onclick = () => mostrar(b.dataset.ir)));

  /* --- proteção de spoiler ---------------------------------------- */
  function pintarTrancas() {
    const lido = progresso.ler();
    document.querySelectorAll('.verbete, .evento').forEach((el) => {
      const trancado = Number(el.dataset.revela) > lido;
      el.classList.toggle('trancado', trancado);
      const cadeado = el.querySelector('.cadeado');
      if (cadeado) cadeado.hidden = !trancado;
      const h2 = el.querySelector('h2');
      if (h2 && el.classList.contains('evento')) {
        if (trancado) { h2.dataset.texto = h2.dataset.texto || h2.textContent; h2.textContent = '— — —'; }
        else if (h2.dataset.texto) h2.textContent = h2.dataset.texto;
      }
    });
  }

  function pintarLista() {
    const lido = progresso.ler();
    document.querySelectorAll('.estado-leitura').forEach((selo) => {
      const n = Number(selo.dataset.numero);
      const m = marcador.ler(n);
      selo.classList.remove('novo');
      if (n <= lido) selo.textContent = 'lido';
      else if (m > 0.02) selo.textContent = Math.round(m * 100) + '%';
      else if (n === lido + 1) { selo.textContent = 'novo'; selo.classList.add('novo'); }
      else selo.textContent = 'não lido';
    });
  }

  function pintarEstado() {
    const p = progresso.ler();
    const texto = document.getElementById('sua-leitura');
    const valor = document.getElementById('valor');
    if (valor) valor.textContent = String(p);
    if (texto) {
      texto.textContent = p === 0
        ? 'Você ainda não concluiu nenhum capítulo — o mapa está quase todo apagado.'
        : 'Você leu até o Capítulo ' + p + '. Faltam ' + Math.max(0, CAPITULOS.length - p) + ' publicados.';
    }
  }
  const liga = (id, f) => { const b = document.getElementById(id); if (b) b.onclick = () => { f(); pintarEstado(); pintarMapas(); }; };
  liga('mais', () => progresso.definir(progresso.ler() + 1));
  liga('menos', () => progresso.definir(progresso.ler() - 1));
  liga('zerar', () => progresso.definir(0));

  /* --- os mapas ---------------------------------------------------- */
  const mapas = [...document.querySelectorAll('.mapa')].map((mapa) => {
    const svg = mapa.querySelector('svg');
    const camera = svg.querySelector('#camera');
    const rio = svg.querySelector('#rio');
    const luz = svg.querySelector('#luz');
    const ficha = mapa.querySelector('.ficha');
    let aberta = null;
    let atual = null;
    let animacao = null;

    const abrir = (id) => {
      const l = POR_ID.get(id);
      if (!l || l.mudo) return;
      const lido = progresso.ler();
      const bloqueado = l.revelaEm > lido;
      aberta = id;
      ficha.querySelector('.ficha-nome').textContent = bloqueado ? 'Ainda não' : l.nome;
      ficha.querySelector('.ficha-descricao').textContent = bloqueado
        ? 'Você ainda não leu o suficiente para que este lugar tenha nome.' : l.descricao;
      ficha.querySelector('.ficha-representa').textContent = bloqueado ? '' : l.representa;
      const passado = bloqueado ? [] : l.passado.filter((p) => p.revelaEm <= lido);
      ficha.querySelector('.ficha-passado').innerHTML = passado.length
        ? '<h4>o que passou</h4><ul>' + passado.map((p) => '<li>' + p.texto + '</li>').join('') + '</ul>' : '';
      const estado = ficha.querySelector('.ficha-estado');
      const tem = !bloqueado && l.estado && l.estado.revelaEm <= lido;
      estado.textContent = tem ? l.estado.texto : '';
      estado.hidden = !tem;
      ficha.hidden = false;
      requestAnimationFrame(() => ficha.classList.add('visivel'));
      mapa.classList.add('com-ficha');
      if (!REDUZIR) {
        const e = 1.7;
        camera.style.transform = 'translate(' + (310 - l.x * e) + 'px, ' + (300 - l.y * e) + 'px) scale(' + e + ')';
      }
    };
    const fechar = () => {
      aberta = null;
      ficha.classList.remove('visivel');
      mapa.classList.remove('com-ficha');
      camera.style.transform = '';
      setTimeout(() => { if (!aberta) ficha.hidden = true; }, 400);
    };
    svg.querySelectorAll('.lugar').forEach((g) => {
      g.onclick = () => (aberta === g.dataset.id ? fechar() : abrir(g.dataset.id));
      g.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(g.dataset.id); } };
    });
    ficha.querySelector('.fechar').onclick = fechar;
    svg.addEventListener('click', (e) => { if (!e.target.closest('.lugar')) fechar(); });

    const comprimento = rio.getTotalLength();
    const noRio = (t) => rio.getPointAtLength(Math.max(0, Math.min(1, t)) * comprimento);

    const mover = (id, tensao, tempo) => {
      const d = POR_ID.get(id);
      if (!d || d.mudo || d.revelaEm > Math.max(progresso.ler(), liberado)) return;
      luz.classList.remove('oculta');
      luz.dataset.tensao = tensao || 'media';
      luz.dataset.tempo = tempo || 'agora';
      const alvo = { x: d.x, y: d.y, t: d.t };
      if (!atual || REDUZIR) {
        atual = alvo;
        luz.style.transform = 'translate(' + alvo.x + 'px, ' + alvo.y + 'px)';
        return;
      }
      if (atual.x === alvo.x && atual.y === alvo.y) return;
      const passos = ['translate(' + atual.x + 'px, ' + atual.y + 'px)'];
      const a = noRio(atual.t);
      passos.push('translate(' + a.x + 'px, ' + a.y + 'px)');
      const n = Math.max(2, Math.round(Math.abs(alvo.t - atual.t) * 26));
      for (let i = 1; i <= n; i++) {
        const p = noRio(atual.t + ((alvo.t - atual.t) * i) / n);
        passos.push('translate(' + p.x + 'px, ' + p.y + 'px)');
      }
      passos.push('translate(' + alvo.x + 'px, ' + alvo.y + 'px)');
      if (animacao) animacao.cancel();
      animacao = luz.animate(passos.map((transform) => ({ transform })), {
        duration: 700 + Math.abs(alvo.t - atual.t) * 1400,
        easing: 'cubic-bezier(.4,0,.2,1)',
        fill: 'forwards',
      });
      atual = alvo;
    };

    const pintar = () => {
      const lido = Math.max(progresso.ler(), liberado);
      svg.querySelectorAll('.lugar').forEach((g) => {
        const apagado = Number(g.dataset.revela) > lido;
        g.classList.toggle('apagado', apagado);
        const rot = svg.querySelector('#rotulos .rotulo[data-id="' + g.dataset.id + '"]');
        if (rot) rot.classList.toggle('apagado', apagado);
      });
      svg.querySelectorAll('.marca-breu').forEach((m) => {
        const l = POR_ID.get(m.dataset.lugar);
        const quando = (l && l.breu && l.breu.revelaEm) || 99;
        m.classList.toggle('escondida', quando > lido);
      });
    };

    return { mapa, mover, pintar };
  });

  let liberado = 0; /* o capítulo em leitura conta como liberado */
  const pintarMapas = () => mapas.forEach((m) => m.pintar());
  const moverTodos = (id, tensao, tempo) => mapas.forEach((m) => m.mover(id, tensao, tempo));

  function acenderInicial() {
    const lido = progresso.ler();
    const visiveis = LUGARES.filter((l) => !l.mudo && l.revelaEm <= lido);
    const alvo = visiveis[visiveis.length - 1] || POR_ID.get('cindra');
    if (alvo) setTimeout(() => moverTodos(alvo.id, 'baixa', 'agora'), 400);
  }

  /* --- o leitor ---------------------------------------------------- */
  const corpo = document.getElementById('corpo-capitulo');
  const leitura = document.querySelector('.leitura');
  const barra = document.querySelector('.progresso .preenchimento');
  let capituloAtual = 1;
  let observador = null;

  function abrirCapitulo(n, fracao) {
    const tpl = document.querySelector('template[data-capitulo="' + n + '"]');
    if (!tpl) return;
    capituloAtual = n;
    liberado = Math.max(liberado, n);
    leitura.dataset.numero = String(n);
    corpo.innerHTML = tpl.innerHTML;
    mostrar('leitor');
    document.getElementById('cap-anterior').disabled = n <= 1;
    document.getElementById('cap-proximo').disabled = n >= CAPITULOS.length;
    pintarMapas();
    ligarCenas();
    const f = fracao !== undefined ? fracao : marcador.ler(n);
    requestAnimationFrame(() => {
      const total = document.documentElement.scrollHeight - innerHeight;
      if (f > 0.02 && f < 0.98) scrollTo({ top: f * total, behavior: 'instant' });
    });
  }

  function ligarCenas() {
    if (observador) observador.disconnect();
    const ancoras = [...corpo.querySelectorAll('.ancora-cena')];
    if (!ancoras.length) return;
    let ultima = '';
    const anunciar = (a) => {
      if (a.id === ultima) return;
      ultima = a.id;
      moverTodos(a.dataset.lugar, a.dataset.tensao, a.dataset.tempo);
    };
    observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) anunciar(e.target); });
    }, { rootMargin: '-25% 0px -60% 0px' });
    ancoras.forEach((a) => observador.observe(a));
    anunciar(ancoras[0]);
  }

  document.querySelectorAll('[data-abrir]').forEach((b) => (b.onclick = () => abrirCapitulo(Number(b.dataset.abrir))));
  document.getElementById('cap-anterior').onclick = () => abrirCapitulo(capituloAtual - 1, 0);
  document.getElementById('cap-proximo').onclick = () => abrirCapitulo(capituloAtual + 1, 0);

  let guardando;
  addEventListener('scroll', () => {
    if (document.querySelector('section[data-rota="leitor"]').hidden) return;
    const total = document.documentElement.scrollHeight - innerHeight;
    const f = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
    if (barra) barra.style.transform = 'scaleX(' + f + ')';
    if (f > 0.92) { progresso.concluir(capituloAtual); pintarMapas(); }
    clearTimeout(guardando);
    guardando = setTimeout(() => marcador.guardar(capituloAtual, f), 400);
  }, { passive: true });

  /* --- tipografia, aviso, gaveta ----------------------------------- */
  const aviso = document.querySelector('.aviso');
  if (aviso) {
    aviso.hidden = !!lerChave('cais:aviso', '');
    const b = aviso.querySelector('.entendi');
    if (b) b.onclick = () => { aviso.hidden = true; guardar('cais:aviso', '1'); };
  }
  const painel = document.getElementById('painel-tipografia');
  const botaoTipografia = document.getElementById('tipografia');
  if (painel) painel.hidden = true;
  if (botaoTipografia && painel) botaoTipografia.onclick = () => (painel.hidden = !painel.hidden);
  document.querySelectorAll('[data-fonte]').forEach((b) => (b.onclick = () => {
    const atual = Number(lerChave('cais:fonte', 18));
    const v = Math.min(26, Math.max(15, atual + (b.dataset.fonte === '+' ? 1 : -1)));
    document.documentElement.style.setProperty('--tamanho-leitura', v + 'px');
    guardar('cais:fonte', String(v));
  }));
  document.querySelectorAll('[data-tema]').forEach((b) => (b.onclick = () => {
    document.documentElement.dataset.tema = b.dataset.tema;
    guardar('cais:tema', b.dataset.tema);
  }));
  const gaveta = document.getElementById('gaveta-mapa');
  const abrirMapa = document.getElementById('abrir-mapa');
  if (gaveta && abrirMapa) {
    abrirMapa.onclick = () => { gaveta.hidden = false; requestAnimationFrame(() => gaveta.classList.add('aberta')); };
    gaveta.querySelector('.fechar-gaveta').onclick = () => {
      gaveta.classList.remove('aberta');
      setTimeout(() => (gaveta.hidden = true), 500);
    };
  }

  /* --- entrada ------------------------------------------------------ */
  pintarMapas();
  pintarTrancas();
  pintarLista();
  pintarEstado();
  mostrar('mapa');
})();
