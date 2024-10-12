// 계산 버튼 클릭 시 계산 함수 실행
document.getElementById('calculateButton').addEventListener('click', calculate);

function calculate() {
    // 입력된 값을 불러와서 변수에 저장 (만원 단위는 10000으로 변환)
    let initialInvestment = parseFloat(document.getElementById('initialInvestment').value) * 10000; 
    let dividendRate = parseFloat(document.getElementById('dividendRate').value) / 100; 
    let dividendGrowthRate = parseFloat(document.getElementById('dividendGrowthRate').value) / 100; 
    let stockGrowthRate = parseFloat(document.getElementById('stockGrowthRate').value) / 100; 
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; 
    let monthlyInvestmentGrowthRate = parseFloat(document.getElementById('monthlyInvestmentGrowthRate').value) / 100; 
    let reinvestmentRate = parseFloat(document.getElementById('reinvestmentRate').value) / 100; 
    let taxRate = parseFloat(document.getElementById('taxRate').value) / 100; 
    let inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100; 
    let targetMonthlyDividend = parseFloat(document.getElementById('targetMonthlyDividend').value) * 10000; 

    // 결과를 저장할 배열 선언
    let results = [];
    let year = 1; // 현재 연차 (1년차부터 시작)
    
    // 초기 자산 및 투자금 설정
    let totalInvestment = initialInvestment; 
    let totalReinvestedDividends = 0; 
    let totalAssets = 0; // 총 자산 초기화

    // 목표 월 배당금에 도달할 때까지 반복
    while (true) {
        // 연간 투자금 계산
        let annualInvestment = totalInvestment + (monthlyInvestment * 12); // 연간 투자금

        // 연간 배당금 계산
        let annualDividends = annualInvestment * dividendRate * reinvestmentRate * (1 - taxRate) * (1 - inflationRate); 

        // 연말 총 자산 계산
        totalAssets = (annualInvestment + annualDividends) * (1 + stockGrowthRate); 
        
        // 결과를 배열에 저장
        results.push({
            year: year,
            monthlyDividend: annualDividends / 12 / 10000, // 연 배당금을 12로 나누어 월 평균 배당금으로 계산
            totalAssets: totalAssets / 10000, // 연말 총 자산
            cumulativeInvestment: totalInvestment / 10000, // 누적 투자 원금
            cumulativeDividends: totalReinvestedDividends / 10000 // 누적 투자 배당금
        });

        // 재투자된 배당금 업데이트
        totalReinvestedDividends += annualDividends; 

        // 다음 해 월 투자금 계산
        monthlyInvestment *= (1 + monthlyInvestmentGrowthRate); 
        totalInvestment = annualInvestment; // 누적 투자 원금 업데이트
        
        // 목표 월 배당금에 도달했는지 확인
        if ((annualDividends / 12) >= targetMonthlyDividend) {
            break; // 목표 달성 시 종료
        }

        year++; // 연도 증가
    }

    // 계산된 결과를 화면에 출력
    displayResults(results, targetMonthlyDividend / 10000, year);
}

// 계산된 결과를 화면에 표시하는 함수
function displayResults(results, targetMonthlyDividend, yearsTaken) {
    let tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = ''; // 기존 테이블 데이터 초기화

    // 결과 데이터를 테이블에 추가
    results.forEach(result => {
        let row = document.createElement('tr');
        row.innerHTML = 
            `<td title="년수">${result.year} 년</td>
             <td title="월 평균 배당금 (만원)">${Math.floor(result.monthlyDividend).toLocaleString()} 만원</td>
             <td title="연말 총 자산 (만원)">${Math.floor(result.totalAssets).toLocaleString()} 만원</td>
             <td title="누적 투자 원금 (만원)">${Math.floor(result.cumulativeInvestment).toLocaleString()} 만원</td>
             <td title="누적 투자 배당금 (만원)">${Math.floor(result.cumulativeDividends).toLocaleString()} 만원</td>`;
        tbody.appendChild(row); // 새로운 행을 테이블에 추가
    });

    // 결과 메시지 출력
    document.getElementById('resultMessage').textContent = `${yearsTaken} 년 후 목표 월 배당금에 도달합니다. 경제적 자유를 위해 화이팅하세요.`;

    // 그래프 그리기
    drawGraph(results);
}

// 그래프 그리기 함수
function drawGraph(results) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = results.map(result => `${result.year}년`);
    const monthlyDividends = results.map(result => result.monthlyDividend);
    const totalAssets = results.map(result => result.totalAssets);

    // 차트 설정
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '월 평균 배당금 (만원)',
                data: monthlyDividends,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }, {
                label: '연말 총 자산 (만원)',
                data: totalAssets,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
