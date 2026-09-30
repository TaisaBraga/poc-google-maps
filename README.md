# Perto — comércios próximos

Aplicação web responsiva para encontrar farmácias, supermercados e cafés próximos da localização do usuário. A visualização inicial mostra um mapa com pins customizados e um carrossel sobreposto na parte inferior. Também é possível alternar para uma lista ordenada por distância.

## Funcionalidades

- Solicita automaticamente a autorização de localização ao abrir a tela, quando a chave do Maps está configurada.
- Busca farmácias, supermercados/mercados e cafés em um raio de até **2 km**.
- Mostra os locais em pins customizados no Google Maps.
- Apresenta no carrossel os mesmos locais exibidos no mapa.
- Sincroniza a seleção: clicar em um pin destaca e traz o card correspondente para o carrossel; clicar no card destaca o pin.
- Dimensiona o mapa para metade da largura da janela e 70% da altura em telas maiores; no celular, usa quase toda a largura disponível.
- Permite alternar entre **Mapa** e **Lista**. Ambas as visualizações têm filtros por categoria; a lista é ordenada por distância.
- Exibe mensagens quando a localização, a chave ou a busca de locais falha.
- Inclui foco visível para navegação por teclado e respeita a preferência de movimento reduzido.

## Acessibilidade

- O documento declara o idioma `pt-BR`, ajudando leitores de tela a pronunciar o conteúdo corretamente.
- Os controles de alternância **Mapa** e **Lista**, filtros de categoria e cartões são botões nativos. Os estados selecionados são expostos com `aria-pressed`.
- O mapa tem uma região identificada para tecnologias assistivas, instruções para encontrar a alternativa em lista e uma região `aria-live` que anuncia o local selecionado.
- Os pins do mapa não entram individualmente na sequência de `Tab`, evitando muitas paradas. A visualização **Lista** é a alternativa operável por teclado: seus filtros e estabelecimentos podem ser percorridos e acionados normalmente.
- No carrossel, as setas esquerda e direita percorrem os cartões, e apenas o cartão ativo participa da sequência de `Tab`. Ao selecionar um local, o card correspondente permanece visível.
- Os botões e controles têm indicador de foco visível, incluindo tratamento para modo de alto contraste do sistema. Os estilos também respeitam `prefers-reduced-motion`.
- A interface adapta o mapa, a lista e o carrossel a telas estreitas e ampliações; o layout permite rolagem horizontal no carrossel.
- O estado de carregamento/erro de localização é comunicado com regiões de status ou alerta, e a atualização de resultados da lista é anunciada.

O ESLint configurado no projeto verifica JavaScript/TypeScript, Hooks do React e Fast Refresh, mas ainda não inclui um plugin específico para regras de acessibilidade JSX. Indicadores de foco e algumas combinações de contraste foram ajustados no CSS; isso não substitui uma auditoria WCAG completa. Faça validação manual com teclado, leitor de tela, zoom e telas estreitas antes de publicar. O Google Maps também tem controles próprios, então a lista é o caminho acessível para navegar pelos estabelecimentos sem percorrer cada pin.

## Tecnologias e dependências

### Dependências da aplicação

| Dependência | Uso |
| --- | --- |
| `react` | Componentes, estado e ciclo de vida da interface. |
| `react-dom` | Renderização da aplicação no navegador. |
| `@vis.gl/react-google-maps` | Componentes React para o Google Maps, mapa e marcadores avançados. |

### Dependências de desenvolvimento

| Dependência | Uso |
| --- | --- |
| `vite` | Servidor de desenvolvimento e build de produção. |
| `@vitejs/plugin-react` | Integração do React com Vite e Fast Refresh. |
| `typescript` | Tipagem estática e compilação do TypeScript. |
| `typescript-eslint` | Parser e regras do ESLint para TypeScript. |
| `eslint` | Análise estática do código. |
| `@eslint/js` | Regras recomendadas do ESLint para JavaScript. |
| `eslint-plugin-react-hooks` | Regras para uso correto dos Hooks do React. |
| `eslint-plugin-react-refresh` | Validação de componentes compatíveis com Fast Refresh. |
| `globals` | Definições de variáveis globais do navegador usadas pelo ESLint. |
| `@types/react`, `@types/react-dom` | Tipos do React e React DOM. |
| `@types/node` | Tipos do Node usados pela configuração do Vite. |

O projeto não usa MUI. Os estilos são CSS próprio, separados dos componentes.

## Configuração do Google Maps

Crie ou edite `.env.local` na raiz do projeto:

```env
VITE_GOOGLE_MAPS_API_KEY=sua_chave_do_google_maps
# Opcional: use um Map ID criado no Google Cloud para substituir o ID de demonstração.
VITE_GOOGLE_MAP_ID=seu_map_id
```

O arquivo `.env.local` é ignorado pelo Git (`*.local`) e não deve ser enviado ao repositório. Como variáveis `VITE_` são incluídas no código do navegador, restrinja a chave no Google Cloud a **Maps JavaScript API** e **Places API (New)** e configure restrições de HTTP referrer para os domínios da aplicação.

O mapa usa `DEMO_MAP_ID` quando `VITE_GOOGLE_MAP_ID` não está definido. O Google disponibiliza esse ID para testes com Advanced Markers; em produção, configure um Map ID próprio. O projeto Google Cloud também precisa ter faturamento e as APIs necessárias habilitadas.

Depois de criar ou alterar `.env.local`, reinicie o servidor de desenvolvimento para o Vite carregar as variáveis.

## Executar o projeto

```bash
npm install
npm run dev
```

O Vite mostra o endereço local no terminal. A geolocalização funciona em contexto seguro, como `localhost` ou uma página servida por HTTPS. Ao abrir a tela, o navegador solicita autorização para compartilhar a localização. Se a permissão tiver sido bloqueada anteriormente, altere-a nas configurações do navegador e recarregue a página.

Comandos disponíveis:

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # verifica os tipos e gera o build em dist/
npm run lint     # executa o ESLint
npm run preview  # serve localmente o build de produção
```

## Organização por Atomic Design

Os componentes visuais ficam em `src/components`, agrupados por responsabilidade:

- **atoms**: peças pequenas, como pins, chips e ícones.
- **molecules**: combinações simples, como o card de um local.
- **organisms**: áreas completas da interface, como mapa, lista e carrossel.

Os tipos ficam em `src/types.ts`, os dados compartilhados em `src/data.ts`, e cada componente mantém seu CSS em arquivo separado.

## Arquivos do projeto

### Aplicação e lógica

| Arquivo | Responsabilidade |
| --- | --- |
| `src/App.tsx` | Controla localização, resultados, seleção, erros e alternância entre mapa e lista; conecta os componentes à API. |
| `src/types.ts` | Tipos compartilhados `Category`, `Place` e `ViewMode`. |
| `src/data.ts` | Rótulos, ícones e nomes das categorias reutilizados pela interface. |
| `src/hooks/useUserLocation.ts` | Solicita e armazena a localização do navegador, o estado de carregamento e erros de geolocalização. |

### Componentes — atoms

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/atoms/PlacePin.tsx` | Pin customizado com símbolo por categoria e estado selecionado. |
| `src/components/atoms/CategoryChip.tsx` | Botão de filtro de categoria com estado pressionado acessível. |
| `src/components/atoms/Icon.tsx` | Revestimento simples para ícones decorativos. |

### Componentes — molecules

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/molecules/PlaceCard.tsx` | Card reutilizável com nome, categoria, endereço, distância e avaliação quando disponível. |

### Componentes — organisms

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/organisms/MapPanel.tsx` | Renderiza o Google Maps, solicita locais com Nearby Search (New), calcula distância em linha reta, aplica o limite de 2 km e ordena os resultados. Também mostra o pin do usuário, os pins dos locais, a legenda e erros de busca. |
| `src/components/organisms/PlaceCarousel.tsx` | Lista horizontal dos locais no modo mapa; mantém o card selecionado visível e encaminha seleções ao mapa. |
| `src/components/organisms/PlaceExplorer.tsx` | Visualização em lista, filtros por categoria e locais em ordem de proximidade. |

## Busca e seleção dos locais

Com a permissão de localização e a chave configurada, `MapPanel` consulta a Places API (New) para as categorias de farmácia, supermercado/mercado e café. A busca limita a área a 2.000 metros; os resultados são filtrados novamente pela distância geodésica calculada no cliente e ordenados da menor para a maior distância. O card do carrossel e o pin compartilham o mesmo ID do local para manter a seleção sincronizada.

Os dados dependem da cobertura da Google Places API na região e das permissões, APIs e faturamento configurados no projeto Google Cloud.
