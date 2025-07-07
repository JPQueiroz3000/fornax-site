// Formatação do telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
    }
    
    e.target.value = value;
});

// Validação e envio do formulário
document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validação básica
    const nome = form.nome.value.trim();
    const sobrenome = form.sobrenome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const produto = form.produto.value;
    const concordo = form.concordo.checked;
    
    if (!nome || !sobrenome || !email || !telefone || !produto || !concordo) {
        alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    
    // Validação de telefone
    const telefoneClean = telefone.replace(/\D/g, '');
    if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        alert('Por favor, insira um número de telefone válido.');
        return;
    }
    
    // Mostrar loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Preparar dados para envio
    const formData = new FormData(form);
    
    // Enviar via fetch
    fetch('enviar-reserva.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Esconder formulário e mostrar mensagem de sucesso
            document.querySelector('.form-container').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
        } else {
            throw new Error(data.message || 'Erro ao enviar reserva');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar reserva. Tente novamente ou entre em contato conosco.');
        
        // Restaurar botão
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    });
});

// Animação de entrada
document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        formContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 100);
});

