const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// Additional URL validation if needed
const isValidCustomUrl = (url) => {
  // Basic URL pattern
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  // Check if URL matches pattern and is not too long
  return urlPattern.test(url) && url.length < 2048;
};

module.exports = {
  isValidUrl,
  isValidCustomUrl,
};
