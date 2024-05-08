export type InputSize = 'small' | 'medium' | 'large';

export const applySize = (inputSize?: InputSize) => {
  const sizeSpecificStyles = {
    small: `
      font-size: 1rem;
      border-radius: 0.25rem;
      padding: 0.5rem 1rem;
      margin: 0.5rem;
    `,
    medium: `
      font-size: 1.5rem;
      border-radius: 0.25rem;
      padding: 0.75rem 1.5rem;
      margin: 0.5rem;
    `,
    large: `
      font-size: 2rem;
      border-radius: 0.25rem;
      padding: 1rem 1.75rem;
      margin: 0.5rem;
    `,
  };
  switch (inputSize) {
    case 'small': return sizeSpecificStyles.small;
    case 'medium': return sizeSpecificStyles.medium;
    case 'large': return sizeSpecificStyles.large;
    default: return sizeSpecificStyles.small;
  }
};
