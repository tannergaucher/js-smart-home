import "semantic-styles";

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("code")) {
  const code = urlParams.get("code");

  sendAccessToken(code);
}

function sendAccessToken(code) {
  const data = { code };

  fetch(`http://localhost:3000/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
