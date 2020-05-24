import FractalBuilder from "./builder.js";

(async () => {
  const FractalBuilderService = new FractalBuilder({
    email: "razvan.gabriel.apostu@gmail.com",
    token: "5K6DAXQ-2DJ4ETD-N2BH7RH-NP12ZTY",
  });

  const Client = await FractalBuilderService.who();
  console.log("Client", Client);

  const DragonFractal = await FractalBuilderService.build({
    height: 800,
    width: 800,
    iterations: 10,
    start: {
      symbol: "FX",
      x: 200,
      y: 400,
    },
    rules: [
      {
        left: "X",
        right: "X+YF+",
      },
      {
        left: "Y",
        right: "-FX-Y",
      },
    ],
    angle: 90,
  });

  console.log("Dragon Fractal:", DragonFractal);
})();

var rulesDragon = [
  {
    left: "X",
    right: "X+YF+",
  },
  {
    left: "Y",
    right: "-FX-Y",
  },
];

var rulesDragon2 = [
  {
    left: "Y",
    right: "Y+XF+",
  },
  {
    left: "X",
    right: "-FY-X",
  },
];
