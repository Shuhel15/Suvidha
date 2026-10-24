export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const navbarDrop = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
};


export const springItem = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    show: {
      opacity: 0.95,
      scale: 1,
      transition: {
        type:"spring",
        stiffness:300,
        damping:20,
      },
    },
};