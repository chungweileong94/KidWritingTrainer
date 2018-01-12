let cnv;
let c;

function setup() {
    cnv = createCanvas(500, 500);
    cnv.parent("canvas-wrapper");

    document.getElementById("black-selection").addEventListener("click", () => c = color(0, 0, 0));
    document.getElementById("red-selection").addEventListener("click", () => c = color(206, 64, 64));
    document.getElementById("green-selection").addEventListener("click", () => c = color(45, 120, 11));
    document.getElementById("blue-selection").addEventListener("click", () => c = color(71, 99, 192));

    document.getElementById("clear-button").addEventListener("click", () => clear());

    c = color(0, 0, 0);
}

function draw() {
    if (mouseIsPressed) {
        if (mouseButton === RIGHT) {
            console.log(cnv.canvas.toDataURL());
        }
    }
}

function mouseDragged() {
    noStroke();
    fill(c);
    ellipse(mouseX, mouseY, 10, 10);
    return false;
}