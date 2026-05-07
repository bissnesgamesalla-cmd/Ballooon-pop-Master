// AllSoundlogig.js
const musicBtn = document.getElementById('music-toggle-btn');
const soundBtn = document.getElementById('sound-toggle-btn');

// Пути к твоим картинкам (замени на свои названия файлов)
const icons = {
    musicOn: 'music_on.webp',
    musicOff: 'music_off.webp',
    soundOn: 'sound_on.webp',
    soundOff: 'sound_off.webp'
};

// Управление Музыкой
musicBtn.addEventListener('click', () => {
     
    const isMuted = window.gameMusic.toggleMute();
    // Меняем картинку в зависимости от состояния
    musicBtn.src = isMuted ? icons.musicOff : icons.musicOn;
    
    // Если есть звук клика, проигрываем его
    if (window.gameSounds) window.gameSounds.playCard();
});

// Управление Звуками (SFX)
soundBtn.addEventListener('click', () => {
    const isEnabled = window.gameSounds.toggleSound();
    // Меняем картинку (isEnabled — это true когда звук ВКЛ)
    soundBtn.src = isEnabled ? icons.soundOn : icons.soundOff;
    
    // Проигрываем звук только если его включили
    if (isEnabled) window.gameSounds.playCard();
});