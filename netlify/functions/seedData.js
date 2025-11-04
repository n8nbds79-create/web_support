
const LEGAL_DOCUMENTS_SEED_DATA = [
    {
        id: 'nd09',
        ten: 'Nghị định số 09/2019/NĐ-CP (Cấp Quốc gia)',
        moTa: 'Quy định chung về chế độ báo cáo của cơ quan hành chính nhà nước.',
        diemMauChot: [
            'Nguyên tắc: Kịp thời, chính xác, không trùng lắp, giảm gánh nặng hành chính.',
            'Phân loại: Báo cáo định kỳ, chuyên đề, và đột xuất.',
            'Định hướng: Đẩy mạnh CNTT, xây dựng Hệ thống thông tin báo cáo quốc gia.'
        ],
        noiDung: "Nghị định 09/2019/NĐ-CP quy định về chế độ báo cáo của các cơ quan hành chính nhà nước. Các nguyên tắc chính bao gồm: Kịp thời, chính xác, không trùng lắp, và giảm gánh nặng hành chính cho các cơ quan. Báo cáo được phân thành ba loại: báo cáo định kỳ (theo tháng, quý, năm), báo cáo chuyên đề (theo yêu cầu cụ thể), và báo cáo đột xuất (khi có sự kiện bất thường). Nghị định cũng nhấn mạnh việc ứng dụng công nghệ thông tin và xây dựng Hệ thống thông tin báo cáo quốc gia để đồng bộ và hiện đại hóa công tác báo cáo."
    },
    {
        id: 'qd01',
        ten: 'Quyết định số 01/2023/QĐ-UBND (Tỉnh Khánh Hòa)',
        moTa: 'Quy định chế độ báo cáo định kỳ trên địa bàn tỉnh ("LUẬT CHƠI").',
        diemMauChot: [
            '<strong>Thời gian chốt số liệu báo cáo (Điều 4):</strong>',
            ' - Báo cáo định kỳ hàng tháng: Tính từ ngày 15 tháng trước đến ngày 14 của tháng thuộc kỳ báo cáo.',
            ' - Báo cáo định kỳ hàng quý: Tính từ ngày 15 tháng trước đến ngày 14 của tháng cuối quý thuộc kỳ báo cáo.',
            ' - Báo cáo định kỳ 6 tháng: Tính từ ngày 15 tháng 12 của năm trước kỳ báo cáo đến ngày 14 tháng 6 của kỳ báo cáo.',
            ' - Báo cáo định kỳ 9 tháng: Tính từ ngày 15 tháng 12 của năm trước kỳ báo cáo đến ngày 14 tháng 9 của kỳ báo cáo.',
            ' - Báo cáo định kỳ năm: Tính từ ngày 15 tháng 12 của năm trước kỳ báo cáo đến ngày 14 tháng 12 của kỳ báo cáo.',
            '<strong>Thời hạn gửi:</strong> 02 ngày làm việc kể từ ngày chốt số liệu.'
        ],
        noiDung: "Theo Điều 4 của Quyết định 01/2023/QĐ-UBND tỉnh Khánh Hòa, thời gian chốt số liệu báo cáo định kỳ được quy định như sau: Báo cáo tháng tính từ ngày 15 tháng trước đến ngày 14 của tháng báo cáo. Báo cáo quý tính từ ngày 15 tháng trước đến ngày 14 của tháng cuối quý. Báo cáo 6 tháng tính từ 15/12 năm trước đến 14/6 của kỳ báo cáo. Báo cáo 9 tháng tính từ 15/12 năm trước đến 14/9 của kỳ báo cáo. Báo cáo năm tính từ 15/12 năm trước đến 14/12 của kỳ báo cáo. Thời hạn gửi báo cáo là 02 ngày làm việc kể từ ngày chốt số liệu."
    },
    {
        id: 'qd1603',
        ten: 'Quyết định số 1603/QĐ-UBND (Tỉnh Khánh Hòa)',
        moTa: 'Ban hành Bộ chỉ tiêu phục vụ chỉ đạo điều hành ("NỘI DUNG CHƠI").',
        diemMauChot: [
            'Quy định cụ thể "Báo cáo cái gì?".',
            'Là danh mục chi tiết các chỉ tiêu KT-XH, AN-QP.',
            'Ví dụ: GRDP (Cục Thống kê), Thu NSNN (Sở Tài chính), Khách lưu trú (Sở Du lịch)...',
            'Là "đầu vào" dữ liệu cho Hệ thống thông tin báo cáo.'
        ],
        noiDung: "Quyết định 1603/QĐ-UBND ban hành Bộ chỉ tiêu kinh tế - xã hội, an ninh - quốc phòng phục vụ công tác chỉ đạo, điều hành của tỉnh Khánh Hòa. Đây là danh mục quy định rõ các nội dung cần báo cáo. Ví dụ, Cục Thống kê chịu trách nhiệm báo cáo chỉ tiêu GRDP; Sở Tài chính báo cáo Thu ngân sách nhà nước; Sở Du lịch báo cáo về lượng khách lưu trú. Các chỉ tiêu này là nguồn dữ liệu đầu vào quan trọng cho Hệ thống thông tin báo cáo của tỉnh."
    },
    {
        id: 'qd2838',
        ten: 'Quyết định số 2838/QĐ-UBND (Tỉnh Khánh Hòa)',
        moTa: 'Quy chế quản lý, vận hành, khai thác Hệ thống TTBC ("QUY CHẾ SÂN CHƠI").',
        diemMauChot: [
            'Địa chỉ hệ thống: <code>https://baocao.khanhhoa.gov.vn</code>',
            'Báo cáo phải được <strong>ký số</strong> trước khi gửi.',
            'Nếu hệ thống lỗi: Gửi qua E-Office và cập nhật lại sau.',
            '<strong>Sở TTTT:</strong> Quản lý kỹ thuật, vận hành hệ thống.',
            '<strong>Sở KH&ĐT:</strong> Chủ trì rà soát Bộ chỉ tiêu (QĐ 1603).',
            '<strong>Văn phòng UBND tỉnh:</strong> Chủ trì rà soát Chế độ báo cáo (QĐ 01).'
        ],
        noiDung: "Quyết định 2838/QĐ-UBND ban hành quy chế quản lý và vận hành Hệ thống thông tin báo cáo của tỉnh tại địa chỉ baocao.khanhhoa.gov.vn. Quy chế yêu cầu tất cả báo cáo phải được ký số trước khi gửi. Trong trường hợp hệ thống gặp sự cố, các đơn vị gửi báo cáo qua hệ thống E-Office và cập nhật lại lên hệ thống báo cáo ngay sau khi sự cố được khắc phục. Quyết định phân công rõ trách nhiệm: Sở Thông tin và Truyền thông quản lý kỹ thuật; Sở Kế hoạch và Đầu tư rà soát Bộ chỉ tiêu; Văn phòng UBND tỉnh rà soát Chế độ báo cáo."
    }
];

module.exports = { LEGAL_DOCUMENTS_SEED_DATA };
