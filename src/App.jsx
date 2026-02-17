import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, RotateCcw, PenTool, Hash, Play, Home, CheckCircle2, XCircle } from 'lucide-react';

// --- Configuración de Datos ---
const NUMBERS_DATA = [
  { val: 1, word: "Uno", emoji: "🍎", color: "bg-red-500" },
  { val: 2, word: "Dos", emoji: "🚲", color: "bg-blue-500" },
  { val: 3, word: "Tres", emoji: "⭐", color: "bg-yellow-500" },
  { val: 4, word: "Cuatro", emoji: "🐶", color: "bg-green-500" },
  { val: 5, word: "Cinco", emoji: "🎈", color: "bg-purple-500" },
  { val: 6, word: "Seis", emoji: "🍦", color: "bg-pink-500" },
  { val: 7, word: "Siete", emoji: "🌈", color: "bg-indigo-500" },
  { val: 8, word: "Ocho", emoji: "🚀", color: "bg-orange-500" },
  { val: 9, word: "Nueve", emoji: "🐱", color: "bg-teal-500" },
  { val: 10, word: "Diez", emoji: "⚽", color: "bg-lime-600" },
  { val: 11, word: "Once", emoji: "🦆", color: "bg-lime-600" },
];

const App = () => {
  const [view, setView] = useState('menu'); // menu, learn, practice, write
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameMode, setGameMode] = useState('linear'); // linear or random
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
  const [stars, setStars] = useState(0);

  // --- Funciones de Navegación ---
  const startLearning = (mode) => {
    setGameMode(mode);
    setCurrentIndex(0);
    setView('learn');
  };

  const nextNumber = () => {
    setFeedback(null);
    if (gameMode === 'random') {
      const next = Math.floor(Math.random() * NUMBERS_DATA.length);
      setCurrentIndex(next);
    } else {
      if (currentIndex < NUMBERS_DATA.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setView('menu');
      }
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setStars(s => s + 1);
    setTimeout(() => {
      nextNumber();
    }, 1500);
  };

  // --- Componentes de Vista ---
  
  const Menu = () => (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 animate-in fade-in zoom-in duration-500">
      <h1 className="text-5xl font-bold text-blue-600 mb-8 text-center drop-shadow-sm">
        ¡Aprendamos los Números!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={() => startLearning('linear')}
          className="flex items-center justify-between p-8 bg-green-400 hover:bg-green-500 text-white rounded-3xl shadow-xl transition-all transform hover:scale-105"
        >
          <div className="text-left">
            <span className="text-2xl font-bold block">Paso a Paso</span>
            <span className="opacity-90">Del 1 al 11 en orden</span>
          </div>
          <Play size={48} fill="currentColor" />
        </button>
        <button 
          onClick={() => startLearning('random')}
          className="flex items-center justify-between p-8 bg-purple-400 hover:bg-purple-500 text-white rounded-3xl shadow-xl transition-all transform hover:scale-105"
        >
          <div className="text-left">
            <span className="text-2xl font-bold block">Modo Aleatorio</span>
            <span className="opacity-90">¡Para expertos!</span>
          </div>
          <RotateCcw size={48} />
        </button>
      </div>
      <div className="mt-8 flex items-center space-x-2 text-yellow-500 text-2xl font-bold bg-white px-6 py-2 rounded-full shadow-md">
        <Star fill="currentColor" />
        <span>Estrellas ganadas: {stars}</span>
      </div>
    </div>
  );

  const LearnView = () => {
    const data = NUMBERS_DATA[currentIndex];
    return (
      <div className="flex flex-col items-center p-4 h-full relative">
        <div className="text-9xl font-black text-gray-800 mb-4 select-none drop-shadow-lg">
          {data.val}
        </div>
        <div className="text-4xl font-bold text-blue-500 mb-8 uppercase tracking-widest">
          {data.word}
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Array.from({ length: data.val }).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="text-6xl"
            >
              {data.emoji}
            </motion.div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => setView('write')}
            className="flex items-center space-x-2 px-8 py-4 bg-orange-400 text-white rounded-2xl font-bold shadow-lg hover:bg-orange-500 transition-colors"
          >
            <PenTool /> <span>Escribir</span>
          </button>
          <button 
            onClick={() => setView('practice')}
            className="flex items-center space-x-2 px-8 py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-600 transition-colors"
          >
            <Hash /> <span>Practicar</span>
          </button>
          <button 
            onClick={nextNumber}
            className="flex items-center space-x-2 px-8 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:bg-green-600 transition-colors"
          >
            <span>Siguiente</span> <ArrowRight />
          </button>
        </div>
      </div>
    );
  };

  const PracticeView = () => {
    const data = NUMBERS_DATA[currentIndex];
    const [options, setOptions] = useState([]);

    useEffect(() => {
      // Generar 3 opciones: la correcta y 2 aleatorias
      let opts = [data.val];
      while (opts.length < 3) {
        const rand = Math.floor(Math.random() * 10) + 1;
        if (!opts.includes(rand)) opts.push(rand);
      }
      setOptions(opts.sort(() => Math.random() - 0.5));
    }, [currentIndex]);

    const checkAnswer = (val) => {
      if (val === data.val) {
        handleCorrect();
      } else {
        setFeedback('wrong');
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <div className="flex flex-col items-center p-4">
        <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          ¿Cuántos objetos hay?
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-6 min-h-[200px] mb-12 bg-white/50 p-8 rounded-3xl border-4 border-dashed border-blue-200">
          {Array.from({ length: data.val }).map((_, i) => (
            <span key={i} className="text-7xl">{data.emoji}</span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {options.map((opt) => (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={opt}
              onClick={() => checkAnswer(opt)}
              className="w-24 h-24 bg-white border-4 border-blue-400 rounded-3xl flex items-center justify-center text-4xl font-black text-blue-600 shadow-xl"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const WritingView = () => {
    const data = NUMBERS_DATA[currentIndex];
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      ctx.lineTo(x, y);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
      <div className="flex flex-col items-center p-4">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">
          Traza el número {data.val}
        </h2>
        
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-100">
          {/* Fondo con el número fantasma para guiar */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[250px] font-black text-gray-100 uppercase tracking-tighter">
              {data.val}
            </span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={350}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="relative z-10 cursor-crosshair touch-none"
          />
        </div>

        <div className="flex space-x-4 mt-8">
          <button 
            onClick={clearCanvas}
            className="p-4 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
          >
            <RotateCcw size={32} />
          </button>
          <button 
            onClick={() => handleCorrect()}
            className="px-10 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <span>¡Listo!</span> <CheckCircle2 />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-gray-800">
      {/* Barra de Navegación Superior */}
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center px-8 border-b-4 border-blue-100">
        <button 
          onClick={() => setView('menu')}
          className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
        >
          <Home size={28} />
        </button>
        <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300">
          <Star className="text-yellow-500 fill-current" size={24} />
          <span className="font-bold text-yellow-700">{stars}</span>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto py-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === 'menu' && <Menu key="menu" />}
          {view === 'learn' && <LearnView key="learn" />}
          {view === 'practice' && <PracticeView key="practice" />}
          {view === 'write' && <WritingView key="write" />}
        </AnimatePresence>
      </main>

      {/* Feedback de Acierto/Error */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white p-12 rounded-full shadow-2xl border-8 border-green-400 flex flex-col items-center animate-bounce">
              <CheckCircle2 size={120} className="text-green-500" />
              <span className="text-4xl font-black text-green-600 mt-4 uppercase">¡Genial!</span>
            </div>
          </motion.div>
        )}
        {feedback === 'wrong' && (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white p-12 rounded-full shadow-2xl border-8 border-red-400 flex flex-col items-center">
              <XCircle size={120} className="text-red-500" />
              <span className="text-4xl font-black text-red-600 mt-4 uppercase">Casi...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 left-0 right-0 text-center text-gray-400 text-sm">
        Hecho con ❤️ para aprender jugando
      </footer>
    </div>
  );
};

export default App;