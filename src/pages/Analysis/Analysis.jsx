import React, { useState } from "react";
import "./analysis.css";
import ParticleBackground from "../../components/Particle Background/ParticleBackground";
import { useNavigate } from "react-router-dom";
import UploadResume from "../../components/UploadResume/UploadResume";
import homeIcon from "../../Assets/home.png"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const sampleResponse = {
  skills: { React: 90, "Node.js": 75, AWS: 65, TypeScript: 85, Python: 70, Docker: 60 },
  progress: { Jan: 65, Feb: 68, Mar: 72, Apr: 78, May: 82, Jun: 88 },
  missing_keywords: ["Machine Learning", "Agile Methodology", "CI/CD Pipeline"],
  suggested_improvements: [
    "Add quantifiable achievements (e.g., 'reduced latency by 30%')",
    "Include certification details (AWS, Docker)",
    "Optimize resume for ATS (keywords & simple formatting)",
  ],
  overall_score: 88,
  rank_percentile: 15,
  extracted_experience_years: 5,
  raw_text_snippet: "Led frontend team to ship a React + TypeScript app used by 1M users",
};

export default function Analysis() {
  const [report, setReport] = useState(sampleResponse);

  async function handleResult(json) {
    if (json?.ok && json?.data) setReport(json.data);
    else if (json?.data) setReport(json.data);
    else setReport(json);
  }

  const radarData = Object.entries(report.skills || {}).map(([skill, value]) => ({
    skill,
    value: Number(value),
  }));

  const lineData = Object.entries(report.progress || {}).map(([month, score]) => ({
    month,
    score: Number(score),
  }));

  const topSkills = Object.entries(report.skills || {}).map(([skill, score]) => ({
    skill,
    score,
  }));

  const navigator = useNavigate()
  return (
    <div className="analysis-root">
      <ParticleBackground />

      <div className="sideBannerbl">
        <div className="homeicon" onClick={()=> {
            navigator('/')
        }}>
           <img src={homeIcon} alt="Home Icon" /> 
        </div>
      </div>

      <div className="analysis-container">
        <header className="analysis-header">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">Resume analysis</p>
          </div>

          <UploadResume onResult={handleResult} />
        </header>

        {/* ⭐ NEW FIXED FLEX LAYOUT */}
        <main className="analysis-layout">
          
          {/* LEFT COLUMN */}
          <div className="left-column">
            
            {/* RADAR */}
            <section className="card" id="kohol">
              <h3 className="card-title">Skill Proficiency Radar</h3>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                    <PolarGrid stroke="#16202a" />
                    <PolarAngleAxis dataKey="skill" stroke="#9ddce6" />
                    <PolarRadiusAxis angle={30} stroke="#22303a" />
                    <Radar
                      name="proficiency"
                      dataKey="value"
                      stroke="#00f0df"
                      fill="#00f0df"
                      fillOpacity={0.18}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* PROGRESS CHART */}
            <section className="card">
              <h3 className="card-title">Progress Over Time</h3>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14161a" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* TOP SKILLS */}
            <section className="card">
              <h3 className="card-title">Top Skills Detected</h3>
              <div className="skills-wrap">
                {topSkills.map((s) => (
                  <div key={s.skill} className="skill-chip">
                    <span className="skill-name">{s.skill}</span>
                    <span className="skill-score">{s.score}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* MISSING + IMPROVEMENTS */}
            <section className="card split">
              <div>
                <h3 className="card-title">Missing Keywords</h3>
                <ul className="dot-list">
                  {(report.missing_keywords || []).map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="card-title">Suggested Improvements</h3>
                <ul className="dot-list cyan">
                  {(report.suggested_improvements || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </section>
          
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="right-column">
            <aside className="card side">
              <h3 className="card-title">AI Analysis</h3>
              <div className="ai-text">
                <p>
                  Based on our AI analysis, your resume demonstrates strong technical
                  proficiency. Key metrics are shown below.
                </p>

                <ul className="bullets">
                  <li>Overall Skill Score: <strong>{report.overall_score}</strong></li>
                  <li>Rank Percentile: <strong>Top {report.rank_percentile}%</strong></li>
                  <li>Experience: <strong>{report.extracted_experience_years ?? "—"} yrs</strong></li>
                </ul>

                <h4>Recommendations</h4>
                <ul>
                  {(report.suggested_improvements || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                <h4>Raw Snippet</h4>
                <p className="raw-snippet">{report.raw_text_snippet}</p>
              </div>

              <div className="badges-row">
                <div className="stat-card">
                  <div className="stat-num">{report.overall_score}</div>
                  <div className="stat-label">Overall Score</div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-num">Top {report.rank_percentile}%</div>
                  <div className="stat-label">Ranking</div>
                </div>

                <div className="stat-card">
                  <div className="stat-num">{topSkills.length}</div>
                  <div className="stat-label">Skills Matched</div>
                </div>
              </div>
            </aside>
          </aside>

        </main>
      </div>
      <footer className="generator-note">
  <p>This analysis was generated using the Gemini Free Tier Model.</p>
</footer>
    </div>
  );
}
