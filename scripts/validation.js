/* ===== VALIDAÇÃO E SANITIZAÇÃO DE FORMULÁRIOS ===== */
(function () {
  /* Remove caracteres perigosos para XSS e injeção SQL */
  function sanitizeText(value) {
    return value
      .replace(/[<>]/g, '')             /* Remove delimitadores de tag HTML */
      .replace(/--/g, '')               /* Remove comentários SQL de linha */
      .replace(/\/\*/g, '')             /* Remove início de comentário SQL de bloco */
      .replace(/\*\//g, '')             /* Remove fim de comentário SQL de bloco */
      .replace(/[;\\]/g, '')            /* Remove ponto-e-vírgula e barra invertida */
      .replace(/javascript\s*:/gi, ''); /* Remove javascript: URI scheme */
  }

  /* Remove tudo que não seja letra (incluindo acentuadas), espaço, hífen ou apóstrofo */
  function sanitizeName(value) {
    return value
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'\-]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart();
  }

  /* Valida nome: ao menos 2 e no máximo 100 caracteres permitidos */
  function isValidName(value) {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]{2,100}$/.test(value.trim());
  }

  /* Exibe mensagem de erro abaixo de um campo */
  function showError(input, message) {
    var errorEl = document.getElementById(input.id + '-error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', input.id + '-error');
  }

  /* Remove mensagem de erro de um campo */
  function clearError(input) {
    var errorEl = document.getElementById(input.id + '-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  /* === Formulário de Contato === */
  var form = document.querySelector('.contact-form');
  if (form) {
    var nomeInput     = document.getElementById('nome');
    var emailInput    = document.getElementById('email');
    var assuntoInput  = document.getElementById('assunto');
    var mensagemInput = document.getElementById('mensagem');

    /* Sanitiza o campo nome em tempo real (whitelist de caracteres) */
    if (nomeInput) {
      nomeInput.addEventListener('input', function () {
        var cleaned = sanitizeName(this.value);
        if (cleaned !== this.value) this.value = cleaned;
        clearError(this);
      });
    }

    /* Sanitiza assunto e mensagem em tempo real (blacklist de caracteres perigosos) */
    [assuntoInput, mensagemInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        var cleaned = sanitizeText(this.value);
        if (cleaned !== this.value) this.value = cleaned;
        clearError(this);
      });
    });

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        clearError(this);
      });
    }

    /* Validação e sanitização final antes do envio */
    form.addEventListener('submit', function (e) {
      var valid = true;

      if (nomeInput) {
        nomeInput.value = sanitizeName(nomeInput.value);
        if (!isValidName(nomeInput.value)) {
          e.preventDefault();
          showError(nomeInput, 'O nome deve conter apenas letras, espaços, hífens e apóstrofos (mínimo 2 caracteres).');
          valid = false;
        }
      }

      if (emailInput && !emailInput.validity.valid) {
        e.preventDefault();
        showError(emailInput, 'Digite um endereço de e-mail válido.');
        valid = false;
      }

      if (assuntoInput) {
        assuntoInput.value = sanitizeText(assuntoInput.value);
        if (!assuntoInput.value.trim()) {
          e.preventDefault();
          showError(assuntoInput, 'O assunto não pode estar vazio.');
          valid = false;
        }
      }

      if (mensagemInput) {
        mensagemInput.value = sanitizeText(mensagemInput.value);
        if (!mensagemInput.value.trim()) {
          e.preventDefault();
          showError(mensagemInput, 'A mensagem não pode estar vazia.');
          valid = false;
        }
      }

      return valid;
    });
  }

  /* === Intenção de Oração (oratorio.html) === */
  var intencaoInput = document.getElementById('intencaoInput');
  if (intencaoInput) {
    intencaoInput.addEventListener('input', function () {
      var cleaned = sanitizeText(this.value);
      if (cleaned !== this.value) this.value = cleaned;
    });
  }

})();
