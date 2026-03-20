/* ===== INTEGRAÇÃO SUPABASE ===== */
/*
 * Configurações do Supabase.
 * Substitua SUPABASE_URL e SUPABASE_ANON_KEY pelas credenciais do seu projeto.
 *
 * Estrutura do banco de dados esperada:
 *
 * Tabela: velas
 *   - id          uuid         PK, default gen_random_uuid()
 *   - created_at  timestamptz  default now()
 *   - latitude    float8       nullable  (geolocalização)
 *   - longitude   float8       nullable  (geolocalização)
 *   - city        text         nullable  (cidade estimada)
 *   - country     text         nullable  (país)
 *   - country_code text        nullable  (código do país, ex: "BR")
 *   - device_type text         nullable  ("mobile" | "desktop" | "tablet")
 *   - session_id  text         nullable  (identificador anônimo da sessão)
 *
 * Tabela: visitas
 *   - id          uuid         PK, default gen_random_uuid()
 *   - created_at  timestamptz  default now()
 *   - page        text         (ex: "index", "oratorio", "biografia")
 *   - session_id  text         nullable
 *   - device_type text         nullable
 *   - referrer    text         nullable
 */

(function () {
  var SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
  var SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';

  /* Inicializa o cliente Supabase se a biblioteca estiver carregada */
  var db = null;
  if (typeof window !== 'undefined' && window.supabase) {
    try {
      db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('[Supabase] Falha ao inicializar cliente:', e);
    }
  }

  /* Detecta tipo de dispositivo */
  function detectDevice() {
    var ua = navigator.userAgent || '';
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
    if (/iPad|Tablet/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  /* Obtém ou cria um ID de sessão anônimo */
  function getSessionId() {
    var key = 'sena_session_id';
    var sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).slice(2, 14) + '_' + Date.now();
      sessionStorage.setItem(key, sid);
    }
    return sid;
  }

  /*
   * Registra uma visita de página no banco de dados.
   * Chamado automaticamente ao carregar qualquer página.
   */
  function registrarVisita() {
    if (!db) return;
    var page = window.location.pathname.replace(/.*\//, '').replace('.html', '') || 'index';
    db.from('visitas').insert({
      page: page,
      session_id: getSessionId(),
      device_type: detectDevice(),
      referrer: document.referrer || null
    }).then(function (result) {
      if (result.error) console.warn('[Supabase] Erro ao registrar visita:', result.error.message);
    });
  }

  /*
   * Salva uma vela acesa no banco de dados.
   * @param {object} opts - { latitude, longitude, city, country, country_code }
   * @returns {Promise}
   */
  function salvarVela(opts) {
    if (!db) return Promise.resolve(null);
    opts = opts || {};
    return db.from('velas').insert({
      latitude: opts.latitude || null,
      longitude: opts.longitude || null,
      city: opts.city || null,
      country: opts.country || null,
      country_code: opts.country_code || null,
      device_type: detectDevice(),
      session_id: getSessionId()
    }).then(function (result) {
      if (result.error) console.warn('[Supabase] Erro ao salvar vela:', result.error.message);
      return result;
    });
  }

  /*
   * Busca todas as velas com coordenadas para exibir no mapa.
   * @returns {Promise<Array>} Array de objetos { latitude, longitude, created_at }
   */
  function buscarVelasParaMapa() {
    if (!db) return Promise.resolve([]);
    return db
      .from('velas')
      .select('latitude, longitude, created_at, country')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500)
      .then(function (result) {
        if (result.error) {
          console.warn('[Supabase] Erro ao buscar velas:', result.error.message);
          return [];
        }
        return result.data || [];
      });
  }

  /*
   * Conta o total de velas acesas.
   * @returns {Promise<number>}
   */
  function contarVelas() {
    if (!db) return Promise.resolve(0);
    return db
      .from('velas')
      .select('id', { count: 'exact', head: true })
      .then(function (result) {
        if (result.error) return 0;
        return result.count || 0;
      });
  }

  /* Expõe as funções globalmente para uso nos outros scripts */
  window.SupabaseSena = {
    salvarVela: salvarVela,
    buscarVelasParaMapa: buscarVelasParaMapa,
    contarVelas: contarVelas,
    registrarVisita: registrarVisita
  };

  /* Registra a visita automaticamente */
  registrarVisita();
})();
