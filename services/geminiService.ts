// Fix: Removed the unused `chatWithBot` function and its associated imports.
// The function was causing a type error because the `ChatMessage` type is not defined,
// and AI functionality has been removed from the application as indicated in `Chatbot.tsx`.

// A helper function to call our Netlify serverless function
const callNetlifyFunction = async (type: string, payload: any) => {
    // This endpoint is automatically created by Netlify when it deploys the function
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, payload }),
    });

    if (!response.ok) {
        // When a Netlify function is not found (404) or has an error (500),
        // the response is often not JSON. We need to handle this gracefully.
        let errorMessage = `Lỗi từ máy chủ: ${response.status} ${response.statusText}`;
        try {
            // Try to parse the error response as JSON, as our function might send structured errors
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // If it's not JSON, it could be a simple text or HTML message from Netlify's servers.
            const errorText = await response.text();
            console.error("Phản hồi lỗi không phải JSON từ máy chủ:", errorText);
        }

        // Add a more specific message to the console for debugging the common 404 issue.
        if (response.status === 404) {
            console.error("Lỗi 404: Không tìm thấy Netlify function tại '/.netlify/functions/gemini'. Vui lòng kiểm tra lại cấu hình tệp 'netlify.toml' và vị trí của thư mục 'netlify/functions'.");
            errorMessage = "Lỗi 404: Không tìm thấy hàm xử lý AI. Vui lòng kiểm tra cấu hình dự án trên Netlify."
        }
        throw new Error(errorMessage);
    }

    return response.json();
};


export const generateReport = async (
    prompt: string,
    referenceContent: string,
    editorContent: string
): Promise<string> => {
    try {
        const data = await callNetlifyFunction('generateReport', {
            prompt,
            referenceContent,
            editorContent,
        });
        return data.text;
    } catch (error) {
        console.error("Lỗi khi gọi Netlify function để tạo báo cáo:", error);
        throw new Error("Không thể tạo báo cáo. Vui lòng thử lại.");
    }
};
