import React, { useState } from 'react';
import axios from 'axios';
import { renderToStaticMarkup } from 'react-dom/server'; // Import this utility
import { problemsData } from '../../data/problems'; 

const DataUploader = () => {
    const [status, setStatus] = useState("Idle");
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const handleUpload = async () => {
        setStatus("Uploading...");
        setLogs([]);
        
        const problemsArray = Object.values(problemsData);
        addLog(`Processing ${problemsArray.length} problems...`);

        for (const problem of problemsArray) {
            try {
                // AUTOMATED CONVERSION MAGIC
                // We create a copy of the problem so we don't mutate the original file
                const processedProblem = {
                    ...problem,
                    visualSteps: problem.visualSteps ? problem.visualSteps.map(step => {
                        // Check if 'svg' exists and is NOT already a string (meaning it is JSX)
                        if (step.svg && typeof step.svg !== 'string') {
                            return {
                                ...step,
                                // This function renders the JSX component into a standard HTML/SVG string
                                svg: renderToStaticMarkup(step.svg)
                            };
                        }
                        return step;
                    }) : []
                };

                // Now processedProblem contains purely strings, perfect for JSON upload
                await axios.post(
                    "https://dorie-lunulate-breezily.ngrok-free.dev/data/load", 
                    processedProblem, 
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true' 
                        }
                    }
                );

                addLog(`✅ Uploaded: ${problem.title}`);
            } catch (error) {
                console.error(error);
                addLog(`❌ Failed ${problem.title}: ${error.message}`);
            }
        }
        setStatus("Finished");
    };

    return (
        <div style={{ padding: '20px', background: '#1e1e1e', color: '#fff' }}>
            <h2>Auto-Converter & Uploader</h2>
            <p>This will convert all JSX diagrams to Strings automatically before uploading.</p>
            <button 
                onClick={handleUpload} 
                disabled={status === "Uploading..."}
                style={{ padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                {status === "Uploading..." ? "Processing & Uploading..." : "Start Migration"}
            </button>
            <div style={{ marginTop: '20px', fontFamily: 'monospace', maxHeight: '300px', overflowY: 'auto' }}>
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
};

export default DataUploader;