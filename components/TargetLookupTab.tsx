
import React, { useState, useMemo } from 'react';
import { ChiTieu } from '../types';
import { CHI_TIEU_DATA } from '../constants';

const TargetLookupTab: React.FC = () => {
    const [searchChiTieu, setSearchChiTieu] = useState('');
    const [filterDonVi, setFilterDonVi] = useState('');
    const [filterKyBaoCao, setFilterKyBaoCao] = useState('');

    const { uniqueDonVi, uniqueKyBaoCao } = useMemo(() => {
        const donViSet = new Set(CHI_TIEU_DATA.map(item => item.donVi));
        const kySet = new Set(CHI_TIEU_DATA.map(item => item.ky));
        const order = { 'Tháng': 1, 'Quý': 2, '6 tháng': 3, 'Năm': 4 };
        return {
            uniqueDonVi: Array.from(donViSet).sort(),
            uniqueKyBaoCao: Array.from(kySet).sort((a, b) => (order[a] || 99) - (order[b] || 99))
        };
    }, []);

    const filteredChiTieu = useMemo(() => {
        const searchLower = searchChiTieu.toLowerCase();
        return CHI_TIEU_DATA.filter(item => {
            const tenMatch = item.chiTieu.toLowerCase().includes(searchLower);
            const donViMatch = filterDonVi === '' || item.donVi === filterDonVi;
            const kyMatch = filterKyBaoCao === '' || item.ky === filterKyBaoCao;
            return tenMatch && donViMatch && kyMatch;
        });
    }, [searchChiTieu, filterDonVi, filterKyBaoCao]);

    const highlight = (text: string, search: string) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<span class="bg-yellow-200 font-bold rounded-sm px-1">$1</span>');
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-5">Tra cứu Chỉ tiêu (Theo Quyết định 1603/QĐ-UBND)</h2>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-0 border border-slate-200 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label htmlFor="searchChiTieu" className="block text-sm font-medium text-slate-700 mb-1">Tìm theo tên chỉ tiêu</label>
                        <input type="text" id="searchChiTieu" value={searchChiTieu} onChange={e => setSearchChiTieu(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Nhập tên chỉ tiêu..."/>
                    </div>
                    <div>
                        <label htmlFor="filterDonVi" className="block text-sm font-medium text-slate-700 mb-1">Lọc theo đơn vị báo cáo</label>
                        <select id="filterDonVi" value={filterDonVi} onChange={e => setFilterDonVi(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                            <option value="">Tất cả đơn vị</option>
                            {uniqueDonVi.map(donVi => <option key={donVi} value={donVi}>{donVi}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterKyBaoCao" className="block text-sm font-medium text-slate-700 mb-1">Lọc theo kỳ báo cáo</label>
                        <select id="filterKyBaoCao" value={filterKyBaoCao} onChange={e => setFilterKyBaoCao(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                            <option value="">Tất cả kỳ</option>
                            {uniqueKyBaoCao.map(ky => <option key={ky} value={ky}>{ky}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">STT</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-5/12">Tên Chỉ tiêu</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-4/12">Đơn vị Báo cáo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-3/12">Kỳ Báo cáo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredChiTieu.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Không tìm thấy chỉ tiêu nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredChiTieu.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.stt}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-slate-900" dangerouslySetInnerHTML={{ __html: highlight(item.chiTieu, searchChiTieu) }}></td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-slate-600">{item.donVi}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.ky}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TargetLookupTab;
