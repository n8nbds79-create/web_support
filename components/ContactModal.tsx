
import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import Icon from './Icon';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contact: Contact | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        organization: contact.organization,
        phone: contact.phone,
        notes: contact.notes || ''
      });
    } else {
      setFormData({ name: '', organization: '', phone: '', notes: '' });
    }
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Vui lòng nhập tên và số điện thoại.');
      return;
    }
    onSave({
      ...contact,
      id: contact?.id || `contact_${Date.now()}`,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
                <h3 className="text-lg leading-6 font-medium text-slate-900">
                {contact ? 'Chỉnh sửa Liên hệ' : 'Thêm Liên hệ mới'}
                </h3>
                <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Tên cá nhân / Cơ quan</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-slate-700">Đơn vị</label>
                <input type="text" name="organization" id="organization" value={formData.organization} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Số điện thoại</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Ghi chú</label>
                <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"></textarea>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 flex flex-row-reverse rounded-b-lg">
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Lưu
            </button>
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;