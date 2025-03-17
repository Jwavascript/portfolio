import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import monitorVertexShader from "./shaders/monitor/vertex.glsl";
import monitorFragmentShader from "./shaders/monitor/fragment.glsl";

const projects = [
  {
    name: "세차 예약 서비스 뽀득뽀득",
    duration: "23.8.27~23.11.18",
    summary:
      "세차 예약 서비스 뽀득뽀득입니다. 결제 화면, 지도 화면, 예약관리 화면을 구현하였고, 개발 문서를 정리하였습니다.",
    features: ["세차 예약 기능", "세차장 검색 시스템", "리뷰 시스템"],
    link: "https://github.com/Step3-kakao-tech-campus/Team10_FE_USER?tab=readme-ov-file",
    technologies: ["javascript", "react", "tailwindcss", "vite"],
  },
  {
    name: "저체중인을 위한 체중 증량 서비스 Eatceed",
    duration: "24.3.10~24.6.01",
    summary:
      "소프트웨어공학과 졸업프로젝트로 진행하였습니다. 웹 파트를 담당하여 구현하였습니다.",
    features: ["메인 페이지", "캘린더 페이지", "분석 페이지", "알람 페이지"],
    link: "https://github.com/catnofat/Eatceedweb",
    technologies: ["javascript", "react", "tailwindcss", "vite"],
  },
  {
    name: "하츠네미쿠 프로그래밍 컨테스트 출품작",
    duration: "23.6.10~23.7.09",
    summary:
      "작곡한 노래를 좀 더 동적으로 즐길 수 있도록 만든 웹 앱입니다. 컴퓨터 바탕화면의 UI를 모티브로 하였습니다.",
    features: [
      "노래 선택 가능",
      "가사를 팝업창으로 보여줌",
      "코드와 음량 조절 기능",
      "다양한 기믹",
    ],
    link: "https://jolly-duckanoo-52ac00.netlify.app/",
    technologies: ["javascript", "react", "tailwindcss", "vite"],
  },
  {
    name: "입력 언어의 발음을 음성합성 소프트웨어 발음기호로 바꿔주는 서비스",
    duration: "23.8.27~23.11.18",
    summary:
      "음성합성소프트웨어의 라이브러리에서 한글을 지원하지 않아, IPA 기호를 바탕으로 한글을 타 언어로 표현하는 서비스를 개발하였습니다.",
    features: ["세차 예약 기능", "세차장 검색 시스템", "리뷰 시스템템"],
    link: "https://lang2synthv.vercel.app/",
    technologies: ["javascript", "react", "tailwindcss", "vite"],
  },
];

const modals = [
  {
    readme: "나중에 시연 영상 링크 첨부하기",
  },
  {
    readme: "나중에 시연 영상 링크 첨부하기",
  },
  {
    readme: "나중에 시연 영상 링크 첨부하기",
  },
  {
    readme: "나중에 시연 영상 링크 첨부하기",
  },
];

const renderProjects = () => {
  const projectsContainer = document.getElementById("projects");
  projectsContainer.innerHTML = projects
    .map(
      (project, index) => `
      <div class="project">
        <div class="subtitle">${project.name}</div>
        <div class="duration">${project.duration}</div>
        <div class="summarize">${project.summary}</div>
        ${project.features
          .map((feature) => `<div class="content">- ${feature}</div>`)
          .join("")}
        <a href="${project.link}" target="_blank" class="link">Project Link</a>
        <div class="skills">Technologies Used</div>
        <div class="icons">
          ${project.technologies
            .map((tech) => `<div class="icon ${tech}"></div>`)
            .join("")}
        </div>
        <!-- 모달 열기 버튼 -->
        <button class="modal-button" data-modal="modal-${
          index + 1
        }">Open Modal</button>
      </div>
      <!-- 동적으로 생성되는 모달 -->
      <div class="modal" id="modal-${index + 1}">
        <div class="modal-content">
          <span class="close-button" data-modal="modal-${
            index + 1
          }">&times;</span>
          <div class="modal-body">
            <p>${modals[index].readme}</p>
          </div>
        </div>
      </div>
    `
    )
    .join("");
};

renderProjects();

// points

document.addEventListener("DOMContentLoaded", () => {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  document.querySelectorAll(".point").forEach((point, index) => {
    point.addEventListener("click", () => {
      const sectionIds = ["about-me", "skills", "archive", "projects"];
      scrollToSection(sectionIds[index]);
    });
  });
});

const modalButtons = document.querySelectorAll(".modal-button");
const closeButtons = document.querySelectorAll(".close-button");

modalButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const modal = document.getElementById(event.target.dataset.modal);
    modal.style.display = "block";
    document.body.classList.add("modal-open");
    setTimeout(() => (modal.style.opacity = "1"), 10);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const modal = document.getElementById(event.target.dataset.modal);
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }, 500);
  });
});

/*
 * Base
 */
// Debug
const debugObject = {};
const gui = new GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * Materials
 */
//Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// monitor light material

const monitorLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: monitorVertexShader,
  fragmentShader: monitorFragmentShader,
});

// Pole light material
const crtLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

/**
 * Model
 */
gltfLoader.load("ground4.glb", (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === "baked");

  const crtLightMesh = gltf.scene.children.find(
    (child) => child.name === "crtLight"
  );
  const pianoLightMesh = gltf.scene.children.find(
    (child) => child.name === "pianoLight"
  );

  bakedMesh.material = bakedMaterial;
  crtLightMesh.material = monitorLightMaterial;
  pianoLightMesh.material = crtLightMaterial;
  scene.add(gltf.scene);
});

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster();

const points = [
  {
    position: new THREE.Vector3(-1.7, 0.2, 0.25),
    element: document.querySelector(".point-0"),
  },
  {
    position: new THREE.Vector3(-1.5, 0.15, 1.45),
    element: document.querySelector(".point-1"),
  },
  {
    position: new THREE.Vector3(-0.15, 0.75, 0.9),
    element: document.querySelector(".point-2"),
  },
  {
    position: new THREE.Vector3(0.5, 0.12, 1.4),
    element: document.querySelector(".point-3"),
  },
];

gui.add(points[0].position, "x", -10, 10).name("dot X");
gui.add(points[0].position, "y", -10, 10).name("dot Y");
gui.add(points[0].position, "z", -10, 10).name("dot Z");

/**
 * Fireflies
 */
//Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.6) * 10;
  positionArray[i * 3 + 1] = Math.random() * 3;
  positionArray[i * 3 + 2] = (Math.random() - 0.2) * 8;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 200 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

gui
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("firefliesSize");

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});
/**
 * Scroll
 */

let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});
/**
 * Camera
 */
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -3;
camera.position.y = 4;
camera.position.z = 9;
cameraGroup.add(camera);

gui.add(camera.position, "x", -100, 100).name("Camera X");
gui.add(camera.position, "y", -100, 100).name("Camera Y");
gui.add(camera.position, "z", -100, 100).name("Camera Z");
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = "#000000";
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  monitorLightMaterial.uniforms.uTime.value = elapsedTime;

  // Animate camera
  camera.position.x = 3 * Math.sin(-scrollY / sizes.height) + -2;
  camera.position.y = 3 * Math.cos(scrollY / sizes.height) + 3;
  camera.position.z = 3 * Math.sin(scrollY / sizes.height) + 5;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 20 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 20 * deltaTime;
  // Update controls
  controls.update();

  // Go through each point
  for (const point of points) {
    const screenPosition = point.position.clone();
    screenPosition.project(camera);

    if (camera.position.z < -3 || scrollY > 0) {
      point.element.classList.remove("visible");
    } else {
      point.element.classList.add("visible");
    }

    const translateX = screenPosition.x * sizes.width * 0.5;
    const translateY = -screenPosition.y * sizes.height * 0.5;
    point.element.style.transform = `translate(${translateX}px,${translateY}px)`;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
