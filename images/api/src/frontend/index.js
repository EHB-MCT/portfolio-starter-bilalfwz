// Functie om de studentId op te halen uit de sessie
function getLoggedInStudentId() {
    // Implementeer de juiste logica om de studentId uit de sessie op te halen
    // Voorbeeld: stel dat je de studentId bij het inloggen in de sessie hebt opgeslagen
    return sessionStorage.getItem('studentId');
  }
  
  // Functie voor registratie
  async function register() {
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value;
  
    // Haal de studentId op uit de sessie
    const studentId = getLoggedInStudentId();
  
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
          // Voeg de studentId toe aan het student object
          studentId: studentId,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Registratie succesvol');
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
  
  async function recordWaterConsumption() {
    // Haal de studentId op uit de sessie
    const studentId = getLoggedInStudentId('id');
    const glassesOfWater = document.getElementById('glasses_of_water').value;
  
    try {
      const response = await fetch('http://localhost:8080/api/water_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,  // gebruik dezelfde naam als in de servercode
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
  
  