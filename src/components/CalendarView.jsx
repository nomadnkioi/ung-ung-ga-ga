import React from 'react';

const CalendarView = ({ records, onDateSelect, currentMonth = new Date(), onPrevMonth, onNextMonth }) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rawStartDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const startDayOfWeek = (rawStartDay + 6) % 7; // Adjust to Monday start (0 is Monday)
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const getRecordForDay = (day) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const targetDate = `${year}-${monthStr}-${dayStr}`;

    return records.filter(r => {
      const rDate = typeof r.date === 'string' ? r.date.split('T')[0] : '';
      return rDate === targetDate;
    });
  };

  const today = new Date();
  const isToday = (day) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  return (
    <div className="calendar-grid">
      <div className="calendar-nav" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <span onClick={onPrevMonth} style={{ fontSize: '1.0rem', color: 'var(--text-color)', cursor: 'pointer', padding: '5px', userSelect: 'none' }}>◀</span>
        <div style={{ display: 'flex', alignItems: 'center', background: '#e1f5fe', padding: '2px 8px', borderRadius: '8px', border: 'var(--border-thick)', boxShadow: '3px 3px 0px var(--text-color)' }}>
          <h2 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-color)', fontFamily: "'DungGeunMo', sans-serif", fontWeight: '700', whiteSpace: 'nowrap' }}>{year}년 {month + 1}월</h2>
        </div>
        <span onClick={onNextMonth} style={{ fontSize: '1.0rem', color: 'var(--text-color)', cursor: 'pointer', padding: '5px', userSelect: 'none' }}>▶</span>
      </div>
      <div className="calendar-header">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div 
            key={`${d}-${i}`} 
            className={`calendar-day-name ${i >= 5 ? 'weekend' : ''}`}
            style={
              i === 5 ? { color: '#888', fontWeight: 'bold' } : 
              i === 6 ? { color: '#f44336', fontWeight: 'bold' } : {}
            }
          >
            {d}
          </div>
        ))}
      </div>
      <div className="calendar-body">
        {emptyDays.map(empty => (
          <div key={`empty-${empty}`} className="calendar-cell empty"></div>
        ))}
        {days.map(day => {
          const hasRecord = getRecordForDay(day).length > 0;
          return (
            <div 
              key={day} 
              className={`calendar-cell ${isToday(day) ? 'today' : ''} ${hasRecord ? 'has-record' : ''}`}
              onClick={() => onDateSelect(new Date(year, month, day))}
            >
              <span className="day-number" style={hasRecord ? { color: '#b0b0b0' } : {}}>{day}</span>
              <div className="day-records">
                {hasRecord && (
                  <div className="record-marker">💩</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
