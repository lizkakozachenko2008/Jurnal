import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function GradeCharts() {
  const { subject, groupName } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const { data } = await api.get(`/api/teacher/journal/${encodeURIComponent(subject)}/${encodeURIComponent(groupName)}`);
        setJournal(data.data);
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, [subject, groupName]);

  const normDate = (d) => {
    if (!d) return '';
    return typeof d === 'string' ? d.split('T')[0] : new Date(d).toISOString().split('T')[0];
  };

  // Экспорт CSV
  const exportCSV = () => {
    if (!journal) return;
    const { students, grades, lessonDates } = journal;
    const activeStudents = students.filter(s => s.is_active);

    let csv = 'Студент,' + lessonDates.map(ld => {
      const d = new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      return `"${d} (${ld.topic || ld.lesson_type})"`;
    }).join(',') + ',Средний\n';

    activeStudents.forEach(student => {
      const row = [student.full_name];
      lessonDates.forEach(ld => {
        const grade = grades.find(g => g.student_email === student.email && normDate(g.date) === normDate(ld.lesson_date));
        row.push(grade ? grade.grade : '');
      });
      const studentGrades = grades.filter(g => g.student_email === student.email);
      const avg = studentGrades.length ? (studentGrades.reduce((s, g) => s + g.grade, 0) / studentGrades.length).toFixed(1) : '';
      row.push(avg);
      csv += row.join(',') + '\n';
    });

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Журнал_${subject}_${groupName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Экспорт Excel (XML Spreadsheet)
  const exportExcel = () => {
    if (!journal) return;
    const { students, grades, lessonDates } = journal;
    const activeStudents = students.filter(s => s.is_active);

    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#4F46E5" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF"/></Style>
    <Style ss:ID="name"><Font ss:Bold="1"/></Style>
  </Styles>
  <Worksheet ss:Name="Журнал">
    <Table>
      <Row>
        <Cell ss:StyleID="header"><Data ss:Type="String">Студент</Data></Cell>`;

    lessonDates.forEach(ld => {
      const d = new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      xml += `<Cell ss:StyleID="header"><Data ss:Type="String">${d}</Data></Cell>`;
    });
    xml += `<Cell ss:StyleID="header"><Data ss:Type="String">Средний</Data></Cell></Row>`;

    activeStudents.forEach(student => {
      xml += `<Row><Cell ss:StyleID="name"><Data ss:Type="String">${student.full_name}</Data></Cell>`;
      lessonDates.forEach(ld => {
        const grade = grades.find(g => g.student_email === student.email && normDate(g.date) === normDate(ld.lesson_date));
        xml += `<Cell><Data ss:Type="String">${grade ? grade.grade : ''}</Data></Cell>`;
      });
      const studentGrades = grades.filter(g => g.student_email === student.email);
      const avg = studentGrades.length ? (studentGrades.reduce((s, g) => s + g.grade, 0) / studentGrades.length).toFixed(1) : '';
      xml += `<Cell><Data ss:Type="String">${avg}</Data></Cell></Row>`;
    });

    xml += `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Журнал_${subject}_${groupName}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>;
  }

  if (!journal) return null;

  const { students, grades, lessonDates } = journal;

  // Только активные студенты
  const activeStudents = students.filter(s => s.is_active);

  // Средний балл только по активным
  const studentAverages = activeStudents.map(student => {
    const sg = grades.filter(g => g.student_email === student.email);
    const avg = sg.length ? sg.reduce((s, g) => s + g.grade, 0) / sg.length : 0;
    return { name: student.full_name, avg: avg.toFixed(1) };
  }).sort((a, b) => b.avg - a.avg);

  const maxAvg = Math.max(...studentAverages.map(s => parseFloat(s.avg)), 10);

  const dateAverages = lessonDates.map(ld => {
    const dateGrades = grades.filter(g => g.date === ld.lesson_date);
    const avg = dateGrades.length ? dateGrades.reduce((s, g) => s + g.grade, 0) / dateGrades.length : 0;
    return { date: new Date(ld.lesson_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }), avg: avg.toFixed(1) };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <Link to={`/teacher/journal/${encodeURIComponent(subject)}/${encodeURIComponent(groupName)}`} className="btn-ghost mb-2 text-sm">
            ← Назад к журналу
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Графики: {subject}</h1>
          <p className="text-slate-500">Группа: {groupName}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportCSV} className="btn-ghost flex items-center gap-2">
            📄 CSV
          </button>
          <button onClick={exportExcel} className="btn-ghost flex items-center gap-2">
            📊 Excel
          </button>
        </div>
      </div>

      {/* График: Средний балл по студентам */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Средний балл студентов</h2>
        <div className="space-y-3">
          {studentAverages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 text-sm text-slate-700 truncate flex-shrink-0" title={s.name}>{s.name}</div>
              <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all flex items-center justify-end pr-2 ${
                    s.avg >= 9 ? 'bg-emerald-500' : s.avg >= 7 ? 'bg-blue-500' : s.avg >= 4 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max((s.avg / maxAvg) * 100, 8)}%` }}
                >
                  <span className="text-white text-xs font-bold">{s.avg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* График: Динамика по датам */}
      {dateAverages.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Динамика среднего балла по занятиям</h2>
          <div className="flex items-end gap-2 h-48 border-b border-l border-slate-200 p-2">
            {dateAverages.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs text-slate-600 mb-1">{d.avg}</span>
                <div
                  className="w-full bg-indigo-500 rounded-t-md transition-all"
                  style={{ height: `${Math.max((d.avg / 10) * 100, 5)}%` }}
                />
                <span className="text-[10px] text-slate-400 mt-1 text-center">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-emerald-600">
            {studentAverages.length > 0 ? studentAverages[0].avg : '—'}
          </div>
          <div className="text-sm text-slate-500 mt-1">Лучший средний балл</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-amber-600">
            {studentAverages.filter(s => parseFloat(s.avg) < 4).length}
          </div>
          <div className="text-sm text-slate-500 mt-1">С баллом ниже 4</div>
        </div>
      </div>
    </div>
  );
}
