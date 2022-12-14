const canvas = document.getElementById('canvas');
const rootStyle = getComputedStyle(document.documentElement);
let penColor = rootStyle.getPropertyValue('--pencolor');
let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

let buttonColor = rootStyle.getPropertyValue('--manageColor');
let pressedButtonColor = rootStyle.getPropertyValue('--back3');

let currentTool = 'pen';

//rainbow variables, duh
let rainBow = '#ee34d2, #9c27b0, #509ae6, #16d0cb, #66ff66, #ccff00, #ffff66, #ffcc33, #ff9933, #ff9966, #ff6037, #fd5b78, #ff355e'.split(', ');
let currentIndex = rainBow.indexOf('#ee34d2'); 
//used for transparency check
let defaultCanvColor = rootStyle.getPropertyValue('--defaultcanv');

let bypass = false;




//This function is solely to avoid using that line every time.
function plainColor(coord) {
    document.getElementById(coord).style.backgroundColor = penColor;
    let ident = coord.trim().split(/\s+/);
    let x = parseInt(ident[0]);
    let y = parseInt(ident[1]);
    cx1 = cx2;
    cy1 = cy2;
    cx2 = x;
    cy2 = y;
    straightLine(cx1, cy1, cx2, cy2);
}

function nullify() {
    if (!(currentTool == 'liner')) {
        cx1 = undefined;
        cy1 = undefined;
        cx2 = undefined;
        cy2 = undefined;
    }
}

function straightLine(x1, y1, x2, y2) {
    if (x1 !== undefined) {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        if ((Math.abs(dx) > 1) || (Math.abs(dy) > 1)) {
            let sx = (x1 < x2) ? 1 : -1;
            let sy = (y1 < y2) ? 1 : -1;
            let err = dx - dy;
            // Set first coordinates
            document.getElementById(x1 + ' ' + y1).style.backgroundColor = penColor;

            // Main loop
            while (!((x1 == x2) && (y1 == y2))) {
                var e2 = err << 1;
                if (e2 > -dy) {
                    err -= dy;
                    x1 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y1 += sy;
                }
                if (currentTool === 'rainbow') {
                    rainbowSlide();
                }
                document.getElementById(x1 + ' ' + y1).style.backgroundColor = penColor;
            }

        }
        
    }
}

function setTool(tool) {
    if (!bypass) {
        nullify()
    }
    document.getElementById(currentTool).style.backgroundColor = buttonColor;
    document.getElementById(tool).style.backgroundColor = pressedButtonColor;
    currentTool = tool;
    if (tool === 'pen') {
        penColor = document.getElementById('colorhex').value;
    }
}

function rainbowSlide() {
    let tool = currentTool;
    bypass = true;
    setColor(rainBow[currentIndex]);
    setTool(tool);
    bypass = false;
    if (currentIndex + 1 > rainBow.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex = currentIndex + 1;        
    }
}

//Used for entering input value into a function.
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

// Used to allow you draw by dragging the cursor. Works for pen and eraser
function drawPixel() {
    let coord = event.target.id;//the ID of current tile, used for bucket and plainColor functions.
    switch (currentTool) {
        case 'pen':
            if (mouseDown) {
                plainColor(coord);
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
                plainColor(coord);
            }
    }
}

//check current tool and then go to dedicated function
function putPixel() {
    let ident = event.target.id; //the ID of current tile, used for bucket and plainColor functions.
    let tileColor = document.getElementById(ident).style.getPropertyValue('background-color');
    let coord = ident.trim().split(/\s+/);
    let x = parseInt(coord[0]);
    let y = parseInt(coord[1]);
    switch (currentTool) {
        case 'pen':
            plainColor(ident); //Just colors the tile
            break;
        case 'eraser':
            event.target.style.backgroundColor = defaultCanvColor; //Colors the tile in default canvas color
            break;
        case 'bucket':
            bucketAction(x, y, tileColor);
            break;
        case 'bucketRainbow':
            bucketRainbowAction(x, y, tileColor);
            break;
        case 'dripper':
            if (tileColor === defaultCanvColor) {
                alert('Be ware that color is used for transparency. You would want to use eraser for that or if you need that type of color, change the hex value by one. Thanks!')
            }
            setColor(rgb2hex(tileColor));
            break;
        case 'rainbow':
            rainbowSlide();
            plainColor(ident);
            break;    
        case 'liner':
            cx1 = cx2;
            cy1 = cy2;
            cx2 = x;
            cy2 = y;
            event.target.style.backgroundColor = penColor;
            straightLine(cx1, cy1, cx2, cy2);
            break;            
    }
}
let cx1;
let cy1;
let cx2 = cx1;
let cy2 = cy1;


function bucketRainbowAction(y, x, filling) {
    rainbowSlide();
    if (document.getElementById(y + ' ' + x).style.getPropertyValue('background-color') !== penColor) {
        document.getElementById(y + ' ' + x).style.backgroundColor = penColor;
        const moveDown = document.getElementById((y + 1) + ' ' + x);
        const moveRight = document.getElementById(y + ' ' + (x + 1));
        const moveUp = document.getElementById((y - 1) + ' ' + x);
        const moveLeft = document.getElementById(y + ' ' + (x - 1));
        if (exists(moveDown)) {
            if (moveDown.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction((y + 1), x, filling);
            } 
        }
        if (exists(moveRight)) {
            if (moveRight.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction(y, (x + 1), filling);
            } 
        }
        if (exists(moveUp)) {
            if (moveUp.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction((y - 1), x, filling);
            } 
        }
        if (exists(moveLeft)) {
            if (moveLeft.style.getPropertyValue('background-color') == filling) {
                bucketRainbowAction(y, (x - 1), filling);
            } 
        }
    }
}

// Check if you aren't trying to fill for instance black blob with black ink and then perform a recursice algorithm
function bucketAction(y, x, filling) {
    if (document.getElementById(y + ' ' + x).style.getPropertyValue('background-color') !== penColor) {   
        document.getElementById(y + ' ' + x).style.backgroundColor = penColor;
        const moveDown = document.getElementById((y + 1) + ' ' + x);
        const moveRight = document.getElementById(y + ' ' + (x + 1));
        const moveUp = document.getElementById((y - 1) + ' ' + x);
        const moveLeft = document.getElementById(y + ' ' + (x - 1));
        if (exists(moveDown)) {
            if (moveDown.style.getPropertyValue('background-color') == filling) {
                bucketAction((y + 1), x, filling);
            } 
        }
        if (exists(moveRight)) {
            if (moveRight.style.getPropertyValue('background-color') == filling) {
                bucketAction(y, (x + 1), filling);
            } 
        }
        if (exists(moveUp)) {
            if (moveUp.style.getPropertyValue('background-color') == filling) {
                bucketAction((y - 1), x, filling);
            } 
        }
        if (exists(moveLeft)) {
            if (moveLeft.style.getPropertyValue('background-color') == filling) {
                bucketAction(y, (x - 1), filling);
            } 
        }     
    }
}

//used to change the canvas size
function drawCanvas(pix) {
    clearCanvas();
    document.documentElement.style.setProperty('--number', pix);
    for (let i = 1; i <= pix; i++) {
        for (let l = 1; l <= pix; l++) {
            let div = document.createElement('div');
            div.className = 'pixel';
            div.setAttribute('id', i + ' ' + l);
            div.style.setProperty('background-color', defaultCanvColor);
            div.addEventListener("mousedown", function(){ putPixel(); });
            div.addEventListener("mouseover", function(){ drawPixel(); });
            div.addEventListener("mouseup", function(){ nullify(); });
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
        setTool('pen');
    }
        if (hex[0] === '#') {
            document.getElementById('colorhex').value = hex;
            value = hex.slice(1);
        } else {
            document.getElementById('colorhex').value = '#' + hex;
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

function transParent(r, g, b) {
    let value = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    if (value === defaultCanvColor) {
        return true;
    } else {
        return false;
    }
}

// The next three functions are for save button.

function rgb2rgba(val) {
    let finish = val.length - 1;
    let sliced = val.slice(4, finish)
    let stringAr = sliced.split(', ');
    let R = parseInt(stringAr[0]);
    let G = parseInt(stringAr[1]);
    let B = parseInt(stringAr[2]);
    let A;
    if (val === defaultCanvColor) {
        A = 0;
    } else {
        A = 255;
    }
    let pixelArray = "rgba(" + R + ", " + G + ", " + B + ", " + A + ")"
    return pixelArray;
}

function createArray() {
    let sideInPixels = document.documentElement.style.getPropertyValue('--number');
    let canvasArray = new Array(sideInPixels);
    for (let i = 1; i <= sideInPixels; i++) {
        let row = new Array(sideInPixels);
        for (let j = 1; j <= sideInPixels; j++) {
            let pixel = document.getElementById(i + ' ' + j).style.getPropertyValue('background-color');
            row[j - 1] = rgb2rgba(pixel);
        }
        canvasArray[i - 1] = row;
    }
    return canvasArray;
}

function createImg(pixelSize) {
    if (exists(document.getElementById('output'))) {
        document.getElementById('output').querySelector('img').remove();
        document.getElementById('output').remove();
    }

    document.getElementById('outputText').style.display = 'inherit'
    let div = document.createElement('div');
    div.setAttribute('id', 'output');
    document.getElementById('rightside').appendChild(div);
    var c = document.createElement("canvas");
    var img = createArray();
    c.height = img[0].length * pixelSize;
    c.width = img.length * pixelSize;
    document.body.appendChild(c);
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    for (var i = 0; i < img.length; i++) {
        for (var j = 0; j < img[0].length; j++) {
            ctx.fillStyle = img[j][i];
            ctx.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
        }
    }

    var png = document.createElement("img");
    png.src = c.toDataURL("image/png");
    c.remove();
    document.getElementById('output').appendChild(png);
}



setTool('pen');
setColor('#111111');
document.getElementById('thatcolorpad').style.backgroundColor = penColor;
drawCanvas(32);