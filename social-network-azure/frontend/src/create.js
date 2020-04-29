const link = null;

(function () {
  initialize();
})();

function initialize() {
  const button = document.querySelector("#buttonSave");
  button.onclick = () => {
    const identity = document.querySelector("#identity").value;
    const password = document.querySelector("#password").value;
    const content = document.querySelector("#identity").value;

    if (!identity || !password || !content || !link) return;

    requestCreatePost({ text, address, coordinates });
    button.dataset.active = false;

    if (text != null && text != "") {
    } else {
      console.log("no text or no address");
    }
  };

  document.querySelector("#imageSearch").onclick = async () => {
    const text = document.querySelector("#imageQuery").value;

    const subscriptionKey = process.env.AZURE_COGNITIVE_KEY;
    const host = process.env.AZURE_COGNITIVE_HOST + "/images/search";

    const url = new URL(host);
    const params = { q: text, count: 1 };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const result = await fetch(url, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    });

    const body = await result.json();
    const image = document.querySelector("#imagePreview");
    image.src = "";

    console.log(body);

    if (body && body.value && body.value[0] && body.value[0].contentUrl) {
      image.src = body.value[0].contentUrl;
      link = body.value[0].contentUrl;
    }

    console.log(body);
  };
}

function requestCreatePost() {
  const identity = document.querySelector("#identity").value;
  const password = document.querySelector("#password").value;
  const content = document.querySelector("#identity").value;

  try {
    const url = new URL(
      "ALEX PLACE THE ENPOINT HERE e.g. azurehost../posts/create"
    );
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        identity,
        password,
        content,
        image: link,
      }),
      // credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.error("errorrrr");
        } else {
          console.log("success");
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("catch");
        throw new Error(error);
      })
      .finally(() => {
        document.querySelector("#buttonSave").dataset.active = true;
      });
  } catch (e) {
    console.error(e);
  } finally {
    document.querySelector("#buttonSave").dataset.active = true;
  }
}
