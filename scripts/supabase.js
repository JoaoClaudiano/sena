/* ===== INTEGRAÇÃO SUPABASE ===== */
/*
 * Configurações do Supabase.
 *
 * Tabela: velas
 *   - id          bigint       PK, auto increment
 *   - created_at  timestamptz  default now()
 *   - localizacao geography(POINT,4326) nullable
 *   - intencao    text         nullable
 *   - user_id     uuid         nullable
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
  var SUPABASE_URL = 'https://pndwwldjhmblwylwlazk.supabase.co';
  /* Chave anônima (publishable) — segura para expor no frontend; segurança garantida pelas políticas RLS do Supabase */
  var SUPABASE_ANON_KEY = 'sb_publishable_ws2eOKUZ-WpLtln-D1OxXg_FiPNHWTO';

  /* Coordenadas de Siena, Itália — fallback quando geolocalização não está disponível */
  var FALLBACK_LAT = 43.3186;
  var FALLBACK_LNG = 11.3305;
  var GEOLOCATION_TIMEOUT = 8000;

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
      /* Ignora silenciosamente o erro de tabela inexistente (migração ainda não aplicada no Supabase) */
      if (result.error && !/Could not find the table/i.test(result.error.message)) {
        console.warn('[Supabase] Erro ao registrar visita:', result.error.message);
      }
    });
  }

  /*
   * Parseia hex EWKB para extrair latitude e longitude de um ponto PostGIS.
   * PostgREST retorna colunas geography como strings hex EWKB.
   * @param {string} hex - String hex EWKB
   * @returns {{ latitude: number, longitude: number } | null}
   */
  function parseEWKBPoint(hex) {
    if (!hex || typeof hex !== 'string') return null;
    try {
      var bytes = [];
      for (var i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.slice(i, i + 2), 16));
      }
      var le = bytes[0] === 1;
      function read4(offset) {
        if (le) {
          return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] * 0x1000000)) >>> 0;
        }
        return (bytes[offset] * 0x1000000 + ((bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3])) >>> 0;
      }
      function readDouble(offset) {
        var buf = new ArrayBuffer(8);
        var view = new DataView(buf);
        for (var j = 0; j < 8; j++) { view.setUint8(j, bytes[offset + j]); }
        return view.getFloat64(0, le);
      }
      var typeFlags = read4(1);
      var hasSRID = (typeFlags & 0x20000000) !== 0;
      var coordOffset = 5 + (hasSRID ? 4 : 0);
      var lng = readDouble(coordOffset);
      var lat = readDouble(coordOffset + 8);
      if (isNaN(lat) || isNaN(lng)) return null;
      return { latitude: lat, longitude: lng };
    } catch (e) {
      return null;
    }
  }

  /*
   * Insere uma vela acesa no banco de dados.
   * Usa coordenadas de Siena como fallback se a localização não for fornecida.
   * @param {number|null} latitude
   * @param {number|null} longitude
   * @param {string|null} intencao
   * @returns {Promise}
   */
  function acenderVela(latitude, longitude, intencao) {
    if (!db) return Promise.resolve(null);
    var lat = (typeof latitude === 'number' && isFinite(latitude)) ? latitude : FALLBACK_LAT;
    var lng = (typeof longitude === 'number' && isFinite(longitude)) ? longitude : FALLBACK_LNG;
    var localizacao = 'POINT(' + lng + ' ' + lat + ')';
    return db.from('velas').insert({
      localizacao: localizacao,
      intencao: intencao || null
    }).then(function (result) {
      if (result.error) console.warn('[Supabase] Erro ao acender vela:', result.error.message);
      return result;
    });
  }

  /*
   * Compatibilidade com código legado — delega para acenderVela.
   * @param {object} opts - { latitude, longitude, intencao }
   * @returns {Promise}
   */
  function salvarVela(opts) {
    opts = opts || {};
    return acenderVela(opts.latitude, opts.longitude, opts.intencao);
  }

  /*
   * Busca velas com coordenadas para exibir no mapa.
   * @returns {Promise<Array>} Array de objetos { latitude, longitude, created_at, intencao }
   */
  function buscarVelasParaMapa() {
    if (!db) return Promise.resolve([]);
    return db
      .from('velas')
      .select('localizacao, created_at, intencao')
      .not('localizacao', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500)
      .then(function (result) {
        if (result.error) {
          console.warn('[Supabase] Erro ao buscar velas:', result.error.message);
          return [];
        }
        return (result.data || []).map(function (v) {
          var coords = parseEWKBPoint(v.localizacao);
          if (!coords) return null;
          return {
            latitude: coords.latitude,
            longitude: coords.longitude,
            created_at: v.created_at,
            intencao: v.intencao
          };
        }).filter(Boolean);
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

  /*
   * Conta o total de visitas registradas.
   * @returns {Promise<number>}
   */
  function contarVisitas() {
    if (!db) return Promise.resolve(0);
    return db
      .from('visitas')
      .select('id', { count: 'exact', head: true })
      .then(function (result) {
        if (result.error) return 0;
        return result.count || 0;
      });
  }

  /*
   * Obtém a geolocalização do usuário via API do navegador.
   * Retorna coordenadas de Siena como fallback se a permissão for negada ou não houver suporte.
   * @returns {Promise<{ latitude: number, longitude: number }>}
   */
  function obterLocalizacao() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) {
        resolve({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        function () {
          resolve({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
        },
        { timeout: GEOLOCATION_TIMEOUT, enableHighAccuracy: false }
      );
    });
  }

  /* Expõe as funções globalmente para uso nos outros scripts */
  window.SupabaseSena = {
    acenderVela: acenderVela,
    salvarVela: salvarVela,
    buscarVelasParaMapa: buscarVelasParaMapa,
    contarVelas: contarVelas,
    contarVisitas: contarVisitas,
    obterLocalizacao: obterLocalizacao,
    registrarVisita: registrarVisita
  };

  /* Registra a visita automaticamente */
  registrarVisita();
})();
