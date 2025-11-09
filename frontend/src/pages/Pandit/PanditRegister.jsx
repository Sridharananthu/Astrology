import React, { useState } from "react";
import { registerPandit } from "../../services/api";

const PanditRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    languages: "",
    skills: [],
    otherSkill: "",
    email: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const skillOptions = [
    "Signature Reading",
    "Vedic",
    "Tarot",
    "KP",
    "Numerology",
    "Lal Kitab",
    "Palmistry",
    "Others",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (skill) => {
    let updatedSkills = [...formData.skills];
    if (updatedSkills.includes(skill)) {
      updatedSkills = updatedSkills.filter((s) => s !== skill);
    } else {
      updatedSkills.push(skill);
    }
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("dob", formData.dob);
    form.append("gender", formData.gender);
    form.append("languages", formData.languages);
    form.append("skills", JSON.stringify(formData.skills));
    form.append("otherSkill", formData.otherSkill);
    form.append("email", formData.email);
    if (formData.image) form.append("image", formData.image);

    try {
      const res = await registerPandit(form);
      if (res.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          dob: "",
          gender: "",
          languages: "",
          skills: [],
          otherSkill: "",
          email: "",
          image: null,
        });
        setPreview(null);
      }
    } catch (err) {
      alert("❌ Registration failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f29] to-[#111633] flex flex-col items-center py-16 px-6">
      {/* Heading Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-2">
          Register as a Pandit
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Join our AstroConnect community of certified astrologers and help guide users through astrology, tarot, and Vedic sciences.
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-5xl bg-[#161b3d] border border-[#d4af37] rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
        {/* Left Column - Image Upload */}
        <div className="md:w-1/3 flex flex-col items-center justify-start">
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#d4af37] mb-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                Upload Image
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-[#d4af37] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#f5d67a] transition">
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Right Column - Form */}
        <div className="md:w-2/3">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Full Name */}
            <div>
              <label className="text-gray-300 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                  className="w-full mt-1 p-2 rounded-lg bg-[#0b0f29] text-white placeholder-gray-400 border border-[#2e3261] focus:border-[#d4af37] outline-none [color-scheme:dark]"

                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-gray-300 text-sm">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-lg bg-[#0b0f29] text-gray-100 border border-[#2e3261] focus:border-[#d4af37] outline-none"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-gray-300 text-sm">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-lg bg-[#0b0f29] text-gray-100 border border-[#2e3261] focus:border-[#d4af37] outline-none"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="text-gray-300 text-sm">Languages Known</label>
              <input
                type="text"
                name="languages"
                placeholder="e.g. Hindi, English"
                value={formData.languages}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-lg bg-[#0b0f29] text-gray-100 placeholder-gray-400 border border-[#2e3261] focus:border-[#d4af37] outline-none"
                required
              />
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="text-gray-300 text-sm">Skills</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {skillOptions.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleSkillChange(skill)}
                    className={`px-4 py-1 rounded-full border transition ${
                      formData.skills.includes(skill)
                        ? "bg-[#d4af37] text-black border-[#d4af37]"
                        : "bg-[#0b0f29] text-gray-200 border-[#2e3261] hover:border-[#d4af37]"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {formData.skills.includes("Others") && (
                <input
                  type="text"
                  name="otherSkill"
                  placeholder="Enter other skill"
                  value={formData.otherSkill}
                  onChange={handleChange}
                  className="w-full mt-3 p-2 rounded-lg bg-[#0b0f29] text-gray-100 placeholder-gray-400 border border-[#2e3261] focus:border-[#d4af37] outline-none"
                />
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-lg bg-[#0b0f29] text-gray-100 border border-[#2e3261] focus:border-[#d4af37] outline-none"
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#d4af37] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#f5d67a] transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#161b3d] border border-[#d4af37] p-8 rounded-2xl text-center shadow-xl max-w-sm w-full">
            <h2 className="text-2xl text-[#d4af37] font-bold mb-2">
              🎉 Registration Successful!
            </h2>
            <p className="text-gray-300 mb-4 text-sm">
              Your details have been saved successfully.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-[#d4af37] text-black px-5 py-2 rounded-lg hover:bg-[#f5d67a]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanditRegister;
