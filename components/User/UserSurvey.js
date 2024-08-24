import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

const QuestionWithImage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*');
      
      if (error) {
        console.error("Error fetching questions:", error.message);
      } else {
        setQuestions(data);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionClick = (question) => {
    setCurrentQuestion(question);
    setCurrentImageIndex(0);
    setShowCongrats(false);
  };

  const saveVote = async (vote) => {
    const currentImageUrl = currentQuestion.images[currentImageIndex];
    const { error } = await supabase
      .from('votes')
      .insert({
        question_id: currentQuestion.id,
        image_url: currentImageUrl,
        vote: vote
      });

    if (error) {
      console.error("Error saving vote:", error.message);
    }
  };

  const handleAnswer = async (vote) => {
    await saveVote(vote);

    if (currentImageIndex < currentQuestion.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setShowCongrats(true);
    }
  };

  if (showCongrats) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations! You've answered all the images.</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
          onClick={() => setCurrentQuestion(null)}
        >
          Go Back to Questions
        </button>
      </div>
    );
  }

  if (currentQuestion) {
    const currentImage = currentQuestion.images[currentImageIndex];
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
        <img
          src={currentImage}
          alt="Survey"
          className="mx-auto mb-4 rounded-lg"
        />
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => handleAnswer('no')}
          >
            No
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => handleAnswer('yes')}
          >
            Yes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Questions</h1>
      {questions.length === 0 ? (
        <p className="text-center text-gray-600">No questions available.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((question) => (
            <li
              key={question.id}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => handleQuestionClick(question)}
            >
              <h2 className="text-xl font-semibold">{question.question}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionWithImage;
