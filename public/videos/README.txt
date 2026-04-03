Hero-Videos (im Repo):

  Production-Empfehlung (Supabase): docs/hero-videos-supabase.md — Bucket hero-videos, Env-URLs in Vercel.

  Platzhalter neu erzeugen: npm run assets:hero-videos (ffmpeg-static)

  Kompression (Stand Apr 2026, „leicht & schnell“): Desktop max 960px breit CRF 26, Mobil max 540px breit CRF 26, beide 30 fps, -an, preset medium, +faststart.
  Zielgröße grob ~8 MB Desktop / ~7 MB Mobil (Loop ~38 s). Stärker komprimiert als 720p/1280-Variante; bitte visuell prüfen.

  Backups: *.original-*mb.backup.mp4 (Quellen), *.22mb-*.backup.mp4 / *.15mb-*.backup.mp4 (Zwischenstufe) — alles in .gitignore.

  hero.mp4         – Desktop (md+), 16:9
  hero-mobile.mp4  – Mobil, 9:16 (Mittelstreifen aus derselben Quelle)

Aktuell im Einsatz (von Original-Backups encodiert):

  FFMPEG=$(node -p "require('ffmpeg-static')") && D="public/videos" && \
  "$FFMPEG" -y -i "$D/hero.original-50mb.backup.mp4" -an -c:v libx264 -crf 26 -preset medium \
    -pix_fmt yuv420p -movflags +faststart -vf "scale='min(960,iw)':-2,fps=30" "$D/hero.mp4" && \
  "$FFMPEG" -y -i "$D/hero-mobile.original-31mb.backup.mp4" -an -c:v libx264 -crf 26 -preset medium \
    -pix_fmt yuv420p -movflags +faststart -vf "scale='min(540,iw)':-2,fps=30" "$D/hero-mobile.mp4"

Optional – noch schärfer / größere Datei: CRF 23–24, min(1280,iw) Desktop, min(720,iw) Mobil, preset slow.

Optional – noch kleiner: CRF 27–28 oder max 854/480 Desktop, 480px breit Mobil (stärkere Blockartefakte möglich).
