# CT Finger Team

Site institucional do CT Finger Team, academia de lutas em Canela, RS. A página apresenta as modalidades, horários, professores, planos, galeria e canais de contato.

## Tecnologias

- HTML
- CSS
- JavaScript

## Como abrir

Não é necessário instalar dependências nem executar uma etapa de build:

1. Abra `index.html` diretamente no navegador; ou
2. Abra a pasta no VS Code e use uma extensão como Live Server.

Mantenha `style.css`, `script.js` e a pasta `assets/image` nos caminhos relativos usados pelo HTML.

## Estrutura

- `index.html` — conteúdo e estrutura da página.
- `style.css` — estilos, animações e layouts responsivos.
- `script.js` — menu, navegação, horários, galeria ampliada e interações.
- `assets/image/` — fotos e imagens usadas no site.

## Contatos e conteúdo

Os links de WhatsApp, Instagram e Google Maps ficam em `index.html`. As mensagens pré-preenchidas do WhatsApp são configuradas pelo atributo `data-wa`, processado em `script.js`.

As imagens e seus textos alternativos também são definidos em `index.html`. Ao trocar uma foto, mantenha o caminho sincronizado nos atributos `src` e, quando aplicável, `href` da galeria.
