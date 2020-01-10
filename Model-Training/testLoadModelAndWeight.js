const tf = require('@tensorflow/tfjs-node');

tf.loadLayersModel('file://myModel/model.json')
.then(model => {
    console.log(model.weights);
}).catch(err => console.log(err));
