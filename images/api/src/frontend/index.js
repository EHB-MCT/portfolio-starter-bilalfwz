// Functie om de studentId op te halen uit de sessie
function getLoggedInStudentId() {
  // Implementeer de juiste logica om de studentId uit de sessie op te halen
  // Voorbeeld: stel dat je de studentId bij het inloggen in de sessie hebt opgeslagen
  return sessionStorage.getItem('studentId');
}

// Functie om de studentId op te halen op basis van het e-mailadres
async function getStudentIdByEmail(email) {
  try {
    const response = await fetch(`http://localhost:8080/api/students?email=${email}`);
    const result = await response.json();

    if (response.ok && result.length > 0) {
      return result[0].id;
    } else {
      throw new Error(result.error || 'Student niet gevonden');
    }
  } catch (error) {
    throw new Error('Fout bij het ophalen van studentgegevens: ' + error.message);
  }
}

// Functie voor registratie
async function register() {
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const age = parseInt(document.getElementById('age').value);
  const email = document.getElementById('email').value;

  try {
    const response = await fetch('http://localhost:8080/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        age: age,
        email: email,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Registratie succesvol');
      // Haal de studentId op basis van het e-mailadres op
      const studentId = await getStudentIdByEmail(email);
      sessionStorage.setItem('studentId', studentId);
      // Toon het dynamische formulier na een succesvolle registratie
      showDynamicForm();
    } else {
      alert(result.error || 'Registratie mislukt');
    }
  } catch (error) {
    console.error('Fout tijdens registratie:', error);
    alert('Er is een onverwachte fout opgetreden tijdens de registratie');
  }
}

// Functie om waterinnamegegevens op te halen
async function recordWaterConsumption() {
  // Haal de studentId op basis van het e-mailadres op
  const email = document.getElementById('email').value;
  const studentId = await getStudentIdByEmail(email);

  // Controleer of de opgehaalde studentId geldig is
  if (!studentId) {
    console.error('Ongeldige studentId opgehaald uit de sessie');
    alert('Er is een probleem opgetreden. Probeer opnieuw in te loggen.');
    return;
  }

  const glassesOfWater = document.getElementById('glasses_of_water').value;

  try {
    const response = await fetch('http://localhost:8080/api/water_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: studentId,
        glasses_of_water: glassesOfWater,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Waterinname succesvol geregistreerd');
    } else {
      alert(result.error || 'Registratie van waterinname mislukt');
    }
  } catch (error) {
    console.error('Fout bij het registreren van waterinname:', error);
    alert('Er is een onverwachte fout opgetreden tijdens het registreren van waterinname');
  }
}


