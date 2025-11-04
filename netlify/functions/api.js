const { neon } = require('@netlify/neon');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { LEGAL_DOCUMENTS_SEED_DATA } = require('./seedData');

// === BỘ KHỞI TẠO ===

// 1. Khởi tạo Neon
const sql = neon();

// 2. Hàm trợ giúp để kết nối Google Sheet (cần env vars)
const getGoogleDoc = async () => {
    // Xác thực bằng Service Account
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Rất quan trọng: thay thế \n
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // ID của file Google Sheet (từ env var hoặc hardcode)
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); // Tải thông tin file
    return doc;
};

// 3. Hàm seed dữ liệu (từ file cũ)
const seedLegalDocuments = async () => {
    console.log("Seeding legal documents...");
    for (const doc of LEGAL_DOCUMENTS_SEED_DATA) {
        await sql`
            INSERT INTO legal_documents (id, ten, mota, "diemMauChot", "noiDung", "isUserUploaded")
            VALUES (${doc.id}, ${doc.ten}, ${doc.moTa}, ${doc.diemMauChot}, ${doc.noiDung}, false)
            ON CONFLICT (id) DO NOTHING;
        `;
    }
    console.log("Seeding complete.");
};

// === HÀM API CHÍNH ===

exports.handler = async (event) => {
    // Chỉ cho phép phương thức POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        // Phân tích nội dung request
        const { action, resource, payload } = JSON.parse(event.body);

        // Phân luồng logic dựa trên 'resource'
        switch (resource) {

            // --- LOGIC BẢNG 'contacts' (NEON) ---
            case 'contacts':
                switch (action) {
                    case 'GET_ALL':
                        const contacts = await sql`SELECT * FROM contacts ORDER BY name ASC`;
                        return { statusCode: 200, body: JSON.stringify(contacts) };
                    case 'SAVE':
                        const { id, name, organization, phone, notes } = payload;
                        if (id && id.startsWith('contact_')) { // Update
                            const [updated] = await sql`
                                UPDATE contacts SET name = ${name}, organization = ${organization}, phone = ${phone}, notes = ${notes}
                                WHERE id = ${id} RETURNING *`;
                            return { statusCode: 200, body: JSON.stringify(updated) };
                        } else { // Create
                            const newId = `contact_${Date.now()}`;
                            const [created] = await sql`
                                INSERT INTO contacts (id, name, organization, phone, notes)
                                VALUES (${newId}, ${name}, ${organization}, ${phone}, ${notes}) RETURNING *`;
                            return { statusCode: 201, body: JSON.stringify(created) };
                        }
                    case 'DELETE':
                        await sql`DELETE FROM contacts WHERE id = ${payload.id}`;
                        return { statusCode: 200, body: JSON.stringify({ id: payload.id }) };
                }
                break;

            // --- LOGIC BẢNG 'work_log' (NEON) ---
            case 'work_log':
                switch (action) {
                    case 'GET_ALL':
                        const logs = await sql`SELECT * FROM work_log ORDER BY "arrivalDate" DESC`;
                        return { statusCode: 200, body: JSON.stringify(logs) };
                    case 'SAVE':
                        const { id, arrivalDate, arrivalTime, workStartTime, workEndTime, personInCharge, dailyStatus, report, notes } = payload;
                        if (id && id.startsWith('worklog_')) { // Update
                            const [updated] = await sql`
                                UPDATE work_log SET "arrivalDate"=${arrivalDate}, "arrivalTime"=${arrivalTime}, "workStartTime"=${workStartTime}, "workEndTime"=${workEndTime}, "personInCharge"=${personInCharge}, "dailyStatus"=${dailyStatus}, report=${report}, notes=${notes}
                                WHERE id = ${id} RETURNING *`;
                            return { statusCode: 200, body: JSON.stringify(updated) };
                        } else { // Create
                            const newId = `worklog_${Date.now()}`;
                            const [created] = await sql`
                                INSERT INTO work_log (id, "arrivalDate", "arrivalTime", "workStartTime", "workEndTime", "personInCharge", "dailyStatus", report, notes)
                                VALUES (${newId}, ${arrivalDate}, ${arrivalTime}, ${workStartTime}, ${workEndTime}, ${personInCharge}, ${dailyStatus}, ${report}, ${notes}) RETURNING *`;
                            return { statusCode: 201, body: JSON.stringify(created) };
                        }
                    case 'DELETE':
                        await sql`DELETE FROM work_log WHERE id = ${payload.id}`;
                        return { statusCode: 200, body: JSON.stringify({ id: payload.id }) };
                }
                break;

            // --- LOGIC BẢNG 'legal_documents' (NEON) ---
            case 'legal_documents':
                switch (action) {
                    case 'GET_ALL':
                        const [{ count }] = await sql`SELECT COUNT(*) FROM legal_documents WHERE "isUserUploaded" = false`;
                        if (parseInt(count, 10) < LEGAL_DOCUMENTS_SEED_DATA.length) {
                            await seedLegalDocuments();
                        }
                        const docs = await sql`SELECT * FROM legal_documents ORDER BY "isUserUploaded" ASC, ten ASC`;
                        return { statusCode: 200, body: JSON.stringify(docs) };

                    case 'CREATE_USER_DOC':
                        const { ten, noiDung } = payload;
                        const newId = `user_${Date.now()}`;
                        const moTa = `Tải lên lúc: ${new Date().toLocaleString('vi-VN')}`;
                        const diemMauChot = [noiDung.substring(0, 150) + (noiDung.length > 150 ? '...' : '')];
                        const [created] = await sql`
                            INSERT INTO legal_documents (id, ten, mota, "diemMauChot", "noiDung", "isUserUploaded")
                            VALUES (${newId}, ${ten}, ${moTa}, ${diemMauChot}, ${noiDung}, true) RETURNING *`;
                        return { statusCode: 201, body: JSON.stringify(created) };

                    case 'DELETE':
                        await sql`DELETE FROM legal_documents WHERE id = ${payload.id} AND "isUserUploaded" = true`;
                        return { statusCode: 200, body: JSON.stringify({ id: payload.id }) };
                }
                break;

            // --- CHỨC NĂNG MỚI: ĐỒNG BỘ NEON -> GOOGLE SHEET ---
            case 'sync_to_google':
                console.log("Bắt đầu đồng bộ Google Sheet...");

                // 1. Lấy dữ liệu từ Neon (Ví dụ: đồng bộ bảng 'contacts')
                // (Bạn có thể lặp lại quy trình này cho 'work_log' nếu muốn)
                const contactsToSync = await sql`SELECT * FROM contacts ORDER BY name ASC`;
                console.log(`Đã lấy ${contactsToSync.length} liên hệ từ Neon.`);

                // 2. Kết nối Google Sheet
                const doc = await getGoogleDoc();
                // Giả sử bạn muốn ghi vào sheet đầu tiên (gid=0)
                const sheet = doc.sheetsByIndex[0];
                console.log(`Đã kết nối Google Sheet: ${doc.title}, Sheet: ${sheet.title}`);

                // 3. Xóa dữ liệu cũ và thêm dữ liệu mới
                // (Lưu ý: Đảm bảo header của Google Sheet khớp với tên cột của Neon, 
                // ví dụ: 'id', 'name', 'organization', 'phone', 'notes')
                await sheet.clearRows(); // Xóa các hàng cũ (giữ lại hàng tiêu đề)
                console.log("Đã xóa các hàng cũ trong Google Sheet.");

                await sheet.addRows(contactsToSync); // Thêm các hàng mới
                console.log("Đã thêm hàng mới vào Google Sheet.");

                return { statusCode: 200, body: JSON.stringify({ message: `Đồng bộ ${contactsToSync.length} liên hệ thành công!` }) };
        }

        // Nếu không có 'resource' nào khớp
        return { statusCode: 400, body: JSON.stringify({ error: 'Hành động hoặc tài nguyên không hợp lệ' }) };

    } catch (error) {
        console.error("API Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Lỗi máy chủ nội bộ' }) };
    }
};