
// Предзагрузка (оставляем как есть)
const images = ['play.webp', 'play2.webp', 'play3.webp', 'play4.webp', 'play5.webp'];
images.forEach(src => {
    const img = new Image();
    img.src = src;
});

document.getElementById('play-button').addEventListener('click', function() {
    const button = this;
     

    // 1. Блокируем кнопку и убираем анимацию пульсации вручную, 
    // чтобы она не конфликтовала с кадрами лопания
    button.style.pointerEvents = 'none';
    button.style.animation = 'none'; 

    // ЭТАПЫ ЛОПАНИЯ:
    
    // 0ms - Лопается P
    button.classList.add('popping-p');

    /*звук нажатия */
    window.gameSounds.playButton();

    // 150ms - Лопается L
    setTimeout(() => {
        button.classList.remove('popping-p');
        button.classList.add('popping-pl');
        /* звук лопания */
        window.gameSounds.playButton();
    }, 150);

    // 300ms - Лопается A
    setTimeout(() => {
        button.classList.remove('popping-pl');
        button.classList.add('popping-pla');
        /* звук лопания */
        window.gameSounds.playButton();
    }, 300);

    // 450ms - Лопается Y (Все буквы сдуты)
    setTimeout(() => {
        button.classList.remove('popping-pla');
        button.classList.add('popping-all');
        /* звук лопания */
        window.gameSounds.playButton();
    }, 450);

    // 700ms - Кнопка начинает плавно исчезать (взрыв)
    setTimeout(() => {
        button.style.transition = 'all 0.3s ease-out';
        button.style.opacity = '0';
        button.style.transform = 'scale(1.3)'; // Эффект разлета
    }, 700);

    // 1000ms (1 секунда) - Полное скрытие меню и старт игры
    setTimeout(() => {
        document.getElementById('game-container-menu').style.display = 'none';
        document.getElementById('game-container-game').style.display = 'block';
        
        // ЗАПУСКАЕМ создание шариков
        startGame();
       
        // Сброс стилей для следующего раза
        button.classList.remove('popping-all');
        button.style.opacity = '1';
        button.style.transform = 'scale(1)';
        button.style.pointerEvents = 'auto';
        button.style.animation = ''; // Возвращаем пульсацию из CSS
        
        console.log("Цепочка завершена! Игра пошла.");
    }, 1000);
}); 