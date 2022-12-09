class QDraw {
    constructor (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.width = canvas.width;
        this.context.height = canvas.height;

        this.cursor = new Vector2D();
        this.origin = new Vector2D();
        
        this.lineWidth = 3; // Deafult
        this.context.lineWidth = this.lineWidth;

        this.cursor.x = 0;
        this.cursor.y = 0;

        this.colors = {
            1: "#000",
            2: "#F00",
            3: "#0F0",
            4: "#00F"
        }
    }
    
    clear() {
        this.context.closePath()
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cursor.x = 0;
        this.cursor.y = 0;
        this.context.strokeStyle = this.colors[1];
    }

    draw(commandString) {
        // Update Line Width
        this.context.lineWidth = this.lineWidth;
        //
        // Parse/Split Commands
        // 
        let commands = commandString.toUpperCase().split(' ');
        commands.forEach((command) => {
            //
            // Split Comand (Pefix / Command Key / Command Value) 
            // 
            let prefix = command[0] == "N" || command[0] == "B" ? command[0] : null;
            let key = prefix == null ? command[0] : command[1];
            let value = command.substr(prefix == null ? 1 : 2);

            //
            // Length Check
            //
            if (prefix && command.length < 3 ) throw "Argument length error!"; 
            else if (!prefix && command.length < 2 ) throw "Argument length error!"; 

            //
            // Transform Actions
            // 
            switch (key) {
                case "A":
                    //
                    // Save Current Canvas Image to Temp Canvas
                    // 
                    let tempCanvas = document.createElement("canvas");
                    tempCanvas.hidden = true;
                    tempCanvas.width = this.canvas.width;
                    tempCanvas.height = this.canvas.height;
                    document.body.append(tempCanvas);
                    let tempContext = tempCanvas.getContext('2d');
                    tempContext.width = this.context.width;
                    tempContext.height = this.context.height; 
                    tempContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
                    
                    // Save Main Context
                    this.context.save();

                    // 
                    // Paste & Rotate Image via Canvas Center
                    // 
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.context.translate(this.canvas.width/2, this.canvas.height/2);
                    this.context.rotate(value * Math.PI/180);
                    this.context.drawImage(tempCanvas, -this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height)
                    
                    // Restore Main Context
                    this.context.restore();

                    // Calculate Last Cursor Position After Rotation
                    let tempCursorX = (this.cursor.x - this.canvas.width/2) * Math.cos(value * Math.PI / 180) - (this.cursor.y - this.canvas.height/2) * Math.sin(value * Math.PI / 180);
                    let tempCursorY = (this.cursor.x - this.canvas.width/2) * Math.sin(value * Math.PI / 180) + (this.cursor.y - this.canvas.height/2) * Math.cos(value * Math.PI / 180);
                    this.cursor.x = tempCursorX + this.canvas.width/2;
                    this.cursor.y = tempCursorY + this.canvas.height/2;

                    // Continue forEach() iteration
                    return; 
                case "C":
                    //
                    // Changes Stroke Color
                    // 
                    this.context.strokeStyle = this.colors[value];
                    return;
            }
            
            // 
            // Draw Actions
            // 
            // Initialize the Begining of Draw Action 
            this.context.beginPath();
            this.context.moveTo(this.cursor.x, this.cursor.y);
            switch (key) {
                //
                // Horizontal / Vertical
                // 
                case "U":   // UP
                    value = parseInt(value);
                    if(prefix == "B") // INFO: If has "B" prefix only move
                        this.context.moveTo(this.cursor.x, this.cursor.y - value);
                    else
                        this.context.lineTo(this.cursor.x, this.cursor.y - value);
                    if(prefix != "N") // INFO: If has not "N" prefix save cursor movement
                        this.cursor.y -= value;
                    break;
                case "D":   // DOWN
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x, this.cursor.y + value);
                    else
                        this.context.lineTo(this.cursor.x, this.cursor.y + value);
                    if(prefix != "N")
                        this.cursor.y += value;
                    break;
                case "L":   // LEFT
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x - value, this.cursor.y);
                    else
                        this.context.lineTo(this.cursor.x - value, this.cursor.y);
                    if(prefix != "N")
                        this.cursor.x -= value;
                    break;
                case "R":   // RIGHT
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x + value, this.cursor.y);
                    else
                        this.context.lineTo(this.cursor.x + value, this.cursor.y);
                    if(prefix != "N")
                        this.cursor.x += value;
                    break;
                // 
                // Diagonal
                // 
                case "H":   // H↖
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x - value, this.cursor.y - value);
                    else
                        this.context.lineTo(this.cursor.x - value, this.cursor.y - value);
                    if(prefix != "N") {
                        this.cursor.x -= value;
                        this.cursor.y -= value;
                    }
                    break;
                case "E":   // E↗
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x + value, this.cursor.y - value);
                    else
                        this.context.lineTo(this.cursor.x + value, this.cursor.y - value);
                    if(prefix != "N") {
                        this.cursor.x += value;
                        this.cursor.y -= value;
                    }
                    break;
                case "G":   // G↙
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x - value, this.cursor.y + value);
                    else
                        this.context.lineTo(this.cursor.x - value, this.cursor.y + value);
                    if(prefix != "N") {
                        this.cursor.x -= value;
                        this.cursor.y += value;
                    }
                    break;
                case "F":   // F↘
                    value = parseInt(value);
                    if(prefix == "B")
                        this.context.moveTo(this.cursor.x + value, this.cursor.y + value);
                    else
                        this.context.lineTo(this.cursor.x + value, this.cursor.y + value);
                    if(prefix != "N") {
                        this.cursor.x += value;
                        this.cursor.y += value;
                    }
                    break;
                // 
                // Move to coord
                // 
                case "M":
                    let xy = value.toString().split(",");
                    let x = xy[0];
                    let y = xy[1];
                    // Check If Relevant Movement
                    let isRelativeMovement = false;
                    if( x[0] == "+" || x[0] == "-" && 
                        y[0] == "+" || y[0] == "-") 
                    {
                        isRelativeMovement = true;
                    }
                    x = parseInt(x);
                    y = parseInt(y);

                    if(prefix == "B") { // INFO: If has "B" prefix only move
                        if(isRelativeMovement) this.context.moveTo(this.cursor.x + x, this.cursor.y + y);
                        else this.context.moveTo(x, y);
                    } 
                    else {
                        if(isRelativeMovement) this.context.lineTo(this.cursor.x + x, this.cursor.y + y);
                        else this.context.lineTo(x, y);
                    }
                    if(prefix != "N" && isRelativeMovement) { // INFO: If has not "N" prefix  AND is relative save cursor movement
                        this.cursor.x += x;
                        this.cursor.y += y;
                    } 
                    else if (prefix != "N" && !isRelativeMovement) { // INFO: If has not "N" prefix AND is NOT relative save new cursor position
                        this.cursor.x = x;
                        this.cursor.y = y;
                    }
                    break;
                // 
                // Default -> throw error
                // 
                default:
                    this.context.closePath();
                    throw `Unknown command error: ${key}`;
                    return;
            }
            // INFO: If has "N" prefix moves cursor to original position after drawing
            if(prefix == "N") this.context.moveTo(this.cursor.x, this.cursor.y);
            // End Draw Action
            this.context.closePath()
            this.context.stroke();
        });
    }
}