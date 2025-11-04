
import { Contact, VanBanPhapLy, WorkLogEntry } from '../types';

const callApi = async (action: string, resource: string, payload?: any) => {
    const response = await fetch('/.netlify/functions/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, resource, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
        throw new Error(errorData.error || `Lỗi máy chủ: ${response.status}`);
    }

    return response.json();
};

// --- Contacts API ---
export const getContacts = (): Promise<Contact[]> => callApi('GET_ALL', 'contacts');
export const saveContact = (contact: Contact): Promise<Contact> => callApi('SAVE', 'contacts', contact);
export const deleteContact = (id: string): Promise<{ id: string }> => callApi('DELETE', 'contacts', { id });

// --- WorkLog API ---
export const getWorkLog = (): Promise<WorkLogEntry[]> => callApi('GET_ALL', 'work_log');
export const saveWorkLog = (log: WorkLogEntry): Promise<WorkLogEntry> => callApi('SAVE', 'work_log', log);
export const deleteWorkLog = (id: string): Promise<{ id: string }> => callApi('DELETE', 'work_log', { id });

// --- Legal Documents API ---
export const getLegalDocuments = (): Promise<VanBanPhapLy[]> => callApi('GET_ALL', 'legal_documents');

export const addLegalDocument = async (file: File): Promise<VanBanPhapLy> => {
    const content = await file.text();
    const newDoc = {
        ten: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        noiDung: content,
    };
    return callApi('CREATE_USER_DOC', 'legal_documents', newDoc);
};

export const deleteLegalDocument = (id: string): Promise<{ id: string }> => callApi('DELETE', 'legal_documents', { id });
