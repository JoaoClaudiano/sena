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
    },
    'demonios': {
      titulo: 'Santa Catarina Assediada pelos Demônios',
      autor: 'Anônimo (escola italiana)',
      data: 'Século XVII',
      tipo: 'Óleo sobre tela',
      localizacao: 'Coleção eclesiástica / museu',
      ondefoi: 'Itália',
      contexto: 'Esta composição retrata as tentações e provações espirituais que Santa Catarina enfrentou em sua vida de oração. Em suas cartas e no Diálogo, ela descreve longos períodos de aridez espiritual e assaltos de visões perturbadoras — que ela suportou com fé inabalável, reconhecendo-os como provas de Deus. A santa, em meio a criaturas demoníacas, mantém a serenidade da fé e o olhar fixo em Cristo.',
      src: 'imagens/St_Catherine_of_Siena_besieged_by_demons.jpg'
    },
    'catarina-escrevendo': {
      titulo: 'Santa Catarina de Sena Escrevendo',
      autor: 'Anônimo (escola italiana)',
      data: 'Século XVII–XIX',
      tipo: 'Óleo sobre tela',
      localizacao: 'Coleção privada / acervo eclesiástico',
      ondefoi: 'Itália',
      contexto: 'Esta cena evoca a extraordinária produção intelectual de Santa Catarina. Analfabeta até a vida adulta, ela ditou cerca de 380 cartas e o Diálogo da Divina Providência a secretários, entre eles o beato Raimundo de Cápua. Em 1970, Paulo VI a declarou Doutora da Igreja — a primeira mulher a receber esse título.',
      src: 'imagens/Catherine_of_Siena_writing.jpg'
    },
    'catherine-de-ricci': {
      titulo: 'Santa Catarina de Ricci',
      autor: 'Anônimo (escola florentina)',
      data: 'Século XVII–XVIII',
      tipo: 'Óleo sobre tela',
      localizacao: 'Convento de San Vincenzo, Prato, Itália',
      ondefoi: 'Florença / Prato, Itália',
      contexto: 'Catarina de Ricci (1522–1590) foi uma freira dominicana florentina que viveu no Convento de San Vincenzo em Prato. Profundamente inspirada pela espiritualidade de Santa Catarina de Sena, ela recebeu os estigmas de Cristo e experimentou êxtases em que reviveu a Paixão cada semana por doze anos. Foi canonizada por Bento XIV em 1746.',
      src: 'imagens/Catherine-de-ricci.jpg'
    },
    'plautilla-nelli': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Plautilla Nelli',
      data: 'Século XVI',
      tipo: 'Óleo sobre tela / têmpera',
      localizacao: 'Convento de Santa Catarina de Siena, Florença, Itália',
      ondefoi: 'Florença, Itália',
      contexto: 'Plautilla Nelli (1524–1588), freira dominicana do Convento de Santa Catarina em Florença, foi a primeira pintora documentada da cidade. Autodidacta, ela produziu obras de arte religiosa para seu convento e para igrejas florentinas. Como dominicana, compartilhava a herança espiritual de Catarina, conferindo à obra uma devoção particular e genuína.',
      src: 'imagens/St._Catherine_of_Siena_painted_by_Plautilla_Nelli.jpg'
    },
    'carlo-dolci': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Atribuído a Carlo Dolci',
      data: 'c. 1650–1680',
      tipo: 'Óleo sobre tela',
      localizacao: 'Coleção privada / museu italiano',
      ondefoi: 'Florença, Itália',
      contexto: 'Carlo Dolci (1616–1686) foi um dos mais devotos pintores barrocos de Florença, célebre por representações de santos e da Virgem com expressão de intensa interioridade espiritual. Seu estilo refinado e contemplativo torna esta obra atribuída um exemplo eloquente da espiritualidade mística que Santa Catarina representou para a arte italiana do século XVII.',
      src: 'imagens/santa catarina de sena pintura atribuida ao pintor barroco italiano Carlo Dolci.png'
    },
    'alessandro-franchi': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Alessandro Franchi',
      data: 'Século XIX',
      tipo: 'Óleo sobre tela',
      localizacao: 'Siena, Itália',
      ondefoi: 'Siena, Itália',
      contexto: 'Alessandro Franchi (1838–1914) foi um pintor sienense do movimento purista, profundamente influenciado pelos primitivos italianos e pela arte medieval de sua cidade natal. Nascido em Siena como Santa Catarina, trouxe à representação da padroeira um sentimento de reverência e pertencimento local, celebrando sua herança espiritual com sensibilidade oitocentista.',
      src: 'imagens/catarina siena Alessandro Franchi.JPG'
    },
    'catarina-rosario-roma': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Anônimo',
      data: 'Século XIX–XX',
      tipo: 'Pintura mural / óleo sobre tela',
      localizacao: 'Igreja de Santa Maria del Rosario in Prati, Roma, Itália',
      ondefoi: 'Roma, Itália',
      contexto: 'A Igreja de Santa Maria del Rosario in Prati, em Roma, é um templo dominicano dedicado ao culto do Rosário. A representação de Santa Catarina neste espaço sagrado insere-se na rica tradição iconográfica da Ordem dos Pregadores, que venerou Catarina como modelo de vida mística, apostolado e amor à Igreja.',
      src: 'imagens/Saint Catherine of Siena. From chiesa di Santa Maria del Rosario in Prati, Roma.jpg'
    },
    'catarina-caleruega': {
      titulo: 'Santa Catarina de Sena — Convento de Caleruega',
      autor: 'Anônimo',
      data: 'Século XIX–XX',
      tipo: 'Pintura religiosa',
      localizacao: 'Convento das Freiras Dominicanas, Caleruega, Espanha',
      ondefoi: 'Caleruega, Burgos, Espanha',
      contexto: 'Caleruega, na província de Burgos, é a terra natal de São Domingos de Gusmão, fundador da Ordem dos Pregadores. O convento dominicano ali estabelecido preserva a memória do fundador e venera os santos da Ordem, entre eles Santa Catarina de Sena. Esta imagem evoca os laços profundos entre a espiritualidade de Catarina e as origens da tradição dominicana.',
      src: "imagens/catarina - the Dominican nuns' convent at Caleruega, Spain.jpg"
    },
    'catalina-siena': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Anônimo',
      data: 'Século XVII–XIX',
      tipo: 'Óleo sobre tela',
      localizacao: 'Acervo eclesiástico',
      ondefoi: 'Itália / Espanha',
      contexto: 'Retrato devocional de Santa Catarina de Sena exibindo os atributos iconográficos tradicionais da santa: o hábito branco e negro dominicano, o lírio da pureza, o livro das Escrituras e, por vezes, a coroa de espinhos — símbolo de sua participação nos sofrimentos de Cristo. A imagem expressa séculos de devoção popular à Mística de Siena.',
      src: 'imagens/catalina-siena.jpg'
    },
    'catarina-de-sena': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Anônimo',
      data: 'Século XVII–XIX',
      tipo: 'Óleo sobre tela',
      localizacao: 'Acervo eclesiástico',
      ondefoi: 'Itália',
      contexto: 'Representação clássica de Santa Catarina, figura central da espiritualidade cristã do século XIV. Conselheira de papas, reformadora da Igreja e Doutora da Igreja, Catarina (1347–1380) viveu apenas 33 anos, mas sua influência atravessou séculos. Em 1999, João Paulo II a proclamou co-padroeira da Europa ao lado de Santa Brígida da Suécia e Santa Edith Stein.',
      src: 'imagens/catarina de sena.jpg'
    },
    'catarina-retrato': {
      titulo: 'Retrato de Santa Catarina de Sena',
      autor: 'Anônimo',
      data: 'Século XVII–XIX',
      tipo: 'Óleo sobre tela',
      localizacao: 'Acervo eclesiástico / coleção privada',
      ondefoi: 'Itália',
      contexto: 'Imagem devocional que captura a serenidade e a força espiritual de Santa Catarina. Seu rosto concentra séculos de devoção popular e a memória viva de uma mulher que, por meio de cartas, visões e ações concretas, transformou a história da Igreja com palavras de fogo e um amor ardente a Deus.',
      src: 'imagens/catarina.jpg'
    },
    'sena-retrato': {
      titulo: 'Santa Catarina de Sena',
      autor: 'Anônimo',
      data: 'Século XIX–XX',
      tipo: 'Pintura religiosa',
      localizacao: 'Acervo eclesiástico',
      ondefoi: 'Itália',
      contexto: 'Imagem inspirada na espiritualidade mística de Santa Catarina de Sena, Virgem, Doutora da Igreja e co-padroeira da Europa e da Itália. A data de sua festa litúrgica, 29 de abril, é celebrada em todo o mundo católico como um convite à contemplação, à caridade e ao compromisso com a unidade da Igreja.',
      src: 'imagens/sena.jpg'
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

    /* Adiciona evento de clique a cada item de arte (homepage e siena.html) */
    var items = document.querySelectorAll('.arte-item[data-obra], .art-piece[data-obra]');
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
