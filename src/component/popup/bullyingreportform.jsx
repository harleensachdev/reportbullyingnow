import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
import "./bullyingreportform.css"; // Import the CSS file

const BullyingReportForm = ({ setOpenPopup }) => {
  const [formData, setFormData] = useState({
    typeOfBullying: "",
    yearGroup: "",
    date: "",
    time: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const reportData = {
        ...formData,
        submittedAt: serverTimestamp(),
        status: "pending",
        reviewed: false,
      };

      const reportsRef = collection(db, "bullyingReports");
      await addDoc(reportsRef, reportData);

      toast.success("Your report has been submitted anonymously.");
      setOpenPopup(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2>Report a Bullying Incident</h2>
        <p>Your report is 100% anonymous and cannot be traced back to you.</p>

        <div>
          <label>Type of Bullying</label>
          <select
            name="typeOfBullying"
            value={formData.typeOfBullying}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select the type of bullying
            </option>
            <option value="physical">Physical</option>
            <option value="verbal">Verbal</option>
            <option value="cyberbullying">Cyberbullying</option>
            <option value="emotional">Emotional</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Your Year Group</label>
          <select
            name="yearGroup"
            value={formData.yearGroup}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select your year group
            </option>
            <option value="Year 7">Year 7</option>
            <option value="Year 8">Year 8</option>
            <option value="Year 9">Year 9</option>
            <option value="Year 10">Year 10</option>
            <option value="Year 11">Year 11</option>
            <option value="Year 12">Year 12</option>
            <option value="Year 13">Year 13</option>
          </select>
        </div>

        <div>
          <label>When did the incident take place?</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>What time did the incident take place?</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select the time of the incident
            </option>
            <option value="Before School">Before School</option>
            <option value="Break Time">Break Time</option>
            <option value="Lunch Time">Lunch Time</option>
            <option value="During Lessons">During Lessons</option>
            <option value="After School">After School</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
        <p>
          Your report will be handled with the utmost confidentiality and care.
        </p>
        <p>
          {" "}
          Once you submit this report, you can continue chatting with an
          ambassador.
        </p>
      </form>
    </div>
  );
};

export default BullyingReportForm;
