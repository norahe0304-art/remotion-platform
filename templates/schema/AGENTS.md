# templates/schema/
> L2 | Parent: templates/AGENTS.md → AGENTS.md

Template schema definition and example templates for B2B video generation.

## Members

- template-schema.json: JSON Schema (draft-07) defining the template format — variables, scenes, animations, brandPresets.
- examples/b2b-showcase.json: B2B product showcase template (hero video for SaaS landing pages).
- examples/social-ads.json: Short-form vertical social ad template (Instagram/TikTok).
- examples/product-launch.json: Multi-scene product launch announcement template (X/LinkedIn).

## Schema Concepts

- **variables**: Replaceable content slots (text, color, image, number, url, font) with defaults.
- **scenes**: Ordered sequence of timed scenes, each with elements and transition effects.
- **animations**: Reusable animation presets (spring, interpolate, sequence) referenced by name.
- **brandPresets**: One-click brand themes that override variable defaults for colors, fonts, logos.
- **category**: Use-case tag for filtering (b2b-showcase, social-ads, product-launch, explainer, testimonial, event-promo).

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
