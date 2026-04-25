import React, { useState, useEffect } from 'react';
import './App.css';
import FallingRain from './components/FallingRain';
import CalendarView from './components/CalendarView';
import RecordForm from './components/RecordForm';
import DayDetailView from './components/DayDetailView';
import MonthlyReport from './components/MonthlyReport';
import { supabase } from './utils/supabaseClient';

const App = () => {
  const [view, setView] = useState('home'); // 'home', 'calendar', 'dayDetail', 'record'
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAlarm, setShowAlarm] = useState(false);

  // 1. 초기 데이터 로드 (Supabase -> LocalStorage 백업 -> State)
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Supabase에서 데이터 가져오기
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Error fetching from Supabase:", error);
        // 오류 발생 시 로컬 데이터 시도
        const localData = localStorage.getItem('ung_ung_ga_ga_records');
        if (localData) setRecords(JSON.parse(localData));
      } else if (data) {
        setRecords(data);
        localStorage.setItem('ung_ung_ga_ga_records', JSON.stringify(data));
      }
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. 기록 추가 (Supabase 저장 및 상태 업데이트)
  const addRecord = async (newRecord) => {
    const recordToSave = {
      type: newRecord.type,
      memo: newRecord.memo || '',
      date: typeof newRecord.date === 'string' ? newRecord.date.split('T')[0] : formatLocalDate(newRecord.date || new Date()),
      // id는 Supabase가 자동 생성하도록 맡기거나 그대로 사용
    };

    try {
      const { data, error } = await supabase
        .from('records')
        .insert([recordToSave])
        .select();

      if (error) throw error;

      if (data) {
        const updatedRecords = [...records, data[0]];
        setRecords(updatedRecords);
        localStorage.setItem('ung_ung_ga_ga_records', JSON.stringify(updatedRecords));
      }
    } catch (e) {
      alert("데이터 저장에 실패했습니다. (오프라인 모드 유지)");
      console.error("Save failed:", e);
      // 오프라인 저장은 일단 로컬만 수행
      const offlineRecord = { ...recordToSave, id: Date.now() };
      const updatedRecords = [...records, offlineRecord];
      setRecords(updatedRecords);
      localStorage.setItem('ung_ung_ga_ga_records', JSON.stringify(updatedRecords));
    }
  };

  //Emergency Alarm Simulation
  useEffect(() => {
    if (view === 'calendar' && !loading && records.length === 0) {
      const timer = setTimeout(() => setShowAlarm(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [view, records, loading]);

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setView('dayDetail');
  };

  const getDayRecords = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const target = `${year}-${month}-${day}`;
    return records.filter(r => r.date === target);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const currentMonthRecords = records.filter(r => {
    if (!r.date) return false;
    const rDate = new Date(r.date);
    if (isNaN(rDate.getTime())) return false;
    return rDate.getFullYear() === currentMonth.getFullYear() && rDate.getMonth() === currentMonth.getMonth();
  });

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

  return (
    <div className="app-container">
      {loading && view !== 'home' && (
        <div className="loading-overlay">
          <div className="pixel-spinner">응가 데이터를 불러오는 중... 💩</div>
        </div>
      )}

      {view === 'home' && (
        <FallingRain onEnter={() => setView('calendar')} />
      )}
      
      {view === 'calendar' && (
        <div className="view-container">
          <header>
            <button className="nav-btn" onClick={() => setView('home')}>HOME</button>
            <h1 className="pixel-title">배변 캘린더</h1>
            <button className="nav-btn accent" onClick={() => { setSelectedDate(new Date()); setView('record'); }}>기록</button>
          </header>
          
          <CalendarView 
            records={currentMonthRecords} 
            onDateSelect={handleDateSelect} 
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <MonthlyReport records={currentMonthRecords} />

          <div className="records-summary">
            <h3>최근 기록</h3>
            {records.length === 0 ? (
              <p className="no-records">아직 기록이 없어요! 💩</p>
            ) : (
              <div className="records-list">
                {records.slice(-4).reverse().map(r => (
                  <div key={r.id || r.created_at} className="record-card">
                    <span className="record-date">{new Date(r.date).toLocaleDateString()}</span>
                    <span className="record-type">{getPoopLabel(r.type)}</span>
                    <p className="record-memo">{r.memo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'dayDetail' && (
        <div className="view-container">
          <header>
            <button className="nav-btn" onClick={() => setView('calendar')}>돌아가기</button>
            <h1 className="pixel-title">기록 상세</h1>
          </header>
          <DayDetailView 
            date={selectedDate} 
            records={getDayRecords(selectedDate)}
            onAddRecord={() => setView('record')}
            onBack={() => setView('calendar')}
          />
        </div>
      )}

      {view === 'record' && (
        <div className="view-container">
          <header>
            <button className="nav-btn" onClick={() => setView('dayDetail')}>취소</button>
            <h1 className="pixel-title">응가 등록</h1>
          </header>
          <RecordForm 
            date={selectedDate} 
            onSave={(newRecord) => {
              addRecord(newRecord);
              setView('dayDetail');
            }} 
            onCancel={() => setView('dayDetail')} 
          />
        </div>
      )}

      {showAlarm && (
        <div className="emergency-alarm" onClick={() => setShowAlarm(false)}>
          <div className="alarm-content">
            <span className="alarm-icon">🚨</span>
            <p className="alarm-text">비상비상!! 응가알람!!</p>
            <p className="alarm-subtext">오늘 응가 기록이 없어요!</p>
            <button className="alarm-close">기록하러 가기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
