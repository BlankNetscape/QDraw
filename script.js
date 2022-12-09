// Global Variables
const canvas = document.getElementById("cnv");
const qdraw = new QDraw(canvas);
const usetInput = document.getElementById('textbox'); 

// Add Event Listeners
document.getElementById('run').addEventListener('click', runCommand);
document.getElementById('clr').addEventListener("click", clear);

// Listeners
function runCommand() {
    let parsed = usetInput.value.toUpperCase();
    qdraw.draw(parsed);
}
function clear() {
    qdraw.clear();
    usetInput.value = "";
}

// Main
qdraw.lineWidth = 2;

qdraw.draw("bM50,50 R150 C2 G40");
qdraw.draw("C1 M-10,+50");
qdraw.draw("A-180");
qdraw.draw("C3 U100");
