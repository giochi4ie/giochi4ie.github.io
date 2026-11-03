// --- DATA DIRECTORY ---
const GAMES_DIRECTORY = [
    {
        id: "elden-ring",
        title: "Elden Ring",
        genre: "Action RPG",
        year: 2022,
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Vincitore del premio Game of the Year. Alzati, Senzaluce, e lasciati guidare dalla grazia per conquistare l'anello primordiale e diventare il signore dell'Interregno. Un'avventura epica open-world senza precedenti.",
        playUrl: ""
    },
    {
        id: "hollow-knight",
        title: "Hollow Knight",
        genre: "Metroidvania",
        year: 2017,
        developer: "Team Cherry",
        publisher: "Team Cherry",
        cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Forge la tua strada in Hollow Knight! Un'avventura d'azione epica e intrecciata attraverso un vasto regno in rovina di insetti ed eroi. Esplora caverne tortuose, combatti creature corrotte e svela antichi segreti.",
        playUrl: ""
    },
    {
        id: "celeste",
        title: "Celeste",
        genre: "Platformer",
        year: 2018,
        developer: "Maddy Makes Games",
        publisher: "Maddy Makes Games",
        cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Aiuta Madeline a sopravvivere ai suoi demoni interiori nel suo viaggio verso la cima della montagna Celeste, in questo platform preciso e toccante creato dai creatori del classico TowerFall.",
        playUrl: ""
    },
    {
        id: "cyberpunk-2077",
        title: "Cyberpunk 2077",
        genre: "Action RPG",
        year: 2020,
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        cover: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Cyberpunk 2077 è un'avventura ad ambientazione d'azione ambientata a Night City, una megalopoli ossessionata dal potere, dal fascino e dalle modifiche corporee.",
        playUrl: ""
    },
    {
        id: "hades",
        title: "Hades",
        genre: "Rogue-like",
        year: 2020,
        developer: "Supergiant Games",
        publisher: "Supergiant Games",
        cover: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80"
        ],
        description: "Sfidate il dio dei morti in questo dungeon crawler rogue-like acclamato dalla critica. Impugnate le armi dell'Olimpo per fuggire dagli inferi nell'epico titolo di Supergiant Games.",
        playUrl: ""
    }
];

// --- APP STATE ---
let currentGameId = null;

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initGenreOptions();
    renderLibrary();
    lucide.createIcons();
});

// --- THEME TOGGLE ---
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
    }
}

// --- NAVIGATION SYSTEM ---
function navigateTo(view, gameId = null) {
    const libView = document.getElementById('view-library');
    const detailView = document.getElementById('view-detail');

    if (view === 'library') {
        detailView.classList.add('hidden');
        libView.classList.remove('hidden');
        currentGameId = null;
        renderLibrary();
    } else if (view === 'detail' && gameId) {
        currentGameId = gameId;
        renderDetailView(gameId);
        libView.classList.add('hidden');
        detailView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- CATALOG & RENDER FUNCTIONS ---
function initGenreOptions() {
    const genreSelect = document.getElementById('filter-genre');
    const genres = [...new Set(GAMES_DIRECTORY.map(g => g.genre))].filter(Boolean);
    
    genreSelect.innerHTML = '<option value="ALL">Tutti i Generi</option>';
    genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        genreSelect.appendChild(opt);
    });
}

function renderLibrary() {
    const grid = document.getElementById('games-grid');
    const emptyState = document.getElementById('empty-state');
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const genreQuery = document.getElementById('filter-genre').value;

    const filtered = GAMES_DIRECTORY.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery) ||
                              game.genre.toLowerCase().includes(searchQuery) ||
                              (game.developer && game.developer.toLowerCase().includes(searchQuery));
        const matchesGenre = genreQuery === 'ALL' || game.genre === genreQuery;

        return matchesSearch && matchesGenre;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(game => {
            grid.appendChild(createGameCard(game));
        });
    }

    document.getElementById('stat-total').textContent = `${GAMES_DIRECTORY.length} Titoli`;
    lucide.createIcons();
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = "group relative bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white border border-neutral-800/80 dark:border-neutral-800/80 light:border-neutral-200/80 rounded-xl overflow-hidden hover:border-neutral-600 dark:hover:border-neutral-600 transition-all duration-200 flex flex-col cursor-pointer shadow-sm hover:shadow-md";

    card.onclick = () => navigateTo('detail', game.id);

    card.innerHTML = `
        <div class="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950">
            <img src="${game.cover}" 
                 alt="${game.title}" 
                 class="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100">
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
                <div class="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-1">
                    <span>${game.genre}</span>
                    <span>${game.year}</span>
                </div>
                <h3 class="text-sm font-bold text-neutral-100 dark:text-white light:text-neutral-900 group-hover:text-white transition line-clamp-1">${game.title}</h3>
            </div>

            <div class="flex items-center justify-between border-t border-neutral-800/60 dark:border-neutral-800/60 light:border-neutral-100 pt-2.5">
                <span class="text-[11px] font-semibold text-neutral-400 group-hover:text-neutral-200 flex items-center space-x-1">
                    <span>Visualizza</span>
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                </span>
            </div>
        </div>
    `;

    return card;
}

// --- DETAIL VIEW RENDER ---
function renderDetailView(id) {
    const game = GAMES_DIRECTORY.find(g => g.id === id);
    if (!game) return;

    document.getElementById('detail-backdrop').style.backgroundImage = `url('${game.cover}')`;
    document.getElementById('detail-cover').src = game.cover;
    document.getElementById('detail-title').textContent = game.title;
    document.getElementById('detail-genre').textContent = game.genre;
    document.getElementById('detail-year').textContent = game.year;
    document.getElementById('detail-developer').textContent = game.developer ? `di ${game.developer}` : '';
    document.getElementById('detail-description').textContent = game.description;

    // Metadata Sidebar
    document.getElementById('meta-developer').textContent = game.developer || 'N/D';
    document.getElementById('meta-publisher').textContent = game.publisher || 'N/D';
    document.getElementById('meta-release').textContent = game.year;

    // Gallery
    const galleryGrid = document.getElementById('detail-gallery');
    galleryGrid.innerHTML = '';
    const images = (game.gallery && game.gallery.length > 0) ? game.gallery : [game.cover];
    
    images.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = game.title;
        img.className = 'w-full h-32 md:h-40 object-cover rounded-lg border border-neutral-800 hover:opacity-90 transition cursor-pointer';
        img.onclick = () => window.open(imgUrl, '_blank');
        galleryGrid.appendChild(img);
    });

    lucide.createIcons();
}

// --- GAME LAUNCHER & DEMO CANVAS ---
function launchCurrentGame() {
    const game = GAMES_DIRECTORY.find(g => g.id === currentGameId);
    if (!game) return;

    const modal = document.getElementById('play-modal');
    const titleHeader = document.getElementById('play-title-header');
    const container = document.getElementById('launcher-container');

    titleHeader.textContent = game.title;
    container.innerHTML = '';

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);

    if (game.playUrl && game.playUrl.startsWith('http')) {
        const iframe = document.createElement('iframe');
        iframe.src = game.playUrl;
        iframe.className = "w-full h-full border-0 rounded-lg";
        iframe.allow = "fullscreen; autoplay";
        container.appendChild(iframe);
    } else {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-lg">
                <canvas id="arcade-canvas" width="400" height="300" class="border border-neutral-800 rounded-xl bg-neutral-900 shadow-2xl"></canvas>
                <p class="text-xs text-neutral-400">Usa le frecce <span class="text-white font-bold">← →</span> per muovere e <span class="text-white font-bold">SPAZIO</span> per sparare!</p>
            </div>
        `;
        initMiniGame();
    }
}

function closePlayModal() {
    const modal = document.getElementById('play-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('launcher-container').innerHTML = '';
    }, 300);
}

function initMiniGame() {
    const canvas = document.getElementById('arcade-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let player = { x: 180, y: 260, width: 40, height: 12, speed: 5 };
    let bullets = [];
    let targets = [];
    let keys = {};

    for (let i = 0; i < 5; i++) {
        targets.push({ x: 40 + i * 70, y: 40, width: 30, height: 15, alive: true });
    }

    window.onkeydown = (e) => keys[e.code] = true;
    window.onkeyup = (e) => keys[e.code] = false;

    function gameLoop() {
        if (!document.getElementById('arcade-canvas')) return;

        if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
        if (keys['Space']) {
            if (bullets.length === 0 || bullets[bullets.length - 1].y < player.y - 20) {
                bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 8 });
            }
        }

        bullets.forEach(b => b.y -= 7);
        bullets = bullets.filter(b => b.y > 0);

        bullets.forEach(b => {
            targets.forEach(t => {
                if (t.alive && b.x < t.x + t.width && b.x + b.width > t.x && b.y < t.y + t.height && b.y + b.height > t.y) {
                    t.alive = false;
                    b.y = -10;
                }
            });
        });

        ctx.fillStyle = '#121215';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        ctx.fillStyle = '#6366f1';
        targets.forEach(t => {
            if (t.alive) ctx.fillRect(t.x, t.y, t.width, t.height);
        });

        ctx.fillStyle = '#f43f5e';
        bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}
