import { gsap } from "gsap";

export const pageTransition = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
  );
};

export const fadeIn = (element: HTMLElement, delay = 0, duration = 0.6) => {
  gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: "power2.out" }
  );
};

export const slideInLeft = (
  element: HTMLElement,
  delay = 0,
  duration = 0.6
) => {
  gsap.fromTo(
    element,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration, delay, ease: "power3.out" }
  );
};

export const slideInRight = (
  element: HTMLElement,
  delay = 0,
  duration = 0.6
) => {
  gsap.fromTo(
    element,
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration, delay, ease: "power3.out" }
  );
};

export const scaleIn = (element: HTMLElement, delay = 0, duration = 0.6) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration, delay, ease: "back.out(1.7)" }
  );
};

export const bounce = (element: HTMLElement, amplitude = 15) => {
  gsap.to(element, {
    y: -amplitude,
    duration: 0.3,
    repeat: 1,
    yoyo: true,
    ease: "power2.inOut",
  });
};

export const shake = (element: HTMLElement, amplitude = 5) => {
  gsap.to(element, {
    x: amplitude,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: "power1.inOut",
  });
};

export const showSuccessMessage = (element: HTMLElement, autoHide = true) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        if (autoHide) {
          gsap.to(element, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            delay: 1.8,
            ease: "power2.in",
          });
        }
      },
    }
  );
};
