
import React, { useState, useMemo, useEffect, useRef } from 'react';

// Make Chart.js available from the global scope (since it's loaded via <script>)
declare const Chart: any;

// --- Data types ---
interface InputField {
    id: string;
    label: string;
    type: 'number';
}

interface CalculationResult {
    soLuong: number;
    kinhPhi: number;
    label?: string;
}

interface DataItem {
    id: string;
    name: string;
    thamChieu: string;
    tieuChuan: string;
    khaoSatRef: string;
    donGia: number;
    congThuc: string;
    inputs: InputField[];
    calculate: (inputs: Record<string, number>) => CalculationResult;
}

// --- Component Data ---
const dataItems: DataItem[] = [
    {
        id: 'maytinh',
        name: 'Cột 3: Máy tính',
        thamChieu: 'Phụ lục II, Mục A (Nhóm VII, VIII)',
        tieuChuan: '01 bộ/chiếc cho mỗi CBCCVC (Nhóm VIII).',
        khaoSatRef: 'Mục I.3 + I.5 (Tổng CBCCVC); Mục II.1 (Tổng số máy tính hiện có)',
        donGia: 20, // Triệu VNĐ
        congThuc: '`Số cần bổ sung = (Tổng số CBCCVC) - (Số máy tính hiện có)`',
        inputs: [
            { id: 'tongBienChe', label: 'Tổng số CBCCVC (Mục I.3 + I.5)', type: 'number' },
            { id: 'soHienCo', label: 'Số máy tính hiện có (Mục II.1)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tongBC = inputs.tongBienChe || 0;
            const hienCo = inputs.soHienCo || 0;
            const canMua = Math.max(0, tongBC - hienCo);
            const kinhPhi = canMua * 20;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'mayin',
        name: 'Cột 4: Máy in',
        thamChieu: 'Phụ lục II, Mục B, STT 2 (Ghi chú)',
        tieuChuan: '01 chiếc/03 biên chế (Nhóm VIII). Làm tròn lên.',
        khaoSatRef: 'Mục I.3 + I.5 (Tổng CBCCVC Nhóm VIII); Mục II.2 (Tổng số máy in hiện có)',
        donGia: 13, // Triệu VNĐ
        congThuc: '`Số tiêu chuẩn = LÀM_TRÒN_LÊN(Tổng CBCCVC / 3)`\n`Số cần bổ sung = (Số tiêu chuẩn) - (Số máy in hiện có)`',
        inputs: [
            { id: 'bcNhomVIII', label: 'Tổng CBCCVC (Mục I.3 + I.5)', type: 'number' },
            { id: 'soHienCo', label: 'Số máy in hiện có (Mục II.2)', type: 'number' }
        ],
        calculate: (inputs) => {
            const bcVIII = inputs.bcNhomVIII || 0;
            const hienCo = inputs.soHienCo || 0;
            const tieuChuan = Math.ceil(bcVIII / 3);
            const canMua = Math.max(0, tieuChuan - hienCo);
            const kinhPhi = canMua * 13;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'mayscan',
        name: 'Cột 5: Máy scan',
        thamChieu: 'Phụ lục II, Mục B, STT 3 (Ghi chú)',
        tieuChuan: '01 chiếc/15 biên chế (toàn bộ). Làm tròn lên.',
        khaoSatRef: 'Mục I.3 + I.5 (Tổng CBCCVC); Mục II.2 (Tổng số máy scan hiện có)',
        donGia: 22, // Triệu VNĐ
        congThuc: '`Số tiêu chuẩn = LÀM_TRÒN_LÊN(Tổng CBCCVC / 15)`\n`Số cần bổ sung = (Số tiêu chuẩn) - (Số máy scan hiện có)`',
        inputs: [
            { id: 'tongBienChe', label: 'Tổng CBCCVC (Mục I.3 + I.5)', type: 'number' },
            { id: 'soHienCo', label: 'Số máy scan hiện có (Mục II.2)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tongBC = inputs.tongBienChe || 0;
            const hienCo = inputs.soHienCo || 0;
            const tieuChuan = Math.ceil(tongBC / 15);
            const canMua = Math.max(0, tieuChuan - hienCo);
            const kinhPhi = canMua * 22;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'vcs',
        name: 'Cột 6: Bộ thiết bị họp trực tuyến (VCS)',
        thamChieu: 'Điều 6 (MMTB chuyên dùng) hoặc Điều 4, Khoản 3',
        tieuChuan: 'Không quy định cứng. Do cơ quan có thẩm quyền quyết định theo nhu cầu.',
        khaoSatRef: 'Mục II.4 (Số lượng bộ thiết bị VCS)',
        donGia: 0, // Đơn giá tự nhập
        congThuc: '`Số cần bổ sung = (Số phòng họp cần trang bị) - (Số bộ VCS hiện có)`',
        inputs: [
            { id: 'soPhongHop', label: 'Số phòng họp cần trang bị', type: 'number' },
            { id: 'soHienCo', label: 'Số bộ VCS hiện có (Mục II.4)', type: 'number' },
            { id: 'donGia', label: 'Đơn giá dự kiến / bộ (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const soPhong = inputs.soPhongHop || 0;
            const hienCo = inputs.soHienCo || 0;
            const donGia = inputs.donGia || 0;
            const canMua = Math.max(0, soPhong - hienCo);
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'phanmem',
        name: 'Cột 7: Bộ phần mềm bản quyền',
        thamChieu: 'Ghi chú Phụ lục II',
        tieuChuan: 'Đi kèm máy tính mua mới. Giá máy tính (20tr) chưa bao gồm phần mềm.',
        khaoSatRef: 'Mục II.1 (Tổng CBCCVC được trang bị PM bản quyền)',
        donGia: 0, // Đơn giá tự nhập
        congThuc: '`Số phần mềm cần mua = (Tổng CBCCVC) - (Số CBCCVC đã có PM)`',
        inputs: [
            { id: 'tongBienChe', label: 'Tổng số CBCCVC (Mục I.3 + I.5)', type: 'number' },
            { id: 'soHienCo', label: 'Số CBCCVC đã có PM (Mục II.1)', type: 'number' },
            { id: 'donGia', label: 'Đơn giá phần mềm / máy (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tongBC = inputs.tongBienChe || 0;
            const hienCo = inputs.soHienCo || 0;
            const donGia = inputs.donGia || 0;
            const canMua = Math.max(0, tongBC - hienCo);
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'tuonglua',
        name: 'Cột 8: Tường lửa (Firewall)',
        thamChieu: 'Điều 6 (MMTB chuyên dùng)',
        tieuChuan: 'Không quy định cứng. Trang bị theo nhu cầu bảo mật.',
        khaoSatRef: 'Mục II.3.7 (Số lượng thiết bị bảo mật)',
        donGia: 0, 
        congThuc: '`Số cần bổ sung = (Số lượng tiêu chuẩn) - (Số hiện có)`',
        inputs: [
            { id: 'soTieuChuan', label: 'Số lượng cần theo thiết kế', type: 'number' },
            { id: 'soHienCo', label: 'Số lượng hiện có (Mục II.3.7)', type: 'number' },
            { id: 'donGia', label: 'Đơn giá dự kiến / thiết bị (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tieuChuan = inputs.soTieuChuan || 0;
            const hienCo = inputs.soHienCo || 0;
            const donGia = inputs.donGia || 0;
            const canMua = Math.max(0, tieuChuan - hienCo);
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'switch',
        name: 'Cột 9: Thiết bị chuyển mạch (Switch)',
        thamChieu: 'Điều 5 (MMTB chung)',
        tieuChuan: 'Không quy định cứng. Trang bị theo nhu cầu hạ tầng.',
        khaoSatRef: 'Mục II.3.4 (Số lượng thiết bị chuyển mạch)',
        donGia: 0, 
        congThuc: '`Số cần bổ sung = (Số lượng tiêu chuẩn) - (Số hiện có)`',
        inputs: [
            { id: 'soTieuChuan', label: 'Số lượng cần theo thiết kế', type: 'number' },
            { id: 'soHienCo', label: 'Số lượng hiện có (Mục II.3.4)', type: 'number' },
            { id: 'donGia', label: 'Đơn giá dự kiến / thiết bị (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tieuChuan = inputs.soTieuChuan || 0;
            const hienCo = inputs.soHienCo || 0;
            const donGia = inputs.donGia || 0;
            const canMua = Math.max(0, tieuChuan - hienCo);
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'wifi',
        name: 'Cột 10: Thiết bị mạng không dây (Wifi)',
        thamChieu: 'Điều 5 (MMTB chung)',
        tieuChuan: 'Không quy định cứng. Trang bị theo nhu cầu phủ sóng.',
        khaoSatRef: 'Mục II.3.4 (Thiết bị mạng không dây)',
        donGia: 0, 
        congThuc: '`Số cần bổ sung = (Số lượng tiêu chuẩn) - (Số hiện có)`',
        inputs: [
            { id: 'soTieuChuan', label: 'Số lượng cần theo thiết kế', type: 'number' },
            { id: 'soHienCo', label: 'Số lượng hiện có (Mục II.3.4)', type: 'number' },
            { id: 'donGia', label: 'Đơn giá dự kiến / thiết bị (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tieuChuan = inputs.soTieuChuan || 0;
            const hienCo = inputs.soHienCo || 0;
            const donGia = inputs.donGia || 0;
            const canMua = Math.max(0, tieuChuan - hienCo);
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'internet',
        name: 'Cột 11: Kênh truyền Internet',
        thamChieu: 'Điều 5, Điều 6 (Dịch vụ thuê)',
        tieuChuan: 'Đảm bảo nhu cầu sử dụng. Không phải mua sắm TS.',
        khaoSatRef: 'Mục II.3.2 (Tổng băng thông Internet)',
        donGia: 0, 
        congThuc: '`Kinh phí = (Kinh phí thuê / tháng) * 12`',
        inputs: [
            { id: 'kinhPhiThang', label: 'Kinh phí thuê dự kiến / tháng (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const kinhPhiThang = inputs.kinhPhiThang || 0;
            const kinhPhi = kinhPhiThang * 12;
            return { soLuong: 1, kinhPhi: kinhPhi, label: 'gói dịch vụ' };
        }
    },
    {
        id: 'slcd',
        name: 'Cột 12: Kênh truyền Mạng SLCD',
        thamChieu: 'Điều 5, Điều 6 (Dịch vụ thuê)',
        tieuChuan: 'Đảm bảo nhu cầu sử dụng. Không phải mua sắm TS.',
        khaoSatRef: 'Mục II.3.3 (Tổng băng thông TSLCD)',
        donGia: 0, 
        congThuc: '`Kinh phí = (Kinh phí thuê / tháng) * 12`',
        inputs: [
            { id: 'kinhPhiThang', label: 'Kinh phí thuê dự kiến / tháng (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const kinhPhiThang = inputs.kinhPhiThang || 0;
            const kinhPhi = kinhPhiThang * 12;
            return { soLuong: 1, kinhPhi: kinhPhi, label: 'gói dịch vụ' };
        }
    },
    {
        id: 'amthanh',
        name: 'Cột 13: Hệ thống âm thanh, ánh sáng',
        thamChieu: 'Điều 5, Khoản 1b (MMTB chung gắn với công trình)',
        tieuChuan: 'Không quy định cứng. Trang bị theo nhu cầu.',
        khaoSatRef: 'Mục II.4 (Hiện trạng hệ thống âm thanh, ánh sáng)',
        donGia: 0, 
        congThuc: 'Nhập tổng kinh phí dự kiến cho hạng mục này.',
        inputs: [
            { id: 'kinhPhiDuKien', label: 'Tổng kinh phí dự kiến (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const kinhPhi = inputs.kinhPhiDuKien || 0;
            return { soLuong: 1, kinhPhi: kinhPhi, label: 'gói hệ thống' };
        }
    },
     {
        id: 'camera',
        name: 'Cột 14: Camera giám sát',
        thamChieu: 'Điều 5, Khoản 1b (MMTB chung gắn với công trình)',
        tieuChuan: 'Không quy định cứng. Trang bị theo nhu cầu.',
        khaoSatRef: 'Mục II.3.8 (Đánh giá chung) hoặc Mục VI',
        donGia: 0, 
        congThuc: '`Kinh phí = (Số camera cần lắp) * (Đơn giá)`',
        inputs: [
            { id: 'soCanMuaThem', label: 'Số camera cần lắp thêm', type: 'number' },
            { id: 'donGia', label: 'Đơn giá dự kiến / camera (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const canMua = inputs.soCanMuaThem || 0;
            const donGia = inputs.donGia || 0;
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'manhinh',
        name: 'Cột 15: Hệ thống màn hình LED/Màn hình ghép',
        thamChieu: 'Điều 5, Khoản 1b (MMTB chung gắn với công trình)',
        tieuChuan: 'Không quy định cứng. Trang bị theo nhu cầu.',
        khaoSatRef: 'Mục II.5 (Số lượng, Hiện trạng)',
        donGia: 0, 
        congThuc: '`Số cần bổ sung = (Số lượng tiêu chuẩn) - (Số hiện có)`',
        inputs: [
            { id: 'soTieuChuan', label: 'Số lượng cần theo thiết kế', type: 'number' },
            { id: 'soHienCo', label: 'Số lượng hiện có (Mục II.5)', type: 'number' },
            { id: 'donGia', label: 'Đơn giá dự kiến / hệ thống (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const tieuChuan = inputs.soTieuChuan || 0;
            const hienCo = inputs.soHienCo || 0;
            const donGia = inputs.donGia || 0;
            const canMua = Math.max(0, tieuChuan - hienCo);
            const kinhPhi = canMua * donGia;
            return { soLuong: canMua, kinhPhi: kinhPhi };
        }
    },
    {
        id: 'cnttkhac',
        name: 'Cột 16: Các thiết bị CNTT khác... cấp xã',
        thamChieu: 'Điều 6, Khoản 3b (MMTB chuyên dùng cho bộ phận một cửa)',
        tieuChuan: 'Do UBND cấp tỉnh quyết định. (VD: Kiosk tra cứu...).',
        khaoSatRef: 'Mục VI (Thông tin khác), Mục III',
        donGia: 0, 
        congThuc: 'Nhập tổng kinh phí dự kiến cho các thiết bị đặc thù này.',
        inputs: [
            { id: 'kinhPhiDuKien', label: 'Tổng kinh phí dự kiến (Triệu VNĐ)', type: 'number' }
        ],
        calculate: (inputs) => {
            const kinhPhi = inputs.kinhPhiDuKien || 0;
            return { soLuong: 1, kinhPhi: kinhPhi, label: 'gói thiết bị' };
        }
    },
];

const EstimationTab: React.FC = () => {
    const [inputValues, setInputValues] = useState<Record<string, number>>({});
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    const handleInputChange = (itemId: string, inputId: string, value: string) => {
        const numericValue = parseFloat(value) || 0;
        setInputValues(prev => ({
            ...prev,
            [`${itemId}-${inputId}`]: numericValue,
        }));
    };

    const summaryData = useMemo(() => {
        return dataItems.map(item => {
            const currentInputs: Record<string, number> = {};
            item.inputs.forEach(input => {
                currentInputs[input.id] = inputValues[`${item.id}-${input.id}`] || 0;
            });
            const result = item.calculate(currentInputs);
            return {
                ...item,
                ...result,
            };
        });
    }, [inputValues]);

    const totalCost = useMemo(() => {
        return summaryData.reduce((acc, item) => acc + item.kinhPhi, 0);
    }, [summaryData]);

    useEffect(() => {
        if (!chartRef.current) return;
        
        const chartData = summaryData.filter(item => item.kinhPhi > 0);
        const labels = chartData.map(item => item.name.split(':')[1]?.trim() || item.name);
        const data = chartData.map(item => item.kinhPhi);
        
        // Destroy previous chart instance before creating a new one
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Kinh phí dự kiến (Triệu VNĐ)',
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Kinh phí (Triệu VNĐ)' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (tooltipItems: any) => {
                                const item = tooltipItems[0];
                                let label = item.chart.data.labels[item.dataIndex];
                                return Array.isArray(label) ? label.join(' ') : label;
                            }
                        }
                    }
                }
            }
        });
        
        // Cleanup function
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };

    }, [summaryData]);

    return (
        <div className="animate-fade-in">
             {/* Section 1: Introduction */}
            <section className="mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Hướng dẫn Quy trình 3 Bước</h2>
                    <p className="text-slate-700 leading-relaxed mb-6">Công cụ này giúp bạn điền số liệu thống kê dự trù đăng ký vật tư, trang thiết bị CNTT một cách chính xác bằng cách liên kết <span className="font-semibold">Quyết định 15</span> (tiêu chuẩn) và <span className="font-semibold">Phiếu Khảo sát</span> (Đã gửi đến địa phương).</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-100 p-4 rounded-lg">
                            <span className="text-xl font-bold text-blue-600">BƯỚC 1: THU THẬP SỐ LIỆU</span>
                            <p className="text-sm mt-2">Tải về và hoàn thành <strong className="text-blue-700">Phiếu Khảo sát</strong> để có số liệu "hiện trạng".</p>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-lg">
                            <span className="text-xl font-bold text-blue-600">BƯỚC 2: TÍNH TOÁN</span>
                            <p className="text-sm mt-2">Sử dụng <strong className="text-blue-700">"Công cụ Tính toán"</strong> bên dưới. Nhập số liệu "hiện trạng" vào các ô.</p>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-lg">
                            <span className="text-xl font-bold text-blue-600">BƯỚC 3: TỔNG HỢP</span>
                            <p className="text-sm mt-2">Công cụ sẽ tự tính <strong className="text-blue-700">"Số lượng cần mua"</strong> và <strong className="text-blue-700">"Kinh phí"</strong> để điền vào Bảng Thống kê.</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Tài liệu tham khảo</h3>
                        <div className="bg-slate-100 p-4 rounded-lg">
                            <ul className="list-disc list-inside mt-2 text-sm text-slate-600 space-y-1">
                                <li><a href="https://vanban.chinhphu.vn/?pageid=27160&docid=213950" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Quyết định số 15/2025/QĐ-TTg</a> (Quy định tiêu chuẩn, định mức)</li>
                                <li><a href="https://docs.google.com/document/d/1IurPka_n8EL0J0UObymH34Lfi-mk2949/edit?usp=sharing&ouid=117609267677309719707&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Mẫu Phiếu Khảo sát hiện trạng CNTT cấp xã</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

             {/* Section 2: Calculator */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Công cụ Tính toán Chi tiết</h2>
                <div className="space-y-4">
                    {dataItems.map(item => {
                        const result = summaryData.find(d => d.id === item.id) || { soLuong: 0, kinhPhi: 0, label: '' };
                        const soLuongLabel = result.label ? `${result.soLuong} (${result.label})` : result.soLuong;
                        return (
                            <details key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                                <summary className="p-5 bg-slate-50 hover:bg-slate-100 cursor-pointer list-none flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-blue-800">{item.name}</h3>
                                    <span className="text-sm font-medium text-blue-700">Kết quả: {result.kinhPhi.toLocaleString('vi-VN')} tr</span>
                                </summary>
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="border-r md:pr-6 border-slate-200">
                                        <h4 className="text-lg font-semibold text-slate-900 mb-2">Thông tin tra cứu</h4>
                                        <div className="space-y-3 text-sm">
                                            <p><strong className="text-slate-600">Căn cứ QĐ 15:</strong> {item.thamChieu}</p>
                                            <p><strong className="text-slate-600">Tiêu chuẩn:</strong> {item.tieuChuan}</p>
                                            {item.khaoSatRef && <p><strong className="text-green-700">Nguồn dữ liệu (Phiếu KS):</strong> {item.khaoSatRef}</p>}
                                            <p><strong className="text-slate-600">Đơn giá tối đa:</strong> {item.donGia > 0 ? `${item.donGia} Triệu VNĐ` : 'Tự nhập theo báo giá'}</p>
                                            <div className="bg-slate-100 p-3 rounded-md">
                                                <strong className="text-slate-600">Công thức tính (gợi ý):</strong>
                                                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 mt-1">{item.congThuc}</pre>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-lg font-semibold text-slate-900 mb-2">Công cụ tính nhanh</h4>
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {item.inputs.map(input => (
                                                <div key={input.id} className="flex-1 min-w-[200px]">
                                                    <label htmlFor={`${item.id}-${input.id}`} className="block text-sm font-medium text-slate-700 mb-1">{input.label}</label>
                                                    <input
                                                        type={input.type}
                                                        id={`${item.id}-${input.id}`}
                                                        onChange={e => handleInputChange(item.id, input.id, e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto bg-blue-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-blue-900">Kết quả dự kiến:</h5>
                                            <p className="text-lg">Số lượng cần mua: <strong className="text-blue-700">{soLuongLabel}</strong></p>
                                            <p className="text-lg">Kinh phí dự kiến: <strong className="text-blue-700">{result.kinhPhi.toLocaleString('vi-VN')}</strong> Triệu VNĐ</p>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        )
                    })}
                </div>
            </section>

             {/* Section 3: Summary */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Bảng Tổng hợp Dự toán</h2>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hạng mục</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng cần mua</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kinh phí dự kiến (Triệu VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {summaryData.map(item => {
                                    const soLuongText = item.label ? `${item.soLuong} (${item.label})` : item.soLuong;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{soLuongText}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.kinhPhi.toLocaleString('vi-VN')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-slate-50">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900" colSpan={2}>TỔNG CỘNG</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{totalCost.toLocaleString('vi-VN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">Biểu đồ Tỷ trọng Kinh phí Dự kiến</h3>
                    <div className="relative w-full max-w-4xl mx-auto h-96">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EstimationTab;
