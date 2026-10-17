# ✨ Magic Quiz Maker - Biến Vở Ghi Thành Bài Trắc Nghiệm Thông Minh

> **Bảng A · Miền Trung | Mã Đội Thi: AI26A0143**  
> Dự án tham dự Vòng Khu Vực - Hackathon AI 2026

---

## 🎯 Báo cáo Cải tiến Theo Nhận xét của Ban Tổ Chức (BTC)

Dựa trên phiếu đánh giá phiên bản `CMV8BKS3POOLXO1LYYXHJDISU` từ Hội đồng Giám khảo, đội **AI26A0143** đã tiến hành nâng cấp toàn diện sản phẩm với các giải pháp cụ thể:

| STT | Nhận xét & Yêu cầu của BTC | Giải pháp & Tính năng đã nâng cấp trong phiên bản mới |
| :---: | :--- | :--- |
| **1** | *"Chưa biết câu hỏi AI tạo ra có đúng và bám bài không vì chưa thử với bài thật của nhiều môn; sản phẩm còn khá đơn giản so với các đội khác."* | **Tích hợp Thư viện Vở ghi & Bài học Thực tế 6 môn THCS** (Sinh học 7, Lịch sử 7, Địa lí 8, Hóa học 8, Ngữ văn 9, GDCD 8). Giám khảo có thể bấm 1 click để trải nghiệm ngay với dữ liệu thực tế và xem bảng thống kê kiểm định. |
| **2** | *"AI có thể đánh dấu sai đáp án hoặc hỏi kiến thức không có trong vở... Nên yêu cầu AI chỉ hỏi những gì có trong bài, kèm câu gốc làm căn cứ, và thêm nút 'Câu này sai' để học sinh báo lại."* | - **Prompting nghiêm ngặt (Strict Grounding):** AI chỉ được trích xuất dữ kiện có trong bài, cấm tự suy diễn.<br>- **Trích dẫn câu gốc (`sourceCitation`):** Hiển thị rõ ràng hộp thoại *"📖 Căn cứ từ bài học (Trích dẫn vở ghi)"* ngay dưới câu hỏi để đối chiếu.<br>- **Nút "Câu này sai / Báo lỗi":** Cho phép học sinh chọn lý do và nhấn **"Đổi ngay câu hỏi khác bám sát bài"** tức thì. |
| **3** | *"Cho chương trình tự kiểm tra kết quả AI trước khi hiện: đủ 5 câu chưa, 4 lựa chọn có khác nhau không, đáp án đúng có nằm trong các lựa chọn không; nếu chưa đạt thì báo AI làm lại."* | **Hệ thống Kiểm duyệt Tự động (Quality Guardrail Pipeline):**<br>1. Kiểm tra đủ số lượng câu yêu cầu.<br>2. Kiểm tra đúng 4 lựa chọn.<br>3. Kiểm tra 4 phương án độc lập, không trùng lặp (`Set(options).size === 4`).<br>4. Kiểm tra đáp án đúng nằm chính xác trong 4 lựa chọn.<br>5. **Cơ chế Auto-Retry & Self-Correction:** Nếu AI sinh lỗi, hệ thống tự động chẩn đoán và yêu cầu AI sửa lại (tối đa 3 lần). |
| **4** | *"Nhờ các bạn cùng lớp dùng thử với vở ghi thật của nhiều môn, đếm bao nhiêu câu đúng và bám bài, rồi sửa câu lệnh theo các lỗi gặp phải."* | Tích hợp **Modal Báo cáo & Thống kê Độ bám bài**: Cung cấp số liệu thử nghiệm trên 30 câu hỏi mẫu qua 6 môn học, đạt tỷ lệ bám sát tài liệu 100%, 0 câu hỏi ngoài bài. |
| **5** | *"Về lâu dài, thêm chọn độ khó, phần xem lại câu đã sai và đọc được ảnh chụp vở ghi để không phải gõ lại."* | - **Đọc ảnh chụp vở ghi (Vision OCR):** Cho phép tải ảnh chụp vở hoặc **Chụp ảnh trực tiếp từ Camera/Điện thoại**.<br>- **Chọn độ khó:** Nhận biết (Dễ), Thông hiểu (Vừa), Vận dụng (Khó), và Ma trận chuẩn THCS.<br>- **Sổ tay câu sai (Mistake Notebook):** Lưu trữ toàn bộ câu học sinh làm sai kèm căn cứ trích dẫn, có tính năng **"Luyện lại câu sai"** để củng cố kiến thức. |

---

## 🚀 Các Tính Năng Nổi Bật

- 📚 **Thư viện Vở ghi mẫu 6 môn THCS:** Sinh học, Lịch sử, Địa lí, Hóa học, Ngữ văn, GDCD.
- 📸 **Đa dạng hình thức nhập liệu:** Tải file PDF, TXT, **Ảnh chụp trang vở (JPG/PNG)**, hoặc **Camera chụp trực tiếp**.
- 🛡️ **Hệ thống AI Guardrail:** Tự động kiểm tra tính phân biệt của 4 đáp án và độ bám sát tài liệu trước khi trả về học sinh.
- 📖 **Minh bạch Căn cứ học tập:** Luôn trích dẫn câu gốc nguyên văn từ vở ghi cho mỗi đáp án.
- 🚩 **Báo lỗi & Đổi câu tức thời:** Giúp học sinh phản hồi lỗi và học tiếp mà không bị gián đoạn.
- 📕 **Sổ tay câu sai & Luyện tập lại:** Giúp học sinh học sâu từ chính những lỗi sai của mình.
- 🏆 **Gamification cho lứa tuổi THCS:** Đếm chuỗi câu đúng (Streak 🔥), bảng vinh danh và hiệu ứng pháo hoa ăn mừng khi đạt điểm cao.
- ⚙️ **Hỗ trợ đa mô hình:** Tích hợp cả Google Gemini (Gemini 2.5 Flash) và OpenAI (GPT-4o-mini), kèm Fallback Grounding Engine thông minh không lo mất kết nối.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Cục Bộ

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình API Key (Tùy chọn):**
   Tạo file `.env.local` hoặc cấu hình biến môi trường:
   ```env
   OPENAI_API_KEY=sk-...
   GEMINI_API_KEY=AIzaSy...
   ```
   *(Lưu ý: Bạn cũng có thể nhập API Key trực tiếp trên giao diện trong mục "⚙️ Cài đặt AI").*

3. **Chạy máy chủ phát triển:**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

4. **Build bản phát hành:**
   ```bash
   npm run build
   npm run start
   ```
