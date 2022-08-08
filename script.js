const canvas = document.getElementById('canvas');

function drawCanvas(pix) {
    clearCanvas();
    document.documentElement.style.setProperty('--number', pix);
    for (let i = 1; i <= pix; i++) {
        for (let l = 1; l <= pix; l++) {
            let div = document.createElement('div');
            div.className = 'pixel';
            div.
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

drawCanvas(16);