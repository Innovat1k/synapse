const ButtonSpinner = ({
  color = "border-white",
  label = "submitting...",
  labelColor = "text-white",
  inline = true,
}) => {
  return (
    <div
      className={`
        flex items-center justify-center gap-2
        ${inline ? "inline-flex" : "w-full"}
      `}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className={`
          w-4 h-4
          border-2 border-solid
          border-current
          border-r-transparent
          rounded-full
          animate-spin
          ${color}
        `}
        aria-hidden="true"
      />
      {label && <span className={`capitalize ${labelColor}`}>{label}</span>}
      {!label && <span className="sr-only">Loading</span>}
    </div>
  );
};

export default ButtonSpinner;
