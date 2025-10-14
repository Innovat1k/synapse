function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-gray-900. rounded-lg p-4 border. border-gray-800. shadow-sm transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
