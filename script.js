'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', e => {
  // const section1Coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: section1Coords.left + window.pageXOffset,
  //   top: section1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // })
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// 1.Add event listener to common parent element
// 2.Determine what element originated the event
// 3.Attach event to that element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Cookie message
let message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies to improve site productivity. <button class="btn btn--close-cookie">Got it</button>';

let header = document.querySelector('.header');
// header.append(message);
// header.append(message.cloneNode(true));

// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.remove();
// });

message.style.backgroundColor = '#37383d';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

///////////////////////////////////////
// Tabbed component functionality

// tabs.forEach(tab => tab.addEventListener('click', () => {
//   console.log(tabs)
// }))

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  const dataTab = clicked.dataset.tab;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${dataTab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
function nandleHoverEvent(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', nandleHoverEvent.bind(0.5));
nav.addEventListener('mouseout', nandleHoverEvent.bind(1));

///////////////////////////////////////
// Sticky navigation
function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loaging images
/*
1) select an acting element:
    	    const el = document.querySelector('.someClass');

2) define options:
	    const options = {
	        root: null,
	        thershold: 0 - 1,
	        rootMargin: "0px 0px 0px 0px"
	    }

3) create a new Intersection Observer: 
	   const observer = new IntersectionObserver(callback, options);

4) create a callback function:
    	   function = callback(entries, observer) {
       	       entries.forEach(entry => entry.doSomeThing)		
	  }

5) apply observer to the acting element:
       	   observer.observe(el), or
	   el.forEach(el => observer.observe(el))
*/

const lazyImgs = document.querySelectorAll('img[data-src]');
const lazyImgOptions = {
  rootMargin: '-200px 0px',
  threshold: 0,
};
const lazyImgObserver = new IntersectionObserver(loadImg, lazyImgOptions);

function loadImg(entries, lazyImgObserver) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () =>
      entry.target.classList.remove('lazy-img')
    );
    lazyImgObserver.unobserve(entry.target);
  });
}

lazyImgs.forEach(img => {
  lazyImgObserver.observe(img);
});

///////////////////////////////////////
// Slider
///////////////////////////////////////
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const [btnLeft, btnRight] = document.querySelectorAll('.slider__btn');
  let currentSlide = 0;

  // Functions
  function createDots() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function activateDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  }

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const previousSlide = () => {
    if (currentSlide === 0) {
      slides.length - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  function sliderInit() {
    goToSlide(currentSlide);
    createDots();
    activateDot(currentSlide);
  }
  sliderInit();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', e => {
    e.key === 'ArrowLeft' && previousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      let { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
