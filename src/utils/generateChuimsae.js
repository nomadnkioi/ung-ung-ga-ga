export const generateChuimsae = (records) => {
  // ALWAYS calculate daily frequency for the current month to prevent crashes
  const now = new Date();
  const year = now.getFullYear();
  const m = now.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const dailyFrequency = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = records.filter(r => {
      const rDate = typeof r.date === 'string' ? r.date.split('T')[0] : '';
      return rDate === dateStr;
    }).length;
    return { day, count };
  });

  const total = records.length;
  if (total === 0) return {
    text: "기록을 시작해보세요!\n모여야 추임새가 나옵니다. 🥁",
    subtext: "첫 응가를 기록하면 분석을 시작할게요!",
    status: 'normal',
    total: 0,
    dailyFrequency,
    counts: {}
  };

  const counts = records.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const healthyCount = counts['Healthy'] || 0;
  const unhealthyCount = (counts['Diarrhea'] || 0) + (counts['Painful'] || 0);
  const goatCount = counts['Goat'] || 0;

  let text = "";
  let subtext = "";
  let status = 'normal';

  if (healthyCount / total > 0.7) {
    text = "얼쑤! 황금똥 대잔치로구나! ✨";
    subtext = "이대로만 가세요. 당신은 진정한 응가 왕!";
    status = 'excellent';
  } else if (unhealthyCount / total > 0.4) {
    text = "에구머니나! 배가 많이 아프셨구려... 🚑";
    subtext = "자극적인 음식은 피하고 배를 따뜻하게 해주세요.";
    status = 'warning';
  } else if (goatCount / total > 0.4) {
    text = "지화자! 토끼들이 친구하자 하겠소! 🐇";
    subtext = "수분을 더 섭취하고 식이섬유를 챙겨보세요.";
    status = 'needs_water';
  } else {
    text = "좋구나! 꾸준히 관리하고 계시는구려! 👍";
    subtext = "기록을 멈추지 마세요. 건강이 최고입니다!";
    status = 'good';
  }

  return { text, subtext, counts, total, status, dailyFrequency };
};
