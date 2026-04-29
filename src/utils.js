export const slideToID = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.warn(`Element with id "${id}" not found.`);
    }
};

export const slideToTop = () => {
  const scrollContainer = document.scrollingElement || document.documentElement;

  scrollContainer.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};