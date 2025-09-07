-- Seed initial data for quiz app

-- Insert question types
INSERT INTO question_types (name, description) VALUES
('학과', '학과 관련 문제'),
('전시', '전시 관련 문제'),
('전공', '전공 관련 문제')
ON CONFLICT (name) DO NOTHING;

-- Insert sample questions
INSERT INTO questions (type_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, '컴퓨터공학과에서 가장 중요한 프로그래밍 언어는?', 'Python', 'Java', 'C++', '모든 언어가 중요함', 'D', '각 언어마다 고유한 장점과 용도가 있습니다.'),
(1, '데이터베이스에서 ACID 속성 중 A는 무엇을 의미하나요?', 'Atomicity', 'Availability', 'Accuracy', 'Authentication', 'A', '원자성(Atomicity)은 트랜잭션의 모든 연산이 완전히 수행되거나 전혀 수행되지 않음을 의미합니다.'),
(2, '현재 전시에서 가장 인상적인 작품은?', '디지털 아트', '인터랙티브 설치', '전통 회화', '조각 작품', 'B', '인터랙티브 설치는 관람객의 참여를 유도하는 현대적인 전시 형태입니다.'),
(2, '전시회 관람 시 가장 중요한 에티켓은?', '사진 촬영', '큰 소리로 대화', '조용히 감상', '작품 만지기', 'C', '다른 관람객을 배려하여 조용히 감상하는 것이 기본 에티켓입니다.'),
(3, 'UI/UX 디자인에서 가장 중요한 원칙은?', '아름다운 색상', '사용자 중심 설계', '최신 트렌드', '복잡한 기능', 'B', '사용자의 니즈와 경험을 우선시하는 것이 좋은 디자인의 핵심입니다.'),
(3, '프론트엔드 개발에서 반응형 디자인이 중요한 이유는?', '예쁘게 보이려고', '다양한 기기 대응', '개발자 편의', '서버 성능', 'B', '모바일, 태블릿, 데스크톱 등 다양한 기기에서 최적의 사용자 경험을 제공하기 위함입니다.'),
(1, '알고리즘의 시간복잡도 O(n²)의 의미는?', '선형 시간', '상수 시간', '제곱 시간', '로그 시간', 'C', '입력 크기 n에 대해 실행 시간이 n의 제곱에 비례하여 증가함을 의미합니다.'),
(2, '박물관과 미술관의 차이점은?', '크기의 차이', '전시 내용의 차이', '건물 구조', '입장료', 'B', '박물관은 역사적 유물을, 미술관은 예술 작품을 주로 전시합니다.'),
(3, '웹 접근성이 중요한 이유는?', '법적 요구사항', '모든 사용자 포용', 'SEO 향상', '모든 것', 'D', '법적 준수, 사용자 포용성, 검색 최적화 등 모든 측면에서 중요합니다.'),
(1, '객체지향 프로그래밍의 4대 특징이 아닌 것은?', '캡슐화', '상속', '다형성', '반복성', 'D', '객체지향의 4대 특징은 캡슐화, 상속, 다형성, 추상화입니다.')
ON CONFLICT DO NOTHING;

-- Insert default admin user (username: admin, password: admin123 - should be changed in production)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', 'admin@quiz.app')
ON CONFLICT (username) DO NOTHING;
