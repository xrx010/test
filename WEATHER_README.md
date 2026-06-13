# 🌤️ Weather Dashboard

Um dashboard interativo de previsão do tempo que integra a API pública OpenWeatherMap. Visualize o clima em tempo real com previsões detalhadas de 5 dias e informações por hora.

## ✨ Características

### 🌍 Funcionalidades Principais

- **Busca de Cidades** - Pesquise qualquer cidade do mundo
- **Localização Automática** - Use sua localização GPS para buscar clima local
- **Sugestões em Tempo Real** - Autocomplete ao digitar o nome da cidade
- **Cidades Favoritas** - Salve cidades para acesso rápido
- **Dados em Tempo Real** - Integração com OpenWeatherMap API

### 📊 Informações Disponíveis

#### Clima Atual
- 🌡️ Temperatura em tempo real
- 💨 Velocidade do vento
- 💧 Umidade do ar
- 🌅 Horário de nascer/pôr do sol
- 🌡️ Sensação térmica
- 🌪️ Pressão atmosférica
- 👁️ Visibilidade
- ☁️ Nebulosidade

#### Previsão de 5 Dias
- 📅 Dia da semana e data
- 🎯 Temperatura máxima e mínima
- 📝 Descrição das condições
- 💧 Umidade esperada
- 💨 Velocidade do vento

#### Previsão por Hora
- ⏰ Próximas 12 horas
- 🌡️ Temperatura horária
- 🎯 Condições climáticas
- 📊 Detalhes completos

### 🎨 Interface Intuitiva

- **Design Responsivo** - Funciona em desktop, tablet e mobile
- **Animações Suaves** - Transições elegantes e fluidas
- **Ícones Emoji** - Representação visual clara do tempo
- **Cards Interativos** - Hover effects e feedback visual
- **Paleta Moderna** - Gradientes azuis e roxos

## 🚀 Como Usar

### Abrindo o Dashboard

1. Abra `weather-dashboard.html` em um navegador
2. O dashboard carregará com dados de São Paulo automaticamente

### Buscando uma Cidade

1. Digite o nome da cidade na barra de busca
2. Clique em "Buscar" ou pressione Enter
3. Sugestões aparecerão conforme você digita
4. Selecione a cidade desejada

### Usando Localização

1. Clique no botão "📍 Localização"
2. Aceite a solicitação de geolocalização
3. Os dados de sua localização atual serão carregados

### Gerenciando Favoritos

- ⭐ As cidades buscadas são automaticamente adicionadas aos favoritos
- 🔗 Clique em uma cidade favorita para recarregar seus dados
- ✕ Clique no ✕ para remover de favoritos
- 💾 Favoritos são salvos no LocalStorage

## 🔧 Tecnologia

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Gradientes, flexbox, grid e animações
- **JavaScript Vanilla** - Sem dependências externas

### API
- **OpenWeatherMap** - API gratuita de clima
  - Endpoint de Dados Atuais: `/data/2.5/weather`
  - Endpoint de Previsão: `/data/2.5/forecast`
  - Endpoint Geográfico: `/geo/1.0/direct`

### Armazenamento
- **LocalStorage** - Persistência de cidades favoritas

## 📊 Estrutura de Dados

### Resposta da API - Clima Atual
```json
{
  "main": {
    "temp": 25.5,
    "feels_like": 24.2,
    "humidity": 65,
    "pressure": 1013
  },
  "weather": [
    {
      "main": "Clear",
      "description": "Céu limpo"
    }
  ],
  "wind": {
    "speed": 5.2
  },
  "sys": {
    "sunrise": 1686564000,
    "sunset": 1686610800
  }
}
```

### Resposta da API - Previsão
```json
{
  "list": [
    {
      "dt": 1686567600,
      "main": {
        "temp": 24.3,
        "temp_max": 26.1,
        "temp_min": 22.5,
        "humidity": 68
      },
      "weather": [{"main": "Clouds"}],
      "wind": {"speed": 4.1}
    }
  ]
}
```

## 💾 Armazenamento Local

### Favoritos
```javascript
[
  {
    "city": "São Paulo",
    "country": "BR",
    "temperature": 25
  }
]
```

## 🎯 Mapeamento de Ícones

O dashboard mapeia condições climáticas para emojis:

| Condição | Emoji |
|----------|-------|
| Clear | ☀️ |
| Clouds | ☁️ |
| Rain | 🌧️ |
| Thunderstorm | ⛈️ |
| Snow | ❄️ |
| Mist/Fog | 🌫️ |
| Tornado | 🌪️ |

## 🔐 API Key

**Nota:** A API key incluída é limitada. Para uso em produção:

1. Cadastre-se em [OpenWeatherMap](https://openweathermap.org/)
2. Obtenha sua chave gratuita
3. Substitua `this.apiKey` em `weather.js`

## 📱 Responsividade

- **Desktop (>768px)** - Layout completo com 4 colunas
- **Tablet (768px)** - Layout adaptado com 2 colunas
- **Mobile (<480px)** - Layout único otimizado para toque

## 🚦 Tratamento de Erros

- ✅ Validação de cidades
- ✅ Fallback para São Paulo se não encontrar
- ✅ Feedback visual de erro
- ✅ Botão "Tentar Novamente"
- ✅ Mensagens claras em português

## 🔄 Atualizações

- Dados atualizados em tempo real
- Timestamp de última atualização
- Clique para recarregar manualmente
- Auto-refresh a cada pesquisa

## 🎬 Roadmap Futuro

- [ ] Previsão de 14 dias
- [ ] Índice UV
- [ ] Qualidade do ar (AQI)
- [ ] Alertas climáticos
- [ ] Múltiplas unidades de temperatura
- [ ] Modo escuro/claro
- [ ] Comparação entre cidades
- [ ] Gráficos de temperatura
- [ ] Integração com calendário
- [ ] Notificações push

## 🐛 Troubleshooting

### "Cidade não encontrada"
- Verifique a ortografia
- Use o código do país (ex: "São Paulo, BR")
- Selecione a sugestão correta

### "Geolocalização negada"
- Permita acesso ao navegador
- Verifique privacidade do navegador
- Use uma cidade favorita como alternativa

### Dados não atualizam
- Recarregue a página
- Limpe o cache do navegador
- Verifique conexão com internet

## 📄 Licença

Projeto de demonstração com dados da OpenWeatherMap (API gratuita).

---

**🌤️ Feito para amantes de meteorologia! 🌍**

*Versão 1.0 - Weather Dashboard*