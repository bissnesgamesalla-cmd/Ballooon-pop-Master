window.addEventListener('load', () => {
    const loader = document.getElementById('loader-screen');
    const progressBar = document.getElementById('progress-bar');
    const menu = document.getElementById('game-container-menu'); // Добавили переменную меню
     
    let progress = 0;
    
    const interval = setInterval(() => {
        // Увеличиваем прогресс
        progress += Math.floor(Math.random() * 15) + 5; 
        
        if (progress > 100) progress = 100;
        
        // Обновляем ширину полоски
        progressBar.style.width = progress + "%";
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Ждем чуть-чуть, чтобы игрок увидел полную полоску, и скрываем
            setTimeout(() => {
                loader.style.transition = "opacity 0.5s ease";
                loader.style.opacity = "0";
                
                setTimeout(() => {
                    loader.style.display = "none";
                     
                    
                    // ПОКАЗЫВАЕМ МЕНЮ ТУТ
                    menu.style.display = "block";
                }, 500);
            }, 300);
        }
    }, 150);
});