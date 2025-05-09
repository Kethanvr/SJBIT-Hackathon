import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiClock,
  FiVideo,
  FiStar,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader";
import { useProTheme } from "../../utils/useProTheme";

const doctors = [
{
id: 1,
name: "Dr. Arjun Mehta",
specialization: "Cardiologist",
experience: "15 years",
rating: 4.8,
reviews: 245,
image: "https://img.freepik.com/premium-photo/professional-indian-male-doctor-isolated-white-background_878783-9865.jpg",
availability: "Mon-Fri, 9AM-5PM",
consultationFee: 300,
languages: ["English", "Hindi", "Gujarati"],
education: ["MBBS - AIIMS Delhi", "DM - Cardiology, PGIMER Chandigarh"],
about: "Renowned for preventive cardiology and lifestyle-based heart care. Expert in managing hypertension, arrhythmias, and cardiac emergencies.",
isAvailable: true,
},
{
id: 2,
name: "Dr. Neha Krishnan",
specialization: "Neurologist",
experience: "12 years",
rating: 4.9,
reviews: 189,
image: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMV9waG90b2dyYXBoeV9vZl9hbl9zb3V0aF9pbmRpYW5fd29tZW5fYXNfYV9kb2N0b19kMzAxMDM3Zi03MDUzLTQxNDAtYmYyZS1lZDFlYWE0YTM3NDRfMS5qcGc.jpg",
availability: "Mon-Sat, 10AM-6PM",
consultationFee: 290,
languages: ["English", "Tamil", "Hindi"],
education: ["MBBS - MMC Chennai", "DM - Neurology, NIMHANS Bangalore"],
about: "Specializes in epilepsy, migraines, and neurodegenerative disorders. Known for compassionate neurological care and rehabilitation.",
isAvailable: true,
},
{
id: 3,
name: "Dr. Anjali Desai",
specialization: "Pediatrician",
experience: "10 years",
rating: 4.7,
reviews: 156,
image: "https://img.freepik.com/free-photo/expressive-young-woman-posing-studio_176474-66963.jpg?ga=GA1.1.1426594692.1746818668&semt=ais_hybrid&w=740",
availability: "Mon-Fri, 8AM-4PM",
consultationFee: 250,
languages: ["English", "Marathi", "Hindi"],
education: ["MBBS - BJMC Pune", "MD - Pediatrics, KEM Hospital Mumbai"],
about: "Committed to holistic child health and development. Offers expert care in childhood vaccinations, nutrition, and infections.",
isAvailable: true,
},
{
id: 4,
name: "Dr. Rohan Kapoor",
specialization: "Dermatologist",
experience: "8 years",
rating: 4.6,
reviews: 132,
image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
availability: "Tue-Sat, 9AM-5PM",
consultationFee: 260,
languages: ["English", "Punjabi", "Hindi"],
education: ["MBBS - Maulana Azad Medical College", "MD - Dermatology, AIIMS Delhi"],
about: "Expert in treating acne, eczema, pigmentation, and cosmetic dermatology. Known for patient-centered skincare routines.",
isAvailable: false,
},
{
id: 5,
name: "Dr. Kavita Joshi",
specialization: "Psychiatrist",
experience: "14 years",
rating: 4.9,
reviews: 210,
image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
availability: "Mon-Fri, 10AM-7PM",
consultationFee: 270,
languages: ["English", "Hindi"],
education: ["MBBS - KGMC Lucknow", "MD - Psychiatry, NIMHANS Bangalore"],
about: "Focuses on adult mental health, including anxiety, depression, and trauma. Combines therapy with evidence-based medication.",
isAvailable: true,
},
{
id: 6,
name: "Dr. Vijay Reddy",
specialization: "Orthopedic Surgeon",
experience: "16 years",
rating: 4.9,
reviews: 198,
image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
availability: "Mon-Fri, 8AM-4PM",
consultationFee: 300,
languages: ["English", "Telugu", "Kannada"],
education: ["MBBS - Osmania Medical College", "MS - Orthopedics, NIMS Hyderabad"],
about: "Specialist in joint replacement and trauma surgery. Offers advanced care for sports injuries and spine disorders.",
isAvailable: true,
},
{
id: 7,
name: "Dr. Sneha Roy",
specialization: "Gynecologist",
experience: "13 years",
rating: 4.8,
reviews: 176,
image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
availability: "Mon-Sat, 9AM-5PM",
consultationFee: 280,
languages: ["English", "Bengali", "Hindi"],
education: ["MBBS - Calcutta Medical College", "MS - Obstetrics & Gynaecology, AIIMS Delhi"],
about: "Specializes in pregnancy care, PCOD, infertility, and menstrual health. Provides patient-friendly consultation for women’s health.",
isAvailable: true,
},
{
id: 8,
name: "Dr. Amit Sharma",
specialization: "Ophthalmologist",
experience: "11 years",
rating: 4.7,
reviews: 145,
image: "https://www.shutterstock.com/image-photo/indian-male-senior-doctor-standing-260nw-2274219717.jpg",
availability: "Mon-Fri, 9AM-6PM",
consultationFee: 240,
languages: ["English", "Hindi"],
education: ["MBBS - JIPMER", "MS - Ophthalmology, PGIMER Chandigarh"],
about: "Expert in cataract, glaucoma, and LASIK surgeries. Offers modern treatment for vision problems and eye care.",
isAvailable: true,
},
{
id: 9,
name: "Dr. Priya Sharma",
specialization: "Endocrinologist",
experience: "12 years",
rating: 4.8,
reviews: 167,
image: "https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope-holding-clipboard-white-background_114579-49847.jpg?semt=ais_hybrid&w=740",
availability: "Mon-Fri, 10AM-6PM",
consultationFee: 270,
languages: ["English", "Hindi"],
education: ["MBBS - Lady Hardinge Medical College", "DM - Endocrinology, AIIMS Delhi"],
about: "Treats diabetes, thyroid, PCOS, and hormonal imbalances. Advocates for lifestyle-driven endocrine health.",
isAvailable: true,
},
{
id: 10,
name: "Dr. Ramesh Iyer",
specialization: "Gastroenterologist",
experience: "14 years",
rating: 4.9,
reviews: 189,
image: "https://t4.ftcdn.net/jpg/06/42/21/43/360_F_642214311_sea4m3Mw7eEKdbMuh1KQm1RFtTfDCUsv.jpg",
availability: "Mon-Sat, 8AM-4PM",
consultationFee: 290,
languages: ["English", "Malayalam", "Hindi"],
education: ["MBBS - KMC Manipal", "DM - Gastroenterology, SGPGI Lucknow"],
about: "Specializes in liver, pancreatic, and digestive disorders. Offers endoscopy and non-invasive GI treatments.",
isAvailable: true,
},
];

const Doctors = () => {  const { t } = useTranslation("doctors");
  const navigate = useNavigate();
  const { isPro } = useProTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [confirmBooking, setConfirmBooking] = useState(null);

  const specializations = [
    "all",
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];

  const handleBookConsultation = (doctor) => {
    toast.success(
      `Consultation request sent to ${doctor.name}! We'll schedule a Google Meet and send you the details soon.`,
      {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",          borderRadius: "10px",
          padding: "16px",
        },
      }
    );
    setConfirmBooking(null);
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={t("title", "Find a Doctor")}
        onBack={() => navigate(-1)}
      />

      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={t(
                "searchPlaceholder",
                "Search doctors by name or specialization..."
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-base ${
                isPro
                  ? "bg-purple-50 border-purple-200 focus:border-purple-400"
                  : "bg-white border-gray-200 focus:border-indigo-400"
              } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isPro ? "focus:ring-purple-400" : "focus:ring-indigo-400"
              } shadow-sm`}
            />
            <FiSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-lg ${
                isPro ? "text-purple-600" : "text-gray-400"
              }`}
            />
          </div>

          {/* Specialization Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-200/50">
            <div className="flex flex-nowrap overflow-x-auto gap-2 scrollbar-hide">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`min-w-[100px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedSpecialization === spec
                      ? isPro
                        ? "bg-purple-500 text-purple-900 shadow-md"
                        : "bg-indigo-500 text-white shadow-md"
                      : isPro
                      ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {spec === "all" ? t("filters.all", "All Specialties") : spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                isPro
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
                  : "bg-white border border-gray-200"
              }`}
            >              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-lg object-cover mx-auto sm:mx-0 mb-3 sm:mb-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="min-w-0 mb-2 sm:mb-0">
                      <h3
                        className={`text-base font-semibold truncate text-center sm:text-left ${
                          isPro ? "text-purple-900" : "text-gray-900"
                        }`}
                      >
                        {doctor.name}
                      </h3>
                      <p
                        className={`text-sm truncate text-center sm:text-left ${
                          isPro ? "text-purple-700" : "text-gray-600"
                        }`}
                      >
                        {doctor.specialization}
                      </p>
                      <div className="mt-1 flex items-center justify-center sm:justify-start space-x-2">
                        <div
                          className={`flex items-center ${
                            isPro ? "text-purple-600" : "text-indigo-600"
                          }`}
                        >
                          <FiStar className="w-3.5 h-3.5 mr-1" />
                          <span className="text-sm font-medium">
                            {doctor.rating}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="text-xs">
                            {doctor.reviews} reviews
                          </span>
                        </div>
                      </div>
                    </div>                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium ${
                        isPro
                          ? "bg-purple-500 text-purple-900 hover:bg-purple-600"
                          : "bg-indigo-500 text-white hover:bg-indigo-600"
                      } transition-colors duration-200 mt-2 sm:mt-0`}
                    >
                      {t("book", "Book")}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        isPro
                          ? "bg-purple-100 text-purple-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      <FiClock className="w-3 h-3 mr-1" />
                      {doctor.experience}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        isPro
                          ? "bg-purple-100 text-purple-700"
                          : "bg-indigo-100 text-indigo-700"                      }`}
                    >
                      <FiVideo className="w-3 h-3 mr-1" />₹
                      {doctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto ${
              isPro ? "border-2 border-purple-200" : ""
            }`}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-bold truncate ${
                      isPro ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {selectedDoctor.name}
                  </h3>
                  <p
                    className={`text-base truncate ${
                      isPro ? "text-purple-700" : "text-gray-600"
                    }`}
                  >
                    {selectedDoctor.specialization}
                  </p>
                  <div className="mt-1 flex items-center">
                    <FiStar
                      className={`w-4 h-4 ${
                        isPro ? "text-purple-500" : "text-indigo-500"
                      }`}
                    />
                    <span className="ml-1 text-sm font-medium">
                      {selectedDoctor.rating}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">
                      {selectedDoctor.reviews} reviews
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      isPro ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {t("about", "About")}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedDoctor.about}
                  </p>
                </div>

                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      isPro ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {t("education", "Education")}
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {selectedDoctor.education.map((edu, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      isPro ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {t("languages", "Languages")}
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {selectedDoctor.languages.map((lang, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          isPro
                            ? "bg-purple-100 text-purple-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      isPro ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {t("consultationDetails", "Consultation Details")}
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span>{selectedDoctor.availability}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiVideo className="w-4 h-4 mr-2" />
                      <span>
                        {t(
                          "videoConsultation",
                          "Video Consultation via Google Meet"
                        )}
                      </span>
                    </div>                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">
                        ₹{selectedDoctor.consultationFee}
                      </span>
                      <span className="ml-1">
                        {t("perConsultation", "per consultation")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">                <button
                  onClick={() => setSelectedDoctor(null)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isPro
                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t("close", "Close")}
                </button>
                <button
                  onClick={() => setConfirmBooking(selectedDoctor)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isPro
                      ? "bg-purple-500 text-purple-900 hover:bg-purple-600"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  {t("bookConsultation", "Book Consultation")}
                </button>
              </div>
            </div>          </div>
        </div>
      )}

      {/* Booking Confirmation Overlay */}
      {confirmBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div 
            className={`bg-white rounded-xl w-full max-w-md p-5 shadow-lg ${
              isPro ? "border-2 border-purple-200" : ""
            }`}
          >
            <div className={`text-center mb-4 ${isPro ? "text-purple-900" : "text-gray-900"}`}>
              <h3 className="text-xl font-bold mb-2">{t("confirmBooking", "Confirm Booking")}</h3>
              <p className="text-sm">{t("confirmBookingDesc", "You are about to book a consultation with:")}</p>
              <p className="text-lg font-semibold mt-2">{confirmBooking.name}</p>
              <p className="text-sm text-gray-600 mt-1">{confirmBooking.specialization}</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{t("consultationFee", "Consultation Fee")}:</span>
                  <span className="text-base font-medium">₹{confirmBooking.consultationFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t("availability", "Availability")}:</span>
                  <span className="text-sm">{confirmBooking.availability}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3 mt-5">
              <button
                onClick={() => setConfirmBooking(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isPro
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } w-1/2`}
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                onClick={() => handleBookConsultation(confirmBooking)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isPro
                    ? "bg-purple-500 text-purple-900 hover:bg-purple-600"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                } w-1/2`}
              >
                {t("confirm", "Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
