// hooks/useCourse.js
import { useState, useEffect, useCallback } from "react";

export function useCourse() {
  // 1) Lazy read from localStorage on first mount
  const [courseId, setCourseId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("courseId"));
    } catch {
      return null;
    }
  });

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [error, setError] = useState(null);

  // 2) Persist courseId whenever it changes
  useEffect(() => {
    if (courseId != null) {
      localStorage.setItem("courseId", JSON.stringify(courseId));
    } else {
      localStorage.removeItem("courseId");
    }
  }, [courseId]);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_BASE_URL;
      const res = await fetch(`${apiUrl}/course/3`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Fetch failed");
      setCourse(json.value);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // 3) Fetch on mount & whenever courseId changes
  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    selectCourse: (id) => setCourseId(id),
    refetch: fetchCourse,
  };
}
