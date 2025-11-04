import React, { useEffect, useRef, useState } from 'react';

declare const Chart: any;

const KpiAnalysisTab: React.FC = () => {
    const [activePage, setActivePage] = useState('tong-quan');

    // Chart refs
    const complexityChartRef = useRef<HTMLCanvasElement>(null);
    const penaltyChartRef = useRef<HTMLCanvasElement>(null);
    const goodDistributionChartRef = useRef<HTMLCanvasElement>(null);
    const badDistributionChartRef = useRef<HTMLCanvasElement>(null);

    const chartInstances = useRef<any>({
        complexity: null,
        penalty: null,
        goodDistribution: null,
        badDistribution: null,
    });
    
    // Simulator state
    const [qualityScore, setQualityScore] = useState(90);
    const [timeStatus, setTimeStatus] = useState(100);
    const [complexity, setComplexity] = useState(1.2);
    const [simulationResults, setSimulationResults] = useState({
        timeResult: 100,
        kpiRawResult: '114.00',
        kpiScaledResult: '79.72',
        formulaBreakdown: '{(90 + 100) / 2} * 1.2'
    });

    useEffect(() => {
        const quality = qualityScore;
        const timeScore = timeStatus;
        const kpiRaw = ((quality + timeScore) / 2) * complexity;
        const kpiScaled = (kpiRaw * 100) / 143;

        setSimulationResults({
            timeResult: timeScore,
            kpiRawResult: kpiRaw.toFixed(2),
            kpiScaledResult: kpiScaled.toFixed(2),
            formulaBreakdown: `{(${quality} + ${timeScore}) / 2} * ${complexity}`
        });

    }, [qualityScore, timeStatus, complexity]);

    useEffect(() => {
        const createChart = (ref: React.RefObject<HTMLCanvasElement>, instanceKey: string, config: any) => {
            if (ref.current && !chartInstances.current[instanceKey]) {
                const ctx = ref.current.getContext('2d');
                if (ctx) {
                    chartInstances.current[instanceKey] = new Chart(ctx, config);
                }
            }
        };

        switch (activePage) {
            case 'cau-truc':
                createChart(complexityChartRef, 'complexity', {
                    type: 'bar',
                    data: {
                        labels: ['Cấp 1', 'Cấp 2', 'Cấp 3', 'Cấp 4', 'Cấp 5'],
                        datasets: [{ label: 'Hệ số', data: [1.0, 1.1, 1.2, 1.3, 1.4], backgroundColor: ['#60a5fa', '#34d399', '#facc15', '#fb923c', '#f87171'], borderRadius: 4 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: false, min: 0.8 } }, plugins: { legend: { display: false }, title: { display: true, text: 'Hệ số Trọng số theo 5 Cấp độ Phức tạp' } } }
                });
                break;
            case 'tinh-toan':
                 createChart(penaltyChartRef, 'penalty', {
                    type: 'bar',
                    data: {
                        labels: ['Sớm hạn', 'Đúng hạn', 'Trễ >=10%', 'Trễ >=20%', 'Trễ >=30%', 'Trễ >=40%', 'Trễ >50%'],
                        datasets: [{ label: 'Điểm Thời gian', data: [120, 100, 98, 95, 93, 90, 0], backgroundColor: ['#10b981', '#3b82f6', '#facc15', '#fb923c', '#f59e0b', '#ef4444', '#b91c1c'], borderRadius: 4 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: true, text: 'Mô phỏng Điểm Thời gian (Thưởng & Phạt)' } } }
                });
                break;
            case 'canh-bao':
                 createChart(goodDistributionChartRef, 'goodDistribution', {
                    type: 'doughnut',
                    data: { labels: ['Cấp 1', 'Cấp 2', 'Cấp 3', 'Cấp 4'], datasets: [{ label: 'Phân bổ', data: [20, 45, 30, 5], backgroundColor: ['#60a5fa', '#34d399', '#facc15', '#fb923c'] }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 10 } }, title: { display: false } } }
                });
                 createChart(badDistributionChartRef, 'badDistribution', {
                    type: 'doughnut',
                    data: { labels: ['Cấp 3', 'Cấp 4', 'Cấp 5'], datasets: [{ label: 'Phân bổ', data: [40, 50, 10], backgroundColor: ['#facc15', '#fb923c', '#f87171'] }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 10 } }, title: { display: false } } }
                });
                break;
        }
    }, [activePage]);

    const PageContent: React.FC<{ id: string, children: React.ReactNode }> = ({ id, children }) => (
        <section style={{ display: activePage === id ? 'block' : 'none' }} className="animate-fade-in">
            {children}
        </section>
    );

    const SidebarLink: React.FC<{ pageId: string, label: string }> = ({ pageId, label }) => (
        <li>
            <a href={`#${pageId}`}
               onClick={(e) => { e.preventDefault(); setActivePage(pageId); }}
               className={`block px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${activePage === pageId ? 'bg-blue-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200 hover:text-blue-700'}`}>
                {label}
            </a>
        </li>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-full">
            <nav className="md:w-64 bg-white md:fixed md:h-full md:shadow-lg z-10 p-4 border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0">
                <h1 className="text-2xl font-extrabold text-blue-700 mb-6 px-3">Phân Tích KPI</h1>
                <ul className="space-y-2">
                    <SidebarLink pageId="tong-quan" label="Giới thiệu & Tổng quan" />
                    <SidebarLink pageId="cau-truc" label="1. Cấu trúc Hạt nhân" />
                    <SidebarLink pageId="tinh-toan" label="2. Phương pháp Tính toán" />
                    <SidebarLink pageId="mo-phong" label="3. Mô phỏng Tính điểm KPI" />
                    <SidebarLink pageId="canh-bao" label="4. Kiểm soát & Cảnh báo" />
                    <SidebarLink pageId="ket-luan" label="5. Kết luận" />
                </ul>
            </nav>

            <main className="flex-1 md:ml-64 p-6 md:p-10">
                <PageContent id="tong-quan">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Phân Tích Chuyên Sâu Bộ Công Cụ KPI Cấp Xã</h1>
                    <p className="text-lg text-gray-600 mb-6">Tài liệu này "giải nén" các thành phần cốt lõi của hệ thống KPI, phương pháp luận tính toán, và các cơ chế kiểm soát rủi ro.</p>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Mục tiêu của Hệ thống</h2>
                        <p className="text-gray-700">Hệ thống này là một nỗ lực nhằm chuyển đổi việc đánh giá cán bộ cấp xã từ <span className="font-semibold text-red-600">định tính</span> sang <span className="font-semibold text-green-700">định lượng, dựa trên dữ liệu</span>.</p>
                    </div>
                </PageContent>
                
                <PageContent id="cau-truc">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">1. Cấu trúc Hạt nhân của Hệ thống KPI</h1>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-5">1.1. Phân loại Công việc (A, B, C, D)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-blue-700 mb-2">Danh mục (A, B, D) - Dùng chung</h3><p className="text-gray-600 mb-4">Nhóm việc Lãnh đạo (A), Chuyên môn chung (B), và Việc khác (D).</p><div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800">Phân tích:</h4><p className="text-gray-700">Tạo "mẫu số chung" để so sánh hiệu suất.</p></div></div>
                            <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-700 mb-2">Danh mục (C) - Dùng riêng</h3><p className="text-gray-600 mb-4">Công việc chuyên môn đặc thù (VTVL).</p><div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800">Phân tích:</h4><p className="text-gray-700">Yếu tố *linh hoạt*, thừa nhận sự khác biệt giữa các vị trí.</p></div></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-5">1.2. Trọng số hóa Độ phức tạp (5 Cấp độ)</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-blue-700 mb-3">Mô phỏng Trọng số</h3><div className="relative w-full max-w-xl mx-auto h-72"><canvas ref={complexityChartRef}></canvas></div></div>
                            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center"><h3 className="text-xl font-bold text-blue-700 mb-3">Phân tích Chuyên sâu</h3><p className="text-gray-700 leading-relaxed">Khuyến khích xử lý công việc khó, có giá trị cao, thay vì chỉ tập trung vào việc dễ để "lấy số lượng".</p></div>
                        </div>
                    </div>
                </PageContent>

                <PageContent id="tinh-toan">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">2. Phương pháp Luận tính toán</h1>
                     <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-5">2.1. Công thức KPI Cốt lõi</h2>
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg font-mono text-xl md:text-2xl text-center">KPI = ((Điểm CL + Điểm TG) / 2) * Hệ số phức tạp</div>
                        <div className="bg-white p-6 rounded-lg shadow-md mt-4"><h4 className="font-semibold text-gray-800 text-lg mb-2">Phân tích: Sự cân bằng</h4><p className="text-gray-700">Tạo sự cân bằng giữa **Chất lượng** (làm tốt) và **Thời gian** (làm nhanh).</p></div>
                    </div>
                     <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-5">2.2. Cơ chế Thưởng/Phạt</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-blue-700 mb-3">Mô phỏng Điểm Thời gian</h3><div className="relative w-full max-w-xl mx-auto h-72"><canvas ref={penaltyChartRef}></canvas></div></div>
                            <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-blue-700 mb-3">Phân tích</h3><div className="space-y-4"><div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"><h4 className="font-bold text-green-800">Thưởng (Sớm hạn)</h4><p className="text-green-700">+20 điểm (thành 120).</p></div><div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"><h4 className="font-bold text-red-800">Phạt (Trễ hạn)</h4><p className="text-red-700">Trễ &gt; 50% thời gian = <span className="font-extrabold">0 điểm</span>.</p></div></div></div>
                        </div>
                    </div>
                     <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-5">2.3. Chuẩn hóa điểm</h2>
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg font-mono text-xl md:text-2xl text-center">KPI Quy đổi = (KPI Thô x 100) / 143</div>
                        <div className="bg-white p-6 rounded-lg shadow-md mt-4"><h4 className="font-semibold text-gray-800 text-lg mb-2">Phân tích</h4><p className="text-gray-700">*Chuẩn hóa* điểm thô về thang 100 để dễ so sánh, xếp loại.</p></div>
                    </div>
                </PageContent>
                
                 <PageContent id="mo-phong">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">3. Mô phỏng Tính điểm KPI</h1>
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-5">
                            <div className="lg:col-span-3 p-6 md:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nhập thông số</h2>
                                <div><label htmlFor="qualityScore" className="flex justify-between text-lg font-semibold text-gray-700 mb-2"><span>Điểm Chất lượng</span><span className="font-extrabold text-blue-700">{qualityScore}</span></label><input type="range" id="qualityScore" min="0" max="100" value={qualityScore} onChange={(e) => setQualityScore(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer" /></div>
                                <div><label htmlFor="timeStatus" className="block text-lg font-semibold text-gray-700 mb-2">Tình trạng Hoàn thành</label><select id="timeStatus" value={timeStatus} onChange={e => setTimeStatus(parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-lg"><option value="120">Sớm hạn (+20đ)</option><option value="100">Đúng hạn</option><option value="98">Trễ &gt;= 10%</option><option value="0">Trễ &gt; 50%</option></select></div>
                                <div><label htmlFor="complexity" className="block text-lg font-semibold text-gray-700 mb-2">Độ phức tạp</label><select id="complexity" value={complexity} onChange={e => setComplexity(parseFloat(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-lg"><option value="1.0">Cấp 1 (x1.0)</option><option value="1.1">Cấp 2 (x1.1)</option><option value="1.2">Cấp 3 (x1.2)</option><option value="1.3">Cấp 4 (x1.3)</option><option value="1.4">Cấp 5 (x1.4)</option></select></div>
                            </div>
                            <div className="lg:col-span-2 p-6 md:p-8 bg-gray-50 flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Kết quả</h2>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm text-center"><h4 className="text-sm font-semibold text-gray-500 uppercase">Điểm TG</h4><p className="text-3xl font-extrabold text-blue-700">{simulationResults.timeResult}</p></div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm text-center"><h4 className="text-sm font-semibold text-gray-500 uppercase">KPI Thô</h4><p className="text-5xl font-extrabold text-gray-900">{simulationResults.kpiRawResult}</p></div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm text-center"><h4 className="text-sm font-semibold text-gray-500 uppercase">KPI Quy đổi</h4><p className="text-3xl font-extrabold text-green-700">{simulationResults.kpiScaledResult}</p></div>
                                </div>
                                <div className="mt-6 text-center bg-gray-200 p-3 rounded-lg"><h4 className="text-sm font-semibold text-gray-600">Công thức:</h4><p className="font-mono text-gray-800 text-sm md:text-base break-words">{simulationResults.formulaBreakdown}</p></div>
                            </div>
                        </div>
                    </div>
                 </PageContent>
                 
                <PageContent id="canh-bao">
                     <h1 className="text-4xl font-extrabold text-gray-900 mb-6">4. Kiểm soát & Cảnh báo</h1>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"><h3 className="text-xl font-bold text-yellow-800 mb-3">🚩 Cờ đỏ 1: Bất thường Giờ làm việc</h3><p className="text-gray-700"><strong>Dấu hiệu:</strong> Giờ BQ/ngày &gt; 8 hoặc &lt; 4. Phát hiện khai khống hoặc thiếu việc.</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"><h3 className="text-xl font-bold text-yellow-800 mb-3">🚩 Cờ đỏ 2: Chênh lệch Giờ</h3><p className="text-gray-700"><strong>Dấu hiệu:</strong> Giờ TT và giờ ĐM chênh lệch &gt; 50%. Cho thấy ước tính sai.</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"><h3 className="text-xl font-bold text-yellow-800 mb-3">🚩 Cờ đỏ 3: Bất thường Số đầu việc</h3><p className="text-gray-700"><strong>Dấu hiệu:</strong> Số đầu việc/ngày đột biến. Cần "gộp việc" nhỏ lại.</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
                            <h3 className="text-xl font-bold text-red-800 mb-3">🚩 Cờ đỏ 4: Bất thường Phân bổ Độ phức tạp</h3>
                            <p className="text-gray-700 mb-3"><strong>Dấu hiệu:</strong> Tỷ trọng CV mức 3-4 chiếm đa số, không có mức 1-2. Phát hiện hành vi "lách luật" (gaming).</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div><h4 className="text-center font-semibold text-green-700 mb-2">Phân bổ "Tốt"</h4><div className="relative w-full h-48"><canvas ref={goodDistributionChartRef}></canvas></div></div>
                                <div><h4 className="text-center font-semibold text-red-700 mb-2">Phân bổ "Xấu"</h4><div className="relative w-full h-48"><canvas ref={badDistributionChartRef}></canvas></div></div>
                            </div>
                        </div>
                     </div>
                </PageContent>

                <PageContent id="ket-luan">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">5. Kết luận</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                        {['Chuẩn hóa', 'Linh hoạt', 'Cân bằng', 'Kỷ luật', 'Kiểm soát'].map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow text-center"><h3 className="font-bold text-blue-700">{index + 1}. Tính {item}</h3></div>
                        ))}
                    </div>
                     <h2 className="text-3xl font-bold text-gray-800 mb-5">Hai yếu tố then chốt để thành công</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600"><h3 className="text-xl font-bold text-red-800 mb-2">1. Ý thức của người nhập liệu</h3><p className="text-gray-700">Cán bộ phải "ghi nhật ký" trung thực hàng ngày.</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600"><h3 className="text-xl font-bold text-red-800 mb-2">2. Năng lực của người giám sát</h3><p className="text-gray-700">Lãnh đạo phải thường xuyên dùng "cờ đỏ" để kiểm tra, chấn chỉnh.</p></div>
                    </div>
                </PageContent>
            </main>
        </div>
    );
};

export default KpiAnalysisTab;