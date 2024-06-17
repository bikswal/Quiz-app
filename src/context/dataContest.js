import { createContext, useState, useEffect } from "react";

const DataContext = createContext({});

export const DataProvider = ({children}) => {
      // All Quizs, Current Question, Index of Current Question, Answer, Selected Answer, Total Marks
  const [quizs, setQuizs] = useState([]);
  const [question, setQuesion] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [marks, setMarks] = useState(0);
  const [isFullscreen,setIsFullscreen] = useState(false);

  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft,setTimeLeft] = useState(600); //10 in seconds
  const [Timerstart,setTimerstart] = useState(false);
  // Load JSON Data
  useEffect(() => {
    fetch('quiz.json')
      .then(res => res.json())
      .then(data => setQuizs(data))
  
  }, []);
  //Load state to local storage
  useEffect(()=>{
  const savedTimeLeft = localStorage.getItem('timeLeft')
    if(savedTimeLeft){
      setTimeLeft(Number(savedTimeLeft));
      console.log(savedTimeLeft)
    }
},[]);
//save state to local storage
useEffect(()=>{

  localStorage.setItem('timeLeft',timeLeft);
},[timeLeft]);
//Timer Logic
useEffect(() => {
  if (Timerstart && timeLeft > 0) {
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  } else {
    
    setShowQuiz(false);
    showTheResult();
  }
}, [showQuiz,timeLeft]);
  // Set a Single Question
  useEffect(() => {
    if (quizs.length > questionIndex) {
      setQuesion(quizs[questionIndex]);
    }
  }, [quizs, questionIndex])

  // Fullscreen change
  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };
    const handleFullscreenChange = () => {
        checkFullscreen();
    };
    // Check initial fullscreen state
    checkFullscreen();

    // Add event listeners for fullscreen change
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE/Edge

    // Check fullscreen status on component mount
    handleFullscreenChange();

    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
}, [isFullscreen]);

  // Start Quiz
  const startQuiz = () => {
    setTimerstart(true)
    if(isFullscreen ){

      setShowStart(false);
      setShowQuiz(true);
    } else {
      alert('Enable full screen to start the quiz');
    }
    
  }

  // Check Answer
  const checkAnswer = (event, selected) => {
    if (!selectedAnswer) {
      setCorrectAnswer(question.answer);
      setSelectedAnswer(selected);

      if (selected === question.answer) {
        event.target.classList.add('bg-success');
        setMarks(marks + 5);
      } else {
        event.target.classList.add('bg-danger');
      }
    }
  }

  // Next Quesion
  const nextQuestion = () => {
    setCorrectAnswer('');
    setSelectedAnswer('');
    const wrongBtn = document.querySelector('button.bg-danger');
    wrongBtn?.classList.remove('bg-danger');
    const rightBtn = document.querySelector('button.bg-success');
    rightBtn?.classList.remove('bg-success');
    setQuestionIndex(questionIndex + 1);
  }

  // Show Result
  const showTheResult = () => {
    setShowResult(true);
    setShowStart(false);
    setShowQuiz(false);
    localStorage.removeItem('timeLeft');
  }

  // Start Over
  const startOver = () => {
    setShowStart(false);
    setShowResult(false);
    setTimeLeft(600);
    setTimerstart(true);
    setShowQuiz(true);
    setCorrectAnswer('');
    setSelectedAnswer('');
    setQuestionIndex(0);
    setMarks(0);
    const wrongBtn = document.querySelector('button.bg-danger');
    wrongBtn?.classList.remove('bg-danger');
    const rightBtn = document.querySelector('button.bg-success');
    rightBtn?.classList.remove('bg-success');
  }
 
    return (
        <DataContext.Provider value={{
            startQuiz,showStart,showQuiz,question,quizs,checkAnswer,correctAnswer,
            selectedAnswer,questionIndex,nextQuestion,showTheResult,showResult,marks,
            startOver,timeLeft,Timerstart,isFullscreen
        }} >
            {children}
            <p>The window is currently {isFullscreen ? 'in' : 'not in'} fullscreen mode.</p> 
        </DataContext.Provider>
    );
}

export default DataContext;