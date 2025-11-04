
import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import Icon from './Icon';
import ContactModal from './ContactModal';
import ConfirmationModal from './ConfirmationModal';

interface DirectoryTabProps {
  contacts: Contact[];
  onSave: (contact: Contact) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DirectoryTab: React.FC<DirectoryTabProps> = ({ contacts, onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState<Contact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

    const handleAddContact = () => {
        setCurrentContact(null);
        setIsModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setCurrentContact(contact);
        setIsModalOpen(true);
    };

    const handleSaveContact = async (contactToSave: Contact) => {
        await onSave(contactToSave);
        setIsModalOpen(false);
    };
    
    const handleConfirmDelete = () => {
        if(contactToDelete) {
            onDelete(contactToDelete.id);
        }
    };

    const filteredContacts = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return [...contacts].filter(c => 
            c.name.toLowerCase().includes(lowerCaseSearch) ||
            c.organization.toLowerCase().includes(lowerCaseSearch) ||
            c.phone.toLowerCase().includes(lowerCaseSearch)
        ).sort((a,b) => a.name.localeCompare(b.name));
    }, [contacts, searchTerm]);

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Danh bạ Điện tử</h2>
            <p className="text-slate-600 mb-8">Quản lý danh bạ các cá nhân, cơ quan và đơn vị.</p>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-auto flex-grow">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon path="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z" className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm theo tên, đơn vị, SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button onClick={handleAddContact} className="flex-shrink-0 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center">
                        <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5 mr-2" />
                        Thêm Liên hệ
                    </button>
                </div>
            </div>

            {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map(contact => (
                        <div key={contact.id} className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between group">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">{contact.name}</h3>
                                {contact.organization && <p className="text-sm text-blue-700 font-medium">{contact.organization}</p>}
                                <p className="text-lg text-slate-600 my-2 flex items-center">
                                    <Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" className="w-4 h-4 mr-2 text-slate-400"/>
                                    {contact.phone}
                                </p>
                                {contact.notes && <p className="text-sm text-slate-500 italic bg-slate-50 p-2 rounded-md border-l-4 border-slate-200">"{contact.notes}"</p>}
                            </div>
                            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditContact(contact)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded-full text-sm font-medium">
                                    <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" className="w-5 h-5"/>
                                </button>
                                <button onClick={() => setContactToDelete(contact)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full text-sm font-medium">
                                    <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.502 0a48.097 48.097 0 013.478-.397m7.54-1.121a48.11 48.11 0 00-7.54 0" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200">
                    <Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4 4 0 014.89-2.064M12 15a4 4 0 100-8 4 4 0 000 8zM3 18.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m7.5-2.952a4 4 0 00-4.89-2.064M12 9a4 4 0 100-8 4 4 0 000 8z" className="mx-auto h-12 w-12 text-slate-400"/>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">Không có liên hệ nào</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {searchTerm ? "Không tìm thấy liên hệ nào phù hợp." : "Hãy bắt đầu bằng cách thêm một liên hệ mới."}
                    </p>
                </div>
            )}

            <ContactModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveContact}
                contact={currentContact}
            />

            <ConfirmationModal
                isOpen={!!contactToDelete}
                onClose={() => setContactToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận Xóa Liên hệ"
                confirmText="Xác nhận Xóa"
                confirmButtonVariant="danger"
            >
                Bạn có chắc chắn muốn xóa liên hệ <strong className="font-semibold">{contactToDelete?.name}</strong>? Hành động này không thể hoàn tác.
            </ConfirmationModal>

        </div>
    );
};

export default DirectoryTab;
