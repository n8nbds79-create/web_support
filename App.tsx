
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EditorTab from './components/EditorTab';
import LegalLookupTab from './components/LegalLookupTab';
import TargetLookupTab from './components/TargetLookupTab';
import SupportTab from './components/SupportTab';
import DirectoryTab from './components/DirectoryTab';
import EstimationTab from './components/EstimationTab';
import KpiAnalysisTab from './components/KpiAnalysisTab';
import WorkLogTab from './components/WorkLogTab';
import GlobalSearch from './components/GlobalSearch';
import Icon from './components/Icon';
import Chatbot from './components/Chatbot';
import { Tab, VanBanPhapLy, Contact, WorkLogEntry } from './types';
import * as apiService from './services/apiService';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Editor);
    const [documents, setDocuments] = useState<VanBanPhapLy[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [workLog, setWorkLog] = useState<WorkLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for sidebar
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false');
        } catch {
            return false;
        }
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for chatbot
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [docsData, contactsData, workLogData] = await Promise.all([
                    apiService.getLegalDocuments(),
                    apiService.getContacts(),
                    apiService.getWorkLog(),
                ]);
                setDocuments(docsData);
                setContacts(contactsData);
                setWorkLog(workLogData);
            } catch (err) {
                console.error("Failed to load data from backend:", err);
                setError("Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra kết nối và thử lại.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSetSidebarCollapsed = (value: boolean) => {
        setIsSidebarCollapsed(value);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(value));
    };

    const handleSetActiveTab = (tab: Tab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    };

    // --- Data Handlers ---
    const handleAddDocument = async (file: File) => {
        try {
            const newDoc = await apiService.addLegalDocument(file);
            setDocuments(prev => [...prev, newDoc]);
        } catch (err) {
            console.error(err);
            alert("Lỗi: Không thể thêm văn bản.");
        }
    };

    const handleDeleteDocument = async (id: string) => {
        try {
            await apiService.deleteLegalDocument(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            console.error(err);
            alert("Lỗi: Không thể xóa văn bản.");
        }
    };

    const handleSaveContact = async (contact: Contact) => {
        try {
            const savedContact = await apiService.saveContact(contact);
            if (contacts.some(c => c.id === savedContact.id)) {
                setContacts(prev => prev.map(c => c.id === savedContact.id ? savedContact : c));
            } else {
                setContacts(prev => [...prev, savedContact]);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi: Không thể lưu liên hệ.");
        }
    };

    const handleDeleteContact = async (id: string) => {
        try {
            await apiService.deleteContact(id);
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Lỗi: Không thể xóa liên hệ.");
        }
    };

    const handleSaveWorkLog = async (log: WorkLogEntry) => {
        try {
            const savedLog = await apiService.saveWorkLog(log);
            if (workLog.some(l => l.id === savedLog.id)) {
                setWorkLog(prev => prev.map(l => l.id === savedLog.id ? savedLog : l));
            } else {
                setWorkLog(prev => [...prev, savedLog]);
            }
            return savedLog;
        } catch (err) {
            console.error(err);
            alert("Lỗi: Không thể lưu nhật ký.");
            throw err;
        }
    };

    const handleDeleteWorkLog = async (id: string) => {
        try {
            await apiService.deleteWorkLog(id);
            setWorkLog(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error(err);
            alert("Lỗi: Không thể xóa nhật ký.");
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <p className="text-lg text-slate-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Đã xảy ra lỗi!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case Tab.Editor:
                return <EditorTab />;
            case Tab.WorkLog:
                return <WorkLogTab
                    logEntries={workLog}
                    onSave={handleSaveWorkLog}
                    onDelete={handleDeleteWorkLog}
                />;
            case Tab.LegalLookup:
                return <LegalLookupTab
                    documents={documents}
                    onAdd={handleAddDocument}
                    onDelete={handleDeleteDocument}
                />;
            case Tab.TargetLookup:
                return <TargetLookupTab />;
            case Tab.Estimation:
                return <EstimationTab />;
            case Tab.Documents:
                return <KpiAnalysisTab />;
            case Tab.Directory:
                return <DirectoryTab
                    contacts={contacts}
                    onSave={handleSaveContact}
                    onDelete={handleDeleteContact}
                />;
            case Tab.Support:
                return <SupportTab />;
            default:
                return <EditorTab />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen md:flex font-sans">
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            <Sidebar
                activeTab={activeTab}
                setActiveTab={handleSetActiveTab}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={handleSetSidebarCollapsed}
                isMobileOpen={isMobileMenuOpen}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="flex-shrink-0 p-4 md:px-6 md:py-4 border-b border-slate-200 bg-slate-100/90 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-slate-600 hover:text-slate-900"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Mở menu"
                        >
                            <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <GlobalSearch documents={documents} />
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            <button
                onClick={() => setIsChatbotOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-110"
                title="Mở Trợ lý Tra cứu"
            >
                <Icon path="M8.625 12a.375.375 0 01.375-.375h6a.375.375 0 010 .75h-6a.375.375 0 01-.375-.375zm0 3a.375.375 0 01.375-.375h6a.375.375 0 010 .75h-6a.375.375 0 01-.375-.375zm0 3a.375.375 0 01.375-.375h6a.375.375 0 010 .75h-6a.375.375 0 01-.375-.375zM4.5 6.375c0-1.036.84-1.875 1.875-1.875h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 014.5 17.625V6.375z" className="w-6 h-6" />
            </button>

            <Chatbot
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                contacts={contacts}
                documents={documents}
                workLog={workLog}
            />
        </div>
    );
};

export default App;
