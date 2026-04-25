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
        <p className="main-text" style={{ textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '1.5', margin: '0 0 10px 0' }}>{text}</p>
        <p className="sub-text" style={{ textAlign: 'center', margin: '0' }}>{subtext}</p>
      </div>

      {total > 0 && (
        <div className="visualization-section">
          <p className="summary-info">일별 배변 빈도 분석 (회/일)</p>
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
              
              {/* Trend Line */}
              {points && (
                <polyline
                  fill="none"
                  stroke="#b3ace5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  className="pixel-line"
                />
              )}
              
              {/* Data Points & Value Labels */}
              {dailyFrequency.map((d, i) => {
                const dayRatio = i / (dailyFrequency.length - 1 || 1);
                const x = dayRatio * (chartWidth - 30) + 20;
                const countRatio = d.count / (maxCount || 1);
                const y = (chartHeight - 10) - countRatio * (chartHeight - 20);
                
                if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) return null;
                if (d.count === 0 && i % 5 !== 0) return null;
                
                return (
                  <g key={`monthly-point-${i}`}>
                    {d.count > 0 && (
                      <React.Fragment key={`frag-${i}`}>
                        <circle cx={x} cy={y} r="3" fill="#9575cd" />
                        <text x={x} y={y - 6} fontSize="7" fill="#9575cd" fontWeight="bold" textAnchor="middle" fontFamily="DungGeunMo">
                          {d.count}
                        </text>
                      </React.Fragment>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="chart-labels" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              width: '100%', 
              paddingLeft: '30px', 
              paddingRight: '20px', 
              boxSizing: 'border-box',
              marginTop: '5px',
              fontSize: '0.55rem',
              color: '#999',
              fontFamily: "'Galmuri11', sans-serif"
            }}>
              <span>1일</span>
              <span>15일</span>
              <span>말일</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MonthlyReport;
