
export enum Tab {
  Editor = 'editor',
  WorkLog = 'nhatKyCongViec',
  LegalLookup = 'traCuuVanBan',
  TargetLookup = 'traCuuChiTieu',
  Estimation = 'lapDuToan',
  Documents = 'taiLieu',
  Directory = 'danhBa',
  Support = 'hoTro',
}

export interface VanBanPhapLy {
  id: string;
  ten: string;
  moTa: string;
  diemMauChot: string[];
  noiDung?: string; // Full content for chatbot
  isUserUploaded?: boolean;
}

export interface ChiTieu {
  stt: string;
  chiTieu: string;
  donVi: string;
  ky: string;
}

export interface Contact {
  id: string;
  name: string;
  organization: string;
  phone: string;
  notes?: string;
}

export interface WorkLogEntry {
  id: string;
  arrivalDate: string;
  arrivalTime: string;
  workStartTime: string;
  workEndTime: string;
  personInCharge: string;
  dailyStatus: string;
  report: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}
