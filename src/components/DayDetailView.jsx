import React, { useState } from 'react';
import healthy from '../assets/healthy_poop.png';
import goat from '../assets/goat_poop.png';
import soft from '../assets/soft_poop.png';
import diarrhea from '../assets/diarrhea_poop.png';
import painful from '../assets/painful_poop.png';

const DayDetailView = ({ date, records, onAddRecord, onBack }) => {
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
        {records.map((r) => (
          <div 
            key={r.id || r.created_at} 
            className={`detail-record-card ${expandedRecordId === (r.id || r.created_at) ? 'expanded' : ''}`}
            onClick={() => setExpandedRecordId(expandedRecordId === (r.id || r.created_at) ? null : (r.id || r.created_at))}
          >
            <div className="card-main">
              <img src={getPoopIcon(r.type)} alt={r.type} className="card-icon" />
              <div className="card-info">
                <span className="card-type">{getPoopLabel(r.type)}</span>
                <span className="card-time">{r.created_at ? new Date(r.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
              </div>
              <div className="expand-indicator">{expandedRecordId === (r.id || r.created_at) ? '▲' : '▼'}</div>
            </div>
            {(expandedRecordId === (r.id || r.created_at) || r.memo.length < 30) && (
              <div className="card-memo">
                {r.memo || <span className="no-memo">메모가 없습니다.</span>}
              </div>
            )}
            {expandedRecordId !== (r.id || r.created_at) && r.memo.length >= 30 && (
              <div className="card-memo-preview">
                {r.memo.substring(0, 30)}...
              </div>
            )}
          </div>
        ))}
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
          border-radius: 16px;
          padding: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .detail-record-card:active {
          transform: scale(0.98);
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
          border-top: 1px dashed #eee;
          white-space: pre-wrap;
        }
        .no-memo {
          color: #ccc;
          font-style: italic;
        }
        .add-more-btn {
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 10px rgba(130, 115, 235, 0.3);
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
