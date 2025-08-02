class DinoGame {
    constructor() {
        this.dino = document.getElementById('dino');
        this.gameArea = document.querySelector('.game-area');
        this.scoreElement = document.getElementById('score');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.isJumping = false;
        this.isGameOver = false;
        this.score = 0;
        this.gameSpeed = 2;
        this.cactusInterval = null;
        this.scoreInterval = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startGame();
    }
    
    bindEvents() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                this.jump();
            }
        });
        
        // Controles de mouse/toque
        document.addEventListener('click', () => {
            if (!this.isGameOver) {
                this.jump();
            }
        });
        
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isGameOver) {
                this.jump();
            }
        });
        
        // Botão de restart
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    jump() {
        if (this.isJumping || this.isGameOver) return;
        
        this.isJumping = true;
        this.dino.classList.add('jumping');
        
        // Remove a classe após a animação
        setTimeout(() => {
            this.dino.classList.remove('jumping');
            this.isJumping = false;
        }, 600);
    }
    
    createCactus() {
        if (this.isGameOver) return;
        
        const cactus = document.createElement('div');
        cactus.className = 'cactus';
        cactus.style.animationDuration = `${this.gameSpeed}s`;
        
        this.gameArea.appendChild(cactus);
        
        // Verifica colisão
        const checkCollision = setInterval(() => {
            const cactusRect = cactus.getBoundingClientRect();
            const dinoRect = this.dino.getBoundingClientRect();
            
            // Se o cactus saiu da tela
            if (cactusRect.right < 0) {
                clearInterval(checkCollision);
                cactus.remove();
                return;
            }
            
            // Verifica colisão
            if (this.checkCollision(dinoRect, cactusRect)) {
                clearInterval(checkCollision);
                this.gameOver();
                return;
            }
        }, 10);
        
        // Cria próximo cactus
        const nextCactusDelay = Math.random() * 2000 + 1000; // 1-3 segundos
        setTimeout(() => {
            this.createCactus();
        }, nextCactusDelay);
    }
    
    checkCollision(dinoRect, cactusRect) {
        return !(dinoRect.right < cactusRect.left || 
                dinoRect.left > cactusRect.right || 
                dinoRect.bottom < cactusRect.top || 
                dinoRect.top > cactusRect.bottom);
    }
    
    updateScore() {
        if (!this.isGameOver) {
            this.score++;
            this.scoreElement.textContent = this.score;
            
            // Aumenta velocidade a cada 100 pontos
            if (this.score % 100 === 0) {
                this.gameSpeed = Math.max(0.5, this.gameSpeed - 0.1);
                this.updateGameSpeed();
            }
        }
    }
    
    updateGameSpeed() {
        const cactuses = document.querySelectorAll('.cactus');
        cactuses.forEach(cactus => {
            cactus.style.animationDuration = `${this.gameSpeed}s`;
        });
    }
    
    gameOver() {
        this.isGameOver = true;
        
        // Para os intervalos
        if (this.cactusInterval) clearInterval(this.cactusInterval);
        if (this.scoreInterval) clearInterval(this.scoreInterval);
        
        // Mostra tela de game over
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.style.display = 'block';
        
        // Adiciona efeito de shake
        this.gameArea.style.animation = 'shake 0.5s ease-in-out';
        
        // Adiciona CSS para shake
        if (!document.querySelector('#shakeStyle')) {
            const style = document.createElement('style');
            style.id = 'shakeStyle';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    restartGame() {
        // Limpa o jogo
        this.isGameOver = false;
        this.score = 0;
        this.gameSpeed = 2;
        this.isJumping = false;
        
        // Remove cactuses existentes
        const cactuses = document.querySelectorAll('.cactus');
        cactuses.forEach(cactus => cactus.remove());
        
        // Esconde tela de game over
        this.gameOverScreen.style.display = 'none';
        
        // Remove animação de shake
        this.gameArea.style.animation = '';
        
        // Atualiza score
        this.scoreElement.textContent = '0';
        
        // Reinicia o jogo
        this.startGame();
    }
    
    startGame() {
        // Inicia sistema de pontuação
        this.scoreInterval = setInterval(() => {
            this.updateScore();
        }, 100);
        
        // Cria primeiro cactus
        setTimeout(() => {
            this.createCactus();
        }, 1000);
    }
}

// Inicia o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new DinoGame();
});