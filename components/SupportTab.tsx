import React from 'react';
import Icon from './Icon';

const SupportTab: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-5">Thông tin Hỗ trợ Kỹ thuật</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-8">
                {/* Section 1: Contact Info */}
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                        <Icon path="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.5-1.05.5-2.175.8-3.363.8H7.5a4.5 4.5 0 010-9h.75c1.188 0 2.313.3 3.363.8.523.29.71.95.463 1.5-.401.891-.732 1.821-.985 2.783m0 0a5.25 5.25 0 01.48-2.653c.196-.842.3-1.717.3-2.61 0-.894-.104-1.768-.3-2.61a5.25 5.25 0 01-.48-2.653m0 0c-.09.328-.19.65-.29.965l.29-.965m0 0c.09.328.19.65.29.965l-.29-.965m0 0-3.184 9.552a4.5 4.5 0 01-8.384-2.822l3.184-9.552m0 0c.962-.253 1.892-.584 2.783-.985.55-.247 1.21-.06 1.5.463.5 1.05.8 2.175.8 3.363 0 1.188-.3 2.313-.8 3.363-.29.523-.95.71-1.5.463-.891-.401-1.821-.732-2.783-.985m0 0c.328.09.65.19.965.29l-.965-.29Z" className="w-8 h-8 text-blue-700" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Đơn vị đầu mối hỗ trợ vận hành HTTT Báo cáo</h3>
                        <p className="text-slate-700">Trung tâm Chuyển đổi số tỉnh Khánh Hòa</p>
                        <p className="text-lg font-bold text-red-600 mt-1">SĐT: 0937.87.40.87</p>
                    </div>
                </div>

                {/* Section 2: Common Issues */}
                <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        2. Những vấn đề Tổ có thể hỗ trợ và khó khăn thường gặp
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 border">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nhóm vấn đề</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Khó khăn địa phương thường gặp</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nội dung Tổ hỗ trợ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200 text-sm">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-800 align-top">Thiết kế biểu mẫu báo cáo</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Chưa nắm rõ cấu trúc mẫu; ràng buộc chỉ tiêu; thiết kế cột – hàng</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Hướng dẫn trực tiếp; tham chiếu mẫu chuẩn; rà soát logic dữ liệu</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-800 align-top">Quy trình giao – nhận báo cáo</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Không nhận được báo cáo; sai kỳ dữ liệu; sai đơn vị nhận</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Kiểm tra cấu hình giao báo cáo; thiết lập lại lịch kỳ và đơn vị thực hiện</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-800 align-top">Nhập và tổng hợp số liệu</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Dữ liệu sai, trùng, thiếu; không biết từ chối / yêu cầu nhập lại</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Đào tạo cách kiểm soát chất lượng số liệu và luồng xử lý dữ liệu</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-800 align-top">Ký số và phát hành báo cáo</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Không ký được; bản đã ký không gửi lên cấp trên</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Kiểm tra chứng thư số, phân quyền ký và trao đổi với đơn vị cung cấp HSM nếu cần</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-800 align-top">Tổ chức triển khai trong đơn vị</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Vai trò, phân quyền chưa rõ</td>
                                    <td className="px-4 py-3 text-slate-600 align-top">Hướng dẫn thiết lập cơ cấu người dùng, phân quyền nhiệm vụ</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-sm text-slate-600 bg-slate-100 p-3 rounded-md">
                        <strong>Lưu ý:</strong> Khi địa phương gặp tình huống lỗi hệ thống, Tổ sẽ hỗ trợ xác định nguyên nhân (lỗi người dùng / dữ liệu / hệ thống / hạ tầng) và hướng dẫn giải pháp phù hợp.
                    </p>
                </div>

                {/* Section 3: Support Methods */}
                <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        3. Cách thức và phương án hỗ trợ
                    </h3>
                    <ul className="list-disc list-inside space-y-3 text-slate-700 text-sm">
                        <li><span className="font-medium">Hỗ trợ từ xa:</span> Qua Zalo nhóm, họp trực tuyến, điện thoại hỗ trợ nhanh.</li>
                        <li><span className="font-medium">Hỗ trợ trực tiếp tại đơn vị:</span> Khi có yêu cầu hoặc khi cần thiết phải can thiệp cấu hình/đào tạo diện rộng.</li>
                        <li>
                            <span className="font-medium">Lộ trình xử lý yêu cầu hỗ trợ:</span>
                            <ol className="list-decimal list-inside ml-5 mt-2 space-y-1">
                                <li>Tiếp nhận yêu cầu → phân loại mức độ ưu tiên.</li>
                                <li>Hướng dẫn xử lý ngay (nếu lỗi thao tác).</li>
                                <li>Kiểm tra cấu hình, truy vết hệ thống (nếu lỗi kỹ thuật).</li>
                                <li>Tổng hợp, báo cáo cấp có thẩm quyền (nếu cần thay đổi hệ thống ở mức cao).</li>
                            </ol>
                        </li>
                        <li><span className="font-medium">Cam kết hỗ trợ:</span> Giải quyết yêu cầu trong vòng 24–48h tùy mức độ.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SupportTab;
