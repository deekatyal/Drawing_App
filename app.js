 const canvas  = document.querySelector("canvas"); 
 let toolbtns = document.querySelectorAll(".tool");
 let fillColor = document.querySelector("#fill-color");
 let sizeSlider = document.querySelector("#size-slider");
 let colorBtns = document.querySelectorAll(".colors .option");
 let colorPicker = document.querySelector("#color-picker");
 let clearCanvas = document.querySelector(".clear-canvas");
 let saveImg = document.querySelector(".save-img");
 //  ctx - short word for context
  var ctx = canvas.getContext("2d");


 // global variables with default values
 let prevMouseX, prevMouseY, snapshot;
 let isDrawing = false;
 let selectedTool = "brush";
 let brushWidth = 5;
 let selectedColor = "#000";


 const setCanvasBackground = () =>{
    // setting whole canvas background to while so the downloaded image will have white background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillStyle back to the selectedColor, it'll be the brush color
 }


 window.addEventListener("load", () => {
    // set canvas width and height .... offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
 })

 const drawRect = (e) => {
    ctx.beginPath();
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }

    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY);
 }

 const drawCircle = (e) => {
    ctx.beginPath(); // new path for the circle

    // calculating radius for the circle
    let radius = Math.sqrt(Math.pow(prevMouseX-e.offsetX, 2) + Math.pow(prevMouseY-e.offsetY, 2));

    // creating circle according to the mouse pointer
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

    if(fillColor.checked){
        ctx.fill();
    }
    else{
        ctx.stroke();
    }
   
 }

 const drawTriangle = (e) => {
    ctx.beginPath();

    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the pointer
    ctx.lineTo(prevMouseX*2-e.offsetX, e.offsetY); // creating the bottom line
    ctx.closePath(); // closing path so the 3rd line automatically gets drawn

    if(fillColor.checked){
        ctx.fill();
    }
    else{
        ctx.stroke();
    }

 }

 const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // current mouseX position as prevMouseX value
    prevMouseY = e.offsetY;  // current mousey position as prevMouseY value
    ctx.beginPath();  // starts new path to draw i.e will not start with the last end point
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor; // passing selected color as stroke style
    ctx.fillStyle = selectedColor; // passing selected color as fill style
    // copying canvas data and passing as snaspshot value ... this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
 }

 const stopDraw = () => {
    isDrawing = false;
 }

 toolbtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from previous option and adding on current clicked options
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
 });

 colorBtns.forEach(btn =>{
    btn.addEventListener("click", () =>{
        // removing selected class from previous option and adding on current clicked options
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        console.log(btn);
    })
 });


 const drawing = (e) =>{
    if(!isDrawing){
        return;
    }
    // adding copied canvas data on this canvas
    ctx.putImageData(snapshot, 0, 0)

    if(selectedTool === "brush"  ||  selectedTool === "eraser"){
        // if selected tool is eraser then we will set the strokeStyle to white
        if(selectedTool === "eraser"){
            ctx.strokeStyle = "#fff";
        }
        
        ctx.lineTo(e.offsetX, e.offsetY);  // creating line according to the mouse pointer
        ctx.stroke();  // drawing/filing line with color
    }
    else if(selectedTool === "rectangle"){
        drawRect(e);
    }
    else if(selectedTool === "circle"){
        drawCircle(e);
    }
    else{
        drawTriangle(e);
    }
 }

 sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slidder value as brush size

 colorPicker.addEventListener("change", () => {
    // passing picker color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
 });

 clearCanvas.addEventListener("click", () =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
 });

 saveImg.addEventListener("click", () =>{
    const link = document.createElement("a"); // creating an <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
 });

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mousemove", drawing);

