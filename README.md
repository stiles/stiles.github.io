# mattstiles.me

Personal portfolio site for Matt Stiles, a data journalist and software
builder.

[View the live site](https://mattstiles.me/)

## Stack

- Jekyll 4.3 and Liquid
- Custom CSS and vanilla JavaScript
- GitHub Pages
- Formspree for the contact form

The site started from the Freelancer Jekyll theme but no longer uses its
Bootstrap, jQuery or remote-theme setup.

## Local development

Install the Ruby dependencies, then start Jekyll with live reload:

```bash
bundle install
bundle exec jekyll serve --livereload
```

The site runs at [localhost:4000](http://localhost:4000).

Build the site and check the generated HTML and links:

```bash
bundle exec rake test
```

To build without running the checks:

```bash
bundle exec jekyll build
```

Jekyll writes generated files to `_site/`. Do not edit that directory.

## Add or update a project

Projects live in `_data/projects.yml`. The comments at the top of that file
document every supported field.

1. Add or edit a project in `_data/projects.yml`.
2. Set `bucket` to a key from `_data/buckets.yml`.
3. Add the relevant links and tag groups.
4. If the project has an image, add matching `.webp` and `.jpg` files to
   `img/portfolio/`.
5. Preview the site and run `bundle exec rake test`.

A typical project looks like this:

```yaml
- title: Project name
  bucket: other-people-use
  blurb: A short description of what the project does.
  img: project-name
  w: 900
  h: 600
  alt: A concise description of the image
  url: https://example.com
  repo: https://github.com/example/project
  does: [Data extraction, Mapping]
  domain: Aviation
  built: [Python, CLI]
```

The `img` value is the extensionless base name shared by the WebP and JPEG
files. Omit `img`, `w`, `h` and `alt` for a text-only card.

Projects follow their order in `_data/projects.yml` within each bucket, with
image cards displayed before text-only cards. Bucket order comes from
`_data/buckets.yml`. Only one project should have `featured: true`.

## Site structure

```text
_config.yml              Site metadata, colors and service settings
_data/
  buckets.yml            Work section names and order
  projects.yml           Portfolio content
_includes/               Reusable HTML partials
_layouts/
  home.html              Home page composition
  style.css              Main CSS source
img/portfolio/           Project image pairs
js/site.js               Navigation, dialogs and page animations
style.css                Jekyll entry point for the main stylesheet
Rakefile                 Build and HTML checks
```

`_layouts/home.html` assembles the single-page site from files in `_includes/`.
Jekyll processes `_layouts/style.css` through the root `style.css` file so the
stylesheet can use values from `_config.yml`.

## Deployment

Push to `main`. GitHub Pages builds and publishes the site at
[mattstiles.me](https://mattstiles.me/). Analytics load only in the production
Jekyll environment.
