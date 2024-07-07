// 음력 날짜를 파싱하여 객체로 반환하는 함수
function parseLunarDate(xmlData) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    // item 태그 아래에 있는 음력 날짜 정보를 추출
    const item = xmlDoc.querySelector('item');
    const lunYear = item.querySelector('lunYear').textContent;
    const lunMonth = item.querySelector('lunMonth').textContent;
    const lunDay = item.querySelector('lunDay').textContent;

    return {
        year: lunYear,
        month: lunMonth,
        day: lunDay
    };
}

async function fetchAndDisplayDates() {
    try {
        // TimezoneDB API 호출하여 양력 날짜 가져오기
        const response = await fetch('https://api.timezonedb.com/v2.1/get-time-zone?key=W3UAKX440D3S&format=json&by=zone&zone=Asia/Seoul');
        const data = await response.json();

        // 현재 한국 시간을 가져옴
        const koreanTime = new Date(data.formatted);

        // 한국 시간을 HTML에 표시
        const koreanTimeString = `현재 시각 ${koreanTime.getHours()}시 ${koreanTime.getMinutes()}분`;
        document.getElementById('time').innerHTML = koreanTimeString;


        // 양력 날짜를 HTML에 표시
        const solarDateString = `${koreanTime.getFullYear()}년<br>${('0' + (koreanTime.getMonth() + 1)).slice(-2)}월 ${('0' + koreanTime.getDate()).slice(-2)}일`;
        document.getElementById('solarDate').innerHTML = solarDateString;

        // 음력 날짜 변환을 위한 API 호출
        const year = koreanTime.getFullYear();
        const month = ('0' + (koreanTime.getMonth() + 1)).slice(-2);
        const day = ('0' + koreanTime.getDate()).slice(-2);
        const lunDateResponse = await fetch(`https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?solYear=${year}&solMonth=${month}&solDay=${day}&ServiceKey=m0RyjXHT1x9idw4p930WvXjlDPfB0THiNlwwIql2%2Bo6XcCnFMAH626F3qrYeAiGbM8QSSV5uiYzavSOJ0u84sw%3D%3D`);
        const lunDateXML = await lunDateResponse.text();
        const lunDate = parseLunarDate(lunDateXML);
        
        // 음력 날짜를 HTML에 표시
        const lunarDateString = `${lunDate.year}년<br>${lunDate.month}월 ${lunDate.day}일`;
        document.getElementById('lunarDate').innerHTML = lunarDateString;

    } catch (error) {
        console.error('Error fetching and displaying dates:', error);
    }
}

// 페이지 로드 시 양력과 음력 날짜를 표시함
fetchAndDisplayDates();

// 일정한 간격으로 화면 업데이트를 위해 setInterval 사용
setInterval(fetchAndDisplayDates, 30000); // 30초마다 업데이트

// 매 초마다 시간 업데이트
setInterval(updateTime, 1000);

// 페이지 로드 시 초기화
updateTime();

function updateTime() {
    var currentTime = new Date();
    var currentHour = currentTime.getHours();
    var bodyElement = document.querySelector('body');
    var cal2Element = document.querySelector('.cal-2');
    var memoElement = document.querySelector('.memo');
    var padElement = document.querySelector('.pad');

    // 시간대에 따라 클래스 추가
    if (currentHour >= 0 && currentHour < 6) {
        bodyElement.classList.remove('morning', 'afternoon', 'evening');
        bodyElement.classList.add('night');
        cal2Element.classList.remove('cal-2-morning', 'cal-2-afternoon', 'cal-2-evening');
        cal2Element.classList.add('cal-2-night');
        memoElement.style.borderColor = "#00008b";
        memoElement.style.boxShadow = "0 0 15px #00008b";
        padElement.style.borderColor = "#00008b";
        padElement.style.boxShadow = "0 0 15px #00008b";
    } else if (currentHour >= 6 && currentHour < 12) {
        bodyElement.classList.remove('night', 'afternoon', 'evening');
        bodyElement.classList.add('morning');
        cal2Element.classList.remove('cal-2-night', 'cal-2-afternoon', 'cal-2-evening');
        cal2Element.classList.add('cal-2-morning');
        memoElement.style.borderColor = "#ffa500";
        memoElement.style.boxShadow = "0 0 15px #ffa500";
        padElement.style.borderColor = "#ffa500";
        padElement.style.boxShadow = "0 0 15px #ffa500";
    } else if (currentHour >= 12 && currentHour < 18) {
        bodyElement.classList.remove('night', 'morning', 'evening');
        bodyElement.classList.add('afternoon');
        cal2Element.classList.remove('cal-2-night', 'cal-2-morning', 'cal-2-evening');
        cal2Element.classList.add('cal-2-afternoon');
        memoElement.style.borderColor = "#228b22";
        memoElement.style.boxShadow = "0 0 15px #228b22";
        padElement.style.borderColor = "#228b22";
        padElement.style.boxShadow = "0 0 15px #228b22";
    } else {
        bodyElement.classList.remove('morning', 'afternoon', 'night');
        bodyElement.classList.add('evening');
        cal2Element.classList.remove('cal-2-morning', 'cal-2-afternoon', 'cal-2-night');
        cal2Element.classList.add('cal-2-evening');
        memoElement.style.borderColor = "#6100DB";
        memoElement.style.boxShadow = "0 0 15px #6100DB";
        padElement.style.borderColor = "#6100DB";
        padElement.style.boxShadow = "0 0 15px #6100DB";
    }
}


