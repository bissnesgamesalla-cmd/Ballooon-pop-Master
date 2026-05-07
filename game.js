// game.js
const gameContainer = document.getElementById('game-container-game');
const gameScreen = document.getElementById('Game-screen');
const scoreValueElement = document.getElementById('score-value');
const backBtn = document.getElementById('back-to-menu-btn');

// Новые элементы
const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreValue = document.getElementById('final-score-value');
const retryBtn = document.getElementById('retry-btn');
const menuBtn = document.getElementById('menu-btn'); 




// все что касается спауна сариков и их перемечения
const totalBalloonTypes = 40;
const columnsCount = 5;
const spawnInterval = 1000;
let fallSpeed = 2;

// список жыжней
const hearts = [
    document.getElementById('heart-1'),
    document.getElementById('heart-2'),
    document.getElementById('heart-3')
];



// Блокировка стандартного скролла при касании
window.addEventListener('touchmove', function(e) {
    // Если игра запущена (экран игры виден) — блокируем скролл полностью
    if (document.getElementById('game-container-game').style.display === 'block') {
        e.preventDefault();
    }
}, { passive: false });

// Блокировка скролла колесиком мыши (для ПК)
window.addEventListener('wheel', function(e) {
    if (document.getElementById('game-container-game').style.display === 'block') {
        e.preventDefault();
    }
}, { passive: false });

// Блокировка клавиш пробела и стрелок (которые тоже скроллят страницу)
window.addEventListener('keydown', function(e) {
    const keys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (keys.includes(e.code) && document.getElementById('game-container-game').style.display === 'block') {
        e.preventDefault();
    }
});


 
// Находим твою кнопку домика
const backToMenuBtn = document.getElementById('back-to-menu-btn');

backToMenuBtn.addEventListener('click', () => {
    // 1. ОСТАНАВЛИВАЕМ ТАЙМЕР РЕКЛАМЫ (самое важное!)
    if (window.adSafetyTimeout) {
        clearTimeout(window.adSafetyTimeout);
        console.log("Защитный таймер сброшен, так как игрок вышел в меню");
    }

    // 2. Твоя обычная логика возврата в меню
    stopGame(); // На всякий случай останавливаем процессы игры
    gameOverOverlay.style.display = 'none'; // Прячем окно проигрыша, если оно было
    document.getElementById('game-container-game').style.display = 'none';
    document.getElementById('game-container-menu').style.display = 'flex';
    
    // Сбрасываем флаг ожидания SDK, чтобы реклама не вылезла внезапно
    window.pendingAfterAd = null; 
});


// --- Функции управления игрой ---
function startGame() {
    
    resetGame(); 
    fallSpeed = 2;
    gameScreen.innerHTML = '';
    activeIntervals = []; // Чистим массив интервалов
    gameInterval = setInterval(createBalloon, spawnInterval);
}

function stopGame() {
    // Останавливаем создание новых шариков
    clearInterval(gameInterval);
    // скорасти равна 0
    fallSpeed = 0;

    // ОСТАНАВЛИВАЕМ ВСЕ летящие шарики прямо сейчас
    activeIntervals.forEach(id => clearInterval(id));
    activeIntervals = [];

    // Удаляем их визуально
    gameScreen.innerHTML = '';
}

// респаун жыжней
function resetGame() {
    lives = 3;
    currentScore = 0;
    scoreValueElement.innerText = '0';
    hearts.forEach(heart => heart.classList.remove('lost'));
}


// все что касается спауна сариков и их перемечения
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    // 1. Указываем путь к картинке
    const randomType = Math.floor(Math.random() * totalBalloonTypes) + 1;
    balloon.style.backgroundImage = `url('${randomType}.webp')`;

    // 2. Расчет колонки
    const randomColumn = Math.floor(Math.random() * columnsCount);
    const xPercent = randomColumn * 20; 

    // 3. ПОЗИЦИЯ СПАВНА: ставим -25%, чтобы шарик был полностью скрыт
    balloon.style.top = '-30vh'; 
    balloon.style.left = (xPercent + 1) + '%';
    balloon.style.display = 'block'; // Убеждаемся, что он виден

    gameScreen.appendChild(balloon);

    // Начальная координата (соответствует стилю сверху)
    let currentY = -30;

    const moveInterval = setInterval(() => {
        // Если скорость 0 (пауза/стоп), шарик не двигается
        if (fallSpeed === 0) return; 

        currentY += (fallSpeed * 0.4); // Немного замедлил шаг для плавности
        balloon.style.top = currentY + 'vh';

        // 4. УДАЛЕНИЕ: если шарик улетел вниз
        if (currentY > 110) {
            clearInterval(moveInterval);
            activeIntervals = activeIntervals.filter(id => id !== moveInterval);
            balloon.remove();
            loseLife(); 
        }
    }, 16);

    activeIntervals.push(moveInterval);

    // Логика клика (оставляем твою)
    balloon.addEventListener('click', () => {
        if (isAdShowing) return; // Не даем лопать во время рекламы
        
        window.gameSounds.playCard();
        if (window.playPop) window.playPop();

        updateScore(1);

        balloon.style.transform = 'scale(0)';
        balloon.style.transition = '0.1s';
        
        setTimeout(() => {
            clearInterval(moveInterval);
            activeIntervals = activeIntervals.filter(id => id !== moveInterval);
            balloon.remove();
        }, 100);
    });
}
 
 
function loseLife() {
    //if (isAdShowing) return; // Во время рекламы жизни не теряем
    if (lives > 0) {
        lives--;
        window.gameSounds.playButton();
        hearts[lives].classList.add('lost');
        if (lives === 0) {
            gameOver();
        }
    }
}







let isAdShowing = false; // Флаг: показывается ли сейчас реклама
// В начале game.js добавим переменную для работы с рекламой
let adPlatform = "admob"; 

function gameOver() {
    stopGame();
    finalScoreValue.innerText = currentScore;
    
    // Вместо вызова SDK напрямую, вызываем нашу функцию
    showInterstitialAd(); 
}

/*function gameOver() {
    stopGame();
    finalScoreValue.innerText = currentScore;
    
    showFinalWindow();

     
    if (typeof sdk !== 'undefined' && sdk.showBanner !== 'undefined') {
        
        setTimeout(() => {
            console.log("Запуск рекламы...");
            sdk.showBanner();
            
            // На большинстве платформ реклама длится от 5 до 30 сек.
            // Если SDK не присылает событие окончания, можно разблокировать через время
            // Но лучше использовать коллбэк самого SDK (например, resumeGame)
        }, 100);
    }
    else {
        onAdFinished();
    }
}*/


// Универсальная функция для показа рекламы AdMob
function showInterstitialAd() {
    // Если мы в браузере и плагин AdMob не загружен
    if (typeof admob === 'undefined') {
        console.log("Реклама AdMob недоступна (браузер). Просто показываем окно.");
        showFinalWindow();
        return;
    }

    // Логика AdMob (через типичный плагин Cordova/Capacitor)
    isAdShowing = true;
    window.gameMusic.pauseForAd(); // Ваша логика звука

    // Показываем межстраничное объявление
    admob.interstitial.show().then(() => {
        // Реклама закрыта
        onAdFinished();
        showFinalWindow();
    }).catch(e => {
        console.error("Ошибка рекламы:", e);
        showFinalWindow();
    });
} 

// Вынесем показ окна в отдельную функцию для чистоты кода
function showFinalWindow() {
    clearTimeout(window.adSafetyTimeout);
    gameOverOverlay.style.display = 'flex';
    const uiTop = document.getElementById('game-ui-top');
    if (uiTop) uiTop.style.display = 'flex';
}


function onAdFinished() {
    isAdShowing = false; // РАЗБЛОКИРУЕМ кнопки
    console.log("Реклама закончилась, кнопки активны");
}


// Кнопка "Играть снова"
retryBtn.addEventListener('click', () => {
    if (isAdShowing) return; // Если идет реклама — кнопка не работает!
    
    gameOverOverlay.style.display = 'none';
    startGame(); 
});

// Кнопка "В меню"
menuBtn.addEventListener('click', () => {
    if (isAdShowing) return; // Если идет реклама — в меню выйти нельзя
    
    window.wasInterruptedByRotation = false;
    gameOverOverlay.style.display = 'none';
    backBtn.click(); 
});



// и функчия  обновления очков 
function updateScore(points) {
    currentScore += points;
    scoreValueElement.innerText = currentScore;
}

 


// ставим игру на паужу
function checkOrientation() {
    const isLandscape = window.innerWidth < 950 && window.innerHeight < window.innerWidth;

    if (isLandscape) {
        // Если повернули горизонтально — останавливаем спаун
        if (gameInterval) {
            stopGame();
            // Помечаем, что игра была прервана поворотом
            window.wasInterruptedByRotation = true; 
        }
    } else {
        // Если вернулись в портретный режим И игра была прервана
        if (window.wasInterruptedByRotation) {
            window.wasInterruptedByRotation = false;
            
            // Если мы сейчас находимся на игровом экране, а не в меню
            if (document.getElementById('game-container-game').style.display === 'block') {
                startGame(); 
            }
        }
    }
}

// Слушаем события
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation); 

































  