# Teach Charlie AI Launch Video

## 🎬 Project Overview

This is a Remotion + Three.js project that creates a professional launch video for Teach Charlie AI, combining:
- 6 video clips showcasing the platform
- 6 different 3D transitions between clips
- Animated 3D intro and outro
- Background music support
- 1080p HD output

## 🚀 Getting Started

### 1. Preview the Video

```bash
npm run dev
```

This opens the Remotion Studio at http://localhost:3000 where you can:
- Preview the "LaunchVideo" composition
- Scrub through the timeline
- Adjust timing and effects

### 2. Video Structure

**Total Duration**: ~80 seconds (2,400 frames at 30fps)

| Section | Duration | Description |
|---------|----------|-------------|
| Intro | 3s | 3D animated Teach Charlie logo |
| Overview Clip | 12s | Platform overview |
| Transition 1 | 1s | Cube flip effect |
| Build Clip | 12s | Agent building process |
| Transition 2 | 1s | Page flip effect |
| Work Clip | 12s | Agent handling tasks |
| Transition 3 | 1s | Sphere morph effect |
| Refine Clip | 12s | Optimization features |
| Transition 4 | 1s | Ripple wave effect |
| Route Clip | 12s | Human routing |
| Transition 5 | 1s | Particle explosion |
| Analytics Clip | 12s | Dashboard insights |
| Outro | 5s | Call to action + URL |

### 3. Adding Background Music (Optional)

1. Find a royalty-free music track (recommended: upbeat, inspirational, 60-80 seconds)
   - **Sources**: Epidemic Sound, Artlist, YouTube Audio Library, Uppbeat
   - **Style**: Tech/corporate, moderate tempo, non-intrusive

2. Place your music file in the `public/` folder:
   ```bash
   cp your-music-file.mp3 public/background-music.mp3
   ```

3. Uncomment the audio in `src/LaunchVideo.tsx` (line ~150):
   ```tsx
   <Audio
     src={staticFile("background-music.mp3")}
     volume={volume}
   />
   ```

## 🎨 Customization

### Adjust Video Clip Durations

Edit `src/LaunchVideo.tsx`:

```tsx
const CLIPS = [
  { name: "Overview", file: "overview.mp4", duration: 360 }, // 12s at 30fps
  { name: "Build", file: "build.mp4", duration: 360 },
  // ... change duration values (in frames)
];
```

### Change Transition Duration

```tsx
const TRANSITION_DURATION = 30; // 1 second at 30fps
```

### Modify Colors/Branding

Purple theme color: `#7C3AED` (change in multiple files)

```tsx
// In LaunchVideo.tsx and Transitions.tsx
color="#7C3AED"  // Change to your brand color
```

### Add Your Logo

Replace the cube in the intro with your logo:

1. Export logo as PNG/SVG
2. Place in `public/logo.png`
3. Update `IntroScene` in `src/LaunchVideo.tsx`:

```tsx
<img
  src={staticFile("logo.png")}
  style={{
    width: 400,
    height: 400,
    position: "absolute",
  }}
/>
```

## 🎥 Rendering the Final Video

### Quick Render (MP4)

```bash
npx remotion render LaunchVideo teach-charlie-launch.mp4
```

### High Quality Render

```bash
npx remotion render LaunchVideo teach-charlie-launch.mp4 --quality=100
```

### With Audio

```bash
npx remotion render LaunchVideo teach-charlie-launch.mp4 --audio-codec=aac
```

### Custom Settings

```bash
npx remotion render LaunchVideo teach-charlie-launch.mp4 \
  --quality=100 \
  --audio-codec=aac \
  --audio-bitrate=320000 \
  --codec=h264
```

## 📦 Export Options

### MP4 (Recommended)
- **Best for**: YouTube, Vimeo, social media
- **Command**: `npx remotion render LaunchVideo output.mp4`

### MOV
- **Best for**: Professional editing, high quality
- **Command**: `npx remotion render LaunchVideo output.mov --codec=prores`

### WebM
- **Best for**: Web embedding
- **Command**: `npx remotion render LaunchVideo output.webm --codec=vp8`

### GIF
- **Best for**: Previews, social media
- **Command**: `npx remotion render LaunchVideo output.gif --scale=0.5`

## 🔧 Troubleshooting

### "Video not found" error
- Ensure all MP4 files are in the `public/` folder
- Check file names match exactly in `CLIPS` array

### Slow rendering
- Rendering with 3D effects is resource-intensive
- Use `--concurrency=1` flag to reduce memory usage
- Close other applications

### Audio desync
- Ensure audio file duration matches video
- Use `--enforce-audio-track` flag

## 🎯 Advanced: 3D Transitions

The project includes 6 transition effects in `src/Transitions.tsx`:

1. **CubeFlipTransition** - Rotating cube
2. **PageFlipTransition** - Page turning effect
3. **SphereMorphTransition** - Morphing sphere
4. **RippleTransition** - Concentric ripples
5. **ParticleExplosionTransition** - Particle burst
6. **SpiralTunnelTransition** - Rotating tunnel

Customize by editing the transition components or changing the rotation in `getTransition()`.

## 📚 Resources

- [Remotion Docs](https://remotion.dev/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Docs](https://threejs.org/docs)
- [Teach Charlie AI](https://app.teachcharlie.ai)

## 🚢 Deployment

Once rendered, upload your video to:
- **YouTube**: For public launch
- **Vimeo**: For embedding on website
- **AWS S3/CloudFront**: For fast global delivery

## 📝 Credits

- **Framework**: Remotion by Jonny Burger
- **3D Graphics**: Three.js + React Three Fiber
- **Music**: [Add your music credits]
- **Created for**: Teach Charlie AI

---

**Need help?** Check the Remotion Discord: https://remotion.dev/discord
