-- Seed initial data for quiz app

-- Insert question types (idempotent)
INSERT INTO question_types (name, description) VALUES
('�а�', '�а� ���� ����'),
('����', '���� ���� ����'),
('����', '���� ���� ����')
ON CONFLICT (name) DO NOTHING;

-- We intentionally skip inserting sample questions to avoid duplicates across deployments.
-- If needed, add via admin UI or with an idempotent statement like:
-- INSERT INTO questions (type_id, question, option_a, option_b, option_c, option_d, correct_answer)
-- VALUES ((SELECT id FROM question_types WHERE name = '�а�'), '���� ���� ����', 'A ����', 'B ����', 'C ����', 'D ����', 'A')
-- ON CONFLICT (type_id, question) DO NOTHING;

-- Insert default admin user (username: admin, password: admin123 - change in production)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', 'admin@quiz.app')
ON CONFLICT (username) DO NOTHING;