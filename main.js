// --- AI Connections: Game Data ---
const GROUPS = [
  {
    name: 'Types of Algorithms',
    color: '#00ffe7',
    words: ['Supervised', 'Unsupervised', 'Reinforcement', 'Self-Supervised']
  },
  {
    name: 'Famous AI Tools',
    color: '#ff00e7',
    words: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras']
  },
  {
    name: 'Ethical Issues',
    color: '#ffe700',
    words: ['Bias', 'Transparency', 'Privacy', 'Accountability']
  },
  {
    name: 'NN Layers',
    color: '#00e7ff',
    words: ['Convolutional', 'Dense', 'Dropout', 'Recurrent']
  }
];

// --- Shuffle and Prepare Tiles ---
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const tilesData = shuffle(GROUPS.flatMap((g, idx) => g.words.map(word => ({ word, group: idx }))));

// --- DOM Elements ---
const grid = document.getElementById('grid');
const grouped = document.getElementById('grouped');
const message = document.getElementById('message');
const particlesCanvas = document.getElementById('particles');

let selectedTiles = [];
let solvedGroups = [];

// --- Render Grid ---
function renderGrid() {
  grid.innerHTML = '';
  tilesData.forEach((tile, idx) => {
    if (solvedGroups.includes(tile.group)) return;
    const div = document.createElement('div');
    div.className = 'tile';
    div.textContent = tile.word;
    div.draggable = true;
    div.dataset.idx = idx;
    div.addEventListener('dragstart', onDragStart);
    div.addEventListener('dragend', onDragEnd);
    div.addEventListener('click', () => onTileClick(idx));
    grid.appendChild(div);
  });
}

// --- Drag & Drop ---
grid.addEventListener('dragover', e => e.preventDefault());
grid.addEventListener('drop', e => {
  e.preventDefault();
  const idx = Number(e.dataTransfer.getData('text/plain'));
  onTileClick(idx);
});

function onDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.idx);
  e.target.classList.add('dragging');
}
function onDragEnd(e) {
  e.target.classList.remove('dragging');
}

// --- Tile Selection Logic ---
function onTileClick(idx) {
  if (solvedGroups.includes(tilesData[idx].group)) return;
  if (selectedTiles.includes(idx)) {
    selectedTiles = selectedTiles.filter(i => i !== idx);
  } else if (selectedTiles.length < 4) {
    selectedTiles.push(idx);
  }
  updateSelection();
  if (selectedTiles.length === 4) {
    checkGroup();
  }
}

function updateSelection() {
  Array.from(grid.children).forEach((tile, i) => {
    tile.classList.toggle('selected', selectedTiles.includes(Number(tile.dataset.idx)));
  });
  grouped.innerHTML = selectedTiles.map(idx => `<span class="tile">${tilesData[idx].word}</span>`).join('');
}

// --- Group Validation ---
function checkGroup() {
  const groups = selectedTiles.map(idx => tilesData[idx].group);
  const allSame = groups.every(g => g === groups[0]);
  if (allSame) {
    // Correct group!
    solvedGroups.push(groups[0]);
    message.textContent = `Correct: ${GROUPS[groups[0]].name}!`;
    showParticles(GROUPS[groups[0]].color);
    selectedTiles = [];
    setTimeout(() => {
      renderGrid();
      updateSelection();
      if (solvedGroups.length === GROUPS.length) {
        message.textContent = 'You solved all groups!';
      }
    }, 1200);
  } else {
    message.textContent = 'Try again!';
    setTimeout(() => { message.textContent = ''; }, 1000);
    selectedTiles = [];
    updateSelection();
  }
}

// --- Particle Effect (3js) ---
let scene, camera, renderer, particleSystem;
function setupParticles() {
  renderer = new THREE.WebGLRenderer({ canvas: particlesCanvas, alpha: true });
  renderer.setSize(grid.offsetWidth, grid.offsetHeight);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, grid.offsetWidth / grid.offsetHeight, 0.1, 1000);
  camera.position.z = 100;
}
function showParticles(color) {
  if (!renderer) setupParticles();
  scene.clear();
  const geometry = new THREE.BufferGeometry();
  const count = 80;
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push((Math.random() - 0.5) * 160, (Math.random() - 0.5) * 160, (Math.random() - 0.5) * 40);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color, size: 8, transparent: true, opacity: 0.7 });
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
  let frame = 0;
  function animate() {
    if (frame > 60) {
      scene.clear();
      renderer.clear();
      return;
    }
    particleSystem.rotation.y += 0.05;
    renderer.render(scene, camera);
    frame++;
    requestAnimationFrame(animate);
  }
  animate();
}

// --- Init ---
renderGrid();
updateSelection();
window.addEventListener('resize', () => {
  if (renderer) renderer.setSize(grid.offsetWidth, grid.offsetHeight);
});
