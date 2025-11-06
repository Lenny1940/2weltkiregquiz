// Elemente
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const frageEl = document.getElementById('frage');
const antwortenEl = document.getElementById('antworten');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('feedback');
const timeEl = document.getElementById('time');
const highscoresEl = document.getElementById('highscores');
const progressBar = document.getElementById('progress-bar');
const pointsBar = document.getElementById('points-bar');

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const tickSound = document.getElementById("tick-sound");

let aktuelleFrage = 0;
let punktzahl = 0;
let timer;
let timeLeft = 15;

// Zufällige Hintergrundfarben
const colors = ["#1e3c72", "#2a5298", "#283e51", "#3a3d98", "#2c5364"];

// Fragen (15 Fragen)
const fragen = [
    { frage: "In welchem Jahr begann der Zweite Weltkrieg?", antworten: ["1914","1939","1941","1945"], korrekt: 1, info:"Der Krieg begann 1939 mit dem Überfall auf Polen." },
    { frage: "Welche Länder gehörten zu den Achsenmächten?", antworten: ["Deutschland, Italien, Japan","USA, Großbritannien, Sowjetunion","Deutschland, Frankreich, Japan","Italien, USA, Sowjetunion"], korrekt: 0, info:"Achsenmächte: Deutschland, Italien, Japan." },
    { frage: "Wer war der Führer Deutschlands während des Zweiten Weltkriegs?", antworten: ["Winston Churchill","Adolf Hitler","Joseph Stalin","Benito Mussolini"], korrekt: 1, info:"Adolf Hitler führte Deutschland." },
    { frage: "Welche Schlacht gilt als Wendepunkt an der Ostfront?", antworten: ["Stalingrad","D-Day","Midway","Frankreich"], korrekt: 0, info:"Stalingrad war entscheidend an der Ostfront." },
    { frage: "Wann endete der Zweite Weltkrieg in Europa?", antworten: ["8. Mai 1945","2. September 1945","1. Januar 1945","6. Juni 1944"], korrekt: 0, info:"Ende in Europa: 8. Mai 1945." },
    { frage: "Was war der Codename für die Invasion in der Normandie?", antworten: ["Operation Overlord","Operation Barbarossa","Operation Torch","Operation Sea Lion"], korrekt: 0, info:"Die Invasion in der Normandie hieß Operation Overlord." },
    { frage: "Welches Land wurde 1941 von Deutschland angegriffen?", antworten: ["USA","Sowjetunion","Italien","Japan"], korrekt: 1, info:"Deutschland griff 1941 die Sowjetunion an." },
    { frage: "Wer führte die USA während des Krieges?", antworten: ["Franklin D. Roosevelt","Harry S. Truman","Dwight D. Eisenhower","Theodore Roosevelt"], korrekt: 0, info:"Franklin D. Roosevelt war Präsident während des Großteils des Krieges." },
    { frage: "Welche Stadt wurde durch Atombomben zerstört?", antworten: ["Hiroshima und Nagasaki","Tokio und Kyoto","Osaka und Nagasaki","Hiroshima und Tokyo"], korrekt: 0, info:"Hiroshima und Nagasaki wurden durch Atombomben zerstört." },
    { frage: "Welche Konferenz legte die Nachkriegsordnung Europas fest?", antworten: ["Jalta-Konferenz","Wendel-Konferenz","Teheran-Konferenz","Versailles-Konferenz"], korrekt: 0, info:"Die Jalta-Konferenz legte die Nachkriegsordnung fest." },
    { frage: "Wer war Premierminister Großbritanniens?", antworten: ["Winston Churchill","Neville Chamberlain","Clement Attlee","Anthony Eden"], korrekt: 0, info:"Winston Churchill führte Großbritannien." },
    { frage: "Welche Luftschlacht war entscheidend für England?", antworten: ["Battle of Britain","Battle of Midway","Battle of Stalingrad","Battle of the Bulge"], korrekt: 0, info:"Die Battle of Britain verhinderte eine deutsche Invasion." },
    { frage: "Welches Land kapitulierte zuerst unter den Achsenmächten?", antworten: ["Italien","Deutschland","Japan","Ungarn"], korrekt: 0, info:"Italien kapitulierte 1943 zuerst unter den Achsenmächten." },
    { frage: "Welche Partisanenbewegung kämpfte in Jugoslawien?", antworten: ["Tito-Partisanen","Resistance","Red Army","Maquis"], korrekt: 0, info:"Die Tito-Partisanen kämpften in Jugoslawien." },
    { frage: "Welches Ereignis zog die USA direkt in den Krieg?", antworten: ["Angriff auf Pearl Harbor","Schlacht um Stalingrad","Invasion Polens","D-Day"], korrekt: 0, info:"Der Angriff auf Pearl Harbor 1941 brachte die USA in den Krieg." }
];

// Eventlistener
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz(){
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    aktuelleFrage = 0;
    punktzahl = 0;
    pointsBar.style.width = "0%";
    shuffle(fragen);
    showQuestion();
}

// Zufällige Array-Mischung
function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Aktuelle Frage anzeigen
function showQuestion(){
    nextBtn.classList.add('hidden');
    feedbackEl.textContent = "";
    timeLeft = 15;
    timeEl.textContent = timeLeft;
    progressBar.style.width = (aktuelleFrage / fragen.length) * 100 + "%";
    
    // Zufälliger Hintergrund
    document.body.style.background = `linear-gradient(135deg, ${colors[Math.floor(Math.random()*colors.length)]}, #2a5298)`;

    const frageObj = fragen[aktuelleFrage];
    frageEl.textContent = frageObj.frage;

    antwortenEl.innerHTML = "";
    let antworten = [...frageObj.antworten];
    shuffle(antworten);

    antworten.forEach(antwort=>{
        const li = document.createElement('li');
        li.textContent = antwort;
        li.addEventListener('click', ()=>selectAnswer(li, antwort));
        antwortenEl.appendChild(li);
    });

    timer = setInterval(countdown, 1000);
}

// Countdown Timer
function countdown(){
    timeLeft--;
    timeEl.textContent = timeLeft;
    let progress = ((aktuelleFrage + (15 - timeLeft)/15)/fragen.length)*100;
    progressBar.style.width = progress + "%";

    if(timeLeft<=5) progressBar.style.backgroundColor="#dc3545";
    else if(timeLeft<=10) progressBar.style.backgroundColor="#ffc107";
    else progressBar.style.backgroundColor="#28a745";

    if(timeLeft<=5) tickSound.play();

    if(timeLeft <= 0){
        clearInterval(timer);
        markCorrectAnswer();
        feedbackEl.textContent = fragen[aktuelleFrage].info;
        nextBtn.classList.remove('hidden');
        nextBtn.onclick = nextQuestion;
    }
}

// Antwort auswählen
function selectAnswer(li, antwort){
    clearInterval(timer);
    const korrektAntwort = fragen[aktuelleFrage].antworten[fragen[aktuelleFrage].korrekt];

    if(antwort === korrektAntwort){
        li.classList.add('correct');
        punktzahl++;
        pointsBar.style.width = (punktzahl / fragen.length * 100) + "%";
        pointsBar.style.backgroundColor = `hsl(${punktzahl*20}, 80%, 50%)`;
        feedbackEl.textContent = "Richtig! " + fragen[aktuelleFrage].info;
        correctSound.play();
    } else {
        li.classList.add('wrong');
        markCorrectAnswer();
        feedbackEl.textContent = "Falsch! " + fragen[aktuelleFrage].info;
        wrongSound.play();
    }

    // Pop-up Animation
    feedbackEl.classList.add("feedback-pop");
    setTimeout(()=>feedbackEl.classList.remove("feedback-pop"),500);

    Array.from(antwortenEl.children).forEach(btn=>btn.removeEventListener('click', selectAnswer));
    nextBtn.classList.remove('hidden');
    nextBtn.onclick = nextQuestion;
}

// Korrekte Antwort markieren
function markCorrectAnswer(){
    const korrektAntwort = fragen[aktuelleFrage].antworten[fragen[aktuelleFrage].korrekt];
    Array.from(antwortenEl.children).forEach(li=>{
        if(li.textContent === korrektAntwort) li.classList.add('correct');
    });
}

// Nächste Frage
function nextQuestion(){
    aktuelleFrage++;
    if(aktuelleFrage < fragen.length){
        showQuestion();
    } else showResult();
}

// Ergebnis anzeigen
function showResult(){
    questionScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    scoreEl.textContent = `Du hast ${punktzahl} von ${fragen.length} Punkten erreicht!`;

    if(punktzahl === fragen.length) launchConfetti();

    // Highscore speichern
    let highscores = JSON.parse(localStorage.getItem("ww2Highscores")) || [];
    highscores.push(punktzahl);
    highscores.sort((a,b)=>b-a);
    highscores = highscores.slice(0,5);
    localStorage.setItem("ww2Highscores", JSON.stringify(highscores));
    renderHighscores(highscores);
}

// Highscore anzeigen
function renderHighscores(list){
    highscoresEl.innerHTML="";
    list.forEach(score=>{
        const li = document.createElement('li');
        li.textContent = `${score} Punkte`;
        highscoresEl.appendChild(li);
    });
}

// Quiz neu starten
function restartQuiz(){
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    pointsBar.style.width = "0%";
}

// Einfache Konfetti-Animation
function launchConfetti(){
    const canvas=document.getElementById('confetti-canvas');
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    const confetti=[];
    for(let i=0;i<150;i++){
        confetti.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height- canvas.height,
            r: Math.random()*6+4,
            d: Math.random()*150+50,
            color:`hsl(${Math.random()*360},100%,50%)`,
            tilt:Math.random()*10-10,
        });
    }

    let angle = 0;
    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        confetti.forEach(c=>{
            ctx.beginPath();
            ctx.lineWidth=c.r/2;
            ctx.strokeStyle=c.color;
            ctx.moveTo(c.x + c.tilt + c.r/4, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r/4);
            ctx.stroke();
        });
        update();
    }

    function update(){
        angle +=0.01;
        confetti.forEach(c=>{
            c.y += Math.cos(angle + c.d) + 1 + c.r/2;
            c.x += Math.sin(angle);
            if(c.y > canvas.height) c.y = -10;
        });
    }

    let confettiInterval = setInterval(draw, 20);
    setTimeout(()=>clearInterval(confettiInterval), 5000);
}

