(function () {
  test();
  // retrieve();
})();

function buildPost(result) {
  if (!result) return "";

  const { identity, content, image } = result;

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
      <div class="image">
        <img src="${image}" />
      </div>
    </div>
    `;

  return post;
}

function test() {
  const item = buildPost({
    identity: "Razvan",
    content: "Salsa",
    image:
      "https://pictures.topspeed.com/IMG/crop/201608/2003-ferrari-enzo-26_1600x0w.jpg",
  });
  const container = document.createElement("div");
  container.classList += "item";
  container.innerHTML = item;
  const list = document.querySelector("#list");
  console.log(list);
  list.appendChild(container);
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
