async function createDemandPredictionModel() {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    inputShape: [5] // [hour, dayOfWeek, latitude, longitude, weather]
  }));
  
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  }));
  
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });
  
  // In a real app, we would load pre-trained weights
  return model;
}

async function predictDemand(model, features) {
  const input = tf.tensor2d([features]);
  const prediction = model.predict(input);
  const value = await prediction.data();
  return value[0];
}