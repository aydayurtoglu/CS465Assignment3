let c, gl;
let aLoc = [];
let uLoc = [];

let positions = [];
let colors = [];

let translation;
let eye;
let center;
let up;
let view;
let mvMatrix = mat4();
let pMatrix = mat4();

let rad = 0;

window.onload = function init() {
    c = document.getElementById("gl-canvas");
    gl = c.getContext("experimental-webgl");

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, c.width, c.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //initShaders();
    //initBuffers();


    // Prepare torus coordinate data
     
    // x = (R + r cos(v)) cos(u)
    // y = (R + r cos(v)) sin(u)
    // z = r sin(v)
    // 
    // u is an element of the set of numbers [0, 2 pi]
    // v is an element of the set of numbers [0, 2 pi]
    
    let ustep = 0.01;
    let vstep = 0.01;
    for (let v = 0; v <= 1; v += vstep) {
        for (let u = 0; u <= 2 * Math.PI; u += ustep) {
            let x = Math.cos(2*u)*(1+0.6*(Math.cos(5*u)+0.75*Math.cos(10*u)));
            let y = Math.sin(2*u)*(1+0.6*(Math.cos(5*u)+0.75*Math.cos(10*u)));
            let z = 0.35*Math.sin(5*u);
            positions = positions.concat([x, y, z]);
            colors = colors.concat([x + 0.5, y + 0.5, z + 0.5])
        }
    }

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
/*
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
*/

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

    render();
};

function render(timestamp) {
    //rad += Math.PI * 1.0 / 180.0;
    rad = timestamp / 1000; // Seconds since the first requestAnimationFrame (ms)

  /*  mat4.perspective(pMatrix, 45, window.innerWidth / window.innerHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);
    let translation = vec3(0.0,0.0,0.0);
    vec3.set(translation, 0.0, 0.0, -2.0);
    mat4.translate(mvMatrix, mvMatrix, translation);
    mat4.rotate(mvMatrix, mvMatrix, rad, [1, 1, 1]);
*/

  //  gl.uniformMatrix4fv(uLoc[0], false, pMatrix);
  //  gl.uniformMatrix4fv(uLoc[1], false, mvMatrix);
    
    gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 3);
    gl.flush();

    requestAnimationFrame(render);
}