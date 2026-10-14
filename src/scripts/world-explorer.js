/* Three.js is loaded only while the reader can see a 3D explorer.
   Every linked case remains fully reachable through semantic HTML controls. */
const roots = document.querySelectorAll("[data-world-explorer]:not([data-world-initialized])");
for (const root of roots) {
  root.dataset.worldInitialized = "true";
  const dataElement = root.querySelector(".world-explorer-data");
  let items;
  try { items = JSON.parse(dataElement?.textContent || "[]"); } catch { items = []; }
  if (!items.length) continue;
  let selected = Math.max(0, Math.min(items.length - 1, Number(root.dataset.selected) || 0));
  const progress = root.querySelector("[data-world-progress]");
  const number = root.querySelector("[data-world-number]");
  const eyebrow = root.querySelector("[data-world-eyebrow]");
  const title = root.querySelector("[data-world-title]");
  const description = root.querySelector("[data-world-description]");
  const read = root.querySelector("[data-world-link]");
  const tag = root.querySelector("[data-world-destination]");
  const motion = root.querySelector("[data-world-motion]");
  const canvas = root.querySelector("canvas");
  const viewport = root.querySelector(".world-viewport");
  const fallback = root.querySelector("[data-world-placeholder]");
  const selectionButtons = [...root.querySelectorAll("[data-world-select]")];
  let reflect3D = () => {};
  const select = (index) => {
    selected = (index + items.length) % items.length;
    const item = items[selected];
    progress.textContent = String(selected + 1).padStart(2,"0") + "—" + String(items.length).padStart(2,"0");
    number.textContent = String(selected + 1).padStart(2,"0");
    eyebrow.textContent = item.eyebrow;
    title.textContent = item.title;
    description.textContent = item.description;
    read.href = item.href;
    tag.textContent = item.destination;
    selectionButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === selected)));
    reflect3D();
  };
  selectionButtons.forEach((button, index) => button.addEventListener("click", () => select(index)));
  root.querySelector("[data-world-prev]").addEventListener("click", () => select(selected - 1));
  root.querySelector("[data-world-next]").addEventListener("click", () => select(selected + 1));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let spin = !reduced;
  motion.textContent = spin ? "回転を停止" : "回転を開始";
  motion.setAttribute("aria-pressed", String(!spin));
  let setSpin = () => {};
  motion.addEventListener("click", () => {
    spin = !spin;
    motion.textContent = spin ? "回転を停止" : "回転を開始";
    motion.setAttribute("aria-pressed", String(!spin));
    setSpin(spin);
  });

  if (!window.WebGLRenderingContext) {
    fallback.querySelector("strong").textContent = "3Dを表示できません";
    motion.hidden = true;
    continue;
  }
  let initialized = false;
  let destroyed = false;
  let dispose = () => {};
  const observer = new IntersectionObserver(entries => {
    if (!entries[0]?.isIntersecting || initialized || destroyed) return;
    initialized = true;
    observer.disconnect();
    initialize().catch(() => {
      root.classList.remove("is-3d");
      fallback.querySelector("strong").textContent = "3Dを表示できません";
      motion.hidden = true;
    });
  }, {rootMargin:"160px"});
  observer.observe(root);

  async function initialize() {
    const THREE = await import("three");
    const {OrbitControls} = await import("three/addons/controls/OrbitControls.js");
    if (destroyed) return;
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x091721, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x091721);
    scene.fog = new THREE.FogExp2(0x091721, .018);
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 90);
    const radius = items.length > 20 ? 5.8 : items.length > 9 ? 4.8 : 4.4;
    camera.position.set(radius * 1.75, radius * 1.35, radius * 1.85);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = .055;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 29;
    controls.maxPolarAngle = Math.PI * .48;
    controls.minPolarAngle = .22;
    controls.autoRotate = spin;
    controls.autoRotateSpeed = .42;
    const hemi = new THREE.HemisphereLight(0xbeddd8,0x153a45,2.25);
    const sunlight = new THREE.DirectionalLight(0xffe4bc,2.8);
    sunlight.position.set(-3,11,7);
    scene.add(hemi, sunlight);
    const floor = new THREE.GridHelper(27, 27, 0x365866, 0x263b47);
    floor.position.y = -.55;
    floor.material.transparent = true;
    floor.material.opacity = .32;
    scene.add(floor);
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.85,2.08,.30,6),
      new THREE.MeshStandardMaterial({color:0x315562,metalness:.35,roughness:.5})
    );
    pedestal.position.y = -.1;
    scene.add(pedestal);
    function box(width,height,depth,color,metalness=.14) {
      return new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),new THREE.MeshStandardMaterial({color,metalness,roughness:.48}));
    }
    const building = new THREE.Group();
    const structure = box(1.48,2.3,1.45,0x538b8c,.3);
    structure.position.y = 1.28;
    building.add(structure);
    const crown = box(1.68,.18,1.7,0xb8d7c0,.4);
    crown.position.y = 2.53;
    building.add(crown);
    for (let row=0;row<4;row++){
      for (let col=0;col<3;col++){
        const front=box(.29,.28,.035,0xa3e8d9,.2);
        front.position.set(-.48+col*.48,.47+row*.48,.745);
        building.add(front);
      }
    }
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),new THREE.MeshBasicMaterial({color:0xe9d5a2}));
    beacon.position.y=2.82;
    building.add(beacon);
    scene.add(building);
    const nodeMeshes = [];
    const hitboxes = [];
    const lines = new THREE.Group();
    scene.add(lines);
    const connectorMaterial = new THREE.LineBasicMaterial({color:0x3c6a72,transparent:true,opacity:.42});
    function label(numberText){
      const surface=document.createElement("canvas"); surface.width=128;surface.height=80;
      const ctx=surface.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle="#b7e9d9"; ctx.font="bold 44px sans-serif";ctx.textAlign="center";ctx.fillText(numberText,64,53);
      const texture=new THREE.CanvasTexture(surface);
      texture.colorSpace=THREE.SRGBColorSpace;
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
      sprite.scale.set(.75,.47,1);
      return sprite;
    }
    items.forEach((item,i)=>{
      const angle=(i/items.length)*Math.PI*2-Math.PI/2;
      const x=Math.cos(angle)*radius;
      const z=Math.sin(angle)*radius;
      const y=items.length>9 ? (i%3)*.22 : .18;
      const pathGeometry=new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0,.6,0),new THREE.Vector3(x*.48,.38,z*.48),
        new THREE.Vector3(x,.1+y,z)
      ]);
      lines.add(new THREE.Line(pathGeometry,connectorMaterial));
      const node=new THREE.Group();
      node.position.set(x,y,z);
      const material=new THREE.MeshStandardMaterial({color:new THREE.Color(item.color),metalness:.35,roughness:.32,emissive:new THREE.Color(item.color),emissiveIntensity:.12});
      const marker=new THREE.Mesh(new THREE.IcosahedronGeometry(.38,1),material);
      marker.userData.index=i;
      marker.position.y=.42;
      node.add(marker);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.59,.018,5,48),new THREE.MeshBasicMaterial({color:0xa9dacc,transparent:true,opacity:.45}));
      ring.rotation.x=Math.PI/2;
      ring.position.y=.12;
      node.add(ring);
      const stem=box(.05,.52,.05,0x426d73);
      stem.position.y=-.01;
      node.add(stem);
      const badge=label(String(i+1).padStart(2,"0"));
      if (badge){badge.position.y=1.15;node.add(badge)}
      scene.add(node);
      nodeMeshes.push({node,marker,ring,material});
      hitboxes.push(marker);
    });
    const raycaster=new THREE.Raycaster();
    const cursor=new THREE.Vector2();
    const updateSelected=()=>{
      nodeMeshes.forEach((entry,i)=>{
        const active=i===selected;
        entry.material.emissiveIntensity=active?.65:.12;
        entry.node.scale.setScalar(active?1.3:1);
        entry.ring.material.opacity=active?1:.33;
      });
    };
    reflect3D=updateSelected;
    updateSelected();
    const pointerStart={x:0,y:0};
    const pointerCoord=e=>{
      const rect=canvas.getBoundingClientRect();
      cursor.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);
      raycaster.setFromCamera(cursor,camera);
      return raycaster.intersectObjects(hitboxes,false)[0];
    };
    const onDown=e=>{pointerStart.x=e.clientX;pointerStart.y=e.clientY;};
    const onUp=e=>{
      if(Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>8)return;
      const hit=pointerCoord(e);
      if(hit)select(hit.object.userData.index);
    };
    const onMove=e=>{canvas.style.cursor=pointerCoord(e)?"pointer":"grab";};
    canvas.addEventListener("pointerdown",onDown);
    canvas.addEventListener("pointerup",onUp);
    canvas.addEventListener("pointermove",onMove);
    canvas.addEventListener("webglcontextlost",e=>{
      e.preventDefault();
      root.classList.remove("is-3d");
      fallback.querySelector("strong").textContent="3Dの表示が中断されました";
    });
    const resize=()=>{
      const {width,height}=viewport.getBoundingClientRect();
      if (!width||!height)return;
      camera.aspect=width/height;
      camera.updateProjectionMatrix();
      renderer.setSize(width,height,false);
      renderer.render(scene,camera);
    };
    const resizeObserver=new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    resize();
    setSpin=value=>{controls.autoRotate=value;controls.update();renderer.render(scene,camera);};
    root.classList.add("is-3d");
    let frame=0;
    let visible=true;
    let last=0;
    const draw=time=>{
      frame=0;
      if (!visible || document.hidden)return;
      const seconds=time/1000;
      if(!reduced && time-last>15){
        nodeMeshes.forEach((entry,i)=>{
          entry.marker.position.y=.42+Math.sin(seconds*1.2+i*.65)*.055;
          entry.marker.rotation.y+=.004;
        });
      }
      last=time;
      controls.update();
      renderer.render(scene,camera);
      frame=requestAnimationFrame(draw);
    };
    const start=()=>{if(!frame&&!document.hidden&&visible)frame=requestAnimationFrame(draw);};
    const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;};
    const visibilityObserver=new IntersectionObserver(entries=>{
      visible=!!entries[0]?.isIntersecting;
      if(visible)start();else stop();
    });
    visibilityObserver.observe(root);
    const onVisibility=()=>{if(document.hidden)stop();else start();};
    document.addEventListener("visibilitychange",onVisibility);
    start();
    dispose=()=>{
      stop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange",onVisibility);
      canvas.removeEventListener("pointerdown",onDown);
      canvas.removeEventListener("pointerup",onUp);
      canvas.removeEventListener("pointermove",onMove);
      controls.dispose();
      scene.traverse(object=>{
        if(object.geometry)object.geometry.dispose();
        const materials=object.material?Array.isArray(object.material)?object.material:[object.material]:[];
        materials.forEach(material=>{if(material.map)material.map.dispose();material.dispose();});
      });
      renderer.dispose();
    };
  }
  window.addEventListener("pagehide",()=>{
    destroyed=true;observer.disconnect();dispose();
  },{once:true});
}
