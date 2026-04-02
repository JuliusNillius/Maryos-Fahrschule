-- Optionales GLB/GLTF für 3D-Ansicht auf der Flotte-Seite (Backoffice: URL eintragen)
alter table public.fleet add column if not exists model_3d_url text;
