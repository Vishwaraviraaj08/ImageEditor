const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img;
let contrast = 0;
let sepia = 0;

document.getElementById("file-input").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});


// document.getElementById("crop-btn").addEventListener("click", function() {
//     const w = canvas.width / 2;
//     const h = canvas.height / 2;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(img, w, h, w, h, 0, 0, w, h);
//     img.src = canvas.toDataURL();
// });

document.getElementById("crop-btn").addEventListener("click", function() {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const cropWidth = canvasWidth / 2;
    const cropHeight = canvasHeight / 2;
    const cropX = (canvasWidth - cropWidth) / 2;
    const cropY = (canvasHeight - cropHeight) / 2;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);
    // img.src = canvas.toDataURL();
});


document.getElementById("contrast-btn").addEventListener("click", function() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
        data[i + 3] = factor * (data[i + 2] - 128) + 128
    }

    ctx.putImageData(imageData, 0, 0);
});


document.getElementById("grayscale-btn").addEventListener("click", function() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2] + data[i + 3]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
        data[i + 3] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
});



document.getElementById("sepia-btn").addEventListener("click", function() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
        data[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
        data[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
    }

    ctx.putImageData(imageData, 0, 0);
});


document.getElementById("negative-btn").addEventListener("click", function() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imageData, 0, 0);
});


document.getElementById("rotate-btn").addEventListener("click", function () {
    const degrees = 90;
    const radians = degrees * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const newWidth = Math.abs(img.width * cos) + Math.abs(img.height * sin);
    const newHeight = Math.abs(img.width * sin) + Math.abs(img.height * cos);

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.rotate(-radians);
    ctx.translate(-newWidth / 2, -newHeight / 2);

    img.src = canvas.toDataURL();
    // ctx.rotate(90);
    // img.src = canvas.toDataURL();
});

document.getElementById("reset-btn").addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
});

document.getElementById("save-btn").addEventListener("click", function() {
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = canvas.toDataURL();
    link.click();
});
