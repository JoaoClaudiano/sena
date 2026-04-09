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
      /* Sempre impede o envio nativo (evita redirecionamento ao formspree.io) */
      e.preventDefault();

      var valid = true;

      if (nomeInput) {
        nomeInput.value = sanitizeName(nomeInput.value);
        if (!isValidName(nomeInput.value)) {
          showError(nomeInput, 'O nome deve conter apenas letras, espaços, hífens e apóstrofos (mínimo 2 caracteres).');
          valid = false;
        }
      }

      if (emailInput && !emailInput.validity.valid) {
        showError(emailInput, 'Digite um endereço de e-mail válido.');
        valid = false;
      }

      if (assuntoInput) {
        assuntoInput.value = sanitizeText(assuntoInput.value);
        if (!assuntoInput.value.trim()) {
          showError(assuntoInput, 'O assunto não pode estar vazio.');
          valid = false;
        }
      }

      if (mensagemInput) {
        mensagemInput.value = sanitizeText(mensagemInput.value);
        if (!mensagemInput.value.trim()) {
          showError(mensagemInput, 'A mensagem não pode estar vazia.');
          valid = false;
        }
      }

      if (!valid) return;

      /* Envia via fetch para evitar redirecionamento */
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            /* Substitui o formulário por mensagem de sucesso */
            var successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.setAttribute('role', 'alert');
            successDiv.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
              '<h3>Mensagem enviada!</h3>' +
              '<p>Obrigado por entrar em contato. Sua mensagem foi recebida com atenção e retornaremos em breve.</p>' +
              '<p style="font-style:italic;font-size:0.9rem;">Santa Catarina de Sena, rogai por nós.</p>';
            form.parentNode.replaceChild(successDiv, form);
          } else {
            /* Erro HTTP do servidor */
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Enviar mensagem';
            }
            var errorDiv = document.getElementById('form-send-error');
            if (!errorDiv) {
              errorDiv = document.createElement('p');
              errorDiv.id = 'form-send-error';
              errorDiv.className = 'form-send-error';
              errorDiv.setAttribute('role', 'alert');
              form.insertBefore(errorDiv, form.firstChild);
            }
            errorDiv.textContent = 'Não foi possível enviar a mensagem. Por favor, tente novamente ou escreva diretamente para jooclaudiano@gmail.com.';
          }
        })
        .catch(function () {
          /* Erro de rede */
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar mensagem';
          }
          var errorDiv = document.getElementById('form-send-error');
          if (!errorDiv) {
            errorDiv = document.createElement('p');
            errorDiv.id = 'form-send-error';
            errorDiv.className = 'form-send-error';
            errorDiv.setAttribute('role', 'alert');
            form.insertBefore(errorDiv, form.firstChild);
          }
          errorDiv.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
        });
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
