# Atlas — Travel Story

A cinematic scroll film in seven photographic layers.

Yours to use, free. Designed and built by Tamer Abou Omar.
Portfolio: https://portfolio.tamerao.workers.dev

## Run it

You need [Node.js](https://nodejs.org) 18 or newer. In this folder:

```bash
npm install
npm run dev
```

That prints a local address (usually http://localhost:5173). Open it and you
have the site running. Edit `src/AtlasSite.jsx` for the content and
`src/atlas.css` for the look; the page reloads as you save.

## Put it online

```bash
npm run build
```

That writes a `dist/` folder of plain static files. Any host will serve it:

- **Netlify** — drag `dist` onto https://app.netlify.com/drop
- **Vercel** — `npx vercel deploy --prod`
- **Cloudflare** — `npx wrangler pages deploy dist`
- **Your own hosting** — upload the contents of `dist` to the web root

## Make it yours

1. **Words.** All the copy is in `src/AtlasSite.jsx`. Change it in place.
2. **Colours and type.** Both live at the top of `src/atlas.css` as custom
   properties, so one edit reaches the whole page. The webfont is loaded by
   `useTemplateFont` inside the component; point it at any Google Fonts URL.
3. **Media.** The demo images are hosted remotely and are placeholders. Drop your own into a `public/` folder and reference them as `/your-image.jpg`.
   Replace them before going live: they are there to show the layout, and they
   are not licensed for your project.

## Want it done for you?

Send your copy, photos and brand and I will have it live on your domain, with
SSL and a working contact form, inside a week. WhatsApp +961 70477595 or email
tamerabouomar1@gmail.com.

## License

The template code is free to use for personal and commercial projects, and you
do not need to credit me. You may not resell or redistribute the template
itself. The placeholder photography, video and fonts belong to their own
owners and are not covered by this.
