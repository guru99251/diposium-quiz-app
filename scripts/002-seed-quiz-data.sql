-- Insert question types (문제 유형)
INSERT INTO question_types (name, description) VALUES 
  ('디지털콘텐츠학과', '디지털콘텐츠학과 관련 문제'),
  ('전시회', '전시회 관련 문제'),
  ('일반상식', '일반 상식 문제')
ON CONFLICT (name) DO NOTHING;

-- Optional: Insert a few sample questions (valid Korean text and quotes)
WITH question_type_ids AS (
  SELECT id, name FROM question_types
)
INSERT INTO questions (type_id, question, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
  qt.id,
  q.question,
  q.option_a,
  q.option_b,
  q.option_c,
  q.option_d,
  q.correct_answer
FROM question_type_ids qt
CROSS JOIN (VALUES
  ('디지털콘텐츠학과', '다음 중 객체지향 프로그래밍 언어가 아닌 것은?', 'Java', 'Python', 'C', 'C++', 'C'),
  ('디지털콘텐츠학과', '데이터베이스 ACID의 A에 해당하는 것은?', 'Atomicity', 'Availability', 'Accuracy', 'Authentication', 'A'),
  ('전시회', '이번 전시회의 주요 주제는 무엇인가요?', '미래기술', '인공지능', '지속가능성', '디지털혁신', 'A'),
  ('일반상식', '지구의 공전 주기는?', '약 364일', '약 365일', '약 366일', '약 367일', 'B')
) AS q(type_name, question, option_a, option_b, option_c, option_d, correct_answer)
WHERE qt.name = q.type_name
ON CONFLICT DO NOTHING;
