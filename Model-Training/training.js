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

  console.log(ys);

  return {
    xs: tf.tensor2d(xs),
    ys: tf.tensor2d(ys)
  };
}

function createModel(num_nodes) {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: num_nodes,
      activation: "sigmoid",
      inputShape: [4]
    })
  );
  model.add(tf.layers.dense({ units: 4, activation: "sigmoid" }));
  model.compile({ optimizer: tf.train.adam(), loss: "categoricalCrossentropy", lr: 0.1 });
  return model;
}

async function trainModel(model, xs, ys, epochs) {
  const loss_arr = [];

  const tf_xs = xs;
  const tf_ys = ys;

  await model.fit(tf_xs, tf_ys, {
    epochs: epochs,
    callbacks: {
      onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
    }
  });

  return loss_arr;
}

function predictModel(model, xv) {
  const yv = model.predict(xv).dataSync();
  return yv;
}

async function run() {
  const data = await createData("label.csv");
  const model = createModel(28);
  console.log(data.xs);
  console.log(data.ys);
  const loss_arr = await trainModel(model, data.xs, data.ys, 2000);
  const yv = predictModel(model, data.xs);
  const saveResult = await model.save("file://saved_model");
}

run()
  .then()
  .catch(err => {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
  });
