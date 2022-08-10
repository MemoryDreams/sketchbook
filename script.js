const canvas = document.getElementById('canvas');
const rootStyle = getComputedStyle(document.documentElement);
let penColor = rootStyle.getPropertyValue('--pencolor');

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

let currentTool = 'pen';

let rainBow = '#ee34d2, #9c27b0, #509ae6, #16d0cb, #66ff66, #ccff00, #ffff66, #ffcc33, #ff9933, #ff9966, #ff6037, #fd5b78, #ff355e'.split(', ');
let currentIndex = rainBow.indexOf('#ee34d2'); 

function setTool(tool) {
    switch (tool) {
        case 'pen':
            currentTool = 'pen';
            penColor = document.getElementById('colorhex').value;
            break;
        case 'eraser':
            currentTool = 'eraser';
            break;
        case 'bucket':
            currentTool = 'bucket';
            break;
        case 'dripper':
            currentTool = 'dripper';
            break;
        case 'rainbow':
            currentTool = 'rainbow';
            break;
        case 'bucketRainbow':
            currentTool = 'bucketRainbow';
            break;
    }
}

function rainbowSlide() {
    let tool = currentTool;
    setColor(rainBow[currentIndex]);
    currentTool = tool;
    if (currentIndex + 1 > rainBow.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex = currentIndex + 1;        
    }
}

// I honestly don't like this style of code. Anonymous functions suck and I'd prefer not to use it. It works though. Used for entering input value into a function.
document.getElementById('colorhex').addEventListener('keypress', function(e) {
    let val = document.getElementById('colorhex').value;
    if (e.key === 'Enter') {
        setColor(val);
    }
});

// Used to check if filling algorythm reached the border of canvas
function exists(element) {
    if(typeof(element) != 'undefined' && element != null){
        return true;
    } else{
        return false;
    }
}

function plainColor() {
    event.target.style.backgroundColor = penColor;
}

// Used to allow you draw by dragging the cursor. Works for pen and eraser
function drawPixel() {
    switch (currentTool) {
        case 'pen':
            if (mouseDown) {
                plainColor();
            }
            break;
        case 'eraser':
            if (mouseDown) {
                event.target.style.backgroundColor = rootStyle.getPropertyValue('--defaultcanv');
            }
            break;
        case 'rainbow':
            if (mouseDown) {
                rainbowSlide();
                plainColor();
            }
    }
}

//check current tool and then go to dedicated function
function putPixel() {
    switch (currentTool) {
        case 'pen':
            plainColor();
            break;
        case 'eraser':
            event.target.style.backgroundColor = rootStyle.getPropertyValue('--defaultcanv');
            break;
        case 'bucket':
            let ident = event.target.id;
            let coord = ident.trim().split(/\s+/);
            let y = parseInt(coord[0]);
            let x = parseInt(coord[1]);
            filling = event.target.style.getPropertyValue('background-color');
            bucketAction(y, x);
            break;
        case 'bucketRainbow':
            let ident1 = event.target.id;
            let coord1 = ident1.trim().split(/\s+/);
            let y1 = parseInt(coord1[0]);
            let x1 = parseInt(coord1[1]);
            filling = event.target.style.getPropertyValue('background-color');
            bucketRainbowAction(y1, x1);
            break;
        case 'dripper':
            let color = event.target.style.getPropertyValue('background-color');
            document.getElementById('colorhex').value = rgb2hex(color);
            document.getElementById('thatcolorpad').style.backgroundColor = color;
            penColor = color;
            currentTool = 'pen';
            break;
        case 'rainbow':
            rainbowSlide();
            plainColor();
            break;            
    }
}


let filling;
let defaultCanvColor = rootStyle.getPropertyValue('--defaultcanv');

function bucketRainbowAction(y, x) {
    rainbowSlide();
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
                bucketRainbowAction(downY, x);
            } 
        }
        if (exists(moveRight)) {
            if (moveRight.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction(y, downX);
            } 
        }
        if (exists(moveUp)) {
            if (moveUp.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction(upY, x);
            } 
        }
        if (exists(moveLeft)) {
            if (moveLeft.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction(y, upX);
            } 
        }
    }
}

// Check if you aren't trying to fill for instance black blob with black ink and then perform a recursice algorithm
function bucketAction(y, x) {
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

function drawCanvas(pix) {
    clearCanvas();
    document.documentElement.style.setProperty('--number', pix);
    for (let i = 1; i <= pix; i++) {
        for (let l = 1; l <= pix; l++) {
            let div = document.createElement('div');
            div.className = 'pixel';
            div.setAttribute('id', i + ' ' + l)
            div.style.setProperty('background-color', defaultCanvColor);
            div.addEventListener("mousedown", function(){ putPixel(); });
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

// Used to set color to your pen
function setColor(hex) {
    if ((currentTool === 'eraser') || (currentTool === 'dripper') || (currentTool === 'bucketRainbow') || (currentTool === 'rainbow')) {
        currentTool = 'pen';
    }
        if (hex[0] === '#') {
            value = hex.slice(1);
        } else {
            value = hex;
        }
        if ((value.length !== 6) && (value.length !== 3)) {
            throw "Only 3-digit and 6-digit hex values are allowed.";
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
            let r = value[0] + value[0];
            rr = parseInt(r, 16);
            let g = value[1] + value[1];
            gg = parseInt(g, 16);
            let b = value[2] + value[2];
            bb = parseInt(b, 16);
        } 
        rgbValue = 'rgb(' + rr + ', ' + gg + ', ' + bb + ')';
        penColor = rgbValue;
        document.getElementById('thatcolorpad').style.backgroundColor = rgbValue;
        document.getElementById('colorhex').value = rgb2hex(rgbValue);
}

//self-explanatory function. I like to work with hex, but browsers not always allow it. 
function rgb2hex(val) {
    let finish = val.length - 1;
    let sliced = val.slice(4, finish)
    let stringAr = sliced.split(', ');
    let R = parseInt(stringAr[0]);
    let G = parseInt(stringAr[1]);
    let B = parseInt(stringAr[2]);
    R = R.toString(16);
    if (R.length < 2) {
        R = 0 + R;
    }
    G = G.toString(16);
    if (G.length < 2) {
        G = 0 + G;
    }
    B = B.toString(16);
    if (B.length < 2) {
        B = 0 + B;
    }
    return '#' + R + G + B;
}

function rgb2pngStart(val) {
    let finish = val.length - 1;
    let sliced = val.slice(4, finish)
    let stringAr = sliced.split(', ');
    let R = parseInt(stringAr[0]);
    let G = parseInt(stringAr[1]);
    let B = parseInt(stringAr[2]);
    let pixelArray = [R, G, B, 255];
    return pixelArray;
}

function createArray() {
    let sideInPixels = document.documentElement.style.getPropertyValue('--number');
    let row = [Array(sideInPixels)];
    for (let i = 1; i <= sideInPixels; i++) {
        for (let j = 1; j <= sideInPixels; j++) {
            let pixel = document.getElementById(i + ' ' + j).style.getPropertyValue('background-color');
            console.log(i + ':' + j + ' color is ' + rgb2pngStart(pixel));
            row[i - 1][j - 1] = rgb2pngStart(pixel);
            console.log(row);
        }
    }
    // let actualCanvas = new Uint8ClampedArray(canvasY);
    // return actualCanvas; 
}


function createImg() {
    createArray();
}

setColor('#112111');
document.getElementById('thatcolorpad').style.backgroundColor = penColor;
drawCanvas(100);