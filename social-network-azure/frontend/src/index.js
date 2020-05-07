(function () {
  // test();
  retrieve();
})();

function buildPost(result) {
  if (!result) return "";

  const { identity, content, id } = result;
  const imageUrl = `https://socialnetworkstorage.blob.core.windows.net/social-network-photos/${id}.png?sp=racwdl&st=2020-05-07T12:42:11Z&se=2021-04-13T12:42:00Z&sv=2019-10-10&sr=c&sig=HMOoPnOVwm9W3qbw3yLGrmcAfhviIQazLcsalMvin3o%3D`;
  const post = `
    <div class="header">
      <div class="picture">
        <p>${String(identity || "i")[0]}</p>
      </div>
      <div class="content">
        <p class="title">${identity || "i"}</p>
        <p class="description">Amazing Post</p>
      </div>
    </div>
    <div class="content">
      <p>${content || "c"}</p>
      <div class="words"></div>
      <div class="image">
        <img src="${imageUrl}" />
      </div>
    </div>
    `;

  const container = document.createElement("div");
  container.classList += "item";
  container.classList += ` item-${id}`;
  container.innerHTML = post;

  return container;
}

function test() {
  const item = buildPost({
    id: 1,
    identity: "Razvan",
    content: "Salsa",
    image:
      "https://pictures.topspeed.com/IMG/crop/201608/2003-ferrari-enzo-26_1600x0w.jpg",
  });

  const list = document.querySelector("#list");
  list.appendChild(item);
}

function retrieve() {
  const endpoint = new URL(
    "https://fii-cc-social-network.azurewebsites.net/posts/"
  );

  fetch(endpoint, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res) return;

      const list = res;
      console.log(res);
      list.forEach((element) => {
        try {
          const post = buildPost(element);

          document.querySelector("#list").appendChild(post);
        } catch (e) {
          console.error(e);
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
