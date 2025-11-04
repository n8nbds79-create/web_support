import React, { useState } from 'react';
import Icon from './Icon';

declare const mammoth: any;
declare const pdfjsLib: any;

const EditorTab: React.FC = () => {
    const [promptData, setPromptData] = useState({
        reportType: 'Báo cáo tháng',
        reportPeriod: '',
        mainPoints: '- Tình hình thực hiện nhiệm vụ...\n- Kết quả đạt được...\n- Khó khăn, vướng mắc...\n- Đề xuất, kiến nghị...',
        styleRequests: 'Văn phong trang trọng, chính xác, khách quan.',
    });
    const [referenceContent, setReferenceContent] = useState<string>('');
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    
    // UI State
    const [showReference, setShowReference] = useState<boolean>(true);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [isParsingFile, setIsParsingFile] = useState<boolean>(false);
    const [showCopyNotification, setShowCopyNotification] = useState<boolean>(false);

    const handleInputChange = (field: keyof typeof promptData, value: string) => {
        setPromptData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsingFile(true);
        setUploadedFileName(file.name);
        setReferenceContent('');

        const extension = file.name.split('.').pop()?.toLowerCase();
        const reader = new FileReader();

        if (extension === 'txt') {
            reader.onload = (e) => {
                setReferenceContent(e.target?.result as string);
                setIsParsingFile(false);
            };
            reader.readAsText(file);
        } else if (extension === 'docx') {
            reader.onload = async (e) => {
                try {
                    if (typeof mammoth === 'undefined') {
                        throw new Error('Mammoth.js library is not loaded.');
                    }
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    setReferenceContent(result.value);
                } catch (error) {
                    console.error("Error parsing .docx file:", error);
                    setReferenceContent(`Lỗi: Không thể đọc tệp ${file.name}. Tệp có thể bị hỏng hoặc không được hỗ trợ.`);
                } finally {
                    setIsParsingFile(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (extension === 'pdf') {
            reader.onload = async (e) => {
                try {
                    if (typeof pdfjsLib === 'undefined') {
                        throw new Error('pdf.js library is not loaded.');
                    }
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
                    const pdf = await loadingTask.promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map((item: { str: string }) => item.str).join(' ');
                        fullText += pageText + '\n\n';
                    }
                    setReferenceContent(fullText.trim());
                } catch (error) {
                    console.error("Error parsing .pdf file:", error);
                    setReferenceContent(`Lỗi: Không thể đọc tệp ${file.name}. Tệp có thể bị hỏng, có mật khẩu hoặc không được hỗ trợ.`);
                } finally {
                    setIsParsingFile(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (extension === 'doc') {
            setReferenceContent(`Lỗi: Định dạng tệp .doc cũ không được hỗ trợ. Vui lòng lưu tệp dưới dạng .docx hoặc .pdf và thử lại.`);
            setIsParsingFile(false);
        } else {
            setReferenceContent(`Lỗi: Định dạng tệp "${file.name}" không được hỗ trợ. Vui lòng chỉ sử dụng .txt, .docx, hoặc .pdf.`);
            setIsParsingFile(false);
        }
    };
    
    const clearReference = () => {
        setReferenceContent('');
        setUploadedFileName(null);
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleGeneratePrompt = () => {
        const prompt = `VAI TRÒ: Bạn là một trợ lý AI chuyên nghiệp, hỗ trợ soạn thảo văn bản hành chính cho cơ quan nhà nước Việt Nam với sự am hiểu về các quy định của tỉnh Khánh Hòa.

YÊU CẦU: Dựa vào các thông tin dưới đây, hãy soạn thảo một văn bản báo cáo hoàn chỉnh.

--- THÔNG TIN CHI TIẾT ---
- Loại báo cáo: ${promptData.reportType || '[Chưa cung cấp]'}
- Kỳ báo cáo: ${promptData.reportPeriod || '[Chưa cung cấp]'}
- Các nội dung chính cần đề cập:
${promptData.mainPoints || '[Chưa cung cấp]'}
- Yêu cầu đặc biệt về văn phong, định dạng: ${promptData.styleRequests || '[Không có]'}
--- HẾT THÔNG TIN CHI TIẾT ---

--- DỮ LIỆU THAM KHẢO ---
Sử dụng dữ liệu dưới đây để lấy số liệu và thông tin chi tiết cho báo cáo. Nếu không có dữ liệu, hãy tạo nội dung dựa trên thông tin chi tiết và để trống phần số liệu với ghi chú dạng "[số liệu]".
${referenceContent || 'Không có dữ liệu tham khảo nào được cung cấp.'}
--- HẾT DỮ LIỆU THAM KHẢO ---

ĐỊNH DẠNG ĐẦU RA:
- Văn bản phải tuân thủ thể thức của một báo cáo hành chính tại Việt Nam.
- Ngôn ngữ: Tiếng Việt, văn phong trang trọng, chính xác, mạch lạc.
- Bắt đầu bằng "Kính gửi: [Cơ quan nhận báo cáo]" và kết thúc bằng "Trân trọng báo cáo./.".`;
        setGeneratedPrompt(prompt);
    };

    const copyPromptToClipboard = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt).then(() => {
            setShowCopyNotification(true);
            setTimeout(() => setShowCopyNotification(false), 2000);
        });
    };

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <h2 className="text-2xl font-semibold text-slate-800">Công cụ tạo Prompt Báo cáo</h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">Điền các thông tin dưới đây để tạo một yêu cầu (prompt) chi tiết. Sau đó, sao chép và dán prompt này vào ứng dụng AI bạn đang sử dụng (ChatGPT, Gemini, Copilot...).</p>

            {/* Prompt Builder Form */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">1. Nhập thông tin cho báo cáo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="reportType" className="block text-sm font-medium text-slate-700 mb-1">Loại báo cáo</label>
                        <input type="text" id="reportType" value={promptData.reportType} onChange={e => handleInputChange('reportType', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="reportPeriod" className="block text-sm font-medium text-slate-700 mb-1">Kỳ báo cáo / Thời gian</label>
                        <input type="text" id="reportPeriod" placeholder="Ví dụ: Quý IV năm 2023" value={promptData.reportPeriod} onChange={e => handleInputChange('reportPeriod', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="mainPoints" className="block text-sm font-medium text-slate-700 mb-1">Các nội dung chính cần báo cáo (dàn ý)</label>
                        <textarea id="mainPoints" rows={5} value={promptData.mainPoints} onChange={e => handleInputChange('mainPoints', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="styleRequests" className="block text-sm font-medium text-slate-700 mb-1">Yêu cầu về văn phong, định dạng</label>
                        <input type="text" id="styleRequests" value={promptData.styleRequests} onChange={e => handleInputChange('styleRequests', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 mt-6">
                <button onClick={() => setShowReference(!showReference)} className="w-full flex justify-between items-center text-lg font-semibold text-slate-800 focus:outline-none">
                    <span>2. Cung cấp Dữ liệu tham khảo (Tùy chọn)</span>
                    <Icon path="m19.5 8.25-7.5 7.5-7.5-7.5" className={`w-5 h-5 transition-transform ${showReference ? 'rotate-180' : ''}`} />
                </button>
                {showReference && (
                    <div className="mt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <input type="file" id="fileInput" onChange={handleFileUpload} className="text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" accept=".txt,.doc,.docx,.pdf"/>
                            <button onClick={clearReference} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm">Xóa tham khảo</button>
                        </div>
                        {isParsingFile && <div className="text-sm text-blue-600">Đang đọc tệp, vui lòng chờ...</div>}
                        {uploadedFileName && <div className="text-sm text-green-700">{`Đã tải tệp: ${uploadedFileName}`}</div>}
                        <textarea value={referenceContent} onChange={e => setReferenceContent(e.target.value)}
                            className="w-full h-48 p-3 border border-slate-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            placeholder="Dán tài liệu tham khảo (ví dụ: số liệu thô, email...) hoặc dùng nút 'Chọn tệp' (.txt, .docx, .pdf)."></textarea>
                    </div>
                )}
            </div>
            
            <div className="my-6">
                <button 
                    onClick={handleGeneratePrompt} 
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-base font-medium flex items-center justify-center"
                >
                   <Icon path="M9.813 15.904L9 18l2.096-.813a1.946 1.946 0 001.21-.433l6.5-6.5a2.121 2.121 0 000-3l-2.5-2.5a2.121 2.121 0 00-3 0l-6.5 6.5A1.946 1.946 0 005.25 12.25v2.828a2.25 2.25 0 01.9-1.664z M18 8.25l-2.5-2.5" className="w-5 h-5 mr-2" />
                    Tạo Prompt chi tiết
                </button>
            </div>
            
            {generatedPrompt && (
                <div className="flex-1 flex flex-col mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="generatedPrompt" className="block text-sm font-medium text-slate-700">Prompt đã tạo:</label>
                        <button onClick={copyPromptToClipboard} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm font-medium flex items-center">
                            <Icon path="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042m-7.416 0v3.042a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V6.75m-7.416 0h7.416" className="w-4 h-4 mr-2" />
                            Sao chép Prompt
                        </button>
                    </div>
                    <textarea 
                        id="generatedPrompt" 
                        readOnly 
                        value={generatedPrompt}
                        className="w-full flex-1 p-4 border border-slate-300 rounded-lg shadow-inner bg-slate-50 text-sm resize-none font-mono"
                        style={{minHeight: '200px'}}
                    />
                </div>
            )}

            {showCopyNotification && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl animate-fade-in-out">
                    Đã sao chép prompt vào clipboard!
                </div>
            )}
        </div>
    );
};

export default EditorTab;
