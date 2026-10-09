# mare-cosmin.ro

Source for [mare-cosmin.ro](https://mare-cosmin.ro), my portfolio site, in Romanian for local clients and in English at [/en/](https://mare-cosmin.ro/en/) for hiring managers.

A static site in plain HTML, CSS and JavaScript, with no framework and no build step, hosted on GitHub Pages.

## Features

- Two languages sharing one stylesheet and one script; the script picks its strings from the page's `lang`
- Accessibility basics: skip link, keyboard-friendly navigation and a `details`-based experience list
- Stat counters that show the real numbers without JavaScript and animate when they come into view
- Contact form posting to Web3Forms, with a honeypot field against bots
- SEO: canonical and `hreflang` links, Open Graph and Twitter cards, JSON-LD (Person, WebSite, ProfilePage), sitemap and robots.txt

## Structure

```
index.html        Romanian page
en/index.html     English page
styles.css        shared styles
scripts.js        nav, scroll progress, counters, form handling
public/           logos and images
sitemap.xml, robots.txt, site.webmanifest, CNAME
```

## Running locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Any static file server works. Pushing to `main` deploys through GitHub Pages.

---

[Cosmin Mare](https://mare-cosmin.ro/en/) · [contact@mare-cosmin.ro](mailto:contact@mare-cosmin.ro)
