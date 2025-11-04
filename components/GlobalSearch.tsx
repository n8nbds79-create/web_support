
import React, { useState, useMemo } from 'react';
import { VanBanPhapLy } from '../types';
import { CHI_TIEU_DATA } from '../constants';
import Icon from './Icon';

interface GlobalSearchProps {
    documents: VanBanPhapLy[];
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ documents }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const searchResults = useMemo(() => {
        if (query.length < 3) {
            return { legalDocs: [], targets: [] };
        }
        const lowerCaseQuery = query.toLowerCase();
        
        const legalDocs = documents.filter(doc => 
            doc.ten.toLowerCase().includes(lowerCaseQuery) ||
            doc.moTa.toLowerCase().includes(lowerCaseQuery) ||
            (doc.noiDung && doc.noiDung.toLowerCase().includes(lowerCaseQuery))
        );

        const targets = CHI_TIEU_DATA.filter(target => 
            target.chiTieu.toLowerCase().includes(lowerCaseQuery) ||
            target.donVi.toLowerCase().includes(lowerCaseQuery)
        );

        return { legalDocs, targets };

    }, [query, documents]);

    const hasResults = searchResults.legalDocs.length > 0 || searchResults.targets.length > 0;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            const url = `https://www.google.com/search?q=${encodeURIComponent(query + " tỉnh Khánh Hòa")}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="relative w-full max-w-lg">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon path="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z" className="w-5 h-5 text-slate-400" />
                </div>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Tìm kiếm văn bản, chỉ tiêu..."
                    className="w-full pl-10 pr-4 py-2 border border-r-0 border-slate-300 rounded-l-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                 <button type="submit" className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-r-lg shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600">
                    Tìm kiếm
                </button>
            </form>
            
            {isFocused && query.length >= 3 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 z-20 max-h-[60vh] overflow-y-auto">
                    {hasResults ? (
                        <div>
                            {searchResults.legalDocs.length > 0 && (
                                <div className="p-2">
                                    <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Văn bản pháp lý</h3>
                                    <ul className="mt-1">
                                        {searchResults.legalDocs.slice(0, 5).map(doc => (
                                            <li key={doc.id} className="p-3 hover:bg-slate-100 rounded-md cursor-pointer text-sm">
                                                <p className="font-medium text-slate-800">{doc.ten}</p>
                                                <p className="text-slate-600 truncate">{doc.moTa}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {searchResults.targets.length > 0 && (
                                <div className="p-2 border-t border-slate-100">
                                    <h3 className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Chỉ tiêu KT-XH</h3>
                                     <ul className="mt-1">
                                        {searchResults.targets.slice(0, 5).map(target => (
                                            <li key={target.stt + target.chiTieu} className="p-3 hover:bg-slate-100 rounded-md cursor-pointer text-sm">
                                                <p className="font-medium text-slate-800">{target.chiTieu}</p>
                                                <p className="text-slate-600">{target.donVi} - Kỳ: {target.ky}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-slate-500">
                            <p>Không tìm thấy kết quả nào trong hệ thống.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;