
const books = [
  {
    id: 'pride',
    title: 'Orgullo y Prejuicio',
    author: 'Jane Austen',
    cover: 'img/pride.jpg',
    file: 'libros/pride.txt',
    description: 'Una novela sobre las relaciones, el matrimonio y las primeras impresiones en la sociedad inglesa.',
    quiz: [
      {q:'¿Quién es la protagonista principal?', opts:['Elizabeth Bennet','Jane Eyre','Emma Woodhouse'], a:0},
      {q:'¿Cuál es el apellido de la familia central?', opts:['Bennet','Dashwood','Woodhouse'], a:0},
      {q:'¿Cuál es el tema central?', opts:['Guerra','Amor y matrimonio','Ciencia'], a:1}
    ]
  },
  {
    id: 'moby',
    title: 'Moby Dick',
    author: 'Herman Melville',
    cover: 'img/moby.jpg',
    file: 'libros/moby.txt',
    description: 'La obsesión del capitán Ahab por una gran ballena blanca y sus consecuencias trágicas.',
    quiz: [
      {q:'¿Quién es el capitán obsesionado?', opts:['Ahab','Cook','Smith'], a:0},
      {q:'¿Cuál es el objetivo del barco Pequod?', opts:['Pescar tiburones','Cazar la ballena blanca','Explorar islas'], a:1},
      {q:'¿Qué simboliza la ballena?', opts:['Amor','Obsesión','Tecnología'], a:1}
    ]
  },
  {
    id: 'alice',
    title: 'Alicia en el país de las maravillas',
    author: 'Lewis Carroll',
    cover: 'img/alice.jpg',
    file: 'libros/alice.txt',
    description: 'Alicia cae por la madriguera de un conejo y vive aventuras absurdas y fantásticas.',
    quiz: [
      {q:'¿Qué sigue Alicia al inicio?', opts:['Un gato','Un conejo blanco','Un ratón'], a:1},
      {q:'¿Qué bebida hace a Alicia pequeña?', opts:['Leche','Té','Bebida misteriosa'], a:2},
      {q:'¿Quién organiza el juicio en la historia?', opts:['La Reina de Corazones','El Sombrerero Loco','El Conejo Blanco'], a:0}
    ]
  }
];

// DOM elements
const gallery = document.getElementById('bookGallery');
const modal = document.getElementById('bookModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalCover = document.getElementById('modalCover');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalDescription = document.getElementById('modalDescription');
const readBookBtn = document.getElementById('readBookBtn');
const quizBtn = document.getElementById('quizBtn');
const downloadCover = document.getElementById('downloadCover');

const readingView = document.getElementById('readingView');
const bookContent = document.getElementById('bookContent');
const readingTitle = document.getElementById('readingTitle');
const closeReading = document.getElementById('closeReading');

const quizView = document.getElementById('quizView');
const quizContent = document.getElementById('quizContent');
const quizTitle = document.getElementById('quizTitle');
const closeQuiz = document.getElementById('closeQuiz');

let currentBook = null;

// render gallery
function renderGallery(){
  gallery.innerHTML = '';
  books.forEach((b, i) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `<img class="book-cover" src="${b.cover}" alt="${b.title}"><div class="book-meta"><h3>${b.title}</h3><p>${b.author}</p></div>`;
    card.addEventListener('click', ()=> openModal(i));
    gallery.appendChild(card);
  });
}

function openModal(index){
  currentBook = books[index];
  modalCover.src = currentBook.cover;
  modalTitle.textContent = currentBook.title;
  modalAuthor.textContent = currentBook.author;
  modalDescription.textContent = currentBook.description;
  downloadCover.href = currentBook.cover;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

readBookBtn.addEventListener('click', ()=>{
  if(!currentBook) return;
  fetch(currentBook.file).then(r=>r.text()).then(txt=>{
    readingTitle.textContent = `${currentBook.title} — ${currentBook.author}`;
    bookContent.textContent = txt;
    readingView.style.display = 'block';
    closeModal();
    setTimeout(()=> bookContent.focus(),100);
  }).catch(()=>{
    bookContent.textContent='Error al cargar el libro.'; readingView.style.display='block';
  });
});

closeReading.addEventListener('click', ()=>{ readingView.style.display='none'; });

quizBtn.addEventListener('click', ()=>{
  if(!currentBook) return;
  openQuiz(currentBook);
});

function openQuiz(book){
  quizTitle.textContent = `Quiz — ${book.title}`;
  quizContent.innerHTML='';
  book.quiz.forEach((q,i)=>{
    const div = document.createElement('div');
    div.className='quiz-question';
    div.innerHTML = `<p><strong>${i+1}. ${q.q}</strong></p>`;
    q.opts.forEach((opt,idx)=>{
      const btn = document.createElement('button');
      btn.className='btn';
      btn.textContent = opt;
      btn.addEventListener('click', ()=>{
        if(idx===q.a){ btn.style.background='#16a34a'; btn.textContent = '✅ ' + opt; } else { btn.style.background='#ef4444'; btn.textContent = '❌ ' + opt; }
        // disable siblings
        Array.from(div.querySelectorAll('button')).forEach(b=>b.disabled=true);
      });
      div.appendChild(btn);
    });
    quizContent.appendChild(div);
  });
  quizView.style.display='block';
  closeModal();
}

closeQuiz.addEventListener('click', ()=>{ quizView.style.display='none'; });

document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'){ if(modal.style.display==='block') closeModal(); if(readingView.style.display==='block') closeReading.click(); if(quizView.style.display==='block') closeQuiz.click(); }
});

renderGallery();
