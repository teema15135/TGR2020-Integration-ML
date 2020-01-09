const tf = require("@tensorflow/tfjs-node");

async function createData(filename) {
  const dataset = tf.data.csv("file://" + filename, { hasHeader: true });

  let v = await dataset.toArray();

  const v_len = v.length;
  const xs = [];
  const ys = [];

  for (var i = 0; i < v_len; i++) {
    const x = [];
    const row = v[i];
    xs.push([row.gate3, row.gate18, row.gate21, row.gate36]);
    ys.push([
      row.near === 3 ? 1 : 0,
      row.near === 18 ? 1 : 0,
      row.near === 21 ? 1 : 0,
      row.near === 36 ? 1 : 0
    ]);
  }

  return {
    xs,
    ys
  };
}

async function run() {
  const data = await createData("./label.csv");
  const model = await tf.loadLayersModel("file://saved_model/model.json");
  let yv = model.predict(tf.tensor2d(data.xs));

console.log(yv.arraySync());

  const new_ys = [];
  data.ys.forEach(y => {
      
    if (y[0] == 1) new_ys.push(3);
    else if (y[1] == 1) new_ys.push(18);
    else if (y[2] == 1) new_ys.push(21);
    else if (y[3] == 1) new_ys.push(36);
    else {
      console.log("WTF IS HAPPENING IN DATA!!!!");
    }
  });

  const index_yv = [];
  yv.arraySync().forEach(row => {
    // console.log(row);
    index_yv.push(maxIndex(row));
  });

  const new_yv = [];

  for (var i = 0; i < index_yv.length; i++) {
    switch (index_yv[i]) {
      case 0:
        new_yv.push(3);
        break;
      case 1:
        new_yv.push(18);
        break;
      case 2:
        new_yv.push(21);
        break;
      case 3:
        new_yv.push(36);
        break;
      default:
        break;
    }
  }

  const count = new_yv.length;
  var score = 0;
  for (let index = 0; index < new_yv.length; index++) {
    if (new_yv[index] == new_ys[index]) score++;
  }
  score /= count;
  score *= 100;
  console.log(score, '%');
}

function maxIndex(arr) {
  var index = -1;
  var max = -1;
  for (var i = 0; i < arr.length; i++) {
    if (max < arr[i]) {
      max = arr[i];
      index = i;
    }
  }
  return index;
}

run()
  .then()
  .catch(e => console.log(e));
