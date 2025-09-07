-- Insert question types
INSERT INTO question_types (name) VALUES 
  ('컴퓨터공학과'),
  ('전시회'),
  ('일반상식')
ON CONFLICT (name) DO NOTHING;

-- Insert sample questions
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
  ('컴퓨터공학과', '프로그래밍 언어 중 객체지향 언어가 아닌 것은?', 'Java', 'Python', 'C', 'C++', 'C'),
  ('컴퓨터공학과', '데이터베이스에서 ACID 속성에 포함되지 않는 것은?', 'Atomicity', 'Consistency', 'Isolation', 'Availability', 'D'),
  ('컴퓨터공학과', '알고리즘의 시간복잡도 O(n²)을 가지는 정렬 알고리즘은?', 'Quick Sort', 'Merge Sort', 'Bubble Sort', 'Heap Sort', 'C'),
  ('전시회', '이번 전시회의 주제는 무엇인가요?', '미래기술', '인공지능', '지속가능성', '디지털혁신', 'A'),
  ('전시회', '전시회 개최 기간은 언제인가요?', '1주일', '2주일', '3주일', '1개월', 'B'),
  ('전시회', '전시회장 위치는 어디인가요?', '서울', '부산', '대구', '인천', 'A'),
  ('일반상식', '대한민국의 수도는?', '부산', '서울', '대구', '인천', 'B'),
  ('일반상식', '지구에서 가장 큰 대륙은?', '아시아', '아프리카', '북아메리카', '유럽', 'A'),
  ('일반상식', '1년은 몇 일인가요?', '364일', '365일', '366일', '367일', 'B'),
  ('일반상식', '태양계에서 가장 큰 행성은?', '지구', '화성', '목성', '토성', 'C')
) AS q(type_name, question, option_a, option_b, option_c, option_d, correct_answer)
WHERE qt.name = q.type_name;
