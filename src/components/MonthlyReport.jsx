import React from 'react';
import { generateChuimsae } from '../utils/generateChuimsae';

const MonthlyReport = ({ records }) => {
  const { text, subtext, total, status, dailyFrequency } = generateChuimsae(records);

  const chartWidth = 300;
  const chartHeight = 80;
  const maxCount = Math.max(...dailyFrequency.map(d => d.count), 3);

  const points = dailyFrequency.map((d, i) => {
    const x = (i / (dailyFrequency.length - 1)) * (chartWidth - 30) + 20;
    const y = (chartHeight - 10) - (d.count / (maxCount || 1)) * (chartHeight - 20);
    if (isNaN(x) || isNaN(y)) return null;
    return `${x},${y}`;
  }).filter(Boolean).join(' ');

  return (
    <div className={`monthly-report-card ${status}`}>
      <div className="report-header" style={{ marginBottom: '20px' }}>
         <h2 className="report-title" style={{ fontSize: '1.1rem', margin: '0', color: 'var(--text-color)' }}>
            <span className="chu-im-sae-icon" style={{ fontSize: '1.2rem', marginRight: '6px' }}>🐰</span>
            이달의 배변 추세
         </h2>
      </div>

      <div className="chuimsae-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p className="main-text" style={{ textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '1.5', margin: '0 0 8px 0', color: 'var(--accent-color)', fontWeight: 'bold' }}>{text}</p>
        <p className="sub-text" style={{ textAlign: 'center', margin: '0', fontSize: '0.8rem', color: '#8E8A9A' }}>{subtext}</p>
      </div>

      {total > 0 && (
        <div className="visualization-section" style={{ marginTop: '30px' }}>
          <h2 className="report-title" style={{ fontSize: '1.1rem', margin: '0 0 16px 0', color: 'var(--text-color)', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '6px' }}>⭐</span>
            이달의 응가 분석
          </h2>
          <div className="quality-analysis-box" style={{ padding: '20px', background: '#fff', border: 'var(--border-thick)', boxShadow: 'var(--shadow-thick)', borderRadius: '18px' }}>
              
              {/* 단일 누적 막대 그래프로 깔끔하게 시각화 */}
              <div style={{ height: '20px', background: '#F8F7FD', borderRadius: '10px', overflow: 'hidden', display: 'flex', marginBottom: '20px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
                {['Healthy', 'Goat', 'Soft', 'Diarrhea', 'Painful'].map(type => {
                  const count = records.filter(r => r.type === type).length;
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  const colors = { Healthy: 'var(--accent-color)', Goat: '#B3A29E', Soft: '#FCD87D', Diarrhea: '#FFAF65', Painful: '#FF7D75' };
                  
                  if (count === 0) return null;
                  return (
                    <div 
                      key={type} 
                      style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        background: colors[type],
                        transition: 'width 0.3s ease'
                      }}
                      title={`${type}: ${count}회 (${Math.round(percentage)}%)`}
                    />
                  );
                })}
              </div>

              {/* 귀여운 배지 칩으로 요약 표시 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Healthy', 'Goat', 'Soft', 'Diarrhea', 'Painful'].map(type => {
                  const count = records.filter(r => r.type === type).length;
                  if (count === 0) return null;
                  const labels = { Healthy: '건강', Goat: '딱딱', Soft: '묽음', Diarrhea: '설사', Painful: '복통' };
                  const colors = { Healthy: 'var(--accent-color)', Goat: '#B3A29E', Soft: '#FCD87D', Diarrhea: '#FFAF65', Painful: '#FF7D75' };
                  return (
                    <span 
                      key={type} 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        background: '#F8F7FD', 
                        border: `1px solid ${colors[type]}`, 
                        color: 'var(--text-color)', 
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: colors[type] }}></span>
                      {labels[type]} {count}회
                    </span>
                  );
                })}
              </div>

              {/* 귀여운 점수 및 요약 디자인 */}
              <div className="wellness-summary" style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingTop: '15px', borderTop: '1.5px dashed #F0EDF7' }}>
                <div style={{ 
                  background: '#F8F7FD', 
                  borderRadius: '16px', 
                  padding: '12px 18px', 
                  textAlign: 'center',
                  minWidth: '90px'
                }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: '#8E8A9A', fontWeight: 'bold' }}>건강점수</p>
                  <div style={{ 
                     fontSize: '2rem', 
                     fontWeight: '800', 
                     fontFamily: "'Outfit', sans-serif",
                     color: 'var(--accent-color)',
                     lineHeight: '1',
                     letterSpacing: '-1px'
                  }}>
                     {Math.round((records.filter(r => r.type === 'Healthy').length / (total || 1)) * 100)}
                     <span style={{ fontSize: '0.8rem', marginLeft: '1px', fontWeight: 'bold' }}>점</span>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6C6875', margin: 0, lineHeight: '1.4' }}>
                     {records.filter(r => r.type === 'Goat').length > 0 
                       ? `이번 달은 토끼똥이 ${records.filter(r => r.type === 'Goat').length}회 있었어요. 물을 조금 더 자주 마셔봐요! 💧` 
                       : "참 잘했어요! 이번 달은 아주 건강하고 부드러운 배변 패턴을 유지하고 있어요. 🌟"}
                  </p>
                </div>
              </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MonthlyReport;
