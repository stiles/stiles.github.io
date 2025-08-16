# mattstiles.me improvement plan

Product requirements document for the Jekyll portfolio website.

## Current state

### Site structure
- Single-page Jekyll site using Freelancer Bootstrap theme
- Remote theme: `jeromelachaud/freelancer-theme`
- Sections: header, portfolio, about, contact, footer
- 3 portfolio projects displayed in modals
- Contact form via Formspree
- Social media links (GitHub, Twitter, TikTok, LinkedIn)

### What works
- Responsive design
- Contact form submits to Formspree
- Bootstrap framework handles mobile layout
- Social media links function
- Displays journalism background

### Technical stack
- Jekyll 4.3
- Bootstrap CSS framework
- Font Awesome icons
- jQuery for interactions
- Remote theme architecture

## Missing features

### Content and visibility

**Portfolio expansion**
- Shows only 3 projects
- Project descriptions are brief
- No case studies or detailed write-ups
- Missing links to live demos and GitHub repos

**SEO and discoverability** 
- No OpenGraph meta tags for social sharing
- No Twitter card integration
- No Google Analytics tracking
- Basic meta descriptions only

### Design and user experience
**Visual updates**
- Green color scheme needs refresh (#7F9F80 - evaluate if this is the right brand color)
- Typography hierarchy unclear
- Loading performance slow
- Images not compressed or responsive

**Portfolio/Projects section improvements**
- No overlay text or titles on project images
- No hover effects to show project names ("DodgersData.bot", "LA trees", "Locations collection")
- Missing project descriptions or teasers to entice clicks
- No visual feedback when hovering over projects
- Images alone don't communicate what projects are about

**Contact section issues**
- Section appears too tall with excessive white space
- Form could be more compact and visually appealing
- Layout feels unbalanced compared to other sections

**Footer enhancements**
- Current footer is basic - could be more elegant like DodgersData.bot footer
- Consider cleaner design with better visual hierarchy
- Social links could be styled more prominently

**Navigation**
- Mobile menu could be clearer
- Smooth scroll stutters

**Accessibility**
- Images missing alt text
- No ARIA labels
- Color contrast needs validation
- Keyboard navigation untested

### Technical gaps
**Performance**
- Images not compressed or converted to WebP
- CSS and JS not minified
- No caching headers
- No lazy loading for images

**Security**
- Contact form lacks CSRF protection
- No Content Security Policy headers
- Dependencies need regular updates

**Development workflow**
- No GitHub Actions for deployment
- No Lighthouse CI for performance monitoring
- No automated testing

## Implementation plan

### Phase 1: foundation (weeks 1-2)

**Content audit**
- Add 2-3 projects to portfolio
- Write detailed project case studies
- Create downloadable resume/CV
- Update existing content

**SEO basics**
- Add OpenGraph meta tags
- Add Twitter cards
- Set up Google Analytics
- Create sitemap.xml

### Phase 2: design refresh (weeks 3-4)
**Portfolio section enhancements**
- Add overlay text/titles to project images
- Create hover effects that reveal project names and descriptions
- Add project teasers or short descriptions visible on hover
- Improve visual feedback for interactive elements
- Consider adding subtle animations or transitions

**Visual updates**
- Evaluate and potentially update color palette (current: #7F9F80)
- Fix typography hierarchy (font selection, sizing, spacing)
- Update button and form styling
- Create consistent spacing system

**Contact section improvements**
- Reduce excessive white space and section height
- Create more compact, visually appealing form design
- Better balance layout proportions with other sections
- Consider adding visual elements or improved styling

**Footer redesign**
- Create more elegant footer similar to DodgersData.bot
- Improve visual hierarchy and layout
- Style social links more prominently
- Add subtle design elements for visual interest

**Performance optimization**
- Compress and optimize all images
- Add responsive image loading
- Minify CSS and JavaScript
- Add caching strategies

**Mobile experience**
- Fix mobile navigation
- Test touch interactions
- Test across devices

### Phase 3: advanced features (weeks 5-6)
**Additional functionality**
- Add search for blog posts
- Add tag and category system
- Create project filtering
- Add reading time estimates

**Analytics and monitoring**
- Set up conversion tracking
- Add error monitoring
- Add performance dashboards
- Create backup strategies

**Accessibility compliance**
- WCAG 2.1 AA compliance audit
- Screen reader testing
- Keyboard navigation fixes
- Color contrast optimization

## Success metrics

### Traffic and engagement
- Increase organic search traffic by 50%
- Improve average session duration
- Reduce bounce rate below 60%
- Increase contact form submissions

### Performance benchmarks
- Lighthouse performance score >90
- Page load time <3 seconds
- Mobile usability score 100%
- Core Web Vitals passing

### Content goals
- Publish 2-3 blog posts monthly
- Showcase 6+ portfolio projects
- Maintain 95%+ uptime
- Generate 10+ contact inquiries monthly

## Technical requirements

### Hosting and deployment
- Continue using GitHub Pages
- Add automated deployments
- Set up staging environment
- Monitor site availability

### Browser support
- Chrome, Safari, Firefox latest 2 versions
- Mobile Safari and Chrome
- Basic IE11 support for government users

### Integrations
- Formspree contact form (existing)
- Google Analytics 4
- Social media sharing
- Newsletter signup (future consideration)

## Content strategy

### Blog topics
- Data journalism techniques
- Python and JavaScript tutorials
- LA-focused data stories
- Industry insights and trends
- Project case studies

### Portfolio expansion
- CNN graphics work (permission-dependent)
- Personal data projects
- Open source contributions
- Speaking engagements
- Workshop materials

## Risk mitigation

### Technical risks
- Remote theme updates breaking customizations
- Third-party service dependencies (Formspree)
- GitHub Pages limitations

### Content risks  
- Employer restrictions on showcasing work
- Copyright considerations for news content
- Maintaining regular publishing schedule

### Mitigation strategies
- Fork and customize theme locally
- Have backup contact form solution
- Clear content usage guidelines
- Editorial calendar with buffer content

## Next steps

1. **Immediate actions**
   - Set up development environment
   - Create feature branch for blog implementation
   - Audit current content for improvements

2. **Week 1 priorities**
   - Blog index page creation
   - Navigation updates
   - Basic SEO implementation

3. **Ongoing tasks**
   - Content creation pipeline
   - Performance monitoring
   - User feedback collection

---

**Document version:** 1.0  
**Last updated:** Aug 2025
