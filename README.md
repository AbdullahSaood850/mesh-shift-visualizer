# Mesh Circular Shift Visualizer

Interactive React + Vite app for visualizing circular $q$-shift routing on a 2D mesh, where node $i$ sends data to node $(i + q) \bmod p$.

## Live Deployment

Vercel URL: https://mesh-shift-visualizer-five-theta.vercel.app/

## Overview

The visualizer decomposes the ring shift into two mesh-compatible stages:

1. Stage 1 (Row Shift): $q \bmod \sqrt{p}$
2. Stage 2 (Column Shift): $\lfloor q / \sqrt{p} \rfloor$

It also compares:

1. Ring steps: $\min(q, p-q)$
2. Mesh steps: $(q \bmod \sqrt{p}) + \lfloor q/\sqrt{p} \rfloor$

## Features

1. Validated control panel for $p$ and $q$
2. Responsive mesh grid with node/data mapping
3. Step controls: Initial, Stage 1, Final
4. Playback controls: Play, Next Step, Reset
5. Framer Motion transitions for data movement
6. Direction indicators for horizontal and vertical stages
7. Complexity panel with formulas and bar comparison

## Project Structure

mesh-shift-visualizer/

1. [index.html](index.html): Vite HTML shell with root mount node and app entry script.
2. [package.json](package.json): npm scripts and runtime/dev dependencies.
3. [vite.config.js](vite.config.js): Vite setup with React plugin.
4. [tailwind.config.js](tailwind.config.js): Tailwind content scan and theme config.
5. [postcss.config.js](postcss.config.js): PostCSS plugin wiring for Tailwind and Autoprefixer.
6. [src/index.js](src/index.js): React bootstrap entry that mounts [App](src/App.jsx).
7. [src/index.css](src/index.css): Tailwind directives and global base styles.
8. [src/App.jsx](src/App.jsx): Main page layout, state orchestration, and panel composition.
9. [src/utils/shiftLogic.js](src/utils/shiftLogic.js): Pure validation, shift decomposition, step metrics, and routing-state generation.
10. [src/components/ControlPanel.jsx](src/components/ControlPanel.jsx): Input validation UI and playback controls.
11. [src/components/MeshGrid.jsx](src/components/MeshGrid.jsx): Responsive grid rendering and Framer Motion stage transitions.
12. [src/components/ComplexityPanel.jsx](src/components/ComplexityPanel.jsx): Formula breakdown and mesh-vs-ring bar chart.
