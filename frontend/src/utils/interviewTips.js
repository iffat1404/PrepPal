export const interviewTips = [
  "Practice speaking clearly and at a moderate pace. This helps with speech recognition accuracy and makes you sound more confident.",
  "Use the STAR method (Situation, Task, Action, Result) to structure your answers to behavioral questions.",
  "Research the company and the role thoroughly. Understand their mission, values, and recent news.",
  "Prepare at least 3-5 thoughtful questions to ask the interviewer. This shows your engagement and interest.",
  "Always send a thank-you note or email within 24 hours after the interview. It's a professional courtesy that can make a difference.",
  "Listen carefully to the question before you answer. It's okay to take a moment to think and structure your thoughts.",
  "Have a concise 30-60 second 'elevator pitch' about yourself ready to go. It's your answer to 'Tell me about yourself.'",
  "Dress professionally, even for a video interview. It shows you're taking the opportunity seriously.",
  "Check your tech beforehand for virtual interviews: test your camera, microphone, and internet connection.",
  "Maintain good posture and eye contact (look at the camera, not just the screen) to appear engaged and confident.",
  "Quantify your accomplishments on your resume and in your answers. Use numbers to show your impact.",
  "Be prepared to discuss your weaknesses. Frame them positively by mentioning how you're working to improve.",
  "Don't speak negatively about previous employers or colleagues. It reflects poorly on you.",
  "Align your answers with the company's values and the job description's requirements.",
  "At the end of the interview, reiterate your interest in the role and briefly summarize why you're a great fit.",
  "Get a good night's sleep before the interview. Being well-rested improves focus and clarity.",
  "Have your resume and the job description on hand for quick reference, but don't read from them directly.",
  "Be enthusiastic and positive throughout the conversation. Attitude can be just as important as skill.",
  "Follow up if you haven't heard back by the timeline they provided, but be patient and professional.",
  "Practice, practice, practice. Do mock interviews with friends, family, or an AI tool to build confidence."
];

/**
 * Gets a new random tip from the list, ensuring it's not the same as the current one.
 * @param {string} [currentTip] - The optional current tip to avoid repeating.
 * @returns {string} A new, random interview tip.
 */
export const getRandomTip = (currentTip) => {
  let newTip = currentTip;
  // If there's only one tip, just return it. Otherwise, loop until a new tip is found.
  if (interviewTips.length > 1) {
    while (newTip === currentTip) {
      const randomIndex = Math.floor(Math.random() * interviewTips.length);
      newTip = interviewTips[randomIndex];
    }
  } else {
    // Handle case with 0 or 1 tip.
    newTip = interviewTips[0] || "No tips available.";
  }
  return newTip;
};