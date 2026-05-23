let selectedChoice = "";
let poppedBalloons = 0;
let activeCandles = 3;

// Navigation Handler
function nextScreen(current, next) {
  document.getElementById(`screen${current}`).classList.remove('active');
  document.getElementById(`screen${next}`).classList.add('active');
  
  if (next === 3) startBalloonGame();
}

// 1. Runner Button Configuration
const noBtn = document.getElementById('noBtn');
noBtn.addEventListener('mouseover', () => {
  const container = document.querySelector('.btn-group');
  const containerRect = container.getBoundingClientRect();
  
  const maxX = containerRect.width - noBtn.offsetWidth;
  const maxY = containerRect.height - noBtn.offsetHeight;
  
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
});

// 2. Option Selection Engine
function selectOption(choice) {
  selectedChoice = choice;
  nextScreen(2, 3);
}

// 3. Mini Game Mechanics
function startBalloonGame() {
  const container = document.getElementById('balloon-container');
  const colors = ['#ff758f', '#ff8fa3', '#ffb3c1', '#ffccd5', '#ff4d6d'];
  
  const spawnInterval = setInterval(() => {
    if (poppedBalloons >= 5) {
      clearInterval(spawnInterval);
      setTimeout(() => nextScreen(3, 4), 600);
      return;
    }
    
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = `${Math.random() * 80 + 10}%`;
    balloon.style.animationDuration = `${Math.random() * 1.5 + 2.5}s`; 
    
    balloon.addEventListener('click', () => {
      balloon.remove();
      poppedBalloons++;
      document.getElementById('popCount').innerText = poppedBalloons;
      
      confetti({ particleCount: 15, spread: 40, origin: { x: 0.5, y: 0.6 } });
    });
    
    container.appendChild(balloon);
    setTimeout(() => { if(balloon.parentNode) balloon.remove(); }, 3500);
  }, 750);
}

// 4. Hardcoded, Bug-Proof Candle Extinguisher
function processWish() {
  const wishInput = document.getElementById('secretWishInput');
  
  if (wishInput.value.trim() === "") {
    alert("Please type a wish before blowing out the candles! ✨");
    return;
  }
  
  // Instantly close the text box safely
  const wishWrapper = document.getElementById('wishWrapper');
  if (wishWrapper) wishWrapper.style.display = 'none';
  
  // Directly turn off flames sequentially
  setTimeout(() => { if(document.getElementById('flame1')) document.getElementById('flame1').style.display = 'none'; }, 200);
  setTimeout(() => { if(document.getElementById('flame2')) document.getElementById('flame2').style.display = 'none'; }, 500);
  setTimeout(() => { if(document.getElementById('flame3')) document.getElementById('flame3').style.display = 'none'; }, 800);
  
  // Smoothly advance to Screen 6 (The Sweet Letter)
  setTimeout(() => {
    // SAFETY NET: Only fire confetti if the external library loaded successfully
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    
    const dynamicMessage = document.getElementById('dynamic-message');
    if (dynamicMessage) {
      dynamicMessage.innerText = `Since you chose "${selectedChoice}" and cast a beautiful secret wish, let's make it a reality!`;
    }
      
    nextScreen(5, 6);
  }, 1300);
}

// 5. Grand Finale Present Revealer
function openGift() {
  const giftBox = document.getElementById('gift-box');
  const finalSurprise = document.getElementById('final-surprise');
  
  if (giftBox) giftBox.style.display = 'none';
  if (finalSurprise) finalSurprise.classList.remove('hidden');
  
  // SAFETY NET: Only fire looping explosions if confetti exists
  if (typeof confetti === 'function') {
    let end = Date.now() + (4 * 1000);
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }
}
