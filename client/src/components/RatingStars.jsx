// src/components/RatingStars.jsx

const RatingStars = ({ value = 0, max = 5 }) => {
   const numericValue = Number(value) || 0;
  const rounded = Math.round(value);
  const stars = '★'.repeat(rounded) + '☆'.repeat(max - rounded);

  return (
    <span style={{ color: '#FFD700', fontSize: '1rem' }}>
      {numericValue.toFixed(1)} <span>{stars}</span>
    </span>
  );
};

export default RatingStars;
