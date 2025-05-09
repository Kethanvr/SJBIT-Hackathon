import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiClock, FiPlus, FiTrash2, FiBell, FiX, FiImage, FiUpload } from "react-icons/fi";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader";
import { useProTheme } from "../../utils/useProTheme";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

const MedicineReminder = () => {
  const { t } = useTranslation("medicineReminder");
  const navigate = useNavigate();
  const { isPro } = useProTheme();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReminders();
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const loadReminders = async () => {
    try {
      const { data, error } = await supabase
        .from("medicine_reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("date_time", { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error("Error loading reminders:", error);
      toast.error(t("errorLoadingReminders", "Error loading reminders"));
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("medicine-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("medicine-images")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error(t("notificationsNotSupported", "Notifications are not supported in your browser"));
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission === "granted";
  };

  const scheduleNotification = (reminder) => {
    const reminderDateTime = new Date(reminder.date_time);
    const delay = reminderDateTime.getTime() - new Date().getTime();

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("💊 " + t("timeToTake", "Time to take"), {
            body: `${reminder.medicine_name}!`,
            icon: reminder.image_url || "/logo192.png",
          });
        }
      }, delay);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!medicineName.trim() || !reminderTime || !reminderDate) {
        toast.error(t("fillRequiredFields", "Please fill in all required fields"));
        return;
      }

      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        toast.error(t("notificationPermissionRequired", "Please allow notifications to set reminders"));
        return;
      }

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const dateTime = new Date(`${reminderDate}T${reminderTime}`);
      if (dateTime.getTime() < new Date().getTime()) {
        dateTime.setDate(dateTime.getDate() + 1);
      }

      const { data, error } = await supabase
        .from("medicine_reminders")
        .insert([
          {
            user_id: user.id,
            medicine_name: medicineName,
            notes: notes,
            image_url: imageUrl,
            date_time: dateTime.toISOString(),
            time: reminderTime,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setReminders([...reminders, data]);
      scheduleNotification(data);

      setMedicineName("");
      setReminderTime("");
      setReminderDate("");
      setNotes("");
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
      toast.success(t("reminderSet", "Reminder set successfully!"));
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast.error(t("errorSettingReminder", "Error setting reminder"));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReminder = async (id) => {
    try {
      const { error } = await supabase
        .from("medicine_reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReminders(reminders.filter((reminder) => reminder.id !== id));
      toast.success(t("reminderDeleted", "Reminder deleted"));
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error(t("errorDeletingReminder", "Error deleting reminder"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={t("title", "Medicine Reminder")}
        onBack={() => navigate(-1)}
      />

      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          {/* Add Reminder Button */}
          <button
            onClick={() => setShowForm(true)}
            className={`w-full py-3 rounded-xl text-base font-medium flex items-center justify-center space-x-2 ${
              isPro
                ? "bg-emerald-500 text-emerald-900 hover:bg-emerald-600"
                : "bg-green-500 text-white hover:bg-green-600"
            } transition-colors duration-200 mb-6`}
          >
            <FiPlus className="w-5 h-5" />
            <span>{t("addReminder", "Add Medicine Reminder")}</span>
          </button>

          {/* Reminders List */}
          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className={`text-center py-8 rounded-xl ${
                isPro ? "bg-emerald-50" : "bg-green-50"
              }`}>
                <FiBell className={`w-12 h-12 mx-auto mb-3 ${
                  isPro ? "text-emerald-500" : "text-green-500"
                }`} />
                <p className={`text-base ${
                  isPro ? "text-emerald-700" : "text-green-700"
                }`}>
                  {t("noReminders", "No reminders set")}
                </p>
                <p className={`text-sm mt-1 ${
                  isPro ? "text-emerald-600" : "text-green-600"
                }`}>
                  {t("addFirstReminder", "Click the button above to add your first reminder")}
                </p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-xl shadow-sm ${
                    isPro
                      ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {reminder.image_url && (
                      <img
                        src={reminder.image_url}
                        alt={reminder.medicine_name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isPro ? "bg-emerald-100" : "bg-green-100"
                          }`}>
                            <FiClock className={`w-5 h-5 ${
                              isPro ? "text-emerald-600" : "text-green-600"
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              isPro ? "text-emerald-900" : "text-gray-900"
                            }`}>
                              {reminder.medicine_name}
                            </h3>
                            <p className={`text-sm ${
                              isPro ? "text-emerald-700" : "text-gray-600"
                            }`}>
                              {new Date(reminder.date_time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className={`p-2 rounded-lg ${
                            isPro
                              ? "text-emerald-600 hover:bg-emerald-100"
                              : "text-gray-600 hover:bg-gray-100"
                          } transition-colors duration-200`}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {reminder.notes && (
                        <p className={`mt-2 text-sm ${
                          isPro ? "text-emerald-700" : "text-gray-600"
                        }`}>
                          {reminder.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Reminder Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-white rounded-xl w-full max-w-md ${
            isPro ? "border-2 border-emerald-200" : ""
          }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isPro ? "text-emerald-900" : "text-gray-900"
                }`}>
                  {t("addReminder", "Add Medicine Reminder")}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-1 rounded-lg ${
                    isPro
                      ? "text-emerald-600 hover:bg-emerald-100"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition-colors duration-200`}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isPro ? "text-emerald-700" : "text-gray-700"
                  }`}>
                    {t("medicineImage", "Medicine Image")}
                  </label>
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                    isPro ? "border-emerald-200" : "border-gray-300"
                  }`}>
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiImage className={`mx-auto h-12 w-12 ${
                            isPro ? "text-emerald-500" : "text-gray-400"
                          }`} />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image-upload"
                              className={`relative cursor-pointer rounded-md font-medium ${
                                isPro
                                  ? "text-emerald-600 hover:text-emerald-500"
                                  : "text-blue-600 hover:text-blue-500"
                              }`}
                            >
                              <span>{t("uploadImage", "Upload an image")}</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">{t("orDragAndDrop", "or drag and drop")}</p>
                          </div>
                          <p className={`text-xs ${
                            isPro ? "text-emerald-500" : "text-gray-500"
                          }`}>
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medicine Name */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isPro ? "text-emerald-700" : "text-gray-700"
                  }`}>
                    {t("medicineName", "Medicine Name")} *
                  </label>
                  <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder={t("medicineNamePlaceholder", "Enter medicine name")}
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      isPro
                        ? "bg-emerald-50 border-emerald-200 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-200 focus:border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      isPro ? "focus:ring-emerald-400" : "focus:ring-gray-400"
                    }`}
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isPro ? "text-emerald-700" : "text-gray-700"
                    }`}>
                      {t("reminderDate", "Date")} *
                    </label>
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm ${
                        isPro
                          ? "bg-emerald-50 border-emerald-200 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-200 focus:border-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        isPro ? "focus:ring-emerald-400" : "focus:ring-gray-400"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isPro ? "text-emerald-700" : "text-gray-700"
                    }`}>
                      {t("reminderTime", "Time")} *
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm ${
                        isPro
                          ? "bg-emerald-50 border-emerald-200 focus:border-emerald-400"
                          : "bg-gray-50 border-gray-200 focus:border-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        isPro ? "focus:ring-emerald-400" : "focus:ring-gray-400"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isPro ? "text-emerald-700" : "text-gray-700"
                  }`}>
                    {t("notes", "Notes")}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("notesPlaceholder", "Add any additional notes...")}
                    rows="3"
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      isPro
                        ? "bg-emerald-50 border-emerald-200 focus:border-emerald-400"
                        : "bg-gray-50 border-gray-200 focus:border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      isPro ? "focus:ring-emerald-400" : "focus:ring-gray-400"
                    }`}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isPro
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={isLoading}
                  >
                    {t("cancel", "Cancel")}
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isPro
                        ? "bg-emerald-500 text-emerald-900 hover:bg-emerald-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? t("saving", "Saving...") : t("setReminder", "Set Reminder")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineReminder;
