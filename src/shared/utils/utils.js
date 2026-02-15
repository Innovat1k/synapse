// Truncate string to limit displayed character
export const truncateString = (string, charLimit = 15) =>
  string.length > charLimit ? string.slice(0, charLimit) + "..." : string;

//
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Convert total minutes to hours and minutes
export const formatDuration = (duration = 0) => {
  if (duration <= 0) return "0 mn";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} h ${minutes} mn`;
  }
  if (hours > 0) {
    return `${hours} h`;
  }
  return `${minutes} mn`;
};

// Convert hours and minutes to total minutes
export const formatMinutes = ({ hours = 0, minutes = 0 }) => {
  const total_minutes = hours >= 1 ? hours * 60 + minutes : minutes;
  return total_minutes;
};

// Convert timetampz date to input datetime-local readable format
export const formatDateLocal = (timestampzDate = new Date().toISOString()) => {
  return new Date(timestampzDate).toISOString().slice(0, 16);
};

export const formatDateUTC = (timestampzDate) => {
  if (!timestampzDate) return "";

  const date = new Date(timestampzDate);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Creates a Promise with externally accessible resolve/reject (for async coordination or testing)
export const createDeferredPromise = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

// Mocks window.innerWidth and triggers a resize event (useful for testing responsive UI)
export const setWindowWidth = (width) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};
