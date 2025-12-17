# Social Preview Image Specification

## Required Dimensions
- **Size**: 1200 x 630 pixels
- **Format**: PNG or JPEG
- **Max file size**: 8 MB (aim for under 1 MB)
- **Color profile**: RGB

## Design Requirements

### Layout
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Vizor Logo]                                  │
│                                                 │
│  Turn Spreadsheets Into                        │
│  Stunning Visualizations                       │
│                                                 │
│  ─────────────────                             │
│                                                 │
│  • 20+ Chart Types                             │
│  • Real-Time Editing                           │
│  • One-Click Export                            │
│                                                 │
│  [Sample Chart Visualization]                   │
│                                                 │
│  getvizor.vercel.app                           │
└─────────────────────────────────────────────────┘
```

### Typography
- **Headline**: Bold, 72-80px, Primary color (#4F46E5)
- **Features**: Regular, 32-36px, White or light gray
- **URL**: Medium, 28-32px, Accent color (#06B6D4)
- **Font**: Inter or similar sans-serif

### Color Scheme
- **Background**: Deep gradient from #1E293B to #0F172A
- **Primary**: Indigo #4F46E5
- **Accent**: Teal #06B6D4
- **Text**: White #FFFFFF

### Visual Elements
1. **Logo** (top-left, 120x120px)
2. **Background blur circles** (subtle, 20% opacity)
3. **Sample chart** (colorful bar/line chart, bottom-center)
4. **Decorative elements** (sparkle icons, gradient lines)

## Platform-Specific Previews

### Twitter/X Card
- Uses same 1200x630 image
- Appears below tweet with title and description

### Facebook Link Preview
- Uses same 1200x630 image
- Shows title, description, and domain

### LinkedIn Share
- Uses same 1200x630 image
- Professional appearance important

### Discord/Slack Embeds
- Uses same 1200x630 image
- Shows as rich embed with title

## Tools to Create

### Free Options
1. **Canva** (easiest)
   - Template: Social Media > Facebook Post
   - Resize to 1200x630
   - Use Vizor colors and branding

2. **Figma** (most control)
   - Create 1200x630 frame
   - Export as PNG at 2x resolution
   - Compress with TinyPNG

3. **Photopea** (Photoshop alternative)
   - Free online editor
   - Layer-based editing

### Quick Template (HTML/CSS)
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; font-family: 'Inter', sans-serif; }
    .og-image {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
      position: relative;
      overflow: hidden;
    }
    .blur-circle-1 {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: #4F46E5;
      opacity: 0.15;
      border-radius: 50%;
      filter: blur(80px);
    }
    .blur-circle-2 {
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 500px;
      height: 500px;
      background: #06B6D4;
      opacity: 0.1;
      border-radius: 50%;
      filter: blur(100px);
    }
    .content {
      position: relative;
      z-index: 10;
      padding: 80px 100px;
      color: white;
    }
    .logo {
      width: 100px;
      height: 100px;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 76px;
      font-weight: 800;
      margin: 0 0 30px 0;
      line-height: 1.1;
      background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .features {
      font-size: 32px;
      margin: 30px 0;
      opacity: 0.9;
    }
    .feature {
      margin: 15px 0;
    }
    .url {
      font-size: 28px;
      color: #06B6D4;
      margin-top: 40px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="og-image">
    <div class="blur-circle-1"></div>
    <div class="blur-circle-2"></div>
    <div class="content">
      <img src="vizor-logo.jpeg" class="logo" alt="Vizor Logo">
      <h1>Turn Spreadsheets Into<br>Stunning Visualizations</h1>
      <div class="features">
        <div class="feature">✨ 20+ Chart Types</div>
        <div class="feature">⚡ Real-Time Editing</div>
        <div class="feature">📊 One-Click Export</div>
      </div>
      <div class="url">getvizor.vercel.app</div>
    </div>
  </div>
</body>
</html>
```

## Implementation

### 1. Create Image
- Use Canva or Figma with above specifications
- Export as PNG
- Compress with TinyPNG or Squoosh

### 2. Add to Project
```bash
# Save as: public/og-image.png
```

### 3. Update index.html
```html
<meta property="og:image" content="https://getvizor.vercel.app/og-image.png">
<meta name="twitter:image" content="https://getvizor.vercel.app/og-image.png">
```

### 4. Test Previews
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Checklist
- [ ] Create 1200x630 image with Vizor branding
- [ ] Include key features and value proposition
- [ ] Save as public/og-image.png
- [ ] Update meta tags in index.html
- [ ] Test on Twitter, Facebook, LinkedIn
- [ ] Verify image loads correctly
- [ ] Check mobile preview

## Example URLs for Inspiration
- https://og-playground.vercel.app/
- https://www.opengraph.xyz/
- https://metatags.io/

---

**Priority**: HIGH - Affects social sharing, which is crucial for virality and organic growth.
