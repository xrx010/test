// ============================================
// 🐱 CATS OF DESTINY - IDLE RPG GAME
// ============================================

class CatsOfDestiny {
    constructor() {
        this.coins = 0;
        this.level = 1;
        this.currentHeroIndex = 0;
        this.heroes = [];
        this.mascots = [];
        this.upgrades = [
            { id: 'attack', name: 'Ataque Felino', cost: 50, level: 1, baseIncrease: 2 },
            { id: 'defense', name: 'Defesa Felina', cost: 50, level: 1, baseIncrease: 1 },
            { id: 'speed', name: 'Velocidade', cost: 75, level: 1, baseIncrease: 1.5 }
        ];
        this.achievements = [];
        this.initGame();
    }

    initGame() {
        this.heroes = [
            { id: 1, name: 'Gatinho Aventureiro', class: 'Aventureiro', attack: 10, defense: 5, speed: 8, level: 1, color: '#FF6B9D' },
            { id: 2, name: 'Gato Cavaleiro', class: 'Tanque', attack: 8, defense: 12, speed: 5, level: 1, color: '#FFA502' },
            { id: 3, name: 'Gato Mago', class: 'Mago', attack: 15, defense: 3, speed: 9, level: 1, color: '#9C27B0' },
            { id: 4, name: 'Gata Arqueira', class: 'Arqueira', attack: 12, defense: 6, speed: 11, level: 1, color: '#FF1744' },
            { id: 5, name: 'Leão Sagrado', class: 'Sábio', attack: 14, defense: 10, speed: 7, level: 1, color: '#FFB300' },
            { id: 6, name: 'Guardião Celestial', class: 'Protetor', attack: 9, defense: 15, speed: 6, level: 1, color: '#00BCD4' }
        ];

        this.mascots = [
            { id: 1, name: 'Gatinho Fantasma', bonus: 'attack', value: 5, emoji: '👻' },
            { id: 2, name: 'Mini Dragão Felino', bonus: 'attack', value: 8, emoji: '🐉' },
            { id: 3, name: 'Raposa Felina Celestial', bonus: 'defense', value: 6, emoji: '🦊' },
            { id: 4, name: 'Coruja Mística', bonus: 'speed', value: 7, emoji: '🦉' },
            { id: 5, name: 'Tigre Branco Filhote', bonus: 'attack', value: 10, emoji: '🐯' }
        ];

        this.setupEventListeners();
        this.render();
        this.startIdleGains();
    }

    setupEventListeners() {
        document.getElementById('attackBtn').addEventListener('click', () => this.attack());
        document.getElementById('collectBtn').addEventListener('click', () => this.collectCoins());
        document.getElementById('restBtn').addEventListener('click', () => this.rest());
        document.getElementById('recruitBtn').addEventListener('click', () => this.showRecruitModal());
        document.getElementById('adoptBtn').addEventListener('click', () => this.showAdoptModal());
        document.getElementById('closeRecruit').addEventListener('click', () => this.closeModal('recruitModal'));
        document.getElementById('closeAdopt').addEventListener('click', () => this.closeModal('adoptModal'));
    }

    getCurrentHero() {
        return this.heroes[this.currentHeroIndex];
    }

    attack() {
        const hero = this.getCurrentHero();
        const damage = hero.attack + Math.random() * 5;
        const coinsGain = Math.floor(damage * 2);
        
        this.coins += coinsGain;
        this.notify(`⚔️ Ataque bem-sucedido! +${coinsGain} moedas!`, 'success');
        this.celebrate('⚔️');
        
        // Aumentar experiência
        hero.level += 0.1;
        if (hero.level % 1 === 0) {
            hero.attack += 2;
            hero.defense += 1;
            this.notify(`🎉 ${hero.name} subiu de nível!`, 'success');
        }
        
        this.render();
    }

    collectCoins() {
        const hero = this.getCurrentHero();
        const baseReward = 50;
        const bonusFromHero = hero.speed * 2;
        const totalReward = baseReward + bonusFromHero;
        
        this.coins += totalReward;
        this.notify(`💰 Coletado ${totalReward} moedas!`, 'success');
        this.celebrate('💰');
        this.render();
    }

    rest() {
        const hero = this.getCurrentHero();
        hero.attack = Math.min(hero.attack + 5, hero.attack * 1.5);
        hero.defense = Math.min(hero.defense + 3, hero.defense * 1.5);
        this.notify(`😴 ${hero.name} descansou e ficou mais forte!`, 'success');
        this.celebrate('😴');
        this.render();
    }

    recruit(heroId) {
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) return;
        
        const cost = 100 + (this.heroes.filter(h => h.recruited).length * 50);
        
        if (this.coins < cost) {
            this.notify('❌ Moedas insuficientes!', 'error');
            return;
        }
        
        this.coins -= cost;
        hero.recruited = true;
        this.notify(`🐱 ${hero.name} foi recrutado!`, 'success');
        this.celebrate('🐱');
        this.closeModal('recruitModal');
        this.render();
    }

    adopt(mascotId) {
        const mascot = this.mascots.find(m => m.id === mascotId);
        if (!mascot) return;
        
        const cost = 150;
        
        if (this.coins < cost) {
            this.notify('❌ Moedas insuficientes!', 'error');
            return;
        }
        
        this.coins -= cost;
        mascot.adopted = true;
        
        // Aplicar bônus
        const allHeroes = this.heroes.filter(h => h.recruited || h.id === 1);
        allHeroes.forEach(hero => {
            if (mascot.bonus === 'attack') hero.attack += mascot.value;
            if (mascot.bonus === 'defense') hero.defense += mascot.value;
            if (mascot.bonus === 'speed') hero.speed += mascot.value;
        });
        
        this.notify(`🐾 ${mascot.name} foi adotado! +${mascot.value} em ${mascot.bonus}!`, 'success');
        this.celebrate('🎉');
        this.closeModal('adoptModal');
        this.render();
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;
        
        if (this.coins < upgrade.cost) {
            this.notify('❌ Moedas insuficientes!', 'error');
            return;
        }
        
        this.coins -= upgrade.cost;
        const increase = upgrade.baseIncrease * upgrade.level;
        
        const hero = this.getCurrentHero();
        if (upgrade.id === 'attack') hero.attack += increase;
        if (upgrade.id === 'defense') hero.defense += increase;
        if (upgrade.id === 'speed') hero.speed += increase;
        
        upgrade.level += 1;
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        
        this.notify(`⚡ Melhoria ${upgrade.name} aplicada! Nível ${upgrade.level}`, 'success');
        this.celebrate('⚡');
        this.render();
    }

    startIdleGains() {
        setInterval(() => {
            const hero = this.getCurrentHero();
            const idleGain = Math.floor(hero.attack / 2);
            this.coins += idleGain;
            this.render();
        }, 5000); // A cada 5 segundos
    }

    showRecruitModal() {
        const modal = document.getElementById('recruitModal');
        const container = document.getElementById('heroesListRecruit');
        
        container.innerHTML = '';
        this.heroes.forEach(hero => {
            if (!hero.recruited && hero.id !== 1) {
                const card = this.createHeroCard(hero, () => this.recruit(hero.id));
                container.appendChild(card);
            }
        });
        
        modal.classList.add('show');
    }

    showAdoptModal() {
        const modal = document.getElementById('adoptModal');
        const container = document.getElementById('mascotsListAdopt');
        
        container.innerHTML = '';
        this.mascots.forEach(mascot => {
            if (!mascot.adopted) {
                const card = this.createMascotCard(mascot, () => this.adopt(mascot.id));
                container.appendChild(card);
            }
        });
        
        modal.classList.add('show');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    createHeroCard(hero, callback) {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.onclick = callback;
        
        card.innerHTML = `
            <svg class="card-svg" viewBox="0 0 100 100">
                ${this.generateCatSVG(hero.color)}
            </svg>
            <div class="card-name">${hero.name}</div>
            <div class="card-level">${hero.class}</div>
            <div class="card-cost">💰 ${100 + (this.heroes.filter(h => h.recruited).length * 50)}</div>
        `;
        
        return card;
    }

    createMascotCard(mascot, callback) {
        const card = document.createElement('div');
        card.className = 'mascot-card';
        card.onclick = callback;
        
        card.innerHTML = `
            <div style="font-size: 3em; text-align: center;">
                ${mascot.emoji}
            </div>
            <div class="card-name">${mascot.name}</div>
            <div class="card-level">+${mascot.value} ${mascot.bonus}</div>
            <div class="card-cost">💰 150</div>
        `;
        
        return card;
    }

    generateCatSVG(color = '#FF6B9D') {
        return `
            <!-- Cabeça -->
            <circle cx="50" cy="45" r="25" fill="${color}"/>
            
            <!-- Orelhas -->
            <polygon points="30,15 25,5 35,15" fill="${color}"/>
            <polygon points="70,15 65,5 75,15" fill="${color}"/>
            
            <!-- Orelhas internas -->
            <polygon points="30,15 28,10 32,15" fill="#FFB6C1"/>
            <polygon points="70,15 68,10 72,15" fill="#FFB6C1"/>
            
            <!-- Olhos -->
            <circle cx="42" cy="40" r="4" fill="white"/>
            <circle cx="58" cy="40" r="4" fill="white"/>
            <circle cx="42" cy="40" r="2" fill="black"/>
            <circle cx="58" cy="40" r="2" fill="black"/>
            
            <!-- Brilho nos olhos -->
            <circle cx="43" cy="39" r="0.8" fill="white"/>
            <circle cx="59" cy="39" r="0.8" fill="white"/>
            
            <!-- Nariz -->
            <polygon points="50,50 48,55 52,55" fill="#FFB6C1"/>
            
            <!-- Boca -->
            <path d="M 50 55 Q 45 58 42 56" stroke="black" stroke-width="1" fill="none" stroke-linecap="round"/>
            <path d="M 50 55 Q 55 58 58 56" stroke="black" stroke-width="1" fill="none" stroke-linecap="round"/>
            
            <!-- Corpo -->
            <ellipse cx="50" cy="75" rx="20" ry="25" fill="${color}"/>
            
            <!-- Patas dianteiras -->
            <rect x="38" y="85" width="6" height="15" fill="${color}" rx="3"/>
            <rect x="56" y="85" width="6" height="15" fill="${color}" rx="3"/>
            
            <!-- Cauda -->
            <path d="M 30 70 Q 15 65 18 50" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
        `;
    }

    notify(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    celebrate(emoji) {
        const celebration = document.getElementById('celebration');
        celebration.textContent = emoji;
        celebration.classList.add('show');
        
        setTimeout(() => {
            celebration.classList.remove('show');
        }, 1000);
    }

    render() {
        this.renderHeader();
        this.renderHeroSection();
        this.renderTeam();
        this.renderMascots();
        this.renderUpgrades();
    }

    renderHeader() {
        document.getElementById('coins').textContent = this.coins;
        document.getElementById('level').textContent = this.level;
        document.getElementById('heroCount').textContent = this.heroes.filter(h => h.recruited || h.id === 1).length;
    }

    renderHeroSection() {
        const hero = this.getCurrentHero();
        
        document.getElementById('heroName').textContent = hero.name;
        document.getElementById('heroClass').textContent = `${hero.class} • Nível ${Math.floor(hero.level)}`;
        
        document.getElementById('attackBar').value = Math.min(hero.attack, 100);
        document.getElementById('attackValue').textContent = Math.floor(hero.attack);
        
        document.getElementById('defenseBar').value = Math.min(hero.defense, 100);
        document.getElementById('defenseValue').textContent = Math.floor(hero.defense);
        
        document.getElementById('speedBar').value = Math.min(hero.speed, 100);
        document.getElementById('speedValue').textContent = Math.floor(hero.speed);
        
        // Renderizar SVG do herói
        const heroSvg = document.getElementById('heroSvg');
        heroSvg.innerHTML = this.generateCatSVG(hero.color);
    }

    renderTeam() {
        const teamGrid = document.getElementById('teamGrid');
        teamGrid.innerHTML = '';
        
        const recruitedHeroes = this.heroes.filter(h => h.recruited || h.id === 1);
        recruitedHeroes.forEach((hero, index) => {
            const card = document.createElement('div');
            card.className = 'team-card';
            if (index === this.currentHeroIndex) card.classList.add('pulse');
            card.onclick = () => {
                this.currentHeroIndex = this.heroes.indexOf(hero);
                this.render();
            };
            
            card.innerHTML = `
                <svg class="card-svg" viewBox="0 0 100 100">
                    ${this.generateCatSVG(hero.color)}
                </svg>
                <div class="card-name">${hero.name}</div>
                <div class="card-level">Nv ${Math.floor(hero.level)}</div>
            `;
            
            teamGrid.appendChild(card);
        });
    }

    renderMascots() {
        const mascotsGrid = document.getElementById('mascotsGrid');
        mascotsGrid.innerHTML = '';
        
        const adoptedMascots = this.mascots.filter(m => m.adopted);
        adoptedMascots.forEach(mascot => {
            const card = document.createElement('div');
            card.className = 'mascot-card';
            
            card.innerHTML = `
                <div style="font-size: 3em; text-align: center;">
                    ${mascot.emoji}
                </div>
                <div class="card-name">${mascot.name}</div>
                <div class="card-level">+${mascot.value} ${mascot.bonus}</div>
            `;
            
            mascotsGrid.appendChild(card);
        });
    }

    renderUpgrades() {
        const upgradesGrid = document.getElementById('upgradesGrid');
        upgradesGrid.innerHTML = '';
        
        this.upgrades.forEach(upgrade => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.onclick = () => this.buyUpgrade(upgrade.id);
            
            const icon = upgrade.id === 'attack' ? '⚔️' : upgrade.id === 'defense' ? '🛡️' : '⚡';
            
            card.innerHTML = `
                <div style="font-size: 2.5em; text-align: center;">
                    ${icon}
                </div>
                <div class="card-name">${upgrade.name}</div>
                <div class="card-level">Nv ${upgrade.level}</div>
                <div class="card-cost">💰 ${upgrade.cost}</div>
            `;
            
            upgradesGrid.appendChild(card);
        });
    }
}

// ============================================
// INICIAR JOGO
// ============================================
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new CatsOfDestiny();
});