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
      <div className="report-header" style={{ marginBottom: '30px' }}>
         <h2 className="report-title" style={{ fontSize: '1.1rem', margin: '0', color: 'var(--text-color)' }}>
            <span className="chu-im-sae-icon" style={{ fontSize: '1.2rem', marginRight: '5px' }}>🥁</span>
            이달의 배변 추세
         </h2>
      </div>

      <div className="chuimsae-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p className="main-text" style={{ textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '1.5', margin: '0 0 10px 0', color: '#fbc02d', fontWeight: 'bold' }}>{text}</p>
        <p className="sub-text" style={{ textAlign: 'center', margin: '0', fontSize: '0.8rem', color: '#888' }}>{subtext}</p>
      </div>

      {total > 0 && (
        <div className="visualization-section" style={{ marginTop: '30px' }}>
          <h2 className="report-title" style={{ fontSize: '1.0rem', margin: '0 0 15px 0', color: 'var(--text-color)', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.1rem', marginRight: '5px' }}>📈</span>
            일별 배변 빈도 추세
          </h2>
          <div className="line-chart-container">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="line-chart">
              {/* Y-Axis Grid Lines & Labels */}
              {[...Array(maxCount + 1)].map((_, i) => {
                const ratio = i / (maxCount || 1);
                const y = (chartHeight - 10) - ratio * (chartHeight - 20);
                if (isNaN(y) || !isFinite(y)) return null;
                return (
                  <g key={`monthly-grid-${i}`} className="grid-line">
                    <line x1="20" y1={y} x2={chartWidth - 10} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    <text x="5" y={y + 2} fontSize="6" fill="#bbb" fontFamily="DungGeunMo">{i}</text>
                  </g>
                );
              })}
              
              <polyline
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 6"
                points={points}
              />
              
              {dailyFrequency.map((d, i) => {
                const dayRatio = i / (dailyFrequency.length - 1 || 1);
                const x = dayRatio * (chartWidth - 30) + 20;
                const countRatio = d.count / (maxCount || 1);
                const y = (chartHeight - 10) - countRatio * (chartHeight - 20);
                if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y) || d.count === 0) return null;
                return <circle key={`p-${i}`} cx={x} cy={y} r="3" fill="#81d4fa" stroke="#212121" strokeWidth="0.5" />;
              })}
            </svg>
            <div className="chart-labels" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px 0 30px', fontSize: '0.6rem', color: '#999', fontFamily: 'DungGeunMo' }}>
              <span>1일</span><span>15일</span><span>말일</span>
            </div>
          </div>

          <div className="quality-analysis-box" style={{ marginTop: '40px', padding: '20px', background: '#fff', border: 'var(--border-thick)', boxShadow: '4px 4px 0px var(--text-color)', borderRadius: '12px' }}>
             <h2 className="report-title" style={{ fontSize: '1.0rem', margin: '0 0 20px 0', color: 'var(--text-color)', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.1rem', marginRight: '5px' }}>🕹️</span>
                이달의 응가 퀄리티 분석
             </h2>
             
             {['Healthy', 'Goat', 'Soft', 'Diarrhea', 'Painful'].map(type => {
               const count = records.filter(r => r.type === type).length;
               const percentage = total > 0 ? (count / total) * 100 : 0;
               const labels = { Healthy: '완벽(건강)', Goat: '딱딱(변비)', Soft: '묽음(부드럽)', Diarrhea: '설사(주의)', Painful: '복통(비상)' };
               const colors = { Healthy: '#002fa7', Goat: '#8d6e63', Soft: '#fff176', Diarrhea: '#ff9800', Painful: '#f44336' };
               
               if (count === 0 && type !== 'Healthy' && type !== 'Goat') return null; // 빈 데이터는 일부 숨김

               return (
                 <div key={type} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', fontFamily: 'DungGeunMo' }}>
                       <span style={{ fontWeight: 'bold' }}>{labels[type]}</span>
                       <span>{count}회</span>
                    </div>
                    <div style={{ height: '14px', background: '#f0f0f0', border: '2px solid #212121', borderRadius: '4px', overflow: 'hidden' }}>
                       <div style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: colors[type],
                          borderRight: percentage > 0 ? '2px solid #212121' : 'none'
                       }}></div>
                    </div>
                 </div>
               );
             })}

             <div className="wellness-summary" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px dashed #eee', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#666' }}>🏆 건강 응가 점수</p>
                <div style={{ 
                   fontSize: '3.5rem', 
                   fontWeight: '900', 
                   fontFamily: 'DungGeunMo',
                   color: '#888888',
                   lineHeight: '1.1',
                   display: 'inline-block',
                   padding: '10px'
                }}>
                   {Math.round((records.filter(r => r.type === 'Healthy').length / (total || 1)) * 100)}
                   <span style={{ fontSize: '1.2rem' }}>점</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#444', marginTop: '10px', lineHeight: '1.4', background: '#f5f5f5', padding: '8px', borderRadius: '4px', border: '1px solid #212121' }}>
                   {records.filter(r => r.type === 'Goat').length > 0 
                     ? `⚠️ 주의! 이번 달은 토끼똥이 ${records.filter(r => r.type === 'Goat').length}번이나 있었어요. 식이섬유를 더 챙겨주세요!` 
                     : "✨ 훌륭해요! 이번 달은 딱딱한 변이 없네요. 아주 좋은 컨디션입니다!"}
                </p>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MonthlyReport;
