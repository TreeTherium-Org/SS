import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [images, setImages] = useState([""]);
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

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleImageChange = (index, event) => {
    const newImages = [...images];
    newImages[index] = event.target.files[0];
    setImages(newImages);
  };

  const addImageInput = () => {
    setImages([...images, ""]);
  };

  const uploadImages = async () => {
    const uploadedImageUrls = [];
    for (const image of images) {
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('survey-images')
          .upload(`public/${fileName}`, image);

        if (error) {
          console.error("Image upload failed:", error.message);
        } else {
          const { data: urlData, error: urlError } = supabase.storage
            .from('survey-images')
            .getPublicUrl(`public/${fileName}`);

          if (urlError) {
            console.error("Failed to get image URL:", urlError.message);
          } else {
            uploadedImageUrls.push(urlData.publicUrl);
          }
        }
      }
    }
    return uploadedImageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question) {
      alert("Please enter a question.");
      return;
    }

  
    const imageUrls = await uploadImages();

    if (imageUrls.length === 0) {
      alert("No images uploaded.");
      return;
    }

  
    const { data, error } = await supabase
      .from('surveys')
      .insert([{ question, images: imageUrls }]);

    if (error) {
      console.error("Error saving survey:", error.message);
    } else {
      alert("Survey created successfully!");
      router.push('/SurveyAnswer');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Question:</label>
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Enter your question"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Images:</label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="file"
                onChange={(event) => handleImageChange(index, event)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addImageInput}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded"
          >
            + Add Image
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;