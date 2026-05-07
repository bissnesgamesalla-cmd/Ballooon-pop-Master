// sound.js - Sound effects management
class SoundManager {
    constructor() {
        // Создаем коллекции звуков для удобного управления всеми сразу
        this.sounds = {
            btn: new Audio('hlop.mp3'),
            card: new Audio('hlop2.wav')
        };

        // Настройки громкости
        this.sounds.btn.volume = 0.6;
        this.sounds.card.volume = 0.6;

        // Внутреннее состояние звуков (не зависит от музыки)
        this.isSoundEnabled = true; 
        this.isMuted = true;
    }

    playButton() {
        this._playSound(this.sounds.btn);
    }

    playCard() {
        this._playSound(this.sounds.card);
    }

    // Вспомогательный метод, чтобы не дублировать код
    _playSound(audio) {
        if (this.isSoundEnabled) {
            audio.currentTime = 0;
            audio.muted = false; // На случай, если SDK их заглушил
            audio.play().catch(e => console.log("Sound play blocked by browser context"));
        }
    }

    // Вызывается при нажатии на кнопку "Выключить звук" в меню
    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        if (!this.isSoundEnabled) {
            this.stopAll();
        }
        return this.isSoundEnabled;
    }

    // ✅ Остановка всех звуков (GameMonetize / CrazyGames Requirement)
    stopAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.pause();
            audio.muted = true;
        });
        console.log("All SFX muted");
    }

    // ✅ Возобновление (после рекламы)
    resumeAll() {
        Object.values(this.sounds).forEach(audio => {
            audio.muted = false;
        });
        console.log("All SFX unmuted");
    }
}

window.gameSounds = new SoundManager();


 


