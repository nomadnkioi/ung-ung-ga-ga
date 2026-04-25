import React, { useState } from 'react';
import healthy from '../assets/healthy_poop.svg';
import goat from '../assets/goat_poop.svg';
import soft from '../assets/soft_poop.svg';
import diarrhea from '../assets/diarrhea_poop.svg';
import painful from '../assets/painful_poop.svg';

const RecordForm = ({ onSave, onCancel, date, initialData }) => {
  const [type, setType] = useState(initialData ? initialData.type : 'Healthy');
  const [memo, setMemo] = useState(initialData ? initialData.memo : '');
  const [showCelebration, setShowCelebration] = useState(false);

  const poopTypes = [
    { id: 'Healthy', icon: healthy, label: '건강한 똥' },
    { id: 'Goat', icon: goat, label: '토끼 똥' },
    { id: 'Soft', icon: soft, label: '묽은 변' },
    { id: 'Diarrhea', icon: diarrhea, label: '설사' },
    { id: 'Painful', icon: painful, label: '복통 설사' }
  ];

  const handleSave = () => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;

    setShowCelebration(true);
    setTimeout(() => {
      onSave({ date: localDateStr, type, memo });
    }, 600);
  };

  if (showCelebration) {
    return (
      <div className="celebration-screen">
        <h2 className="celebration-text">오늘도 건똥하자! ✨</h2>
        <div className="sparkles">✨ Poof! ✨</div>
        <style jsx>{`
          .celebration-screen {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.5s ease-out;
          }
          .celebration-text {
            font-family: 'Galmuri11', sans-serif;
            font-size: 1.1rem;
            color: #a0a0a0;
            text-align: center;
          }
          .sparkles {
            margin-top: 20px;
            font-size: 2rem;
            animation: bounce 0.5s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="record-form">
      <h3>{initialData ? '응가 기록 수정하기' : '기분 좋은 배변 기록'}</h3>
      <div className="type-selector">
        {poopTypes.map(pt => (
          <div 
            key={pt.id} 
            className={`type-item ${type === pt.id ? 'active' : ''}`}
            onClick={() => setType(pt.id)}
          >
            <img src={pt.icon} alt={pt.label} className="type-icon" />
            <span>{pt.label}</span>
          </div>
        ))}
      </div>
      
      <div className="memo-field">
        <label>메모 (식단/컨디션)</label>
        <textarea 
          placeholder="오늘의 응가 상태는 어땠나요?"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div className="actions">
        <button className="save-btn" onClick={handleSave}>
          {initialData ? '수정 완료하기' : '기록하기'}
        </button>
      </div>

    </div>
  );
};

export default RecordForm;
