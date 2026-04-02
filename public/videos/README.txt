Hero-Videos (im Repo):

  hero.mp4         – Desktop (md+), 16:9, 1920×1080, H.264, ohne Ton
  hero-mobile.mp4  – Mobil, 9:16, 1080×1920 (Mittelstreifen aus derselben Quelle)

Empfohlen – hohe Bildqualität (aktuell im Einsatz):

  FFMPEG=$(node -p "require('ffmpeg-static')") && SRC="/pfad/zur/quelle.mp4" && \
  "$FFMPEG" -y -i "$SRC" -an -c:v libx264 -crf 23 -preset slow -movflags +faststart \
    -pix_fmt yuv420p -vf "scale='min(1920,iw)':-2,fps=30" public/videos/hero.mp4 && \
  "$FFMPEG" -y -i "$SRC" -an -c:v libx264 -crf 24 -preset slow -movflags +faststart \
    -pix_fmt yuv420p -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920,fps=30" public/videos/hero-mobile.mp4

  CRF: niedriger = schärfer (18–23 typisch „sehr gut“). preset slow = bei gleicher Qualität oft etwas kleinere Datei als medium.

Optional – kleinere Dateien (spürbar stärkere Kompression, nicht für „keine Qualitätseinbuße“):

  CRF z. B. 28/29, preset medium, ggf. 1280×720 Desktop und 720×1280 Mobil.
