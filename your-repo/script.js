// サボテンのプリセットデータ
const speciesDefaults = {
    "ギムノカリキウム": {
        watering_interval: 14,
        temperature_range: [15, 30],
        humidity_range: [30, 60]
    },
    "エキノプシス": {
        watering_interval: 10,
        temperature_range: [10, 28],
        humidity_range: [30, 50]
    },
    "マミラリア": {
        watering_interval: 12,
        temperature_range: [18, 32],
        humidity_range: [25, 55]
    },
    "アストロフィツム": {
        watering_interval: 20,
        temperature_range: [15, 27],
        humidity_range: [30, 60]
    },
    "フェロカクタス": {
        watering_interval: 14,
        temperature_range: [20, 35],
        humidity_range: [25, 50]
    },
    "オプンチア": {
        watering_interval: 10,
        temperature_range: [18, 32],
        humidity_range: [30, 60]
    },
    "ハオルチア": {
        watering_interval: 7,
        temperature_range: [15, 25],
        humidity_range: [40, 70]
    },
    "サンセベリア": {
        watering_interval: 21,
        temperature_range: [15, 28],
        humidity_range: [30, 50]
    }
};

// ローカルストレージのキー
const STORAGE_KEY = 'cactus_data';

// アプリケーションの状態
let cactusList = [];
let currentWeather = null;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadCactusList();
    displayCactusList();
    setupEventListeners();
    getCurrentWeather();
    
    // 今日の日付をデフォルトに設定
    document.getElementById('lastWatered').value = new Date().toISOString().split('T')[0];
    
    // 定期的に通知をチェック
    checkNotifications();
    setInterval(checkNotifications, 300000); // 5分ごと
});

// イベントリスナーの設定
function setupEventListeners() {
    document.getElementById('cactusForm').addEventListener('submit', handleAddCactus);
}

// 種類選択時の処理
function handleSpeciesChange() {
    const species = document.getElementById('species').value;
    const customSettings = document.getElementById('customSettings');
    
    if (species === 'カスタム') {
        customSettings.style.display = 'block';
    } else {
        customSettings.style.display = 'none';
    }
}

// サボテン追加の処理
function handleAddCactus(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const species = formData.get('species');
    
    let cactusData = {
        id: Date.now(),
        name: formData.get('name'),
        species: species,
        last_watered: formData.get('lastWatered')
    };
    
    if (species === 'カスタム') {
        cactusData.watering_interval = parseInt(formData.get('wateringInterval'));
        cactusData.temp_min = parseFloat(formData.get('tempMin'));
        cactusData.temp_max = parseFloat(formData.get('tempMax'));
        cactusData.humidity_min = parseFloat(formData.get('humidityMin'));
        cactusData.humidity_max = parseFloat(formData.get('humidityMax'));
    } else if (speciesDefaults[species]) {
        const defaults = speciesDefaults[species];
        cactusData.watering_interval = defaults.watering_interval;
        cactusData.temp_min = defaults.temperature_range[0];
        cactusData.temp_max = defaults.temperature_range[1];
        cactusData.humidity_min = defaults.humidity_range[0];
        cactusData.humidity_max = defaults.humidity_range[1];
    }
    
    cactusList.push(cactusData);
    saveCactusList();
    displayCactusList();
    checkNotifications();
    
    // フォームをリセット
    e.target.reset();
    document.getElementById('customSettings').style.display = 'none';
    document.getElementById('lastWatered').value = new Date().toISOString().split('T')[0];
    
    alert('サボテンが追加されました！');
}

// サボテンリストの保存
function saveCactusList() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cactusList));
}

// サボテンリストの読み込み
function loadCactusList() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        cactusList = JSON.parse(stored);
    }
}

// サボテンリストの表示
function displayCactusList() {
    const container = document.getElementById('cactusList');
    
    if (cactusList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">まだサボテンが登録されていません</p>';
        return;
    }
    
    container.innerHTML = cactusList.map(cactus => {
        const needsWater = isWateringDue(cactus);
        const tempWarning = currentWeather && isTempOutOfRange(cactus, currentWeather.temperature);
        const humidityWarning = currentWeather && isHumidityOutOfRange(cactus, currentWeather.humidity);
        
        let cardClass = 'cactus-card';
        if (needsWater) cardClass += ' needs-water';
        else if (tempWarning || humidityWarning) cardClass += ' env-warning';
        
        return `
            <div class="${cardClass}">
                <div class="cactus-name">${cactus.name}</div>
                <div class="cactus-species">${cactus.species}</div>
                <div class="cactus-info">
                    <div><strong>水やり間隔:</strong> ${cactus.watering_interval}日</div>
                    <div><strong>最適温度:</strong> ${cactus.temp_min}℃ - ${cactus.temp_max}℃</div>
                    <div><strong>最適湿度:</strong> ${cactus.humidity_min}% - ${cactus.humidity_max}%</div>
                    <div><strong>最後の水やり:</strong> ${cactus.last_watered}</div>
                    <div><strong>次回水やり予定:</strong> ${getNextWateringDate(cactus)}</div>
                </div>
                <button class="btn-water" onclick="waterCactus(${cactus.id})">
                    💧 水やり完了
                </button>
                <button class="btn-delete" onclick="deleteCactus(${cactus.id})">
                    🗑️ 削除
                </button>
            </div>
        `;
    }).join('');
}

// 水やりが必要かチェック
function isWateringDue(cactus) {
    const lastWatered = new Date(cactus.last_watered);
    const today = new Date();
    const daysSince = Math.floor((today - lastWatered) / (1000 * 60 * 60 * 24));
    return daysSince >= cactus.watering_interval;
}

// 温度が範囲外かチェック
function isTempOutOfRange(cactus, currentTemp) {
    return currentTemp < cactus.temp_min || currentTemp > cactus.temp_max;
}

// 湿度が範囲外かチェック
function isHumidityOutOfRange(cactus, currentHumidity) {
    return currentHumidity < cactus.humidity_min || currentHumidity > cactus.humidity_max;
}

// 次回水やり日の計算
function getNextWateringDate(cactus) {
    const lastWatered = new Date(cactus.last_watered);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(lastWatered.getDate() + cactus.watering_interval);
    return nextWatering.toISOString().split('T')[0];
}

// 水やり完了
function waterCactus(id) {
    const cactus = cactusList.find(c => c.id === id);
    if (cactus) {
        cactus.last_watered = new Date().toISOString().split('T')[0];
        saveCactusList();
        displayCactusList();
        checkNotifications();
        alert(`${cactus.name}の水やりが完了しました！`);
    }
}

// サボテン削除
function deleteCactus(id) {
    const cactus = cactusList.find(c => c.id === id);
    if (cactus && confirm(`${cactus.name}を削除しますか？`)) {
        cactusList = cactusList.filter(c => c.id !== id);
        saveCactusList();
        displayCactusList();
        checkNotifications();
    }
}

// 天気情報の取得（模擬）
function getCurrentWeather() {
    // 実際のAPIの代わりに、位置情報とランダムな値を使用
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 実際の天気APIを使用する場合はここで実装
                // 今回は模擬データを使用
                currentWeather = {
                    temperature: Math.round(Math.random() * 20 + 15), // 15-35度
                    humidity: Math.round(Math.random() * 40 + 30), // 30-70%
                    location: '現在地'
                };
                displayWeatherInfo();
                checkNotifications();
            },
            () => {
                // 位置情報取得失敗時は固定値を使用
                currentWeather = {
                    temperature: 22,
                    humidity: 50,
                    location: '不明'
                };
                displayWeatherInfo();
                checkNotifications();
            }
        );
    } else {
        currentWeather = {
            temperature: 22,
            humidity: 50,
            location: '不明'
        };
        displayWeatherInfo();
        checkNotifications();
    }
}

// 天気情報の表示
function displayWeatherInfo() {
    const container = document.getElementById('weatherInfo');
    
    if (!currentWeather) {
        container.innerHTML = '<p>天気情報を取得できませんでした</p>';
        return;
    }
    
    container.innerHTML = `
        <p><strong>位置:</strong> ${currentWeather.location}</p>
        <div class="weather-data">
            <div class="weather-item">
                <div class="weather-value">${currentWeather.temperature}°C</div>
                <div class="weather-label">温度</div>
            </div>
            <div class="weather-item">
                <div class="weather-value">${currentWeather.humidity}%</div>
                <div class="weather-label">湿度</div>
            </div>
        </div>
        <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
            ※ この情報は模擬データです。実際のAPIを使用する場合は、OpenWeatherMap等のサービスを利用してください。
        </p>
    `;
}

// 通知のチェック
function checkNotifications() {
    if (!currentWeather) return;
    
    const notifications = [];
    
    cactusList.forEach(cactus => {
        if (isWateringDue(cactus)) {
            notifications.push({
                type: 'water',
                message: `${cactus.name} に水やりが必要です。`
            });
        }
        
        if (isTempOutOfRange(cactus, currentWeather.temperature)) {
            notifications.push({
                type: 'temp',
                message: `${cactus.name} の温度が最適範囲外です（現在 ${currentWeather.temperature}℃）`
            });
        }
        
        if (isHumidityOutOfRange(cactus, currentWeather.humidity)) {
            notifications.push({
                type: 'humidity',
                message: `${cactus.name} の湿度が最適範囲外です（現在 ${currentWeather.humidity}%）`
            });
        }
    });
    
    displayNotifications(notifications);
}

// 通知の表示
function displayNotifications(notifications) {
    const container = document.getElementById('notifications');
    
    if (notifications.length === 0) {
        container.classList.remove('show');
        return;
    }
    
    container.innerHTML = `
        <h3>🔔 通知</h3>
        ${notifications.map(notif => `
            <div class="notification-item warning">
                ${notif.message}
            </div>
        `).join('')}
    `;
    
    container.classList.add('show');
}
