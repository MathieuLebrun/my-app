import React, { useState, useEffect } from 'react';

const ReconnaissanceVocale = () => {
  const [texte, setTexte] = useState('');
  const [enEcoute, setEnEcoute] = useState(false);
  const [erreur, setErreur] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'fr-FR';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event) => {
        setTexte(event.results[0][0].transcript);
      };

      recognitionInstance.onend = () => {
        setEnEcoute(false);
      };

      recognitionInstance.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setErreur("L'accès au microphone a été refusé. Veuillez permettre l'accès au microphone et réessayer.");
          // Tentez de demander l'accès au microphone ici si vous le souhaitez
        } else {
          setErreur(`Erreur de reconnaissance vocale: ${event.error}`);
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setErreur("La reconnaissance vocale n'est pas prise en charge par ce navigateur.");
    }
  }, []);

  const demanderPermissionMicro = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setErreur(''); // Réinitialiser l'erreur si la permission est accordée
      // Vous pouvez démarrer la reconnaissance vocale ici directement si nécessaire
    } catch (err) {
      setErreur("L'accès au microphone a été refusé ou une erreur s'est produite. Veuillez vérifier vos paramètres de permission.");
    }
  };

  const demarrerEcoute = async (event) => {
    event.preventDefault();
    if (!enEcoute && recognition) {
      try {
        await demanderPermissionMicro();
        recognition.start();
        setEnEcoute(true);
      } catch (error) {
        console.error("Erreur lors de la demande de permission du microphone ou démarrage de la reconnaissance vocale", error);
        // L'erreur est déjà gérée dans demanderPermissionMicro, pas besoin de définir à nouveau setErreur ici
      }
    }
  };

  return (
    <div>
      <button onClick={demarrerEcoute} disabled={enEcoute}>
        {enEcoute ? 'Écoute...' : 'Démarrer la reconnaissance vocale'}
      </button>
      {texte && <p>Texte reconnu: {texte}</p>}
      {erreur && <p style={{color: 'red'}}>{erreur}</p>}
    </div>
  );
};

export default ReconnaissanceVocale;
