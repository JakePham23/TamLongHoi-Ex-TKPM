// Utils for CourseTable:  sort and map data

export function sortCourses(courses, sortOrder) {
  return [...courses].sort((a, b) => {
    const valA = a.courseName?.toLowerCase() || "";
    const valB = b.courseName?.toLowerCase() || "";
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
}

export function mapCoursesToTableData(courses, departments, t) {
  return courses.map((course, index) => {
    const deptId = course.department?._id || course.department;
    const dept = departments.find(d => d._id === deptId);
    return {
      ...course,
      stt: index + 1,
      courseNameTranslated: t(`course_list.${course.courseId}.name`, course.courseName),
      departmentName: dept
        ? t(`department_list.${dept._id}.name`, { ns: 'department', defaultValue: dept.departmentName })
        : t('error.not determined'),
      prerequisite: course.prerequisite || t('error.not available'),
    };
  });
}
