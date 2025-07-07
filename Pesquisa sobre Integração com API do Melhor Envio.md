# Pesquisa sobre Integração com API do Melhor Envio

## Resumo da Viabilidade
✅ **VIÁVEL** - A integração com a API do Melhor Envio é totalmente possível e gratuita.

## Principais Descobertas

### 1. Características da API
- **Gratuita**: Não há taxas ou mensalidades pelo uso da API
- **REST**: Padrão de arquitetura REST
- **Autenticação**: Bearer Token
- **Formato**: JSON
- **Endpoint base**: https://sandbox.melhorenvio.com.br/api/v2/ (sandbox)
- **Endpoint produção**: https://melhorenvio.com.br/api/v2/

### 2. Funcionalidades Disponíveis
- ✅ Cotação de fretes em tempo real
- ✅ Múltiplas transportadoras (Correios, transportadoras privadas)
- ✅ Cálculo automático de empacotamento
- ✅ Serviços adicionais (Aviso de Recebimento, Mãos Próprias)
- ✅ Customização de preços e prazos
- ✅ Compra de etiquetas (opcional)
- ✅ Rastreamento

### 3. Requisitos para Cotação
**Parâmetros obrigatórios:**
- CEP de origem
- CEP de destino
- Informações dos produtos (dimensões e peso)

**Formato dos dados:**
- Dimensões: centímetros (cm)
- Peso: quilogramas (kg)
- Valores: reais (R$)

### 4. Duas Formas de Implementação

#### Opção 1: Por Produtos (Recomendada)
```json
{
  "from": {"postal_code": "96020360"},
  "to": {"postal_code": "01018020"},
  "products": [
    {
      "id": "frigideira-15cm",
      "width": 15,
      "height": 5,
      "length": 15,
      "weight": 0.8,
      "insurance_value": 150.00,
      "quantity": 1
    }
  ]
}
```

#### Opção 2: Por Pacotes
```json
{
  "from": {"postal_code": "01002001"},
  "to": {"postal_code": "90570020"},
  "package": {
    "height": 4,
    "width": 12,
    "length": 17,
    "weight": 0.3
  },
  "options": {
    "insurance_value": 150.00
  }
}
```

### 5. Resposta da API
A API retorna:
- `custom_price`: Preço com customizações do usuário (recomendado)
- `custom_delivery_time`: Prazo com customizações (recomendado)
- `price`: Preço base
- `delivery_time`: Prazo base
- Informações da transportadora
- Serviços disponíveis

### 6. Processo de Implementação

#### Passo 1: Cadastro e Configuração
1. Criar conta no Melhor Envio
2. Criar aplicativo na seção "Integrações"
3. Obter token de acesso
4. Configurar CEP de origem

#### Passo 2: Implementação Técnica
1. Criar formulário de cotação no site
2. Implementar chamada à API via JavaScript/PHP
3. Exibir resultados formatados
4. Salvar cotação para uso posterior (opcional)

#### Passo 3: Headers Obrigatórios
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}
User-Agent: Fornax Utensílios (fornax@fornaxutensilios.com)
```

## Recomendação de Implementação

### Para o Site da Fornax:
1. **Implementar cotação simples** com os produtos existentes
2. **Usar a Opção 1 (por produtos)** - mais flexível
3. **Começar com sandbox** para testes
4. **Implementar apenas cotação** (não compra de etiquetas)

### Dimensões Estimadas dos Produtos:
- **Frigideira Profissional**: 30cm x 30cm x 8cm, ~1.5kg
- **Paellera Rasa**: 35cm x 35cm x 5cm, ~2.0kg  
- **Frigideira 15cm**: 15cm x 15cm x 5cm, ~0.8kg

### Fluxo Proposto:
1. Cliente seleciona produto
2. Cliente informa CEP de destino
3. Sistema faz cotação automática
4. Exibe opções de frete (econômico/expresso)
5. Cliente escolhe e finaliza reserva

## Próximos Passos:
1. ✅ Pesquisa concluída - API é viável
2. ⏳ Implementar formulário de cotação
3. ⏳ Integrar com API (sandbox)
4. ⏳ Testar com produtos reais
5. ⏳ Migrar para produção

## Observações Importantes:
- API gratuita, sem custos de integração
- Necessário cadastro no Melhor Envio
- Token de acesso obrigatório
- Suporte técnico disponível
- Documentação completa e atualizada

