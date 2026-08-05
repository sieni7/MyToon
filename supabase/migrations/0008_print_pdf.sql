-- ============================================================
-- MyToon — Fichier d'impression PDF (impression DTF)
-- ============================================================

alter table public.orders
  add column if not exists print_pdf_path text;