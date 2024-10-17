'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getDatabase, ref, set } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../lib/firebase';

const SpeechToTextComponent = () => {
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const database = getDatabase(app);
    const functions = getFunctions(app);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Web Speech API. Please use Google Chrome.");
      return;
    }

    const initRecognition = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'zh-TW';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript); //prev =>   (prev + ' ' 

        // Save to Firebase
        const speechRef = ref(database, 'speechToText');
        set(speechRef, { transcript: transcript + ' ' + currentTranscript })
          .then(() => console.log("Transcript saved to Firebase."))
          .catch((error) => console.error("Error saving transcript to Firebase:", error));

        // Translate
        const translateText = httpsCallable(functions, 'translateText');
        translateText({ text: transcript + ' ' + currentTranscript, targetLanguage: 'en-US' })
          .then((result) => setTranslation(result.data.translation))
          .catch((error) => console.error("Translation Error:", error));
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Recognition error:", event.error);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          console.log("Recognition ended. Restarting...");
          startRecognition();
        }
      };

      startRecognition();
    };

    const startRecognition = () => {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    const restartRecognition = () => {
      console.log("Restarting recognition...");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      initRecognition();
    };

    if (isListening) {
      initRecognition();
      timerRef.current = setInterval(restartRecognition, 8000);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTranscript('');
      setTranslation('');
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button
        onClick={toggleListening}
        className={`mb-4 px-4 py-2 rounded ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white font-bold transition-colors`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <motion.div 
        className="w-full max-w-2xl bg-white rounded shadow-md p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2">
          <strong>語音文字:</strong> {transcript}
        </div>
        <div>
          <strong>翻譯結果:</strong> {translation}
        </div>
      </motion.div>
    </div>
  );
};

export default SpeechToTextComponent;