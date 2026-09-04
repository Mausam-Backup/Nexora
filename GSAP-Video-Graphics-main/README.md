# GSAP Video Graphics 🎬✨

[![GitHub](https://img.shields.io/github/license/mausamkar/GSAP-Video-Graphics)](https://github.com/mausamkar/GSAP-Video-Graphics)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)
[![GSAP](https://img.shields.io/badge/GSAP-88ce02?logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Transform your videos into stunning scroll-based animations with GSAP and ScrollTrigger

Welcome to **GSAP Video Graphics**, a powerful solution for creating cinematic web experiences by extracting video frames and animating them with GreenSock Animation Platform (GSAP). This project enables you to create smooth, professional-grade animations that respond to user scrolling.

## 🌟 Features

| Feature | Description |
|---------|-------------|
| **Frame Extraction** | Extract every frame from your video using FFmpeg |
| **GSAP Animation** | Smooth scroll-triggered animations with GreenSock |
| **Responsive Design** | Adapts to all screen sizes |
| **Performance Optimized** | Efficient loading and rendering |
| **Customizable UI** | Easy to modify and extend |
| **Loading Indicator** | Shows progress while frames are loading |

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| ![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white) | Video frame extraction |
| ![GSAP](https://img.shields.io/badge/GSAP-88ce02?style=for-the-badge&logo=greensock&logoColor=white) | Animation engine |
| ![ScrollTrigger](https://img.shields.io/badge/ScrollTrigger-39b54a?style=for-the-badge&logo=greensock&logoColor=white) | Scroll-based animations |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Styling framework |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Core functionality |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | Markup structure |

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

| Tool | Description | Installation |
|------|-------------|--------------|
| **FFmpeg** | Multimedia framework for frame extraction | [Download FFmpeg](https://ffmpeg.org/download.html) |
| **Git** | Version control system | [Download Git](https://git-scm.com/downloads) |

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mausamkar/GSAP-Video-Graphics.git
cd GSAP-Video-Graphics
```

### 2. Install Dependencies

For Windows users:
1. Download FFmpeg from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Add FFmpeg to your system PATH

For macOS users with Homebrew:
```bash
brew install ffmpeg
```

For Linux users (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install ffmpeg
```

## ▶️ Usage

### Extract Video Frames

Use the provided script to extract frames from your video:

```bash
chmod +x extract_frames.sh
./extract_frames.sh [VIDEO_PATH] [OUTPUT_DIRECTORY]
```

**Parameters:**
- `[VIDEO_PATH]`: Path to your source video (e.g., `~/Desktop/my_video.mp4`)
- `[OUTPUT_DIRECTORY]`: Directory for extracted frames (will be created if it doesn't exist)

### Example

```bash
./extract_frames.sh ~/Desktop/source.mov ~/Desktop/output_frames
```

This will create an `output_frames` folder containing JPEG images named `frame_0001.jpg`, `frame_0002.jpg`, etc.

### Customize Animation

Modify `script.js` to adjust:
- Animation timing
- Frame transitions
- ScrollTrigger behavior
- GSAP timeline

## 🎨 Customization Guide

| Component | File | Description |
|-----------|------|-------------|
| **Animations** | `script.js` | GSAP timeline and ScrollTrigger settings |
| **Styling** | `index.html` | CSS styles and Tailwind classes |
| **Layout** | `index.html` | HTML structure and content |
| **Frame Extraction** | `extract_frames.sh` | FFmpeg command configuration |

## 📁 Project Structure

```
GSAP-Video-Graphics/
├── extract_frames.sh     # Frame extraction script
├── index.html           # Main HTML file
├── script.js            # Animation logic
├── output_frames/       # Extracted video frames (generated)
└── README.md            # This file
```

## 🎯 How It Works

1. **Frame Extraction**: The bash script uses FFmpeg to extract all frames from a video file
2. **Preloading**: JavaScript preloads all frames for smooth animation
3. **Scroll Animation**: GSAP ScrollTrigger creates animations based on scroll position
4. **Responsive Display**: Canvas resizes to fit different screen sizes

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Mausam Kar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mausamkar)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mausamkar)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mausam03.vercel.app)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:chillamcherlaabhinay@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GreenSock Animation Platform](https://greensock.com/gsap/) for the powerful animation library
- [FFmpeg](https://ffmpeg.org/) for reliable video processing
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS framework