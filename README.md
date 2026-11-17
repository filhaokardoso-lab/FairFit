# FairFit — Fair Fit Doceria

Site estático em português, feito com as 17 imagens fornecidas pela marca.

## Recursos

- Layout responsivo, animações suaves e controle de movimento.
- Vitrine com 16 fotos de doces, filtros, busca e detalhes ampliados.
- Sacolinha com quantidades, persistência local e remoção de itens.
- Geração e cópia de uma mensagem para consulta pelo Instagram.
- Navegação por teclado, diálogos nativos, descrições de imagens e preferência por movimento reduzido.

## Conteúdo comercial

Os nomes e as descrições dos doces foram organizados de forma descritiva a partir das fotos. Devem ser confirmados pela marca, assim como a composição, os alérgenos, as embalagens e os sabores oficiais. Não foram fornecidos preços, telefone, endereço ou horários, portanto o site apresenta valores e disponibilidade sob consulta e usa o perfil `@fairfitdoceria` que aparece nas embalagens.

A sacolinha prepara uma consulta. Não processa pagamentos nem confirma encomendas. O visitante copia a seleção e a envia manualmente no atendimento.

## Editar e executar

Os produtos estão no início de `app.js`. O conteúdo está em `index.html`, os estilos em `styles.css` e as fotos em `assets`.

Não há dependências ou etapa de compilação. Sirva a raiz do projeto com qualquer servidor HTTP estático. Para verificar a sintaxe do JavaScript, execute `node --check app.js`.

## GitHub Pages

O projeto está pronto para publicação pelo GitHub Pages a partir da branch `main`, na pasta raiz (`/`). O arquivo `.nojekyll` preserva a distribuição estática sem processamento Jekyll.

As fontes DM Sans e Cormorant Garamond são distribuídas com suas licenças SIL Open Font License na pasta de assets.
