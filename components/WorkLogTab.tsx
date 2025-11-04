
import React, { useState } from 'react';
import { WorkLogEntry } from '../types';
import Icon from './Icon';
import ConfirmationModal from './ConfirmationModal';

interface WorkLogTabProps {
  logEntries: WorkLogEntry[];
  onSave: (entry: WorkLogEntry) => Promise<WorkLogEntry>;
  onDelete: (id: string) => Promise<void>;
}

const EditableCell: React.FC<{isEditing: boolean; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: 'text' | 'date' | 'time' | 'textarea'}> = ({ isEditing, value, onChange, type = 'text'}) => {
  if (!isEditing) {
    return <span className="text-sm text-slate-700 block p-1">{value || <span className="italic text-slate-400">Trống</span>}</span>;
  }
  
  const commonProps = {
    value: value,
    onChange: onChange,
    className: "p-1 border border-slate-300 rounded-md w-full text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
  };

  if (type === 'textarea') {
    return <textarea rows={2} {...commonProps} />;
  }
  return <input type={type} {...commonProps} />;
}

const WorkLogTab: React.FC<WorkLogTabProps> = ({ logEntries, onSave, onDelete }) => {
    const [entryToDelete, setEntryToDelete] = useState<WorkLogEntry | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempEntry, setTempEntry] = useState<WorkLogEntry | null>(null);

    const handleAddRow = async () => {
        const newEntry: WorkLogEntry = {
            id: `worklog_${Date.now()}`,
            arrivalDate: new Date().toISOString().split('T')[0],
            arrivalTime: new Date().toTimeString().substring(0, 5),
            workStartTime: '',
            workEndTime: '',
            personInCharge: '',
            dailyStatus: '',
            report: '',
            notes: '',
        };
        // Save to backend first to get a persistent ID if needed
        const savedEntry = await onSave(newEntry);
        setEditingId(savedEntry.id);
        setTempEntry(savedEntry);
    };

    const handleEditClick = (entry: WorkLogEntry) => {
        setEditingId(entry.id);
        setTempEntry({ ...entry });
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setTempEntry(null);
    };

    const handleSaveClick = async () => {
        if (!tempEntry) return;
        await onSave(tempEntry);
        setEditingId(null);
        setTempEntry(null);
    };
    
    const handleTempEntryChange = (field: keyof WorkLogEntry, value: string) => {
        if (tempEntry) {
          setTempEntry(prev => ({ ...prev!, [field]: value }));
        }
    };

    const handleConfirmDelete = () => {
        if (entryToDelete) {
            onDelete(entryToDelete.id);
        }
    };
    
    const handleExportToCSV = () => {
        if (logEntries.length === 0) {
          alert("Không có dữ liệu để xuất. Vui lòng thêm ít nhất một hàng vào nhật ký.");
          return;
        }
    
        const headers = [
          "STT", "Ngày đến", "Giờ đến", "Bắt đầu làm việc", "Kết thúc làm việc",
          "Người phụ trách", "Tình hình công việc", "Báo cáo", "Ghi chú",
        ];
    
        const toCsvRow = (arr: (string | number)[]) => {
          return arr
            .map((val) => {
              const str = String(val).replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(",");
        };
        
        const sortedEntries = [...logEntries].sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
        
        const csvContent = [
          headers.join(','),
          ...sortedEntries.map((entry, index) =>
            toCsvRow([
              index + 1, entry.arrivalDate, entry.arrivalTime, entry.workStartTime,
              entry.workEndTime, entry.personInCharge, entry.dailyStatus,
              entry.report, entry.notes,
            ])
          ),
        ].join("\n");
    
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "NhatKyCongViec.csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
    };

    const sortedLogEntries = [...logEntries].sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Nhật ký Công việc</h2>
                    <p className="text-slate-600">Ghi chép, chỉnh sửa và theo dõi công việc hàng ngày.</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportToCSV}
                            className="flex-grow sm:flex-grow-0 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                            title="Xuất dữ liệu ra tệp CSV để mở bằng Google Sheets hoặc Excel"
                        >
                            <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" className="w-5 h-5 mr-2" />
                            Xuất ra CSV
                        </button>
                        <button
                            onClick={handleAddRow}
                            className="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center">
                            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />
                            Thêm hàng
                        </button>
                    </div>
                     <p className="text-xs text-slate-500 text-center sm:text-left bg-slate-100 p-2 rounded-md">
                        <strong>Mẹo:</strong> Để đưa vào Google Sheets, sau khi xuất CSV, hãy vào trang tính và chọn 'Tệp' {'->'} 'Nhập' {'->'} 'Tải lên'.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">STT</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[180px]">Ngày & Giờ đến</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[180px]">Thời gian làm việc</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[150px]">Người phụ trách</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[250px]">Tình hình công việc</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[250px]">Báo cáo</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">Ghi chú</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sortedLogEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                        Chưa có mục nào trong nhật ký. Nhấn "Thêm hàng" để bắt đầu.
                                    </td>
                                </tr>
                            ) : (
                                sortedLogEntries.map((entry, index) => {
                                    const isEditing = entry.id === editingId;
                                    const currentData = isEditing ? tempEntry : entry;
                                    
                                    return (
                                    <tr key={entry.id} className={`align-top ${isEditing ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                        <td className="px-4 py-3 text-sm text-center text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <EditableCell isEditing={isEditing} value={currentData?.arrivalDate || ''} onChange={e => handleTempEntryChange('arrivalDate', e.target.value)} type="date" />
                                                <EditableCell isEditing={isEditing} value={currentData?.arrivalTime || ''} onChange={e => handleTempEntryChange('arrivalTime', e.target.value)} type="time" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                             <div className="flex items-center gap-2">
                                                <EditableCell isEditing={isEditing} value={currentData?.workStartTime || ''} onChange={e => handleTempEntryChange('workStartTime', e.target.value)} type="time" />
                                                <span>-</span>
                                                <EditableCell isEditing={isEditing} value={currentData?.workEndTime || ''} onChange={e => handleTempEntryChange('workEndTime', e.target.value)} type="time" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <EditableCell isEditing={isEditing} value={currentData?.personInCharge || ''} onChange={e => handleTempEntryChange('personInCharge', e.target.value)} type="text" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <EditableCell isEditing={isEditing} value={currentData?.dailyStatus || ''} onChange={e => handleTempEntryChange('dailyStatus', e.target.value)} type="textarea" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <EditableCell isEditing={isEditing} value={currentData?.report || ''} onChange={e => handleTempEntryChange('report', e.target.value)} type="textarea" />
                                        </td>
                                        <td className="px-4 py-3">
                                             <EditableCell isEditing={isEditing} value={currentData?.notes || ''} onChange={e => handleTempEntryChange('notes', e.target.value)} type="textarea" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {isEditing ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={handleSaveClick} title="Lưu" className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-full"><Icon path="M4.5 12.75l6 6 9-13.5" className="w-5 h-5"/></button>
                                                    <button onClick={handleCancelClick} title="Hủy" className="p-2 text-white bg-slate-500 hover:bg-slate-600 rounded-full"><Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5"/></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => handleEditClick(entry)} title="Chỉnh sửa" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"><Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" className="w-5 h-5"/></button>
                                                    <button onClick={() => setEntryToDelete(entry)} title="Xóa" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full"><Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.502 0a48.097 48.097 0 013.478-.397m7.54-1.121a48.11 48.11 0 00-7.54 0" className="w-5 h-5" /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )})
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!entryToDelete}
                onClose={() => setEntryToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận Xóa mục"
                confirmText="Xác nhận Xóa"
                confirmButtonVariant="danger"
            >
                Bạn có chắc chắn muốn xóa mục nhật ký này không? Hành động này không thể hoàn tác.
            </ConfirmationModal>
        </div>
    );
};

export default WorkLogTab;
