const canvas = document.getElementById('canvas');
const rootStyle = getComputedStyle(document.documentElement);
let penColor = rootStyle.getPropertyValue('--pencolor');

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

let currentTool = 'pen';

document.getElementById('colorhex').addEventListener('keypress', function(e) {
    let val = document.getElementById('colorhex').value;
    if (e.key === 'Enter') {
        console.log(val);
        setColor(val);
    }
});

function exists(element) {
    if(typeof(element) != 'undefined' && element != null){
        return true;
    } else{
        return false;
    }
}

function pen() {
    currentTool = 'pen';
    penColor = document.getElementById('colorhex').value;
}

function eraser() {
    currentTool = 'pen';
    penColor = rootStyle.getPropertyValue('--defaultcanv');
}

function drawPixel() {
    if (currentTool === 'pen') {
        if (mouseDown) {
            event.target.style.backgroundColor = penColor;
        }
    }
}

let filling;
let defaultCanvColor = rootStyle.getPropertyValue('--defaultcanv');

function bucketAction(y, x) {
    if (document.getElementById(y + ' ' + x).style.getPropertyValue('background-color') !== penColor) {
        document.getElementById(y + ' ' + x).style.backgroundColor = penColor;
        const downX = x + 1;
        const downY = y + 1;
        const upX = x - 1;
        const upY = y - 1;
        const moveDown = document.getElementById(downY + ' ' + x);
        const moveRight = document.getElementById(y + ' ' + downX);
        const moveUp = document.getElementById(upY + ' ' + x);
        const moveLeft = document.getElementById(y + ' ' + upX);
        if (exists(moveDown)) {
            if (moveDown.style.getPropertyValue('background-color') == filling) {
                bucketAction(downY, x);
            } 
        }
        if (exists(moveRight)) {
            if (moveRight.style.getPropertyValue('background-color') == filling) {
                bucketAction(y, downX);
            } 
        }
        if (exists(moveUp)) {
            if (moveUp.style.getPropertyValue('background-color') == filling) {
                bucketAction(upY, x);
            } 
        }
        if (exists(moveLeft)) {
            if (moveLeft.style.getPropertyValue('background-color') == filling) {
                bucketAction(y, upX);
            } 
        }
    }
}

//check current tool and then go to dedicated function
function putPixel() {
    switch (currentTool) {
        case 'pen':
            event.target.style.backgroundColor = penColor;
            break;
        case 'bucket':
            let ident = event.target.id;
            let coord = ident.trim().split(/\s+/);
            let y = parseInt(coord[0]);
            let x = parseInt(coord[1]);
            filling = event.target.style.getPropertyValue('background-color');
            bucketAction(y, x);
            break;
    }
}

function drawCanvas(pix) {
    clearCanvas();
    document.documentElement.style.setProperty('--number', pix);
    for (let i = 1; i <= pix; i++) {
        for (let l = 1; l <= pix; l++) {
            let div = document.createElement('div');
            div.className = 'pixel';
            div.setAttribute('id', i + ' ' + l)
            div.style.setProperty('background-color', defaultCanvColor);
            div.addEventListener("click", function(){ putPixel(); });
            div.addEventListener("mouseover", function(){ drawPixel(); });
            canvas.appendChild(div);
        }
    }
    return 0;
}

function clearPic() {
    let num = document.documentElement.style.getPropertyValue('--number');
    drawCanvas(num);
}

function clearCanvas() {
    let num = document.documentElement.style.getPropertyValue('--number');
    for (let i = 1; i <= num; i++) {
        for (let l = 1; l <= num; l++) {
            canvas.querySelector('div').remove();
        }
    }
}

function setCells() {
    document.getElementById('cells').setAttribute('onclick', 'clearCells()');
    document.documentElement.style.setProperty('--border', '1px');
}

function clearCells() {
    document.getElementById('cells').setAttribute('onclick', 'setCells()');
    document.documentElement.style.setProperty('--border', '0px');
}

function bucketTool() {
    currentTool = 'bucket';
}

function setColor(hex) {
        if (hex[0] === '#') {
            value = hex.slice(1);
        }
        if ((value.length !== 6) && (value.length !== 3)) {
            throw "this is invalid";
        }
        let rr;
        let gg;
        let bb;
        if (value.length == 6) {
            let r = value.slice(0, 2);
            rr = parseInt(r, 16);
            let g = value.slice(2, 4);
            gg = parseInt(g, 16);
            let b = value.slice(4, 6);
            bb = parseInt(b, 16);
        } else if (value.length == 3) {
            let r = value[0];
            rr = parseInt(r, 16);
            let g = value[1];
            gg = parseInt(g, 16);
            let b = value[2];
            bb = parseInt(b, 16);
            alert("3-digit hex doesn't work at the moment, so please use 6-digit hex value.")
        } 
        rgbValue = 'rgb(' + rr + ', ' + gg + ', ' + bb + ')';
        penColor = rgbValue;
}
drawCanvas(16);