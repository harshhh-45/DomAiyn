# Technical Architecture & Animation Guide

This document serves as a reference for the tech stack and sophisticated animation systems used in the DomAIyn Labs project.

## 🛠️ Core Tech Stack

| Technology | Purpose | Implementation Detail |
| :--- | :--- | :--- |
| **React 18** | Frontend Library | Component-based UI logic and state management. |
| **Vite** | Build Tool | Lightning-fast development server and optimized production builds. |
| **Three.js** | 3D Engine | Core logic for 3D renderings and mathematical computations. |
| **React Three Fiber** | 3D React Bridge | Declarative Three.js components within the React tree. |
| **React Three Drei** | helper Library | Advanced 3D utilities (Points, shaders, controls). |
| **Framer Motion** | Animation | High-performance scroll, hover, and entrance animations. |
| **Tailwind CSS** | Styling | Utility-first CSS for layout, glassmorphism, and responsiveness. |

---

## ✨ Animation & Effects Breakdown

### 1. Global Effects
- **Starfield Background**: A persistent 3D canvas using `POINTS` from Three.js. Includes interactive parallax (follows mouse movement) and a selective "twinkle" algorithm that randomly scales specific particles.
- **Rocket Nav**: A dynamic navigation bar that switches between horizontal (Header) and vertical (Side) layouts based on the current active section using `framer-motion`.

### 2. Hero Section
- **Dynamic Logo**: The large DomAIyn logo image scales up and fades out as the user scrolls, creating an immersive depth effect.
- **Text Staggering**: Title, subtitle, and CTA buttons use staggered delays (`0.2s`, `0.4s`, `0.6s`) to reveal themselves gracefully on load.

### 3. About Section
- **Slide-In Reveal**: Uses `useInView` to trigger a vertical slide-up animation when the section enters the viewport.
- **Glassmorphism**: Cards use `backdrop-blur-md` and semi-transparent borders to maintain the space theme.

### 4. Bayora Section (3D Intensive)
- **Main Molecule**: A custom 3D Revolving Molecule built with `BufferGeometry`. It features glowing vertices and gradient-colored connecting lines that adapt to camera rotation.
- **Process Visuals**:
    - **Step 01 (Attack)**: Chaotic red particles moving towards a central "Target" core.
    - **Step 02 (Analysis)**: Purple orbiting waves representing data flow.
    - **Step 03 (Judgement)**: Miniaturized 3D molecule with pink/blue hues.
- **AnimatedElement Wrapper**: A custom reusable component that manages directional entrance animations (up, down, left, right, scale) based on scroll position.

### 5. Services Section
- **Directional Grid**: Service cards slide in from the left or right depending on their column, creating a "closing" effect as you scroll down.
- **Hover States**: Cards feature a subtle vertical lift (`-8px`) and a glow intensity increase when hovered.

### 6. Contact Section
- **Interactive Cards**: Office location cards utilize a combination of Framer Motion `whileHover` and absolute-positioned gradient overlays to create a "breathing" neon effect.
- **Social Glow**: Icons use radial gradients with high blur radii to simulate glowing holographic projections.

---

## 🎨 Design Systems
- **Color Palette**: Dark space-base (#000000 to #0a0a0a) with vibrant accent gradients:
    - `Nebula Purple` (#8b5cf6)
    - `Nebula Blue` (#3b82f6)
    - `Nebula Pink` (#ec4899)
- **Typography**: `Space Grotesk` for technical/bold headings and `Inter` for highly readable body text.
