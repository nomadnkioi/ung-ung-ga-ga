import React, { useState } from 'react';
import healthy from '../assets/healthy_poop.svg';
import goat from '../assets/goat_poop.svg';
import soft from '../assets/soft_poop.svg';
import diarrhea from '../assets/diarrhea_poop.svg';
import painful from '../assets/painful_poop.svg';

const DayDetailView = ({ date, records, onAddRecord, onEditRecord, onDeleteRecord, onBack }) => {
  const [expandedRecordId, setExpandedRecordId] = useState(null);

  const getPoopIcon = (type) => {
    switch (type) {
      case 'Healthy': return healthy;
      case 'Goat': return goat;
      case 'Soft': return soft;
      case 'Diarrhea': return diarrhea;
      case 'Painful': return painful;
      default: return healthy;
    }
  };

  const getPoopLabel = (type) => {
    const labels = {
      Healthy: '건강한 똥',
      Goat: '토끼 똥',
      Soft: '묽은 변',
      Diarrhea: '설사',
      Painful: '복통 설사'
    };
    return labels[type] || type;
  };

  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <div className="day-detail-view">
      <div className="detail-header">
        <h2 className="detail-date">{formattedDate}</h2>
        <p className="detail-subtitle">{records.length > 0 ? `${records.length}개의 기록이 있습니다.` : '기록이 없습니다.'}</p>
      </div>

      <div className="detail-records-list">
        {records.map((r, index) => {
          const recordKey = r.id || `record-${index}-${r.created_at}`;
          const isExpanded = expandedRecordId === recordKey;
          
          return (
            <div 
              key={recordKey} 
              className={`detail-record-card ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedRecordId(isExpanded ? null : recordKey);
              }}
            >
              <div className="card-main">
                <img src={getPoopIcon(r.type)} alt={r.type} className="card-icon" />
                <div className="card-info">
                  <span className="card-type">{getPoopLabel(r.type)}</span>
                  <span className="card-time">
                    {r.created_at ? new Date(r.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </span>
                </div>
                <div className="expand-indicator" style={{
                  transition: 'transform 0.3s ease', 
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  fontSize: '1.2rem'
                }}>▼</div>
              </div>
              
              <div className="card-memo-container" style={{
                maxHeight: isExpanded ? '200px' : '0',
                opacity: isExpanded ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div className="card-memo" style={{ borderTop: isExpanded ? '2px dashed #f0f0f0' : 'none', marginTop: isExpanded ? '12px' : '0' }}>
                  {r.memo || <span className="no-memo">메모가 없습니다.</span>}
                  
                  {isExpanded && (
                    <div className="card-actions" style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      gap: '12px', 
                      marginTop: '15px' 
                    }}>
                      <span 
                        onClick={(e) => { e.stopPropagation(); onEditRecord(r); }}
                        style={{ fontSize: '0.75rem', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}
                      >수정</span>
                      <span 
                        onClick={(e) => { e.stopPropagation(); onDeleteRecord(r.id); }}
                        style={{ fontSize: '0.75rem', color: '#ff5252', cursor: 'pointer', textDecoration: 'underline' }}
                      >삭제</span>
                    </div>
                  )}
                </div>
              </div>

              {!isExpanded && r.memo && (
                <div className="card-memo-preview" style={{
                  marginTop: '10px', 
                  fontSize: '0.85rem', 
                  color: '#999',
                  borderTop: '1px solid #f9f9f9',
                  paddingTop: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {r.memo.length > 25 ? (
                    <>{r.memo.substring(0, 25)}<span style={{fontSize: '0.75rem', color: '#ccc'}}> ...(더보기)</span></>
                  ) : (
                    r.memo
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="add-more-btn" onClick={onAddRecord}>
        <span>+</span> 새로운 기록 추가하기
      </button>

      <style jsx>{`
        .day-detail-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: slideUp 0.3s ease-out;
        }
        .detail-header {
          text-align: center;
          margin-bottom: 10px;
        }
        .detail-date {
          font-family: 'Galmuri11', sans-serif;
          color: var(--text-color);
          margin-bottom: 5px;
        }
        .detail-subtitle {
          font-size: 0.9rem;
          color: #888;
        }
        .detail-records-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 50vh;
          overflow-y: auto;
          padding: 5px;
        }
        .detail-record-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          border: var(--border-thick);
          box-shadow: 3px 3px 0px var(--text-color);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .detail-record-card:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px var(--text-color);
        }
        .card-main {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .card-icon {
          width: 40px;
          height: 40px;
          image-rendering: pixelated;
        }
        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-type {
          font-weight: 700;
          color: var(--text-color);
        }
        .card-time {
          font-size: 0.8rem;
          color: #aaa;
        }
        .expand-indicator {
          font-size: 0.8rem;
          color: #ccc;
        }
        .card-memo, .card-memo-preview {
          margin-top: 12px;
          font-size: 0.95rem;
          color: #555;
          line-height: 1.5;
          padding-top: 12px;
          border-top: 2px dashed #eee;
          white-space: pre-wrap;
        }
        .no-memo {
          color: #ccc;
          font-style: italic;
        }
        .add-more-btn {
          background: var(--accent-color);
          color: white;
          border: var(--border-thick);
          border-radius: 8px;
          padding: 15px;
          font-family: 'Galmuri11', sans-serif;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: var(--shadow-thick);
          transform: translate(-2px, -2px);
          transition: all 0.1s;
        }
        .add-more-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px var(--text-color);
        }
        .add-more-btn span {
          font-size: 1.2rem;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DayDetailView;
