import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/index.css'
import Navbar from '../components/layout/Navbar'; 
// Import your solution components (ensure paths are correct after merging)
import { Intuition, Complexity, Mistakes, RelatedProblems, InterviewTips } from '../components/solution/ContentSection';
import ProblemHeader from '../components/solution/ProblemHeader';
import CodeDisplay from '../components/solution/CodeDisplay';
import Visualizer from '../components/visualization/Visualizer';
import Sidebar from '../components/layout/Sidebar'; // Assuming this is the solution-specific sidebar
import { apiFetch } from '../utils/api';

// Helper to safely parse the "stringified JSON" from your backend
const safeParse = (str) => {
  try { return typeof str === 'string' ? JSON.parse(str) : str; } 
  catch (e) { return null; }
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') throw new Error("Please log in.");

        const response = await apiFetch(`/question/${problemId}`);

        if (!response.ok) throw new Error("Failed to load problem");
        
        const rawData = await response.json();

        // Parse the nested JSON strings from the backend
        const parsedData = {
          ...rawData,
          intuition: safeParse(rawData.intuition),
          complexity: safeParse(rawData.complexity),
          mistakes: safeParse(rawData.mistakes),
          related: safeParse(rawData.related),
          tips: safeParse(rawData.tips),
          codeSnippets: safeParse(rawData.codeSnippets),
          visualSteps: safeParse(rawData.visualSteps)
        };

        setData(parsedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [problemId]);

  if (loading) return <div className="page-container">Loading Solution...</div>;
  if (error || !data) return <div className="page-container">Error: {error || "Problem not found"}</div>;

  return (
    <>
      <div className="solution-wrapper dark-mode">
      <Navbar />
      <div className="page-container">
        <main className="main-content">
          <ProblemHeader data={data} />
          {/* Only render components if data exists */}
          {data.codeSnippets && <CodeDisplay snippets={data.codeSnippets} />}
          {data.intuition && <Intuition steps={data.intuition} />}
          {data.visualSteps && <Visualizer steps={data.visualSteps} />}
          {data.complexity && <Complexity data={data.complexity} />}
          {data.tips && <InterviewTips tips={data.tips} />}
          {data.mistakes && <Mistakes mistakes={data.mistakes} />}
          {data.related && <RelatedProblems problems={data.related} />}
        </main>
        {/* Pass data to the sidebar if it needs stats */}
        <Sidebar stats={data} />
      </div>
      </div>
    </>
  );
};

export default ProblemPage;