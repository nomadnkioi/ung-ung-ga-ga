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
  const [editingRecord, setEditingRecord] = useState(null); // 수정 중인 기록 저장
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
    };

    try {
      if (editingRecord) {
        // [수정 모드]
        const { data, error } = await supabase
          .from('records')
          .update(recordToSave)
          .eq('id', editingRecord.id)
          .select();

        if (error) throw error;
        if (data) {
          const updatedRecords = records.map(r => r.id === editingRecord.id ? data[0] : r);
          setRecords(updatedRecords);
          localStorage.setItem('ung_ung_ga_ga_records', JSON.stringify(updatedRecords));
          setEditingRecord(null);
        }
      } else {
        // [새 기록 모드]
        const { data, error } = await supabase
          .from('records')
          .insert([recordToSave])
          .select();

        if (error) throw error;
        if (data) {
          const updatedRecords = [...records, data[0]];
          setRecords(updatedRecords);
          localStorage.setItem('ung_ung_ga_ga_records', JSON.stringify(updatedRecords));
          alert("새 응가가 등록되었습니다! 오늘도 건똥! 💩✨");
        }
      }
    } catch (e) {
      console.error("Operation failed:", e);
      alert("처리에 실패했습니다.");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("정말 이 응가 기록을 삭제할까요? 💩🗑️")) return;
    try {
      const { error } = await supabase.from('records').delete().eq('id', id);
      if (error) throw error;
      const updatedRecords = records.filter(r => r.id !== id);
      setRecords(updatedRecords);
      localStorage.setItem('ung_ung_ga_ga_records', JSON.stringify(updatedRecords));
      alert("삭제되었습니다.");
    } catch (e) {
      console.error("Delete failed:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  const startEditing = (record) => {
    setEditingRecord(record);
    setView('record');
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
            <button className="nav-btn home" onClick={() => setView('home')}>HOME</button>
            <h1 style={{fontSize: '1.8rem', margin: '0', cursor: 'default'}}>💩</h1>
            <div style={{width: '60px'}}></div>
          </header>
          
          <CalendarView 
            records={currentMonthRecords} 
            onDateSelect={handleDateSelect} 
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <MonthlyReport records={currentMonthRecords} />

        </div>
      )}

      {view === 'dayDetail' && (
        <div className="view-container">
          <header>
            <button className="nav-btn home" onClick={() => setView('calendar')}>돌아가기</button>
            <h1 style={{fontSize: '1.8rem', margin: '0', cursor: 'default'}}>💩</h1>
            <div style={{width: '64px'}}></div>
          </header>
          <DayDetailView 
            date={selectedDate} 
            records={getDayRecords(selectedDate)}
            onAddRecord={() => { setEditingRecord(null); setView('record'); }}
            onEditRecord={startEditing}
            onDeleteRecord={deleteRecord}
            onBack={() => setView('calendar')}
          />
        </div>
      )}

      {view === 'record' && (
        <div className="view-container">
          <header>
            <button className="nav-btn home" onClick={() => { setEditingRecord(null); setView('dayDetail'); }}>취소</button>
            <h1 style={{fontSize: '1.8rem', margin: '0', cursor: 'default'}}>💩</h1>
            <div style={{width: '64px'}}></div>
          </header>
          <RecordForm 
            date={selectedDate} 
            initialData={editingRecord}
            onSave={(newRecord) => {
              addRecord(newRecord);
              setView('dayDetail');
            }} 
            onCancel={() => { setEditingRecord(null); setView('dayDetail'); }} 
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
