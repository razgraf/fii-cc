(function () {
  test();
  // retrieve();
})();

function buildPost(result) {
  if (!result) return "";

  const { identity, content, image, id } = result;

  const post = `
    <div class="header">
      <div class="picture">
        <p>${String(identity)[0]}</p>
      </div>
      <div class="content">
        <p class="title">${identity}</p>
        <p class="description">Amazing Post</p>
      </div>
    </div>
    <div class="content">
      <p>${content}</p>
      <div class="words"></div>
      <div class="image">
        <img src="${image}" />
      </div>
    </div>
    `;

  const container = document.createElement("div");
  container.classList += "item";
  container.classList += `item-${id}`;
  container.innerHTML = item;

  return container;
}

async function resolveTags({ id, image }) {
  const subscriptionKey = process.env.AZURE_COGNITIVE_KEY;
  const host = process.env.AZURE_COGNITIVE_HOST + "/images/visualsearch";

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
  resolveTags(item);
}

function retrieve() {
  const endpoint = new URL("ALEX PUNE AICI");

  fetch(endpoint, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res) return;

      const list = res; // SCHIMBA AICI DACA AI SALVAT IN O VARIABILA SAU LASA ASA DACA RESPONSE E ARRAY

      list.forEach((element) => {
        try {
          const post = buildPost(element);
          const container = document.createElement("div");
          container.classList += "item";
          container.innerHTML = post;
          document.querySelector("#list").appendChild(container);
        } catch (e) {
          console.error(e);
        }
      });
    });
}
