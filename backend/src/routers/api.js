const { fetch } = require('undici');
const express = require('express');
const router = express.Router();

const externalFHIRUrl = 'https://hapi.fhir.org/baseR4';

router.get('/patients', async (req, res) => {
  const limit = req.query.limit || 10;

  try {
    const response = await fetch(`${externalFHIRUrl}/Patient?_count=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API Error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);

    res.status(500).json({
      errorMessage: 'Ошибка сервера при запросе данных',
      error
    });
  }
});

router.get('/patients/search', async (req, res) => {
  const {id, name} = req?.query;

  try {
    const response = await fetch(`${externalFHIRUrl}/Patient?${new URLSearchParams(Object.entries({name, id}).filter(([,v]) => v))}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API Error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);

    res.status(500).json({
      errorMessage: 'Ошибка сервера при запросе данных',
      error
    });
  }
});

router.get('/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${externalFHIRUrl}/Patient/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API Error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);

    res.status(500).json({
      error: 'Ошибка сервера при запросе данных',
    });
  }
});

router.get('/patients/:id/observations', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${externalFHIRUrl}/Observation?subject=Patient/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API Error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);

    res.status(500).json({
      error: 'Ошибка сервера при запросе данных',
    });
  }
});

module.exports = router;
