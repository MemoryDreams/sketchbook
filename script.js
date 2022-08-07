const canvas = document.getElementById('canvas');

function drawCanvas(pix) {
    for (let i = 1; i <= pix; i++) {
        for (let l = 1; l <= pix; l++) {
            let div = document.createElement('div');
            div.className = 'pixel';
            canvas.appendChild(div);
        }
    }
    canvas.style.setProperty('grid-template-columns', 'repeat(' + pix + ', 1fr)');
    canvas.style.setProperty('grid-template-rows', 'repeat(' + pix + ', 1fr)');
    return 0;
}