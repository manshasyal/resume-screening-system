
import { useState } from "react";

function App() {

  const [file, setFile] = useState(null);

  const [resumeText, setResumeText] =
    useState("");

  const [jobDescription,
    setJobDescription] =
    useState("");

  const [score, setScore] =
    useState(null);

  const [matchedSkills,
    setMatchedSkills] =
    useState([]);

  const [missingSkills,
    setMissingSkills] =
    useState([]);

  const handleFileChange = (e) => {

    setFile(e.target.files[0]);

  };

  const uploadResume = async () => {

    if (!file) {

      alert("Please select a PDF");

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );

    const response =
      await fetch(
        "https://resume-screening-backend-nrrb.onrender.com/upload",
        {
          method: "POST",
          body: formData
        }
      );

    const data =
      await response.json();

    setResumeText(
      data.resume_text
    );
  };

  const analyzeResume =
    async () => {

      if (
        resumeText.trim() === "" ||
        jobDescription.trim() === ""
      ) {

        alert(
          "Upload resume and enter job description first"
        );

        return;
      }

      const response =
        await fetch(
          "https://resume-screening-backend-nrrb.onrender.com/analyze",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              resume_text:
                resumeText,

              job_description:
                jobDescription
            })
          }
        );

      const data =
        await response.json();

      setScore(
        data.score
      );

      setMatchedSkills(
        data.matched_skills
      );

      setMissingSkills(
        data.missing_skills
      );
    };

  return (

    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        textAlign: "center",
        padding: "20px"
      }}
    >

      <h1>
        AI Resume Screening System
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button
        onClick={uploadResume}
      >
        Upload Resume
      </button>

      <br />
      <br />

      <h3>
        Extracted Resume Text
      </h3>

      <textarea
        value={resumeText}
        readOnly
        rows="10"
        cols="100"
      />

      <br />
      <br />

      <h3>
        Job Description
      </h3>

      <textarea
        rows="8"
        cols="100"
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={analyzeResume}
      >
        Analyze Resume
      </button>

      <br />
      <br />

      {score !== null && (

        <div>

          <h2>
            Match Score: {score}%
          </h2>

          <h3>
            Matched Skills
          </h3>

          <ul
            style={{
              textAlign: "left",
              display: "inline-block"
            }}
          >
            {matchedSkills.map(
              (skill, index) => (
                <li key={index}>
                  ✅ {skill}
                </li>
              )
            )}
          </ul>

          <h3>
            Missing Skills
          </h3>

          <ul
            style={{
              textAlign: "left",
              display: "inline-block"
            }}
          >
            {missingSkills.map(
              (skill, index) => (
                <li key={index}>
                  ❌ {skill}
                </li>
              )
            )}
          </ul>

        </div>

      )}

    </div>

  );
}

export default App;

