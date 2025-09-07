import './style.css';
// Инициализация состояния игры
let gameState = {
  players: {
    A: { pos: [1, 1], hp: 10 },
    B: { pos: [1, 4], hp: 10 },
  },
  selectedAction: null,
  direction: null,
  turnLog: [],
};

// Функция отрисовки позиций игроков
function renderPlayers() {
  // Очистка текущих маркеров
  document.querySelectorAll('.grid-cell').forEach((cell) => {
    cell.innerHTML = '';
    cell.classList.remove('selected');
  });

  // Отображение позиций игроков
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach((cell, index) => {
    const posCell = cell.dataset.pos;
    const row = Number(posCell.split('-')[0]);
    const col = Number(posCell.split('-')[1]);
    cell.innerHTML = `${row}-${col}`;
    if (
      row === gameState.players.A.pos[0] &&
      col === gameState.players.A.pos[1]
    ) {
      cell.innerHTML = `
              <div class="opacity-75 absolute -translate-y-4">${gameState.players.A.pos}</div>
              <div class="w-4 h-4 rounded-full bg-white"></div>
          `;
    }

    if (
      row === gameState.players.B.pos[0] &&
      col === gameState.players.B.pos[1]
    ) {
      cell.innerHTML = `
              <div class="opacity-75 absolute -translate-y-4">${gameState.players.B.pos}</div>
              <div class="w-4 h-4 rounded-full bg-black"></div>
          `;
    }
  });
}

// Обработчики кнопок действий
document.getElementById('moveBtn').addEventListener('click', () => {
  gameState.selectedAction = 'move';
  highlightButton('moveBtn');
  document.getElementById('movementControls').classList.remove('hidden');
});

document.getElementById('attackBtn').addEventListener('click', () => {
  gameState.selectedAction = 'attack';
  highlightButton('attackBtn');
  document.getElementById('movementControls').classList.add('hidden');
});

document.getElementById('skipBtn').addEventListener('click', () => {
  gameState.selectedAction = 'skip';
  highlightButton('skipBtn');
  document.getElementById('movementControls').classList.add('hidden');
});

function highlightButton(id) {
  ['moveBtn', 'attackBtn', 'skipBtn'].forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btnId === id) {
      btn.classList.add('ring-4', 'ring-yellow-400');
    } else {
      btn.classList.remove('ring-4', 'ring-yellow-400');
    }
  });
}

function selectDirection(dir) {
  gameState.direction = dir;
}

window.selectDirection = selectDirection;

// Подтверждение выбора
document.getElementById('confirmBtn').addEventListener('click', () => {
  if (!gameState.selectedAction) {
    alert('Выберите действие!');
    return;
  }

  // Логика выполнения действий
  executeTurn();
});

function executeTurn() {
  console.log({ ...gameState });
  const directions = {
    up: { x: 0, y: -1 }, // вверх
    down: { x: 0, y: 1 }, // вниз
    left: { x: -1, y: 0 }, // влево
    right: { x: 1, y: 0 }, // вправо
  };
  if (gameState.selectedAction === 'move' && gameState.direction !== null) {
    if (directions.hasOwnProperty(gameState.direction)) {
      gameState.players.A.pos[0] += directions[gameState.direction].y;
      gameState.players.A.pos[1] += directions[gameState.direction].x;
    }
  }
  if (gameState.selectedAction === 'attack') {
    if (gameState.players.A.pos[0] === gameState.players.B.pos[0]) {
      gameState.players.B.hp -= 1;
    }
  }

  // Обновляем показатели здоровья
  document.getElementById('hpB').textContent = gameState.players.B.hp;
  document.getElementById('hpA').textContent = gameState.players.A.hp;

  // Проверка условий победы
  if (gameState.players.A.hp <= 0 || gameState.players.B.hp <= 0) {
    setTimeout(() => {
      alert(
        gameState.players.A.hp <= 0 ? 'Победил Игрок B!' : 'Победил Игрок A!'
      );
      location.reload();
    }, 500);
  }

  // Сброс выбора
  gameState.selectedAction = null;
  gameState.direction = null;
  highlightButton('');
  document.getElementById('movementControls').classList.add('hidden');

  // Обновление отображения
  renderPlayers();
}

// Инициализация игры
renderPlayers();

document.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram.WebApp;
  tg.ready(); // сообщаем клиенту, что можно скрыть прелоадер
  tg.expand(); // раскрыть на весь экран (опционально)
  if (tg.initDataUnsafe) {
    document.getElementById('userInfo').innerHTML = JSON.stringify(tg.initDataUnsafe, null, 2);
  }
});
