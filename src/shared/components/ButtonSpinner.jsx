const ButtonSpinner = ({ color = "border-white" }) => {
  return (
    <div
      className={`
        inline-block 
        w-4 h-4 
        border-2 border-solid 
        border-current 
        border-r-transparent 
        rounded-full 
        animate-spin 
        ${color}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Submitting...</span>
    </div>
  );
};

export default ButtonSpinner;
