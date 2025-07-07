// Formatação do CEP
function formatCEP(value) {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
}

// Aplicar formatação ao campo CEP
document.getElementById("cep-input").addEventListener("input", function(e) {
    e.target.value = formatCEP(e.target.value);
});

// Função para validar CEP
function isValidCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, "");
    return cleanCEP.length === 8;
}

// Função para formatar preço
function formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(price);
}

// Função para criar card de resultado
function createResultCard(option) {
    const card = document.createElement("div");
    card.className = "result-card";
    
    const deliveryTime = option.custom_delivery_time || option.delivery_time || "N/A";
    const price = option.custom_price || option.price || 0;
    
    card.innerHTML = `
        <div class="result-header">
            <div class="company-info">
                <img src="${option.company.picture || "https://via.placeholder.com/40x40"}" alt="${option.company.name}" class="company-logo">
                <div>
                    <h4>${option.company.name}</h4>
                    <p>${option.name}</p>
                </div>
            </div>
            <div class="result-price">
                <span class="price">${formatPrice(price)}</span>
                <span class="delivery-time">${deliveryTime} dias úteis</span>
            </div>
        </div>
        <div class="result-actions">
            <button class="btn-primary btn-select" onclick="selectShipping(\'${option.id}\', ${price}, \'${option.company.name}\', \'${option.name}\', ${deliveryTime})">
                Selecionar
            </button>
        </div>
    `;
    
    return card;
}

// Função para selecionar frete
function selectShipping(serviceId, price, companyName, serviceName, deliveryTime) {
    // Salvar seleção no localStorage para uso posterior
    const shippingData = {
        serviceId,
        price,
        companyName,
        serviceName,
        deliveryTime,
        selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem("selectedShipping", JSON.stringify(shippingData));
    
    // Mostrar confirmação
    alert(`Frete selecionado:\n${companyName} - ${serviceName}\n${formatPrice(price)} em ${deliveryTime} dias úteis\n\nRedirecionando para reserva...`);
    
    // Redirecionar para página de reserva
    window.location.href = "reserva.html";
}

// Função principal para calcular frete
async function calculateShipping() {
    const productSelect = document.getElementById("product-select");
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    
    if (!selectedOption.value) {
        throw new Error("Selecione um produto");
    }
    
    const productData = {
        id: selectedOption.value,
        width: parseFloat(selectedOption.dataset.width),
        height: parseFloat(selectedOption.dataset.height),
        length: parseFloat(selectedOption.dataset.length),
        weight: parseFloat(selectedOption.dataset.weight),
        price: parseFloat(selectedOption.dataset.price)
    };
    
    const cepDestino = document.getElementById("cep-input").value.replace(/\D/g, "");
    const cepOrigem = "02469120"; // CEP fixo da sede
    
    // Dados para a API do Melhor Envio
    const requestData = {
        from: {
            postal_code: cepOrigem
        },
        to: {
            postal_code: cepDestino
        },
        products: [
            {
                id: productData.id,
                width: productData.width,
                height: productData.height,
                length: productData.length,
                weight: productData.weight,
                insurance_value: productData.price,
                quantity: 1 // Assumindo 1 unidade para cotação simples
            }
        ],
        options: {
            receipt: false,
            own_hand: false
        }
    };
    
    // Para demonstração, vamos simular a resposta da API
    // Em produção, você faria a chamada real para a API do Melhor Envio
    return simulateAPIResponse(requestData);
}

// Função para simular resposta da API (para demonstração)
function simulateAPIResponse(requestData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const basePrice = requestData.products[0].insurance_value * 0.05; // 5% do valor do produto
            const weight = requestData.products[0].weight * requestData.products[0].quantity;
            
            const mockResponse = [
                {
                    id: 1,
                    name: "PAC",
                    price: basePrice + (weight * 5),
                    custom_price: basePrice + (weight * 5),
                    delivery_time: 8,
                    custom_delivery_time: 8,
                    company: {
                        id: 1,
                        name: "Correios",
                        picture: "https://www.melhorenvio.com.br/images/shipping-companies/correios.png"
                    }
                },
                {
                    id: 2,
                    name: "SEDEX",
                    price: basePrice + (weight * 8),
                    custom_price: basePrice + (weight * 8),
                    delivery_time: 3,
                    custom_delivery_time: 3,
                    company: {
                        id: 1,
                        name: "Correios",
                        picture: "https://www.melhorenvio.com.br/images/shipping-companies/correios.png"
                    }
                },
                {
                    id: 17,
                    name: "Normal",
                    price: basePrice + (weight * 6),
                    custom_price: basePrice + (weight * 6),
                    delivery_time: 5,
                    custom_delivery_time: 5,
                    company: {
                        id: 4,
                        name: "JadLog",
                        picture: "https://www.melhorenvio.com.br/images/shipping-companies/jadlog.png"
                    }
                }
            ];
            
            resolve(mockResponse);
        }, 1500); // Simula delay da API
    });
}

// Event listener para o botão de calcular frete
document.getElementById("calculate-shipping-btn").addEventListener("click", async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target;
    const resultsSection = document.getElementById("shipping-results");
    let errorSection = document.getElementById("error-message");
    
    // Validações
    const cepDestino = document.getElementById("cep-input").value;
    if (!isValidCEP(cepDestino)) {
        showError("CEP de destino inválido. Digite um CEP válido com 8 dígitos.");
        return;
    }

    const productSelect = document.getElementById("product-select");
    if (!productSelect.value) {
        showError("Selecione um produto para calcular o frete.");
        return;
    }
    
    // Esconder seções anteriores
    resultsSection.innerHTML = ""; // Limpa resultados anteriores
    resultsSection.style.display = "none";
    if (errorSection) errorSection.style.display = "none"; // Esconde o erro se já existia
    
    // Mostrar loading (se houver um spinner ou texto de loading)
    submitBtn.disabled = true;
    submitBtn.textContent = "Calculando..."; // Ou adicione um spinner
    
    try {
        const shippingOptions = await calculateShipping();
        
        if (shippingOptions && shippingOptions.length > 0) {
            displayResults(shippingOptions);
        } else {
            showError("Nenhuma opção de frete encontrada para este CEP e produto.");
        }
    } catch (error) {
        console.error("Erro ao calcular frete:", error);
        showError(error.message || "Erro ao calcular frete. Tente novamente.");
    } finally {
        // Restaurar botão
        submitBtn.disabled = false;
        submitBtn.textContent = "Calcular Frete";
    }
});

// Função para exibir resultados
function displayResults(options) {
    const resultsContainer = document.getElementById("shipping-results");
    
    resultsContainer.innerHTML = ""; // Limpa resultados anteriores
    
    // Ordenar por preço
    options.sort((a, b) => (a.custom_price || a.price) - (b.custom_price || b.price));
    
    options.forEach(option => {
        const card = createResultCard(option);
        resultsContainer.appendChild(card);
    });
    
    resultsContainer.style.display = "block";
    
    // Scroll suave para os resultados
    resultsContainer.scrollIntoView({ behavior: "smooth" });
}

// Função para exibir erro
function showError(message) {
    let errorSection = document.getElementById("error-message");
    if (!errorSection) {
        errorSection = document.createElement("div");
        errorSection.id = "error-message";
        errorSection.className = "error-message";
        document.querySelector(".calculator-form").insertBefore(errorSection, document.getElementById("shipping-results"));
    }
    errorSection.innerHTML = `<div class="error-icon">&#x2716;</div><div class="error-content"><h4>Erro:</h4><p>${message}</p></div>`;
    errorSection.style.display = "flex"; // Usar flex para alinhar ícone e texto
    
    // Scroll suave para o erro
    errorSection.scrollIntoView({ behavior: "smooth" });
}

// Animação de entrada (se aplicável)
document.addEventListener("DOMContentLoaded", function() {
    // Seções que podem ter animação, ajuste conforme seu CSS
    const sections = document.querySelectorAll(".shipping-calculator");
    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        setTimeout(() => {
            section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }, 100);
    });
});



