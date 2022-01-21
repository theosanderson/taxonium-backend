// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pako from "pako";
import protobufjs from "protobufjs";
const fs = require("fs");

const PROTOBUF_LOCATION = "./pages/api/taxonium.proto";
const PB_LOCATION = "./pages/api/nodelist.pb.gz";

async function loadData() {
  const root = await protobufjs.load(PROTOBUF_LOCATION);
  console.log("got proto");
  const message = root.lookupType("AllData");
  console.log("found message proto");
  const buffer = fs.readFileSync(PB_LOCATION);
  console.log("read file into buffer");
  const data = message.decode(pako.inflate(buffer));
  console.log("hissss");
  console.log(data.nodeData.x[0]);
  return data;
}

let data_store = null;

// Load the data:
loadData().then((data) => {
  data_store = data;
});

export default function handler(req, res) {
  if (!data_store) {
    res.statusCode = 500;
    res.end("Loading data...");
  } else {
    res.status(200).json({
      result: data_store.nodeData.x[0],
    });
  }
}
