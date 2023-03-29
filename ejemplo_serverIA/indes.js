const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Configurar las credenciales de AWS
AWS.config.update({
  accessKeyId: 'AKIARBGJTPBKXVPBTU7I',
  secretAccessKey: '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',
  region: 'us-east-2'
});

// Crear un objeto para interactuar con el servicio de Rekognition
const rekognition = new AWS.Rekognition();

// Definir un endpoint de tipo POST para subir una imagen al servicio de Rekognition
app.post('/api/rekognition', (req, res) => {
  const imagen = req.body.imagen;

  // Convertir la imagen en un buffer
  const buffer = Buffer.from(imagen.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  // Definir los parámetros de la solicitud al servicio de Rekognition
  const params = {
    Image: {
      Bytes: buffer
    },
    MaxLabels: 10,
    MinConfidence: 80
  };

  // Enviar la solicitud al servicio de Rekognition
  rekognition.detectLabels(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.status(500).send('Error en el servicio de Rekognition');
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
