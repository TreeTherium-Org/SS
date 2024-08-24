import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabaseClient';

const Results = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [results, setResults] = useState([]);

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

  const fetchResults = async (questionId) => {
    const { data, error } = await supabase
      .from('votes')
      .select('image_url, vote')
      .eq('question_id', questionId);

    if (error) {
      console.error("Error fetching results:", error.message);
    } else {
      const aggregatedResults = data.reduce((acc, vote) => {
        const image = acc.find(img => img.image_url === vote.image_url);
        if (image) {
          image[vote.vote] += 1;
        } else {
          acc.push({ image_url: vote.image_url, yes: vote.vote === 'yes' ? 1 : 0, no: vote.vote === 'no' ? 1 : 0 });
        }
        return acc;
      }, []);
      setResults(aggregatedResults);
    }
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    fetchResults(question.id);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Survey Results</h1>
      {selectedQuestion ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">{selectedQuestion.question}</h2>
          <ul className="space-y-4">
            {results.map((result, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded-lg">
                <img src={result.image_url} alt="Survey" className="mb-4 rounded-lg" />
                <p className="text-lg font-semibold">Yes: {result.yes}</p>
                <p className="text-lg font-semibold">No: {result.no}</p>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => setSelectedQuestion(null)}
          >
            Back to Questions
          </button>
        </>
      ) : (
        <ul className="space-y-4">
          {questions.map((question) => (
            <li
              key={question.id}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              onClick={() => handleQuestionSelect(question)}
            >
              <h2 className="text-xl font-semibold">{question.question}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;