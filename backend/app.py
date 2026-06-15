from flask import Flask, request
from flask_cors import CORS
import PyPDF2
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Backend Connected Successfully!"


@app.route("/upload", methods=["POST"])
def upload_resume():

    file = request.files["resume"]

    pdf_reader = PyPDF2.PdfReader(file)

    text = ""

    for page in pdf_reader.pages:

        page_text = page.extract_text()

        if page_text:
            text += page_text

    return {
        "resume_text": text
    }


@app.route("/analyze", methods=["POST"])
def analyze_resume():

    data = request.get_json()

    resume_text = data["resume_text"].lower()
    job_description = data["job_description"].lower()

    documents = [
        resume_text,
        job_description
    ]

    vectorizer = TfidfVectorizer()

    tfidf_matrix = vectorizer.fit_transform(
        documents
    )

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    ai_score = round(
        similarity * 100,
        2
    )

    jd_words = set(
        re.findall(
            r'\b[a-zA-Z]+\b',
            job_description
        )
    )

    resume_words = set(
        re.findall(
            r'\b[a-zA-Z]+\b',
            resume_text
        )
    )

    matched_skills = list(
        jd_words.intersection(
            resume_words
        )
    )

    missing_skills = list(
        jd_words.difference(
            resume_words
        )
    )

    skill_score = 0

    if len(jd_words) > 0:

        skill_score = round(
            len(matched_skills)
            /
            len(jd_words)
            *
            100,
            2
        )

    final_score = round(
        (skill_score * 0.7)
        +
        (ai_score * 0.3),
        2
    )

    return {
        "score": final_score,
        "matched_skills":
            matched_skills,
        "missing_skills":
            missing_skills
    }


if __name__ == "__main__":
    app.run(debug=True)