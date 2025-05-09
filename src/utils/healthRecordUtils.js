// Utility functions for health record logic
const prepareRecordToSave = (user, recordData, fileUrl, filePublicId) => ({
  user_id: user.id,
  name: recordData.name,
  type: recordData.type,
  record_date: recordData.date || null,
  description: recordData.description || null,
  notes: recordData.notes || null,
  image_url: fileUrl,
  file_public_id: filePublicId,
});

export default prepareRecordToSave;