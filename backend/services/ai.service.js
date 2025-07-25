const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model - Using the fast and reliable 'flash' version
// This single model instance will be used by all functions in this file.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// ====================================================================
// A robust helper function to extract JSON from the AI's response.
// It can handle clean JSON as well as JSON wrapped in markdown code blocks.
// ====================================================================
function extractJson(text) {
    // Regular expression to find a JSON block within markdown ```json ... ```
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);

    if (match && match[1]) {
        // If a markdown block is found, parse the content inside it
        return JSON.parse(match[1]);
    } else {
        // If no markdown block is found, try to parse the entire text
        return JSON.parse(text);
    }
}


// ====================================================================
// Generate interview questions
// ====================================================================
const generateQuestions = async ({ topic, experienceLevel, difficulty, numberOfQuestions }) => {
    try {
        const prompt = `
You are an expert technical interviewer. Generate ${numberOfQuestions} interview questions for the following specifications:

Topic: ${topic}
Experience Level: ${experienceLevel}
Difficulty: ${difficulty}

Requirements:
- Questions should be appropriate for the specified experience level and difficulty.
- Include a mix of theoretical and practical questions.
- Questions should be clear and specific.

Please return ONLY a JSON array of strings, where each string is a question. Do not include any other text, formatting, or markdown.

Example format:
["Question 1 here", "Question 2 here", "Question 3 here"]
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Debugging: See what the AI is actually sending back.
        console.log("Raw AI Response for generateQuestions:", text);

        let questions;
        try {
            questions = extractJson(text.trim());
        } catch (parseError) {
            console.error("Failed to parse JSON from AI response for generateQuestions.", parseError);
            throw new Error("AI returned a response in an invalid format.");
        }

        // Validate that we received an array
        if (!Array.isArray(questions)) {
            throw new Error("AI did not return a valid array of questions.");
        }
        
        // Warn if the count is different, but don't crash the server
        if (questions.length !== numberOfQuestions) {
            console.warn(`AI generated ${questions.length} questions instead of the requested ${numberOfQuestions}. We will proceed with the questions provided.`);
        }

        return questions;
    } catch (error) {
        console.error("Error in generateQuestions service:", error);
        throw new Error("Failed to generate interview questions");
    }
};


// ====================================================================
// Evaluate interview responses
// ====================================================================
const evaluateInterview = async ({ topic, experienceLevel, questions }) => {
    try {
        const questionsAndAnswers = questions
            .map((qa, index) => `Question ${index + 1}: ${qa.question}\nAnswer: ${qa.answer || "No answer provided"}`)
            .join("\n\n");

        const prompt = `
You are an expert technical interviewer evaluating an interview session. Please provide a comprehensive evaluation based on the following:

Topic: ${topic}
Experience Level: ${experienceLevel}

Questions and Answers:
${questionsAndAnswers}

Please provide your evaluation in the following JSON format ONLY. Do not include any other text, formatting, or markdown.
{
  "overallScore": <number between 0-100>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "detailedFeedback": "Detailed paragraph explaining the overall performance.",
  "questionFeedback": [
    {
      "questionIndex": 0,
      "score": <number between 0-10>,
      "feedback": "Specific feedback for this question."
    }
  ]
}

Evaluation Criteria:
- Technical accuracy and depth of knowledge.
- Clarity and structure of the communication.
- Problem-solving approach.
- Relevance of the answer to the experience level.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Debugging: See what the AI is actually sending back.
        console.log("Raw AI Response for evaluateInterview:", text);

        let evaluation;
        try {
            evaluation = extractJson(text.trim());
        } catch (parseError) {
            console.error("Failed to parse JSON from AI evaluation response.", parseError);
            throw new Error("Failed to parse AI evaluation response.");
        }

        // Validate the structure of the evaluation object
        if (!evaluation.overallScore || !evaluation.strengths || !evaluation.improvements || !evaluation.questionFeedback) {
            throw new Error("Invalid evaluation format received from AI.");
        }

        return evaluation;
    } catch (error) {
        console.error("Error in evaluateInterview service:", error);
        throw new Error("Failed to evaluate interview responses");
    }
};

module.exports = {
    generateQuestions,
    evaluateInterview,
};