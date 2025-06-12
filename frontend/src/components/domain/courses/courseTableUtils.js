// Utils for CourseTable: filter, sort, and map data
import removeVietnameseTones from "../../../utils/string.util.js";

export function filterCourses(courses, searchTerm) {
  const cleanSearch = removeVietnameseTones((searchTerm || "").toLowerCase().trim());
  console.log("Clean search term:", cleanSearch);

  return courses.filter((c) => {
    const rawCourseId = c.courseId || "";
    const rawCourseName = c.courseName || "";
    const rawDepartment = c.department?.departmentName || "";

    const courseNameSearchable = removeVietnameseTones(rawCourseName.toLowerCase());
    const courseIdSearchable = removeVietnameseTones(rawCourseId.toLowerCase());
    const departmentSearchable = removeVietnameseTones(rawDepartment.toLowerCase());

    const matched = courseNameSearchable.includes(cleanSearch) ||
      courseIdSearchable.includes(cleanSearch) ||
      departmentSearchable.includes(cleanSearch);

    if (cleanSearch && matched) {
      console.log("✅ MATCH:", rawCourseName, "→", courseNameSearchable);
    }

    return matched;
  });
}



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
