import React, { useRef } from 'react';

const SettingsView = ({ records, onRestore, onBack }) => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      if (records.length === 0) {
        alert("백업할 배변 기록이 아직 없습니다!");
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records));
      const downloadAnchorNode = document.createElement('a');
      
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `ung_ung_gaga_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      alert("백업 중 오류가 발생했습니다.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (window.confirm("복원 시 현재 기기의 모든 데이터가 덮어씌워집니다. 계속 진행할까요?")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            // Sanitize: ensure valid structure
            const validRecords = parsed.filter(r => r && typeof r === 'object' && r.type && r.date);
            if (validRecords.length > 0) {
              onRestore(validRecords);
              alert(`${validRecords.length}개의 응가 기록이 성공적으로 복원되었습니다! 💩✨`);
              onBack(); // Return to calendar on success
            } else {
              alert("선택하신 백업 파일 내에 정상적인 응가 기록이 없습니다.");
            }
          } else {
            alert("응응가가 호환 백업 파일이 아닙니다.");
          }
        } catch (error) {
          alert("파일을 읽는 데 실패했습니다. 손상되었거나 잘못된 파일인지 확인해 주세요.");
        }
      };
      reader.readAsText(file);
    }
    // Prevent same-file upload bug
    e.target.value = null;
  };

  return (
    <div className="view-container">
      <header>
        <button className="nav-btn" onClick={onBack}>달력으로</button>
        <h1 className="pixel-title">설정 & 백업</h1>
        <div style={{ width: '60px' }}></div> {/* Spacer for pure centering */}
      </header>
      
      <div className="settings-card">
        <h3>데이터 영구 보존함 💾</h3>
        <p className="settings-desc">
          브라우저 캐시를 강제로 삭제하거나 기기를 초기화해도 나의 배변 파노라마를 잃지 않도록, 
          회원가입 없이 아이폰 '파일' 앱에 백업본을 저장해두세요. 언제든지 이 화면에서 100% 온전히 복원할 수 있습니다!
        </p>
        
        <div className="backup-controls">
          <button className="backup-btn export-btn" onClick={handleExport}>
            <span className="icon">📥</span>
            <div className="btn-text">
              <strong>기록 내보내기 (백업)</strong>
              <span>데이터를 아이폰 통째로 안전하게 저장합니다.</span>
            </div>
          </button>

          <button className="backup-btn import-btn" onClick={handleImportClick}>
            <span className="icon">📤</span>
            <div className="btn-text">
              <strong>기록 불러오기 (복원)</strong>
              <span>저장해둔 백업본으로 과거 기록을 완전 소생시킵니다.</span>
            </div>
          </button>
          
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
