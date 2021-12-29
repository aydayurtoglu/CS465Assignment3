let canvas, gl;
let aLoc = [];
let uLoc = [];
let program; 
let positions = [];
let colors = [];

let translation;
let view;
let mvMatrix = mat4();
let pMatrix = mat4();

let rad = 0;

var projectionMatrix = mat4();
var projectionMatrixLoc;
var modelViewMatrix = mat4();
var modelViewMatrixLoc;

var parameter = 2;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

var eye = vec3(0.1,0.1,0.9);
var at = vec3(0.0,0.0,0.0);
var up = vec3(0.0,1.0,0.0);

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("experimental-webgl");

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Parametric equation for decorative knot
    let ustep = 0.1;
    let vstep = 0.1;
    let phistep = 0.1;
    for (let v = 0; v <= 1; v += vstep) {
        for (let u = -2 * Math.PI; u <= 2 * Math.PI; u += ustep) {
            for (let phi = 0; phi <= 2 * Math.PI; phi += phistep) {
                let x = Math.cos(2*u)*(1+0.6*(Math.cos(5*u)+0.75*Math.cos(10*u)));
                let y = Math.sin(2*u)*(1+0.6*(Math.cos(5*u)+0.75*Math.cos(10*u)));
                let z = 0.35*Math.sin(5*u);

                let a = (4 * x + Math.cos(phi) * x);
                let b = (4 * y + Math.cos(phi) * y);
                let c = (Math.sin(phi) + z);
                positions = positions.concat([a,b,c]);
                

            // positions = positions.concat([x,y,z]);
                colors = colors.concat([x + 0.5, y + 0.5, z + 0.5])
            }
        }
    }

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    aLoc[0] = gl.getAttribLocation(program, "position");
    aLoc[1] = gl.getAttribLocation(program, "color");
    gl.enableVertexAttribArray(aLoc[0]);
    gl.enableVertexAttribArray(aLoc[1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aLoc[0], 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aLoc[1], 3, gl.FLOAT, false, 0, 0);

    document.getElementById("Button1").onclick = function(){eye[0] *= 1.2};
    document.getElementById("Button2").onclick = function(){eye[0] *= 0.8};
    document.getElementById("Button3").onclick = function(){eye[1] *= 1.2};
    document.getElementById("Button4").onclick = function(){eye[1] *= 0.8};
    document.getElementById("Button5").onclick = function(){eye[2] *= 1.2};
    document.getElementById("Button6").onclick = function(){eye[2] *= 0.8};

    document.getElementById("Button7").onclick = function(){parameter -= 0.1};
    document.getElementById("Button8").onclick = function(){parameter += 0.1};

    render();
};

function render() {
    projectionMatrix = ortho(-parameter, parameter, -parameter, parameter, -10.0, 10.0);
    modelViewMatrix = lookAt(eye, at , up); 

    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix");

    gl.uniformMatrix4fv( gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix");
    
    gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 3);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    requestAnimationFrame(render);
}