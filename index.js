document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("[data-animate]");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animationClass = entry.target.dataset.animate;
            entry.target.classList.add(animationClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
  
    sections.forEach((section) => observer.observe(section));
  });
  