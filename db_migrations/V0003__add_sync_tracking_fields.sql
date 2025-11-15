ALTER TABLE t_p56644526_my_lawyer_ai.legal_documents 
ADD COLUMN IF NOT EXISTS article_hash VARCHAR(32),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_legal_docs_hash 
ON t_p56644526_my_lawyer_ai.legal_documents(code_name, article_number, article_hash);

CREATE INDEX IF NOT EXISTS idx_legal_docs_updated 
ON t_p56644526_my_lawyer_ai.legal_documents(updated_at DESC);
