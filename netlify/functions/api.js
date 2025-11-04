
const { neon } = require('@netlify/neon');
const { LEGAL_DOCUMENTS_SEED_DATA } = require('./seedData');

const sql = neon();

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

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { action, resource, payload } = JSON.parse(event.body);

        switch (resource) {
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
        }

        return { statusCode: 400, body: JSON.stringify({ error: 'Hành động hoặc tài nguyên không hợp lệ' }) };

    } catch (error) {
        console.error("API Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Lỗi máy chủ nội bộ' }) };
    }
};
