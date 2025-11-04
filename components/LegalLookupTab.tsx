
import React, { useState } from 'react';
import { VanBanPhapLy } from '../types';
import Icon from './Icon';
import ConfirmationModal from './ConfirmationModal';

const DocumentManager: React.FC<{
    documents: VanBanPhapLy[];
    onAdd: (file: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}> = ({ documents, onAdd, onDelete }) => {
    const [docToDelete, setDocToDelete] = useState<VanBanPhapLy | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setIsUploading(true);
            try {
                await onAdd(e.target.files[0]);
            } catch (error) {
                console.error("Error uploading document:", error);
            } finally {
                setIsUploading(false);
                e.target.value = ''; // Reset input
            }
        }
    };
    
    const handleConfirmDelete = () => {
        if (docToDelete) {
            onDelete(docToDelete.id);
        }
    };

    const downloadDocument = (doc: VanBanPhapLy) => {
        const blob = new Blob([doc.noiDung || ''], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${doc.ten.replace(/ /g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const userDocuments = documents.filter(d => d.isUserUploaded);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Quản lý Văn bản Cá nhân</h3>
                <p className="text-sm text-slate-600 mb-4">Thêm các tệp văn bản (.txt) của bạn để AI sử dụng làm kiến thức nền khi tra cứu hoặc soạn thảo.</p>
                
                <label htmlFor="file-upload" className="relative block w-full border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                        <Icon path="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" className="w-10 h-10 text-slate-400 mb-2" />
                        <span className="text-sm font-semibold text-blue-600">Nhấn để tải lên tệp</span>
                        <span className="mt-1 text-xs text-slate-500">Chỉ hỗ trợ tệp .txt</span>
                    </div>
                    <input id="file-upload" type="file" className="hidden" accept=".txt" onChange={handleFileChange} disabled={isUploading} />
                </label>
                
                {isUploading && <p className="text-center text-sm text-blue-600 mt-2">Đang tải lên...</p>}

                {userDocuments.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-slate-700 mb-3">Văn bản đã tải lên:</h4>
                        <ul className="space-y-3">
                            {userDocuments.map(doc => (
                                <li key={doc.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200 group">
                                    <div className="flex items-center space-x-3">
                                        <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5 text-slate-500"/>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{doc.ten}</p>
                                            <p className="text-xs text-slate-500">{doc.moTa}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => downloadDocument(doc)} title="Tải xuống" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded-full">
                                            <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setDocToDelete(doc)} title="Xóa" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full">
                                            <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.502 0a48.097 48.097 0 013.478-.397m7.54-1.121a48.11 48.11 0 00-7.54 0" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <ConfirmationModal
                isOpen={!!docToDelete}
                onClose={() => setDocToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận Xóa Văn bản"
                confirmText="Xác nhận Xóa"
                confirmButtonVariant="danger"
            >
                Bạn có chắc chắn muốn xóa văn bản <strong>{docToDelete?.ten}</strong>? Hành động này không thể hoàn tác.
            </ConfirmationModal>
        </>
    );
};


const LegalLookupTab: React.FC<{
    documents: VanBanPhapLy[];
    onAdd: (file: File) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}> = ({ documents, onAdd, onDelete }) => {
    
    const systemDocuments = documents.filter(d => !d.isUserUploaded);

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Tra cứu Văn bản Pháp lý</h2>
            <p className="text-slate-600 mb-8">Quản lý và tra cứu nhanh các văn bản pháp lý quan trọng.</p>
            
            <DocumentManager documents={documents} onAdd={onAdd} onDelete={onDelete} />

            <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">Văn bản Hệ thống</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {systemDocuments.map(vb => (
                        <div key={vb.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-start space-x-4 mb-3">
                                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                                    <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-6 h-6 text-blue-700"/>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-800">{vb.ten}</h4>
                                    <p className="text-sm text-slate-500">{vb.moTa}</p>
                                </div>
                            </div>
                            <div className="border-t border-slate-200 pt-4">
                                <ul className="space-y-2 text-sm">
                                    {vb.diemMauChot.map((diem, index) => (
                                        <li key={index} className="flex items-start">
                                            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: diem }}></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LegalLookupTab;
