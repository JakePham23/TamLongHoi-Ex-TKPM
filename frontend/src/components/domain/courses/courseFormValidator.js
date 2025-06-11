export function validateCourseForm(formData, t) {
  const newErrors = {};

  if (!formData.courseId.trim()) {
    newErrors.courseId = t('course id blank');
  }
  if (!formData.courseName.trim()) {
    newErrors.courseName = t('course name blank');
  }
  if (!formData.credit || formData.credit < 2) {
    newErrors.credit = t('credits greater than 1');
  }
  if (formData.practicalSession === "" || formData.practicalSession < 0) {
    newErrors.practicalSession = t('number of practical sessions must be greater than or equal to 0');
  }
  if (formData.theoreticalSession === "" || formData.theoreticalSession < 0) {
    newErrors.theoreticalSession = t('number of theoretical sessions must be greater than or equal to 0');
  }
  if (!formData.departmentId) {
    newErrors.departmentId = t('please select department');
  }

  return newErrors;
}