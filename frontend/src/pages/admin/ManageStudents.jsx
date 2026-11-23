import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { Users, Search, Trash2, Mail, GraduationCap, Phone } from 'lucide-react';

const ManageStudents = () => {
  const { showToast } = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.users.getStudents();
      if (res.success) setStudents(res.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.users.deleteStudent(deleteTarget.id);
      if (res.success) {
        showToast(`Student ${deleteTarget.fullName} removed from portal.`, 'success');
        setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
      }
    } catch (e) {
      showToast('Failed to remove student', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.fullName && s.fullName.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Manage Student Directory</h1>
          <p className="welcome-subtitle">
            View registered students, academic departments, roll numbers, and manage user records.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search students by name, email, roll number, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="70px" />
      ) : filteredStudents.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No students found"
            message="No registered student records match your search."
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID / Roll</th>
                <th>College Email</th>
                <th>Department</th>
                <th>Year / Semester</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                        {s.fullName?.charAt(0) || 'S'}
                      </div>
                      <span style={{ fontWeight: 600 }}>{s.fullName}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {s.studentId || 'N/A'}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {s.email}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{s.department}</td>
                  <td style={{ fontSize: '0.85rem' }}>{s.yearSemester || '3rd Year'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {s.phone || 'N/A'}
                  </td>
                  <td>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--status-rejected)' }}
                      title="Remove Student Record"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteStudent}
          title="Remove Student Account"
          message={`Are you sure you want to remove ${deleteTarget.fullName} (${deleteTarget.studentId}) from CampusConnect? This will delete the student profile.`}
          confirmText="Yes, Remove Student"
        />
      )}
    </div>
  );
};

export default ManageStudents;

