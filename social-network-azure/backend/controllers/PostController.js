async function create(req, res) {
  console.log(req.params);
  console.log(req.body);
  res.json({ message: "Create not implemented yet" });
}

async function edit(req, res) {
  res.json({ message: "Edit not implemented yet", params: req.params });
}

async function remove(req, res) {
  res.json({ message: "Remove not implemented yet" });
}

async function get(req, res) {
  res.status(200);
  res.json({ message: "Get SINGLE not implemented yet", params: req.params });
}

async function list(req, res) {
  res.json({ message: "Get LIST not implemented yet" });
}

module.exports = {
  create,
  edit,
  remove,
  get,
  list,
};
