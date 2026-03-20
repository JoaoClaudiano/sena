/* ===== STATUS DO SISTEMA NO RODAPÉ ===== */
/*
 * Exibe indicadores dinâmicos na seção "Status do Sistema" do rodapé:
 *   - Indicador de disponibilidade (online/offline)
 *   - Total de visitas (tabela `visitas`)
 *   - Total de velas acesas (tabela `velas`)
 *   - Data de lançamento (fixa)
 *   - Horário da última atualização bem-sucedida
 *
 * Atualiza automaticamente a cada 5 minutos.
 * Requer: scripts/supabase.js já carregado (window.SupabaseSena disponível).
 */
(function () {
  var INTERVALO_MS = 5 * 60 * 1000; /* 5 minutos */

  var elOnline     = document.getElementById('statusOnline');
  var elVisitas    = document.getElementById('totalVisitas');
  var elVelas      = document.getElementById('totalVelas');
  var elAtualizacao = document.getElementById('ultimaAtualizacao');

  /* Nenhum elemento de status presente nesta página — encerra silenciosamente */
  if (!elOnline && !elVisitas && !elVelas && !elAtualizacao) return;

  /* Define estado de carregamento inicial */
  function setCarregando() {
    if (elVisitas)    elVisitas.textContent    = 'carregando…';
    if (elVelas)      elVelas.textContent      = 'carregando…';
    if (elAtualizacao) elAtualizacao.textContent = '—';
  }

  /* Aplica estado de erro: mostra aviso e marca status offline */
  function setErro() {
    if (elOnline) {
      elOnline.textContent = '🔴 Offline';
      elOnline.className   = 'status-badge status-offline';
    }
    if (elVisitas)    elVisitas.textContent    = '⚠️ Indisponível';
    if (elVelas)      elVelas.textContent      = '⚠️ Indisponível';
  }

  /* Formata um número com separadores de milhar em português */
  function formatar(n) {
    return Number(n).toLocaleString('pt-BR');
  }

  /* Retorna o horário atual formatado como HH:MM:SS */
  function horaAtual() {
    var d = new Date();
    var pad = function (v) { return String(v).padStart(2, '0'); };
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  /* Busca os totais no Supabase e atualiza os elementos do DOM */
  function atualizarStatus() {
    var sena = window.SupabaseSena;

    /* Se o módulo Supabase ainda não estiver disponível, marca erro e tenta mais tarde */
    if (!sena) {
      setErro();
      return;
    }

    Promise.all([
      sena.contarVisitas(),
      sena.contarVelas()
    ]).then(function (resultados) {
      var totalVisitas = resultados[0];
      var totalVelas   = resultados[1];

      /* Indicador de disponibilidade — online */
      if (elOnline) {
        elOnline.textContent = '🟢 Online';
        elOnline.className   = 'status-badge status-online';
      }

      if (elVisitas)    elVisitas.textContent    = formatar(totalVisitas);
      if (elVelas)      elVelas.textContent      = formatar(totalVelas);
      if (elAtualizacao) elAtualizacao.textContent = horaAtual();

    }).catch(function () {
      setErro();
    });
  }

  /* Inicializa com estado de carregamento e depois busca os dados */
  setCarregando();

  /*
   * Aguarda o supabase.js inicializar (ele usa `defer`, assim como este script).
   * Se window.SupabaseSena já estiver disponível, executa imediatamente;
   * caso contrário, aguarda o evento DOMContentLoaded como garantia extra.
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', atualizarStatus);
  } else {
    atualizarStatus();
  }

  /* Atualiza a cada 5 minutos */
  setInterval(atualizarStatus, INTERVALO_MS);
})();
