CREATE TABLE IF NOT EXISTS ad_slots (
  slot INTEGER PRIMARY KEY CHECK (slot BETWEEN 0 AND 2),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ad_media (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  slot INTEGER NOT NULL CHECK (slot BETWEEN 0 AND 2),
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ad_media_slot_position ON ad_media(slot, position);

INSERT OR IGNORE INTO ad_slots(slot,title,subtitle) VALUES
(0,'Divulgue sua empresa','Sua marca em destaque para novos clientes.'),
(1,'Anuncie seus produtos','Espaço premium para campanhas e promoções.'),
(2,'Publicidade premium','Vídeos em um espaço vertical de alta visibilidade.');
