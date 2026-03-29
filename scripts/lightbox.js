/* ===== LIGHTBOX DE OBRAS DE ARTE ===== */
(function () {
  /* Dados detalhados de cada obra */
  var obraData = {
    'franceschini': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Baldassare Franceschini (il Volterrano)',
      data: 'c. 1660',
      tipo: 'Óleo sobre tela',
      localizacao: 'Coleções privadas / Museus italianos',
      ondefoi: 'Florença, Itália',
      contexto: 'Baldassare Franceschini (1611–1689), conhecido como il Volterrano, foi um dos principais pintores barrocos florentinos. Nesta obra, retrata Santa Catarina em êxtase místico, tema recorrente na arte devocional do século XVII. A pintura reflete a influência da Contra-Reforma, que valorizava representações emotivas da experiência espiritual.',
      src: 'imagens/Franceschini_Baldassare_St_Catherine_of_Siena.jpg'
    },
    'tiepolo': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Giovanni Battista Tiepolo',
      data: 'c. 1746',
      tipo: 'Óleo sobre tela',
      localizacao: 'Kunsthistorisches Museum, Viena, Áustria',
      ondefoi: 'Veneza, Itália',
      contexto: 'Giovanni Battista Tiepolo (1696–1770) foi o maior mestre do rococó veneziano. Conhecido por sua luminosidade etérea e composições dinâmicas, retratou Santa Catarina com delicadeza espiritual característica de seu estilo. A santa aparece frequentemente em suas obras religiosas como símbolo de contemplação mística.',
      src: 'imagens/Giovanni_Battista_Tiepolo_Santa_Catarina_de_Sena.jpg'
    },
    'vanni': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Andrea Vanni',
      data: 'c. 1380–1400',
      tipo: 'Têmpera sobre painel',
      localizacao: 'Basílica de São Domingos (San Domenico), Siena, Itália',
      ondefoi: 'Siena, Itália',
      contexto: 'Andrea Vanni (c. 1332–1414) foi contemporâneo e discípulo espiritual de Santa Catarina. Este retrato é considerado o mais fiel à aparência real da santa, pois o artista a conheceu pessoalmente. A obra encontra-se na Basílica de São Domingos em Siena, onde Catarina frequentemente orava. Trata-se do único retrato feito em vida — ou pouco após sua morte.',
      src: 'imagens/Saint_Catherine_by_Andrea_Vanni,_San_Domenico,_Siena.jpg'
    },
    'giovanni-di-paolo': {
      titulo: 'Santa Catarina trocando o coração com Cristo',
      autor: 'Giovanni di Paolo',
      data: 'c. 1461–1462',
      tipo: 'Têmpera e ouro sobre madeira',
      localizacao: 'The Metropolitan Museum of Art, Nova York, EUA',
      ondefoi: 'Siena, Itália',
      contexto: 'Giovanni di Paolo (c. 1403–1482) foi um dos mais criativos pintores sienenses do século XV. Esta cena retrata um dos episódios mais famosos da vida mística de Santa Catarina: a troca do coração com Cristo — momento em que ela afirmou que Deus removeu seu coração humano e o substituiu pelo Seu próprio, transformando-a em instrumento de amor divino.',
      src: 'imagens/Giovanni_di_Paolo_Saint_Catherine_of_Siena_Exchanging_Her_Heart_with_Christ.jpg'
    },
    'beccafumi': {
      titulo: 'Estigmatização de Santa Catarina de Sena',
      autor: 'Domenico Beccafumi',
      data: 'c. 1513–1515',
      tipo: 'Óleo sobre painel',
      localizacao: 'Pinacoteca Nazionale, Siena, Itália',
      ondefoi: 'Siena, Itália',
      contexto: 'Domenico Beccafumi (1486–1551), um dos maiores nomes do maneirismo sienense, retrata aqui o momento em que Santa Catarina recebe os estigmas de Cristo — ocorrido na Igreja de Santa Cristina, em Pisa, em 1375. Durante sua vida, os estigmas permaneceram invisíveis, tornando-se visíveis apenas após sua morte. Beccafumi captura o éxtase e a dor do momento com intensidade dramática.',
      src: 'imagens/Domenico_Beccafumi_-_Stigmatization_of_St_Catherine_of_Siena_-_WGA01536.jpg'
    },
    'estigmas': {
      titulo: 'Santa Catarina recebendo os Estigmas',
      autor: 'Anônimo (escola italiana)',
      data: 'Século XVI–XVII',
      tipo: 'Óleo sobre tela',
      localizacao: 'Museu eclesiástico / coleção privada',
      ondefoi: 'Itália',
      contexto: 'Esta representação anônima da estigmatização de Santa Catarina de Sena segue a iconografia tradicional do episódio ocorrido em Pisa em 1375. Catarina viu raios luminosos vindo das cinco chagas de Cristo crucificado e pediu que permanecessem invisíveis enquanto vivesse — pedido atendido. A cena tornou-se uma das mais representadas na arte devocional italiana dos séculos XVI e XVII.',
      src: 'imagens/Saint_Catherine_of_Siena_Receiving_the_Stigmata.jpg'
    }
  };

  /* Cria o HTML do lightbox */
  function criarLightbox() {
    var lb = document.createElement('div');
    lb.id = 'arteLightbox';
    lb.className = 'arte-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Detalhes da obra de arte');
    lb.innerHTML = [
      '<div class="arte-lightbox-backdrop"></div>',
      '<div class="arte-lightbox-panel">',
      '  <button class="arte-lightbox-close" id="arteLightboxClose" aria-label="Fechar">',
      '    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      '  </button>',
      '  <div class="arte-lightbox-inner">',
      '    <div class="arte-lightbox-img-wrap">',
      '      <img id="arteLightboxImg" src="" alt="" class="arte-lightbox-img">',
      '    </div>',
      '    <div class="arte-lightbox-info">',
      '      <h2 id="arteLightboxTitulo" class="arte-lightbox-titulo"></h2>',
      '      <dl class="arte-lightbox-meta">',
      '        <div class="arte-meta-row">',
      '          <dt>Autor</dt>',
      '          <dd id="arteLightboxAutor"></dd>',
      '        </div>',
      '        <div class="arte-meta-row">',
      '          <dt>Data</dt>',
      '          <dd id="arteLightboxData"></dd>',
      '        </div>',
      '        <div class="arte-meta-row">',
      '          <dt>Técnica</dt>',
      '          <dd id="arteLightboxTipo"></dd>',
      '        </div>',
      '        <div class="arte-meta-row">',
      '          <dt>Localização atual</dt>',
      '          <dd id="arteLightboxLocal"></dd>',
      '        </div>',
      '        <div class="arte-meta-row">',
      '          <dt>Pintado em</dt>',
      '          <dd id="arteLightboxOnde"></dd>',
      '        </div>',
      '      </dl>',
      '      <p id="arteLightboxContexto" class="arte-lightbox-contexto"></p>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    document.body.appendChild(lb);
    return lb;
  }

  /* Abre o lightbox com os dados da obra */
  function abrirLightbox(key) {
    var obra = obraData[key];
    if (!obra) return;

    var lb = document.getElementById('arteLightbox') || criarLightbox();

    document.getElementById('arteLightboxImg').src = obra.src;
    document.getElementById('arteLightboxImg').alt = obra.titulo + ' — ' + obra.autor;
    document.getElementById('arteLightboxTitulo').textContent = obra.titulo;
    document.getElementById('arteLightboxAutor').textContent = obra.autor;
    document.getElementById('arteLightboxData').textContent = obra.data;
    document.getElementById('arteLightboxTipo').textContent = obra.tipo;
    document.getElementById('arteLightboxLocal').textContent = obra.localizacao;
    document.getElementById('arteLightboxOnde').textContent = obra.ondefoi;
    document.getElementById('arteLightboxContexto').textContent = obra.contexto;

    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    /* Foco acessível */
    var closeBtn = document.getElementById('arteLightboxClose');
    if (closeBtn) closeBtn.focus();
  }

  /* Último elemento focusável que abriu o lightbox */
  var lastFocused = null;

  /* Fecha o lightbox */
  function fecharLightbox() {
    var lb = document.getElementById('arteLightbox');
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    /* Devolve foco ao elemento original */
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
  }

  /* Focus trap: mantém Tab/Shift+Tab dentro do lightbox */
  function trapFocus(e) {
    var lb = document.getElementById('arteLightbox');
    if (!lb || !lb.classList.contains('open')) return;
    var focusable = lb.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
  }

  /* Inicializa após o DOM estar pronto */
  function init() {
    /* Cria o lightbox no DOM */
    var lb = criarLightbox();
    lb.setAttribute('aria-hidden', 'true');

    /* Fecha ao clicar no backdrop ou no botão fechar */
    lb.querySelector('.arte-lightbox-backdrop').addEventListener('click', fecharLightbox);
    document.getElementById('arteLightboxClose').addEventListener('click', fecharLightbox);

    /* Fecha com Escape e gerencia focus trap */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharLightbox();
      else trapFocus(e);
    });

    /* Adiciona evento de clique a cada item de arte */
    var items = document.querySelectorAll('.arte-item[data-obra]');
    items.forEach(function (item) {
      item.style.cursor = 'pointer';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Ver detalhes da obra: ' + (item.getAttribute('data-titulo') || 'obra de arte'));

      item.addEventListener('click', function () {
        lastFocused = item;
        abrirLightbox(item.getAttribute('data-obra'));
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lastFocused = item;
          abrirLightbox(item.getAttribute('data-obra'));
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
