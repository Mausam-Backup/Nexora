const frames = {
  currentIndex: 0,
  maxIndex: 302, // 302 frames extracted from lion.mp4
};

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let imagesLoaded = 0;
const images = [];
// Get reference to loading elements
const loadingPopup = document.getElementById('loadingPopup');
const loadingPercentage = document.getElementById('loadingPercentage');

function preloadImages() {
  for (let i = 1; i <= frames.maxIndex; i++) {
    const imageUrl = `./output_frames/frame_${i.toString().padStart(4, "0")}.jpg`;
    const img = new Image();
    img.src = imageUrl;
    img.onload = function () {
      imagesLoaded++;
      
      // Update loading percentage
      const percentage = Math.round((imagesLoaded / frames.maxIndex) * 100);
      loadingPercentage.textContent = `${percentage}%`;
      
      if (imagesLoaded === frames.maxIndex) {
        // Hide loading popup when all images are loaded
        loadingPopup.style.display = 'none';
        // console.log("all images loaded");
        loadImage(frames.currentIndex);
        startAnimation();
      }
    };
    images.push(img);
  }
}

function loadImage(index) {
  if (index >= 0 && index <= frames.maxIndex) {
    const img = images[index];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.max(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

    frames.currentIndex = index;
  }
}

function startAnimation() {
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".parent",
      start: "top top",
      scrub: 2,
      end: "bottom bottom",
    },
  });

  function updateFrame(index) {
    return {
      currentIndex: index,
      ease: "linear",
      onUpdate: function () {
        loadImage(Math.floor(frames.currentIndex));
      },
    };
  }

  //   tl.to(frames, {
  //     currentIndex: frames.maxIndex,
  //     onUpdate: function () {
  //       loadImage(Math.floor(frames.currentIndex));
  //     },
  //   });

  // Helper to proportionally scale keyframe targets to available frames
  const frameAt = (baseIndex) => Math.min(Math.round((baseIndex / 1344) * (frames.maxIndex - 1)), frames.maxIndex - 1);

  //as a is written, it's a flag that make sures both animation happen same time rather, one after another like regular .to
  tl
  .to(frames, updateFrame(frameAt(84)), "first")
  .to(".animate1",{opacity: 0, ease: "linear"},"first")

  .to(frames, updateFrame(frameAt(168)), "second")
  .to(".animate2",{opacity: 1, ease: "linear"},"second")

  .to(frames, updateFrame(frameAt(252)), "third")
  .to(".animate2",{opacity: 1, ease: "linear"},"third")

  .to(frames, updateFrame(frameAt(336)), "fourth")
  .to(".animate2",{opacity: 0, ease: "linear"},"fourth")

  .to(frames, updateFrame(frameAt(420)), "fifth")
  .to(".animate3",{opacity: 1, ease: "linear"},"fifth")

  .to(frames, updateFrame(frameAt(504)), "sixth")
  .to(".animate3",{opacity: 1, ease: "linear"},"sixth")

  .to(frames, updateFrame(frameAt(588), "seventh"))
  .to(".animate3",{opacity: 0, ease: "linear"},"seventh")

  .to(frames, updateFrame(frameAt(672)), "eighth")
  .to(".panel",{x: "0%", ease: "expo"},"eighth")

  .to(frames, updateFrame(frameAt(756)), "ninth")
  .to(".panel",{x: "0%", ease: "expo"},"ninth")
  
  .to(frames, updateFrame(frameAt(840)), "tenth")
  .to(".panel",{opacity: "0", ease: "linear"},"tenth")
  
  .to(frames, updateFrame(frameAt(924)), "eleventh")
  .to("canvas",{scale: .5, ease: "linear"},"eleventh")
  
  .to(frames, updateFrame(frameAt(1008)), "twelveth")
  .to(".panelism",{opacity: 1, ease: "expo"},"twelveth")
  
  .to(frames, updateFrame(frameAt(1092)), "twelveth")
  .to(".panelism span",{width: 200, ease: "expo"},"twelveth")
  
  .to(frames, updateFrame(frameAt(1176)), "thirteen")
  .to("canvas",{scale: 1, ease: "linear"},"thirteen")
  
  .to(frames, updateFrame(frameAt(1260)), "fourteen")
  .to(".panelism",{scale: 2, ease: "circ"},"fourteen")
  
  .to(frames, updateFrame(frameAt(1344)), "fifteen")
  .to(".panelism",{scale: 2, ease: "circ"},"fifteen");

}

window.addEventListener("resize", function () {
  loadImage(Math.floor(frames.currentIndex));
});

let headings = document.querySelectorAll(".headings h3")
headings.forEach(function(elem){
    gsap.from(elem,{
        scrollTrigger:{
            trigger: elem,
            start:"top 90%",
            end:"bottom 20%",
            scrub:2
        },
        opacity:.3
    })
})

//lenis
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

Shery.mouseFollower({
  skew: true,
  ease: "cubic-bezier(1, 1, 1, 1)",
  duration: 0.2,
});

Shery.makeMagnet("#magnet", {});

preloadImages();