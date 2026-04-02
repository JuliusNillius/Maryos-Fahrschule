#!/usr/bin/env node
/**
 * Erzeugt minimale Platzhalter-Videos unter public/videos/ (ffmpeg-static).
 * Für echtes Branding: Clips gemäß public/videos/README.txt ersetzen.
 */
const { mkdirSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const root = join(__dirname, '..');
const outDir = join(root, 'public', 'videos');

function run(args) {
  const r = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

mkdirSync(outDir, { recursive: true });

run([
  '-y',
  '-f',
  'lavfi',
  '-i',
  'color=c=0x0a0a0a:s=1920x1080:d=2',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  join(outDir, 'hero.mp4'),
]);

run([
  '-y',
  '-f',
  'lavfi',
  '-i',
  'color=c=0x0a0a0a:s=1080x1920:d=2',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  join(outDir, 'hero-mobile.mp4'),
]);

console.log('OK: public/videos/hero.mp4 + hero-mobile.mp4');
