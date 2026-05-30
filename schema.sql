-- Tabla de log de cada operación sobre archivos (upload / download / getSize)
CREATE TABLE IF NOT EXISTS file_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  file_key TEXT,
  usuario TEXT,
  size INTEGER,
  status TEXT NOT NULL,
  error TEXT,
  origin TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_file_log_created_at ON file_log (created_at);
CREATE INDEX IF NOT EXISTS idx_file_log_action ON file_log (action);

-- Tabla de log de cada request HTTP entrante
CREATE TABLE IF NOT EXISTS request_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  status INTEGER NOT NULL,
  ip TEXT,
  auth_user TEXT,
  origin TEXT,
  user_agent TEXT,
  body TEXT,
  error TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_request_log_created_at ON request_log (created_at);
CREATE INDEX IF NOT EXISTS idx_request_log_status ON request_log (status);
