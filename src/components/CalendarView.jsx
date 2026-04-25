import React from 'react';

const CalendarView = ({ records, onDateSelect, currentMonth = new Date(), onPrevMonth, onNextMonth }) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  
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
        <button onClick={onPrevMonth} style={{ background: 'none', border: 'none', fontSize: '1rem', color: 'var(--accent-color)', cursor: 'pointer', padding: '10px' }}>◀</button>
        <div style={{ display: 'flex', alignItems: 'center', background: '#fdfbff', padding: '8px 25px', borderRadius: '30px', border: '1.5px dashed #e1dff2' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)', fontFamily: "'Outfit', sans-serif", fontWeight: '700' }}>{year}년 {month + 1}월</h2>
        </div>
        <button onClick={onNextMonth} style={{ background: 'none', border: 'none', fontSize: '1rem', color: 'var(--accent-color)', cursor: 'pointer', padding: '10px' }}>▶</button>
      </div>
      <div className="calendar-header">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="calendar-day-name">{d}</div>
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
