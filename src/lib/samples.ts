import { SampleSubject } from './types';

export const SAMPLE_SUBJECTS: SampleSubject[] = [
  {
    id: 'khtn-sinh-7',
    name: 'Khoa học tự nhiên (Sinh học)',
    grade: 'Lớp 7',
    subjectCode: 'KHTN',
    icon: '🌱',
    title: 'Quang hợp ở thực vật & Hô hấp tế bào',
    description: 'Vở ghi bài học về bản chất, phương trình quang hợp, bào quan thực hiện và vai trò điều hòa sinh thái.',
    verifiedCount: 5,
    content: `VỞ GHI MÔN KHOA HỌC TỰ NHIÊN 7
Bài: QUANG HỢP Ở THỰC VẬT

1. Khái niệm và Bào quan quang hợp:
- Quang hợp là quá trình lá cây sử dụng nước và khí carbon dioxide, nhờ năng lượng ánh sáng mặt trời được lục lạp hấp thụ để tổng hợp chất hữu cơ (chủ yếu là glucose) và giải phóng khí oxygen.
- Lục lạp là bào quan thực hiện quá trình quang hợp ở tế bào thực vật. Trong lục lạp có chứa chất diệp lục có khả năng hấp thụ năng lượng ánh sáng.

2. Phương trình quang hợp dạng chữ:
Nước + Khí carbon dioxide --(Ánh sáng mặt trời / Diệp lục)--> Glucose + Khí oxygen

3. Các yếu tố ảnh hưởng đến quang hợp:
- Ánh sáng: Cường độ ánh sáng tăng thì hiệu suất quang hợp tăng đến một giới hạn nhất định.
- Nồng độ khí carbon dioxide: Nồng độ thích hợp trong không khí khoảng 0.03%.
- Nước: Nước vừa là nguyên liệu vừa là môi trường cho các phản ứng sinh hóa. Khi cây thiếu nước, khí khổng đóng lại làm giảm hấp thụ CO2.
- Nhiệt độ: Nhiệt độ tối ưu cho quang hợp của đa số thực vật từ 25°C đến 35°C.

4. Ý nghĩa sinh thái của quang hợp:
- Cung cấp nguồn chất hữu cơ làm thức ăn cho các sinh vật dị dưỡng trên Trái Đất.
- Hấp thụ khí carbon dioxide và giải phóng khí oxygen, giúp cân bằng hàm lượng các chất khí trong khí quyển và giảm hiệu ứng nhà kính.`,
    sampleQuestions: [
      {
        id: 'sinh-1',
        question: 'Bào quan nào trực tiếp thực hiện quá trình quang hợp ở tế bào thực vật?',
        options: ['Lục lạp', 'Không bào', 'Ti thể', 'Nhân tế bào'],
        correctAnswer: 'Lục lạp',
        sourceCitation: 'Lục lạp là bào quan thực hiện quá trình quang hợp ở tế bào thực vật.',
        explanation: 'Chính xác! Lục lạp chứa chất diệp lục màu xanh giúp hấp thụ ánh sáng mặt trời để tạo ra dinh dưỡng cho cây.',
        difficulty: 'easy',
        concept: 'Bào quan thực vật',
      },
      {
        id: 'sinh-2',
        question: 'Nguyên liệu đầu vào của phương trình quang hợp ở thực vật gồm những chất nào?',
        options: [
          'Nước và Khí carbon dioxide',
          'Glucose và Khí oxygen',
          'Khí nitrogen và Nước',
          'Glucose và Khí carbon dioxide',
        ],
        correctAnswer: 'Nước và Khí carbon dioxide',
        sourceCitation: 'Nước + Khí carbon dioxide --(Ánh sáng mặt trời / Diệp lục)--> Glucose + Khí oxygen',
        explanation: 'Tuyệt vời! Cây hút nước từ rễ và hấp thụ CO2 qua khí khổng ở lá dưới ánh sáng để tạo glucose và oxy.',
        difficulty: 'medium',
        concept: 'Phương trình quang hợp',
      },
      {
        id: 'sinh-3',
        question: 'Nhiệt độ tối ưu cho quá trình quang hợp của đa số các loài thực vật nằm trong khoảng nào?',
        options: ['Từ 25°C đến 35°C', 'Từ 0°C đến 10°C', 'Từ 15°C đến 20°C', 'Từ 45°C đến 55°C'],
        correctAnswer: 'Từ 25°C đến 35°C',
        sourceCitation: 'Nhiệt độ tối ưu cho quang hợp của đa số thực vật từ 25°C đến 35°C.',
        explanation: 'Đúng rồi! Nhiệt độ quá lạnh hoặc quá nóng sẽ làm giảm hoạt tính của các enzyme tham gia quang hợp.',
        difficulty: 'medium',
        concept: 'Yếu tố ảnh hưởng quang hợp',
      },
      {
        id: 'sinh-4',
        question: 'Khi cây bị thiếu nước nghiêm trọng, hiện tượng nào xảy ra ảnh hưởng trực tiếp đến quang hợp?',
        options: [
          'Khí khổng đóng lại làm giảm hấp thụ CO2',
          'Lá cây đổi sang màu tím đậm',
          'Rễ cây tăng cường hút khí carbon dioxide',
          'Cây ngừng hoàn toàn hô hấp tế bào',
        ],
        correctAnswer: 'Khí khổng đóng lại làm giảm hấp thụ CO2',
        sourceCitation: 'Khi cây thiếu nước, khí khổng đóng lại làm giảm hấp thụ CO2.',
        explanation: 'Chuẩn xác! Để tránh thoát hơi nước, khí khổng đóng lại, vô tình chặn luôn nguồn CO2 khiến quang hợp giảm mạnh.',
        difficulty: 'hard',
        concept: 'Cơ chế tự vệ của thực vật',
      },
      {
        id: 'sinh-5',
        question: 'Vì sao quá trình quang hợp có ý nghĩa sống còn đối với khí quyển Trái Đất?',
        options: [
          'Hấp thụ CO2 và giải phóng O2 giúp cân bằng khí quyển',
          'Tạo ra hơi nước làm biến mất hoàn toàn sa mạc',
          'Làm tăng nồng độ khí nitrogen trong khí quyển',
          'Phá vỡ tầng ozon để đón ánh sáng mặt trời',
        ],
        correctAnswer: 'Hấp thụ CO2 và giải phóng O2 giúp cân bằng khí quyển',
        sourceCitation: 'Hấp thụ khí carbon dioxide và giải phóng khí oxygen, giúp cân bằng hàm lượng các chất khí trong khí quyển và giảm hiệu ứng nhà kính.',
        explanation: 'Rất chính xác! Rừng cây như lá phổi xanh, hấp thu khí CO2 gây hiệu ứng nhà kính và cung cấp O2 cho muôn loài.',
        difficulty: 'easy',
        concept: 'Ý nghĩa sinh thái',
      },
    ],
  },
  {
    id: 'lich-su-7',
    name: 'Lịch sử & Địa lí (Phân môn Lịch sử)',
    grade: 'Lớp 7',
    subjectCode: 'SỬ',
    icon: '⚔️',
    title: 'Khởi nghĩa Lam Sơn (1418 - 1427)',
    description: 'Vở ghi chi tiết về căn cứ Lam Sơn, lãnh tụ Lê Lợi, mưu sĩ Nguyễn Trãi, các chiến dịch lớn Tốt Động - Chúc Động và Chi Lăng - Xương Giang.',
    verifiedCount: 5,
    content: `VỞ GHI MÔN LỊCH SỬ 7
Bài: KHỞI NGHĨA LAM SƠN (1418 - 1427)

1. Giai đoạn mở đầu và Căn cứ Lam Sơn:
- Mùa xuân năm 1418, Lê Lợi phất cờ khởi nghĩa tại căn cứ Lam Sơn (Thanh Hóa), tự xưng là Bình Định Vương.
- Hội thề Lũng Nhai (1416) gồm 19 người đứng đầu là Lê Lợi, thể hiện ý chí đồng lòng cứu nước đánh đuổi quân Minh xâm lược.
- Nguyễn Trãi dâng "Bình Ngô sách" (kế sách đánh giặc tập trung vào "đánh vào lòng người" - tâm công).

2. Giai đoạn tiến quân giải phóng Nghệ An và mở rộng địa bàn (1424 - 1425):
- Theo kế hoạch của tướng Nguyễn Chích, nghĩa quân bất ngờ chuyển hướng tiến vào Nghệ An để xây dựng căn cứ vững chắc, giải phóng một vùng rộng lớn từ Thanh Hóa đến đèo Hải Vân.

3. Các chiến thắng quyết định:
- Chiến thắng Tốt Động - Chúc Động (cuối năm 1426): Nghĩa quân Lam Sơn đặt phục binh tiêu diệt hơn 5 vạn quân giặc, làm phá sản hoàn toàn kế hoạch phản công của Vương Thông.
- Chiến thắng Chi Lăng - Xương Giang (tháng 10 - 11/1427): Tiêu diệt đạo viện binh 10 vạn quân của Liễu Thăng. Tướng Liễu Thăng bị chém đầu tại ải Chi Lăng (Lạng Sơn).

4. Kết quả và Ý nghĩa:
- Đầu năm 1428, nghĩa quân tổ chức Hội thề Đông Quan, mở đường cho quân Minh rút về nước an toàn (thể hiện tính nhân đạo sâu sắc).
- Đất nước hoàn toàn sạch bóng quân xâm lược. Nguyễn Trãi thừa lệnh Lê Lợi viết "Bình Ngô Đại Cáo" tuyên bố độc lập dân tộc.`,
    sampleQuestions: [
      {
        id: 'su-1',
        question: 'Lê Lợi phất cờ khởi nghĩa chống quân Minh tại căn cứ nào vào năm 1418?',
        options: ['Lam Sơn (Thanh Hóa)', 'Chi Lăng (Lạng Sơn)', 'Tốt Động (Hà Nội)', 'Hội thề Đông Quan'],
        correctAnswer: 'Lam Sơn (Thanh Hóa)',
        sourceCitation: 'Mùa xuân năm 1418, Lê Lợi phất cờ khởi nghĩa tại căn cứ Lam Sơn (Thanh Hóa), tự xưng là Bình Định Vương.',
        explanation: 'Chính xác! Lam Sơn thuộc vùng núi Thanh Hóa là cái nôi nuôi dưỡng cuộc khởi nghĩa oanh liệt suốt 10 năm.',
        difficulty: 'easy',
        concept: 'Căn cứ địa khởi nghĩa',
      },
      {
        id: 'su-2',
        question: 'Ai là người dâng "Bình Ngô sách" với tư tưởng cốt lõi "đánh vào lòng người" (tâm công)?',
        options: ['Nguyễn Trãi', 'Nguyễn Chích', 'Lê Lai', 'Trần Hưng Đạo'],
        correctAnswer: 'Nguyễn Trãi',
        sourceCitation: 'Nguyễn Trãi dâng "Bình Ngô sách" (kế sách đánh giặc tập trung vào "đánh vào lòng người" - tâm công).',
        explanation: 'Đúng rồi! Nguyễn Trãi với tài mưu lược kiệt xuất đã giúp Lê Lợi thu phục nhân tâm, lấy đại nghĩa thắng hung tàn.',
        difficulty: 'medium',
        concept: 'Nhân vật lịch sử',
      },
      {
        id: 'su-3',
        question: 'Theo kế sách của ai, nghĩa quân Lam Sơn đã tiến vào Nghệ An để mở rộng căn cứ vào năm 1424?',
        options: ['Nguyễn Chích', 'Vương Thông', 'Liễu Thăng', 'Lê Lợi'],
        correctAnswer: 'Nguyễn Chích',
        sourceCitation: 'Theo kế hoạch của tướng Nguyễn Chích, nghĩa quân bất ngờ chuyển hướng tiến vào Nghệ An để xây dựng căn cứ vững chắc',
        explanation: 'Xuất sắc! Tướng Nguyễn Chích đề xuất "bỏ chỗ hiểm, đánh chỗ sơ hở", chuyển quân vào Nghệ An tạo bước ngoặt chiến lược.',
        difficulty: 'hard',
        concept: 'Chiến thuật quân sự',
      },
      {
        id: 'su-4',
        question: 'Tướng giặc nào của nhà Minh đã bị quân Lam Sơn chém đầu tại ải Chi Lăng?',
        options: ['Liễu Thăng', 'Vương Thông', 'Thoát Hoan', 'Trương Phụ'],
        correctAnswer: 'Liễu Thăng',
        sourceCitation: 'Tướng Liễu Thăng bị chém đầu tại ải Chi Lăng (Lạng Sơn).',
        explanation: 'Chính xác! Đạo viện binh 10 vạn của Liễu Thăng bị mai phục và tiêu diệt tan tác tại ải Chi Lăng hiểm trở.',
        difficulty: 'easy',
        concept: 'Chiến dịch Chi Lăng - Xương Giang',
      },
      {
        id: 'su-5',
        question: 'Tác phẩm bất hủ nào được Nguyễn Trãi thừa lệnh viết vào năm 1428 tuyên bố độc lập dân tộc?',
        options: ['Bình Ngô Đại Cáo', 'Hịch Tướng Sĩ', 'Nam Quốc Sơn Hà', 'Bạch Đằng Giang Phú'],
        correctAnswer: 'Bình Ngô Đại Cáo',
        sourceCitation: 'Nguyễn Trãi thừa lệnh Lê Lợi viết "Bình Ngô Đại Cáo" tuyên bố độc lập dân tộc.',
        explanation: 'Quá đỉnh! "Bình Ngô Đại Cáo" được coi là bản Tuyên ngôn Độc lập thứ hai của dân tộc Việt Nam.',
        difficulty: 'medium',
        concept: 'Văn học lịch sử',
      },
    ],
  },
  {
    id: 'dia-li-8',
    name: 'Lịch sử & Địa lí (Phân môn Địa lí)',
    grade: 'Lớp 8',
    subjectCode: 'ĐỊA',
    icon: '🌏',
    title: 'Đặc điểm Khí hậu Việt Nam',
    description: 'Vở ghi về tính chất nhiệt đới gió mùa ẩm, hai mùa gió chính, nhiệt độ và lượng mưa trung bình các vùng.',
    verifiedCount: 5,
    content: `VỞ GHI MÔN ĐỊA LÍ 8
Bài: ĐẶC ĐIỂM KHÍ HẬU VIỆT NAM

1. Tính chất nhiệt đới gió mùa ẩm:
- Tính chất nhiệt đới: Số giờ nắng cao (1400 - 3000 giờ/năm). Nhiệt độ trung bình năm của hầu hết cả nước đều vượt trên 21°C (trừ vùng núi cao), tăng dần từ Bắc vào Nam.
- Tính chất ẩm: Lượng mưa trung bình năm lớn, phổ biến từ 1500 mm đến 2000 mm/năm. Độ ẩm không khí rất cao, trên 80%.

2. Hai mùa gió chính:
- Gió mùa mùa đông (tháng 11 đến tháng 4 năm sau): Hướng Đông Bắc (gió mùa Đông Bắc). Miền Bắc có mùa đông lạnh, nửa đầu mùa hanh khô, nửa sau mùa mưa phùn ẩm ướt.
- Gió mùa mùa hạ (tháng 5 đến tháng 10): Hướng Tây Nam (gió mùa Tây Nam). Thời tiết nóng ẩm, mưa nhiều trên phạm vi cả nước. Riêng vùng ven biển Trung Bộ chịu ảnh hưởng của hiệu ứng phơn (gió Lào) khô nóng.

3. Sự phân hóa khí hậu:
- Khí hậu nước ta phân hóa đa dạng: theo chiều Bắc - Nam (ranh giới là dãy Bạch Mã ở vĩ tuyến 16°B), theo độ cao địa hình (đai nhiệt đới chân núi, đai cận nhiệt đới gió mùa trên núi, đai ôn đới gió mùa trên núi cao), và theo mùa.`,
    sampleQuestions: [
      {
        id: 'dia-1',
        question: 'Nhiệt độ trung bình năm của hầu hết các khu vực trên lãnh thổ Việt Nam là bao nhiêu?',
        options: ['Vượt trên 21°C', 'Dưới 15°C', 'Từ 10°C đến 18°C', 'Trên 35°C'],
        correctAnswer: 'Vượt trên 21°C',
        sourceCitation: 'Nhiệt độ trung bình năm của hầu hết cả nước đều vượt trên 21°C (trừ vùng núi cao), tăng dần từ Bắc vào Nam.',
        explanation: 'Chính xác! Do nằm hoàn toàn trong vành đai nội chí tuyến Bắc bán cầu nên nước ta có nền nhiệt độ dồi dào quanh năm.',
        difficulty: 'easy',
        concept: 'Tính chất nhiệt đới',
      },
      {
        id: 'dia-2',
        question: 'Lượng mưa trung bình năm phổ biến ở Việt Nam đạt mức nào?',
        options: ['Từ 1500 mm đến 2000 mm/năm', 'Dưới 500 mm/năm', 'Từ 3500 mm đến 5000 mm/năm', 'Khoảng 700 mm đến 900 mm/năm'],
        correctAnswer: 'Từ 1500 mm đến 2000 mm/năm',
        sourceCitation: 'Lượng mưa trung bình năm lớn, phổ biến từ 1500 mm đến 2000 mm/năm.',
        explanation: 'Đúng rồi! Nhờ biển Đông rộng lớn bao bọc nên các khối khí đi qua biển mang lại lượng mưa rất phong phú.',
        difficulty: 'medium',
        concept: 'Đặc trưng lượng mưa',
      },
      {
        id: 'dia-3',
        question: 'Đặc điểm thời tiết của miền Bắc nước ta trong nửa sau của mùa đông là gì?',
        options: ['Mưa phùn ẩm ướt', 'Hanh khô, trời quang đãng', 'Nắng gắt và khô hạn gay gắt', 'Bão lũ dồn dập'],
        correctAnswer: 'Mưa phùn ẩm ướt',
        sourceCitation: 'Miền Bắc có mùa đông lạnh, nửa đầu mùa hanh khô, nửa sau mùa mưa phùn ẩm ướt.',
        explanation: 'Chuẩn xác! Nửa sau mùa đông khối không khí lạnh lệch đông đi qua biển mang theo hơi ẩm gây hiện tượng mưa phùn nồm ẩm.',
        difficulty: 'medium',
        concept: 'Gió mùa Đông Bắc',
      },
      {
        id: 'dia-4',
        question: 'Dãy núi nào đóng vai trò là ranh giới tự nhiên phân chia khí hậu hai miền Bắc - Nam của nước ta?',
        options: ['Dãy Bạch Mã', 'Dãy Hoàng Liên Sơn', 'Dãy Trường Sơn Bắc', 'Dãy Hoành Sơn'],
        correctAnswer: 'Dãy Bạch Mã',
        sourceCitation: 'ranh giới là dãy Bạch Mã ở vĩ tuyến 16°B',
        explanation: 'Chính xác! Dãy Bạch Mã đâm ngang ra biển ngăn cản gió mùa Đông Bắc, tạo nên sự khác biệt rõ nét giữa hai miền khí hậu.',
        difficulty: 'hard',
        concept: 'Phân hóa khí hậu',
      },
      {
        id: 'dia-5',
        question: 'Vùng ven biển Trung Bộ vào đầu mùa hạ chịu ảnh hưởng bởi hiện tượng thời tiết đặc biệt nào?',
        options: ['Hiệu ứng phơn khô nóng (gió Lào)', 'Sương muối giá buốt', 'Tuyết rơi dày đặc', 'Mưa đá dồn dập'],
        correctAnswer: 'Hiệu ứng phơn khô nóng (gió Lào)',
        sourceCitation: 'Riêng vùng ven biển Trung Bộ chịu ảnh hưởng của hiệu ứng phơn (gió Lào) khô nóng.',
        explanation: 'Rất đúng! Gió Tây Nam vượt qua dãy Trường Sơn trút hết mưa ở sườn Tây, khi sang sườn Đông trở nên khô và cực kỳ nóng.',
        difficulty: 'medium',
        concept: 'Hiện tượng thời tiết',
      },
    ],
  },
  {
    id: 'khtn-hoa-8',
    name: 'Khoa học tự nhiên (Hóa học)',
    grade: 'Lớp 8',
    subjectCode: 'HÓA',
    icon: '⚗️',
    title: 'Định luật bảo toàn khối lượng & Phản ứng hoá học',
    description: 'Vở ghi phân biệt biến đổi vật lí và biến đổi hoá học, nội dung định luật Lômônôxốp - Lavoadie và phương trình bảo toàn khối lượng.',
    verifiedCount: 5,
    content: `VỞ GHI MÔN KHOA HỌC TỰ NHIÊN 8
Bài: ĐỊNH LUẬT BẢO TOÀN KHỐI LƯỢNG

1. Sự biến đổi chất:
- Hiện tượng vật lí: Là hiện tượng chất bị biến đổi về hình dạng, trạng thái mà vẫn giữ nguyên là chất ban đầu (ví dụ: nước đá tan thành nước lỏng, hòa tan muối ăn vào nước).
- Hiện tượng hoá học: Là hiện tượng chất bị biến đổi có sự tạo thành chất mới (ví dụ: đốt cháy than sinh ra khí carbon dioxide, đinh sắt để ngoài không khí bị gỉ).

2. Nội dung Định luật bảo toàn khối lượng:
- Do hai nhà khoa học Lômônôxốp (Nga) và Lavoadie (Pháp) phát minh độc lập.
- Nội dung: "Trong một phản ứng hoá học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng."

3. Biểu thức áp dụng:
- Giả sử có phản ứng: Chất A + Chất B ---> Chất C + Chất D
- Biểu thức khối lượng: m_A + m_B = m_C + m_D

4. Giải thích bản chất:
- Trong phản ứng hoá học, chỉ có liên kết giữa các nguyên tử bị thay đổi, còn số lượng nguyên tử của mỗi nguyên tố vẫn giữ nguyên trước và sau phản ứng. Khối lượng của các nguyên tử không đổi, vì vậy tổng khối lượng các chất được bảo toàn.`,
    sampleQuestions: [
      {
        id: 'hoa-1',
        question: 'Hiện tượng nào dưới đây là ví dụ của hiện tượng hoá học?',
        options: ['Đốt cháy than sinh ra khí carbon dioxide', 'Nước đá tan chảy thành nước lỏng', 'Hòa tan đường vào cốc nước', 'Xé vụn một tờ giấy trắng'],
        correctAnswer: 'Đốt cháy than sinh ra khí carbon dioxide',
        sourceCitation: 'Hiện tượng hoá học: Là hiện tượng chất bị biến đổi có sự tạo thành chất mới (ví dụ: đốt cháy than sinh ra khí carbon dioxide',
        explanation: 'Chính xác! Đốt than tạo ra chất mới hoàn toàn là khí CO2, trong khi các ví dụ khác chỉ thay đổi trạng thái hoặc hình dạng vật lí.',
        difficulty: 'easy',
        concept: 'Hiện tượng hoá học',
      },
      {
        id: 'hoa-2',
        question: 'Ai là hai nhà khoa học đã độc lập phát minh ra Định luật bảo toàn khối lượng?',
        options: ['Lômônôxốp và Lavoadie', 'Men-đê-lê-ép và Niutơn', 'Anh-xtanh và Paxcan', 'Đác-uyn và Men-đen'],
        correctAnswer: 'Lômônôxốp và Lavoadie',
        sourceCitation: 'Do hai nhà khoa học Lômônôxốp (Nga) và Lavoadie (Pháp) phát minh độc lập.',
        explanation: 'Đúng rồi! Hai nhà bác học vĩ đại đã đặt nền móng cho hóa học định lượng hiện đại.',
        difficulty: 'medium',
        concept: 'Lịch sử phát minh',
      },
      {
        id: 'hoa-3',
        question: 'Nội dung cốt lõi của Định luật bảo toàn khối lượng khẳng định điều gì?',
        options: [
          'Tổng khối lượng sản phẩm bằng tổng khối lượng chất tham gia',
          'Khối lượng sản phẩm luôn lớn gấp đôi chất tham gia',
          'Khối lượng của khí bay đi không cần tính vào bảo toàn',
          'Thể tích chất tham gia bằng thể tích chất sản phẩm',
        ],
        correctAnswer: 'Tổng khối lượng sản phẩm bằng tổng khối lượng chất tham gia',
        sourceCitation: 'Trong một phản ứng hoá học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng.',
        explanation: 'Chuẩn xác! Vật chất không tự nhiên sinh ra hay mất đi, tổng khối lượng luôn được bảo toàn tuyệt đối.',
        difficulty: 'easy',
        concept: 'Nội dung định luật',
      },
      {
        id: 'hoa-4',
        question: 'Vì sao tổng khối lượng được bảo toàn trong mọi phản ứng hoá học?',
        options: [
          'Số lượng nguyên tử của mỗi nguyên tố giữ nguyên',
          'Nhiệt độ của phản ứng không bao giờ thay đổi',
          'Liên kết giữa các nguyên tử luôn cố định',
          'Các electron biến mất hoàn toàn',
        ],
        correctAnswer: 'Số lượng nguyên tử của mỗi nguyên tố giữ nguyên',
        sourceCitation: 'chỉ có liên kết giữa các nguyên tử bị thay đổi, còn số lượng nguyên tử của mỗi nguyên tố vẫn giữ nguyên trước và sau phản ứng.',
        explanation: 'Xuất sắc! Nguyên tử chỉ sắp xếp lại liên kết tạo thành chất mới chứ số lượng nguyên tử của mỗi nguyên tố không đổi.',
        difficulty: 'hard',
        concept: 'Bản chất vi mô',
      },
      {
        id: 'hoa-5',
        question: 'Đốt cháy hoàn toàn 12g than (carbon) trong không khí thu được 44g khí CO2. Khối lượng khí oxygen đã phản ứng là bao nhiêu?',
        options: ['32g', '56g', '24g', '12g'],
        correctAnswer: '32g',
        sourceCitation: 'Biểu thức khối lượng: m_A + m_B = m_C + m_D (áp dụng: m_Carbon + m_Oxygen = m_CO2 => m_Oxygen = 44 - 12 = 32g)',
        explanation: 'Tuyệt đỉnh! Áp dụng định luật: m_C + m_O2 = m_CO2 => m_O2 = 44 - 12 = 32 gam.',
        difficulty: 'hard',
        concept: 'Tính toán hoá học',
      },
    ],
  },
  {
    id: 'ngu-van-9',
    name: 'Ngữ văn',
    grade: 'Lớp 9',
    subjectCode: 'VĂN',
    icon: '📚',
    title: 'Truyện ngắn "Lặng lẽ Sa Pa" - Nguyễn Thành Long',
    description: 'Vở ghi phân tích hoàn cảnh sống, công việc thầm lặng và vẻ đẹp tâm hồn của nhân vật anh thanh niên trên đỉnh Yên Sơn.',
    verifiedCount: 5,
    content: `VỞ GHI MÔN NGỮ VĂN 9
Bài: LẶNG LẼ SA PA (Nguyễn Thành Long)

1. Tác giả và Hoàn cảnh sáng tác:
- Tác giả: Nguyễn Thành Long (1925 - 1991), một cây bút chuyên viết truyện ngắn và kí.
- Hoàn cảnh sáng tác: Tác phẩm được viết vào mùa hè năm 1970, sau chuyến đi thực tế của tác giả lên Lào Cai, trong giai đoạn miền Bắc đang hăng say xây dựng chủ nghĩa xã hội.

2. Hoàn cảnh sống và công việc của Anh thanh niên:
- Anh thanh niên 27 tuổi, sống và làm việc một mình trên đỉnh núi Yên Sơn cao 2600 mét quanh năm mây mù bao phủ.
- Công việc: Làm công tác khí tượng kiêm vật lý địa cầu. Nhiệm vụ là "đo gió, đo mưa, đo nắng, tính mây, đo chấn động mặt đất" để báo cáo dự báo thời tiết hàng ngày và phục vụ chiến đấu.
- Các khung giờ ốp (lấy số liệu): 4 giờ sáng, 11 giờ trưa, 7 giờ tối và 1 giờ đêm. Gian khổ nhất là lúc 1 giờ đêm giữa mùa đông buốt giá.

3. Vẻ đẹp tính cách và tâm hồn:
- Lòng yêu nghề sâu sắc và tinh thần trách nhiệm: Anh xem công việc là bạn ("khi ta làm việc, ta với công việc là đôi, sao gọi là một mình được?").
- Lối sống ngăn nắp, lạc quan, giàu tình cảm: Trồng hoa cẩm tú cầu, nuôi gà, đọc sách nghiên cứu, niềm nở tiếp đón khách và tặng hoa cho cô kỹ sư, tặng giỏ trứng gà cho ông họa sĩ già.
- Đức tính khiêm tốn: Khi ông họa sĩ muốn vẽ chân dung, anh từ chối và nhiệt tình giới thiệu những tấm gương cống hiến thầm lặng khác như ông kĩ sư vườn rau hay anh đồng chí nghiên cứu bản đồ sét.`,
    sampleQuestions: [
      {
        id: 'van-1',
        question: 'Nhân vật Anh thanh niên trong truyện ngắn "Lặng lẽ Sa Pa" bao nhiêu tuổi và làm việc ở độ cao nào?',
        options: ['27 tuổi, trên đỉnh núi Yên Sơn cao 2600m', '20 tuổi, trên đỉnh Phan-xi-păng cao 3143m', '35 tuổi, tại thung lũng Sa Pa', '25 tuổi, trên đèo Hải Vân cao 1500m'],
        correctAnswer: '27 tuổi, trên đỉnh núi Yên Sơn cao 2600m',
        sourceCitation: 'Anh thanh niên 27 tuổi, sống và làm việc một mình trên đỉnh núi Yên Sơn cao 2600 mét quanh năm mây mù bao phủ.',
        explanation: 'Chính xác! Hoàn cảnh sống đơn độc giữa đỉnh núi mây mù càng làm tôn lên vẻ đẹp phi thường của anh.',
        difficulty: 'easy',
        concept: 'Chi tiết tác phẩm',
      },
      {
        id: 'van-2',
        question: 'Nhiệm vụ chuyên môn chính của Anh thanh niên trên trạm khí tượng là gì?',
        options: [
          'Đo gió, đo mưa, đo nắng, tính mây, đo chấn động mặt đất',
          'Trồng trọt và bảo tồn các loài hoa quý hiếm Sa Pa',
          'Tuần tra biên giới và bắt lâm tặc phá rừng',
          'Vẽ tranh phong cảnh và dẫn đường cho đoàn xe khách',
        ],
        correctAnswer: 'Đo gió, đo mưa, đo nắng, tính mây, đo chấn động mặt đất',
        sourceCitation: 'Nhiệm vụ là "đo gió, đo mưa, đo nắng, tính mây, đo chấn động mặt đất" để báo cáo dự báo thời tiết hàng ngày',
        explanation: 'Rất chính xác! Công việc đòi hỏi sự tỉ mỉ, chuẩn xác đến từng phút dù mưa bão giá rét.',
        difficulty: 'medium',
        concept: 'Nội dung công việc',
      },
      {
        id: 'van-3',
        question: 'Khung giờ lấy số liệu khí tượng (ốp) nào được xem là thử thách gian khổ nhất đối với anh thanh niên?',
        options: ['1 giờ đêm giữa mùa đông buốt giá', '11 giờ trưa lúc nắng gắt', '4 giờ sáng mùa thu', '7 giờ tối sau bữa ăn'],
        correctAnswer: '1 giờ đêm giữa mùa đông buốt giá',
        sourceCitation: 'Gian khổ nhất là lúc 1 giờ đêm giữa mùa đông buốt giá.',
        explanation: 'Đúng rồi! Nửa đêm phải trở dậy ra ngoài trời rét căm căm, gió thốc từng cơn để lấy số liệu gửi về trung tâm.',
        difficulty: 'medium',
        concept: 'Chi tiết nghệ thuật',
      },
      {
        id: 'van-4',
        question: 'Câu nói nào của Anh thanh niên thể hiện sâu sắc nhất quan niệm sống và tình yêu lao động?',
        options: [
          '"Khi ta làm việc, ta với công việc là đôi, sao gọi là một mình được?"',
          '"Sống ở đây buồn lắm, cháu muốn bỏ về xuôi"',
          '"Cháu chỉ thích trồng hoa chứ không ham công việc"',
          '"Vẽ cháu làm gì, cháu là người tài giỏi nhất Sa Pa rồi"',
        ],
        correctAnswer: '"Khi ta làm việc, ta với công việc là đôi, sao gọi là một mình được?"',
        sourceCitation: 'Anh xem công việc là bạn ("khi ta làm việc, ta với công việc là đôi, sao gọi là một mình được?").',
        explanation: 'Tuyệt vời! Đây là tuyên ngôn sống đẹp của thế hệ thanh niên Việt Nam thời kỳ xây dựng và bảo vệ Tổ quốc.',
        difficulty: 'hard',
        concept: 'Tư tưởng tác phẩm',
      },
      {
        id: 'van-5',
        question: 'Khi ông họa sĩ già ngỏ ý muốn vẽ chân dung, thái độ của Anh thanh niên như thế nào?',
        options: [
          'Khiêm tốn từ chối và giới thiệu những người cống hiến thầm lặng khác',
          'Lập tức đồng ý và tạo dáng tự hào',
          'Từ chối vì tức giận và muốn khách rời đi ngay',
          'Đòi ông họa sĩ phải trả tiền công vẽ chân dung',
        ],
        correctAnswer: 'Khiêm tốn từ chối và giới thiệu những người cống hiến thầm lặng khác',
        sourceCitation: 'Khi ông họa sĩ muốn vẽ chân dung, anh từ chối và nhiệt tình giới thiệu những tấm gương cống hiến thầm lặng khác',
        explanation: 'Chuẩn xác! Anh khiêm nhường tự thấy mình nhỏ bé so với ông kĩ sư vườn rau hay anh cán bộ bản đồ sét.',
        difficulty: 'medium',
        concept: 'Tính cách nhân vật',
      },
    ],
  },
  {
    id: 'gdcd-8',
    name: 'Giáo dục công dân (GDCD)',
    grade: 'Lớp 8',
    subjectCode: 'GDCD',
    icon: '⚖️',
    title: 'Quyền và Nghĩa vụ của Công dân đối với Gia đình',
    description: 'Vở ghi về trách nhiệm của cha mẹ, bổn phận con cháu hiếu thảo, bình đẳng trong hôn nhân và gia đình theo Luật Hôn nhân & Gia đình.',
    verifiedCount: 5,
    content: `VỞ GHI MÔN GIÁO DỤC CÔNG DÂN 8
Bài: QUYỀN VÀ NGHĨA VỤ CỦA CÔNG DÂN TRONG GIA ĐÌNH

1. Khái niệm gia đình:
- Gia đình là tập hợp những người gắn bó với nhau do hôn nhân, quan hệ huyết thống hoặc quan hệ nuôi dưỡng, làm phát sinh các quyền và nghĩa vụ giữa họ với nhau.

2. Quyền và nghĩa vụ của con cái, cháu chắt:
- Yêu quý, kính trọng, biết ơn và hiếu thảo với cha mẹ, ông bà.
- Có bổn phận chăm sóc, phụng dưỡng cha mẹ, ông bà, đặc biệt khi cha mẹ già yếu, ốm đau.
- Nghiêm cấm con cái có hành vi ngược đãi, xúc phạm hoặc bạo lực gia đình đối với cha mẹ, ông bà.

3. Quyền và nghĩa vụ của cha mẹ đối với con:
- Nuôi dưỡng, chăm sóc, bảo vệ quyền và lợi ích hợp pháp của con.
- Giáo dục con, tôn trọng ý kiến chính đáng của con, tạo điều kiện cho con học tập và phát triển toàn diện.
- Không được phân biệt đối xử giữa các con (con trai - con gái, con đẻ - con nuôi), không ép buộc con làm những việc trái pháp luật hoặc đạo đức xã hội.

4. Mối quan hệ giữa anh chị em:
- Anh, chị, em có bổn phận thương yêu, chăm sóc, giúp đỡ nhau; có nghĩa vụ nuôi dưỡng nhau trong trường hợp không còn cha mẹ.`,
    sampleQuestions: [
      {
        id: 'gdcd-1',
        question: 'Gia đình là tập hợp những người gắn bó với nhau dựa trên những mối quan hệ cơ bản nào?',
        options: [
          'Hôn nhân, huyết thống hoặc quan hệ nuôi dưỡng',
          'Quan hệ hợp đồng lao động và trả lương',
          'Quan hệ bạn bè quen biết trên mạng xã hội',
          'Quan hệ kinh doanh buôn bán bất động sản',
        ],
        correctAnswer: 'Hôn nhân, huyết thống hoặc quan hệ nuôi dưỡng',
        sourceCitation: 'Gia đình là tập hợp những người gắn bó với nhau do hôn nhân, quan hệ huyết thống hoặc quan hệ nuôi dưỡng',
        explanation: 'Chính xác! Gia đình gắn kết thiêng liêng bởi tình thân, pháp lý hôn nhân hoặc nhận nuôi con hợp pháp.',
        difficulty: 'easy',
        concept: 'Khái niệm gia đình',
      },
      {
        id: 'gdcd-2',
        question: 'Hành vi nào dưới đây bị pháp luật nghiêm cấm đối với con cái trong gia đình?',
        options: [
          'Ngược đãi, xúc phạm hoặc bạo lực với cha mẹ',
          'Tự giác giúp đỡ cha mẹ việc nhà sau giờ học',
          'Chăm sóc cha mẹ khi đau ốm',
          'Nỗ lực đạt thành tích học tập tốt',
        ],
        correctAnswer: 'Ngược đãi, xúc phạm hoặc bạo lực với cha mẹ',
        sourceCitation: 'Nghiêm cấm con cái có hành vi ngược đãi, xúc phạm hoặc bạo lực gia đình đối với cha mẹ, ông bà.',
        explanation: 'Đúng rồi! Bất hiếu và bạo lực gia đình là hành vi vừa vi phạm đạo đức nghiêm trọng vừa bị pháp luật xử phạt.',
        difficulty: 'easy',
        concept: 'Nghĩa vụ con cái',
      },
      {
        id: 'gdcd-3',
        question: 'Trách nhiệm của cha mẹ đối với con cái về mặt giáo dục và phát triển là gì?',
        options: [
          'Tôn trọng ý kiến chính đáng và tạo điều kiện cho con học tập',
          'Ép buộc con phải bỏ học sớm để đi làm kiếm tiền',
          'Phân biệt đối xử ưu tiên con trai hơn con gái',
          'Không cho phép con tham gia các hoạt động xã hội',
        ],
        correctAnswer: 'Tôn trọng ý kiến chính đáng và tạo điều kiện cho con học tập',
        sourceCitation: 'Giáo dục con, tôn trọng ý kiến chính đáng của con, tạo điều kiện cho con học tập và phát triển toàn diện.',
        explanation: 'Chuẩn xác! Cha mẹ có nghĩa vụ tạo môi trường lành mạnh, bình đẳng cho con phát triển tài năng và nhân cách.',
        difficulty: 'medium',
        concept: 'Nghĩa vụ cha mẹ',
      },
      {
        id: 'gdcd-4',
        question: 'Trong trường hợp cha mẹ không còn, ai có nghĩa vụ thương yêu, nuôi dưỡng và đùm bọc các em?',
        options: ['Anh, chị em trong gia đình', 'Người hàng xóm bất kỳ', 'Chính quyền địa phương đưa đi xa', 'Tự lập không cần ai'],
        correctAnswer: 'Anh, chị em trong gia đình',
        sourceCitation: 'Anh, chị, em có bổn phận thương yêu, chăm sóc, giúp đỡ nhau; có nghĩa vụ nuôi dưỡng nhau trong trường hợp không còn cha mẹ.',
        explanation: 'Xuất sắc! "Anh em như thể tay chân", tình thân gia đình luôn là chỗ dựa vững chãi nhất trong cuộc sống.',
        difficulty: 'medium',
        concept: 'Tình cảm anh em',
      },
      {
        id: 'gdcd-5',
        question: 'Quan điểm nào thể hiện đúng nhất nguyên tắc bình đẳng giữa các con trong gia đình?',
        options: [
          'Không phân biệt đối xử giữa con trai - con gái, con đẻ - con nuôi',
          'Chỉ chăm sóc con đầu lòng, mặc kệ con út',
          'Con nuôi không có quyền được học hành như con đẻ',
          'Con gái không được thừa kế quyền học tập',
        ],
        correctAnswer: 'Không phân biệt đối xử giữa con trai - con gái, con đẻ - con nuôi',
        sourceCitation: 'Không được phân biệt đối xử giữa các con (con trai - con gái, con đẻ - con nuôi)',
        explanation: 'Quá chuẩn! Mọi người con đều có giá trị và quyền được yêu thương, chăm sóc công bằng như nhau.',
        difficulty: 'easy',
        concept: 'Bình đẳng giới trong gia đình',
      },
    ],
  },
];
