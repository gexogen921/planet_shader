import * as THREE from 'three';
import perlin from './perlin';

const animate = () => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.008;
    renderer.render(scene, camera);
    requestAnimationFrame(() => animate());
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const grid = new THREE.GridHelper(10, 10, 0x0000ff, 0x808080);
grid.name = 'Grid';
grid.material.transparent = true;
grid.material.opacity = 0.25;
scene.add(grid);

camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const SIZE_X = 1024;
const SIZE_Y = 1024;

document.getElementById("perlin").setAttribute("width", SIZE_X);
document.getElementById("perlin").setAttribute("height", SIZE_Y);

const c = document.getElementById("perlin");
const ctx = c.getContext("2d");
const imgData = ctx.createImageData(SIZE_X, SIZE_Y);

function color() {
    const color = colors[Math.floor(Math.random() * colors.length - 1) + 1];

    return hexToRgb(color);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const octive1 = new perlin(SIZE_X, SIZE_Y, 1024);
const octive2 = new perlin(SIZE_X, SIZE_Y, 512);
const octive3 = new perlin(SIZE_X, SIZE_Y, 128);
const octive4 = new perlin(SIZE_X, SIZE_Y, 64);
const octive5 = new perlin(SIZE_X, SIZE_Y, 32);
const colors = [
    "#a5531b",
    // "#59504a",
    // "#686064",
    // "#5b4a46"
];

let t = 0;
for (let j = 0; j < SIZE_Y; j++) {
    for (let i = 0; i < SIZE_X; i++) {
        let c = octive1.getHeight(i, j);
        let c2 = octive2.getHeight(i, j);
        let c3 = octive3.getHeight(i, j);
        let c4 = octive4.getHeight(i, j);
        let c5 = octive5.getHeight(i, j);

        const colorBrightner = color();

        let pixelData = {
            r: Math.abs(c * 2 + c2 + c3 + c4 / 2 + c5 / 4) * colorBrightner.r,
            g: Math.abs(c * 2 + c2 + c3 + c4 / 2 + c5 / 4) * colorBrightner.g,
            b: Math.abs(c * 2 + c2 + c3 + c4 / 2 + c5 / 4) * colorBrightner.b,
            a: Math.floor(Math.random() * 255) + 0.1
        };

        imgData.data[t] = (pixelData.r < 0) ? 0 : (pixelData.r > 300) ? 300 - (pixelData.r - 300) : pixelData.r;
        imgData.data[t + 1] = (pixelData.g < 0) ? 0 : (pixelData.g > 300) ? 300 - (pixelData.g - 300) : pixelData.g;
        imgData.data[t + 2] = (pixelData.b < 0) ? 0 : (pixelData.b > 300) ? 300 - (pixelData.b - 300) : pixelData.b;
        imgData.data[t + 3] = pixelData.a;
        t += 4;
    }
}

const texture = new THREE.Texture(imgData);
texture.needsUpdate = true;

const mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(4, 32, 32),
    new THREE.MeshBasicMaterial({
        map: texture
    })
);
scene.add(mesh);

const domElement = document.getElementById('root');
domElement.appendChild(renderer.domElement);

animate();
