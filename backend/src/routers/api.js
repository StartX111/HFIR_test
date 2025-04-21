const { fetch } = require('undici');
const express = require('express');
const router = express.Router();


const externalFHIRUrl = process.env.EXTERNAL_FHIR_URL || 'http://localhost:8080/fhir';

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

    data['originalUrl'] = externalFHIRUrl;
    res.json(data);
  } catch (error) {
    console.error('Error executing request:', error);

    res.status(500).json({
      errorMessage: 'Server error while requesting data',
      error
    });
  }
});

router.get('/patients/search', async (req, res) => {
  const {id, name} = req?.query;

  let queryParam = ''
  if (id) {
    queryParam = `_id=${id}`
  } if (name) {
    queryParam = `given=${name}`
  }

  try {
    const response = await fetch(`${externalFHIRUrl}/Patient?${queryParam}`, {
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

    data['originalUrl'] = externalFHIRUrl;
    res.json(data);
  } catch (error) {
    console.error('Error executing request:', error);

    res.status(500).json({
      errorMessage: 'Server error while requesting data',
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

    data['originalUrl'] = externalFHIRUrl;
    res.json(data);
  } catch (error) {
    console.error('Error executing request:', error);

    res.status(500).json({
      error: 'Server error while requesting data',
    });
  }
});

router.get('/patients/:id/observations', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${externalFHIRUrl}/Observation?patient=${id}`, {
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

    const responseOther = await fetch(`${externalFHIRUrl}/Observation?patient=${id}&category=vital-signs`, {
      method: 'GET',
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/json'
      },
    });

    if (!responseOther.ok && !response.ok) {
      return res.status(responseOther.status).json({
        error: `API Error: ${responseOther.statusText} and ${response.statusText}`,
      });
    }

    const data2 = await responseOther.json();

    res.json({...data, ...data2, originalUrl: externalFHIRUrl});
  } catch (error) {
    console.error('Error executing request:', error);

    res.status(500).json({
      error: 'Server error while requesting data',
    });
  }
});

module.exports = router;