import React, { useState } from 'react';
import { Tab } from '../types';
import Icon from './Icon';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobileOpen: boolean;
}

const iconPaths = {
  editor: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  workLog: "M6 12h1.5m5.25 0h1.5m-4.5 0h1.5m-7.5 0h1.5m-1.5 3h15a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v9a1.5 1.5 0 001.5 1.5zm1.5-6h.01M6 12h.01M6 15h.01M12 15h.01M15 15h.01M18 15h.01M18 12h.01M18 9h.01M15 9h.01M12 9h.01M9 9h.01",
  traCuuVanBan: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25",
  traCuuChiTieu: "m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z",
  lapDuToan: "M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75zM16.5 9.75a.75.75 0 00-1.5 0v2.25H12a.75.75 0 000 1.5h3a.75.75 0 00.75-.75V9.75zM9 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z",
  taiLieuKPI: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  danhBa: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4 4 0 014.89-2.064M12 15a4 4 0 100-8 4 4 0 000 8zM3 18.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m7.5-2.952a4 4 0 00-4.89-2.064M12 9a4 4 0 100-8 4 4 0 000 8z",
  hoTro: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008Z",
};

const NavButton: React.FC<{
  label: string;
  iconPath: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ label, iconPath, isActive, onClick, isCollapsed }) => {
  const activeClasses = 'bg-blue-100 text-blue-700';
  const inactiveClasses = 'text-slate-600 hover:bg-slate-100';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center px-3' : 'px-4'}`}
      title={isCollapsed ? label : undefined}
    >
      <Icon path={iconPath} className="w-5 h-5 shrink-0" />
      <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? 'w-0 ml-0 opacity-0' : 'w-auto ml-3 opacity-100'}`}>
        {label}
      </span>
    </button>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, isMobileOpen }) => {

  // --- BẮT ĐẦU: CODE MỚI THÊM (LOGIC ĐỒNG BỘ) ---
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    // 1. Hiển thị thông báo xác nhận
    if (!confirm('Bạn có chắc chắn muốn đồng bộ Danh bạ từ Neon sang Google Sheet không? Việc này sẽ GHI ĐÈ dữ liệu cũ.')) {
      return;
    }

    // 2. Bắt đầu trạng thái tải
    setIsSyncing(true);

    try {
      // 3. Gửi request đến Netlify Function
      const response = await fetch('/.netlify/functions/api', {
        method: 'POST',
        body: JSON.stringify({
          resource: 'sync_to_google' // "Chìa khóa" để gọi logic mới
        })
      });

      if (!response.ok) {
        // Nếu server trả về lỗi, cố gắng đọc lỗi JSON
        const errorData = await response.json().catch(() => ({ error: 'Server báo lỗi, không thể đọc phản hồi.' }));
        throw new Error(errorData.error || 'Server báo lỗi không xác định.');
      }

      const result = await response.json();
      alert(result.message || 'Đồng bộ thành công!'); // Hiển thị thông báo từ API

    } catch (error: any) { // Dùng 'any' để bắt lỗi
      console.error('Lỗi khi đồng bộ:', error);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    } finally {
      // 5. Kết thúc trạng thái tải (dù thành công hay thất bại)
      setIsSyncing(false);
    }
  };
  // --- KẾT THÚC: CODE MỚI THÊM (LOGIC ĐỒNG BỘ) ---


  const sidebarContainerClasses = `
        bg-white shadow-lg flex flex-col
        transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0 z-40
        md:relative md:shadow-none md:z-auto md:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

  return (
    <aside className={sidebarContainerClasses}>
      <div className={`p-5 border-b border-slate-200 flex items-center shrink-0 h-[72px] ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <div className={`overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>
          <h1 className="text-xl font-bold text-blue-700 whitespace-nowrap">Hỗ trợ Báo cáo</h1>
          <p className="text-sm text-slate-500 whitespace-nowrap">Tỉnh Khánh Hòa</p>
        </div>
        <div className={`${isCollapsed ? 'block' : 'hidden'}`}>
          <Icon path="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" className="w-8 h-8 text-blue-700" />
        </div>
      </div>

      {/* Đây là phần menu (flex-1), nó sẽ đẩy phần footer xuống dưới */}
      <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
        <NavButton
          label="Soạn thảo Báo cáo"
          iconPath={iconPaths.editor}
          isActive={activeTab === Tab.Editor}
          onClick={() => setActiveTab(Tab.Editor)}
          isCollapsed={isCollapsed}
        />
        <NavButton
          label="Nhật ký Công việc"
          iconPath={iconPaths.workLog}
          isActive={activeTab === Tab.WorkLog}
          onClick={() => setActiveTab(Tab.WorkLog)}
          isCollapsed={isCollapsed}  /* <-- ĐÃ SỬA LỖI (từ islCollapsed) */
        />
        <NavButton
          label="Tra cứu Văn bản"
          iconPath={iconPaths.traCuuVanBan}
          isActive={activeTab === Tab.LegalLookup}
          onClick={() => setActiveTab(Tab.LegalLookup)}
          isCollapsed={isCollapsed}
        />
        <NavButton
          label="Tra cứu Chỉ tiêu (QĐ 1603)"
          iconPath={iconPaths.traCuuChiTieu}
          isActive={activeTab === Tab.TargetLookup}
          onClick={() => setActiveTab(Tab.TargetLookup)}
          isCollapsed={isCollapsed}
        />
        <NavButton
          label="Lập Dự toán CNTT"
          iconPath={iconPaths.lapDuToan}
          isActive={activeTab === Tab.Estimation}
          onClick={() => setActiveTab(Tab.Estimation)}
          isCollapsed={isCollapsed}
        />
        <NavButton
          label="Tài liệu KPI"
          iconPath={iconPaths.taiLieuKPI}
          isActive={activeTab === Tab.Documents}
          onClick={() => setActiveTab(Tab.Documents)}
          isCollapsed={isCollapsed}
        />
        <NavButton
          label="Danh bạ Điện tử"
          iconPath={iconPaths.danhBa}  /* <-- ĐÃ SỬA LỖI (xóa {iconPath = ...}) */
          isActive={activeTab === Tab.Directory}
          onClick={() => setActiveTab(Tab.Directory)}
          isCollapsed={isCollapsed}
        />
        <NavButton
          label="Thông tin Hỗ trợ"
          iconPath={iconPaths.hoTro}
          isActive={activeTab === Tab.Support}
          onClick={() => setActiveTab(Tab.Support)}
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Đây là phần footer chứa nút Thu gọn và nút Đồng bộ */}
      <div className="p-3 border-t border-slate-200 shrink-0">

        {/* --- BẮT ĐẦU: KHỐI ĐỒNG BỘ MỚI --- */}
        {/* Khối này sẽ tự động ẩn khi menu bị thu gọn (isCollapsed) */}
        <div className={`transition-all duration-200 ease-in-out ${isCollapsed ? 'w-0 opacity-0 h-0 overflow-hidden' : 'w-auto opacity-100 h-auto mb-3'}`}>
          <h4 className="text-xs font-semibold text-slate-700 mb-2 whitespace-nowrap">QUẢN TRỊ DỮ LIỆU</h4> {/* <-- ĐÃ SỬA LỖI (từ nowFap) */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Google Sheet'}
          </button>
        </div>
        {/* --- KẾT THÚC: KHỐI ĐỒNG BỘ MỚI --- */}

        {/* Nút Thu gọn/Mở rộng (code cũ của bạn) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-200"
          title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          <Icon path={isCollapsed ? "M8.25 4.5l7.5 7.5-7.5 7.5" : "M15.75 19.5L8.25 12l7.5-7.5"} className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;