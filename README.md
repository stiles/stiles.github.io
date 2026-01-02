# mattstiles.me

Personal portfolio site for Matt Stiles, data journalist.

**Live site:** [mattstiles.me](https://mattstiles.me/)

## Local development

```bash
# Install dependencies (first time only)
bundle install

# Run the site locally
bundle exec jekyll serve

# Site runs at http://localhost:4000
```

If you get errors about missing gems, try:
```bash
bundle update
```

## Adding a new project

1. Add a thumbnail image to `img/portfolio/` (recommended: ~900×650px, will be cropped to 3:2)

2. Create a new file in `_posts/` with this format:
   ```
   YYYY-MM-DD-project-name.markdown
   ```

3. Use this front matter template:
   ```yaml
   ---
   layout: default
   title: Project Name
   modal-id: 10  # increment from the highest existing modal-id
   date: 2025-01-15
   img: project-thumbnail.png
   alt: Brief image description
   project-date: 2025
   client: Personal project  # or "Open source", "Data project", etc.
   category: Python, JavaScript, D3  # tools/technologies used
   description: Project description with optional <a href="https://example.com">links</a>.
   ---
   ```

4. Projects display newest to oldest by the `date` field.

## Project structure

```
_config.yml          # Site settings, colors, social links
_posts/              # Portfolio projects (displayed as modals)
_includes/           # HTML partials
  ├── head.html      # Meta tags, CSS links
  ├── nav.html       # Navigation
  ├── header.html    # Hero section with about content
  ├── portfolio_grid.html
  ├── modals.html    # Project detail modals
  ├── contact_static.html
  ├── footer.html
  └── css/main.css   # Main stylesheet
_layouts/            # Page templates
img/
  ├── portfolio/     # Project thumbnails
  ├── profile.png    # Profile photo
  └── og-image.png   # Social sharing image
```

## Configuration

Key settings in `_config.yml`:

- `title`, `description`, `url` — site metadata
- `color.primary`, `color.secondary` — theme colors (hex without #)
- `social` — social media links shown in footer

## Deployment

Push to `main` branch. GitHub Pages automatically builds and deploys.

The site uses:
- Jekyll with the [Freelancer theme](https://github.com/jeromelachaud/freelancer-theme) (remote)
- GitHub Pages for hosting
- Formspree for contact form

## Useful commands

```bash
# Build without serving (outputs to _site/)
bundle exec jekyll build

# Serve with live reload
bundle exec jekyll serve --livereload

# Serve and show drafts
bundle exec jekyll serve --drafts
```
