class MusicManager {
    constructor() {
        this.bgMusic = new Audio('music.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;
        this.isStarted = false;
        this.isMuted = false;

        // Автозапуск при первом клике
        const startAudio = () => {
            if (!this.isMuted && !this.isStarted) {
                this.play();
            }
        };
        window.addEventListener('click', startAudio, { once: true });
        window.addEventListener('touchstart', startAudio, { once: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseForAd(); 
            } else {
                // Важно: возвращаем музыку только если пользователь сам её не выключал!
                if (!this.isMuted) {
                    this.resumeAfterAd();
                }
            }
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.bgMusic.pause();
        } else {
            // Если мы ВКЛЮЧАЕМ музыку:
            if (!this.isStarted) {
                // Если она еще не стартовала (первое включение через кнопку)
                this.play(); 
            } else {
                // Если уже работала раньше — просто продолжаем
                this.bgMusic.play().catch(e => console.log("Play failed:", e));
            }
        }
        return this.isMuted;
    }
 
    play() {
        // Убираем здесь жесткий return, если хотим чтобы музыка "зарядилась"
        this.bgMusic.muted = false;
        this.bgMusic.play().then(() => {
            this.isStarted = true;
            // Но если в этот момент юзер уже нажал "выкл", сразу ставим на паузу
            if (this.isMuted) {
                this.bgMusic.pause();
            }
        }).catch(err => {
             console.log("Audio play blocked:", err);
        });
    }    

    pauseForAd() {
        this.bgMusic.pause();
    }

    resumeAfterAd() {
        // Дополнительная проверка на isMuted
        if (!this.isMuted && this.isStarted) {
            this.bgMusic.play().catch(e => console.log("Resume failed:", e));
        }
    }

    stop() {
        this.bgMusic.pause();
    }
}


 
window.gameMusic = new MusicManager();

 
  