import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { Connection, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';


const network = "https://devnet.helius-rpc.com/?api-key=02480449-bf86-4cc2-9de8-596d20276cc8";
const connection = new Connection(network, "confirmed");
const programId = new PublicKey("DowGMszf41NQpgKBfSnvcJk3Ca7e1sKG5J2oLcSoDEaq");
const idl = {
  "version": "0.1.0",
  "name": "solana_vote",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {"name": "state", "isMut": true, "isSigner": true},
        {"name": "user", "isMut": true, "isSigner": true},
        {"name": "systemProgram", "isMut": false, "isSigner": false}
      ],
      "args": []
    },
    {
      "name": "vote",
      "accounts": [
        {"name": "voteAccount", "isMut": true, "isSigner": false},
        {"name": "user", "isMut": true, "isSigner": true},
        {"name": "systemProgram", "isMut": false, "isSigner": false}
      ],
      "args": [
        {"name": "questionId", "type": "u32"},
        {"name": "vote", "type": "bool"}
      ]
    }
  ],
  "accounts": [
    {
      "name": "State",
      "type": {"kind": "struct", "fields": [{"name": "questionId", "type": "u32"}]}
    },
    {
      "name": "VoteAccount",
      "type": {"kind": "struct", "fields": [{"name": "questionId", "type": "u32"}, {"name": "vote", "type": "bool"}]}
    }
  ]
};

const QuestionWithImage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [program, setProgram] = useState(null);
  const [provider, setProvider] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const solana = window.solana;

      if (solana) {
        const anchorProvider = new AnchorProvider(connection, solana, { commitment: "confirmed" });
        const programInstance = new Program(idl, programId, anchorProvider);
        setProvider(anchorProvider);
        setProgram(programInstance);
      } else {
        console.error("Solana wallet not found. Please install a wallet like Phantom.");
      }
    }
  }, []);

  const connectWallet = async () => {
    if (window.solana) {
      try {
        await window.solana.connect();
        setWalletConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install a Solana wallet extension.");
    }
  };

  const handleQuestionClick = (question) => {
    setCurrentQuestion(question);
    setCurrentImageIndex(0);
    setShowCongrats(false);
  };

  const saveVoteOnChain = async (vote) => {
    if (!provider || !program) {
      alert("Solana wallet not connected or program not initialized.");
      return;
    }
  
    const questionId = currentQuestion.id;
    const voteValue = vote === 'yes';
    const voteAccount = Keypair.generate();
    const voteAccountPublicKey = voteAccount.publicKey;
    const systemProgram = SystemProgram.programId.toBase58(); 
  
    try {
      const tx = await program.methods.vote(questionId, voteValue)
        .accounts({
          voteAccount: voteAccountPublicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature:", tx);
    } catch (error) {
      console.error("Transaction error:", error);
    }

    console.log("voteAccount PublicKey:", voteAccountPublicKey.toBase58());
    console.log("user PublicKey:", provider.wallet.publicKey.toBase58());
    console.log("systemProgram:", systemProgram);
  };

  const handleAnswer = async (vote) => {
    console.log("User selected:", vote);
    
    await saveVoteOnChain(vote);

    if (currentImageIndex < currentQuestion.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setShowCongrats(true);
    }
  };

  if (!walletConnected) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

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
