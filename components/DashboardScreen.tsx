import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { CHALLENGE_DATA } from '../constants';

interface StudentData {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  currentDay: number;
  completedDays: boolean[];
  lastLogin?: any;
}

const DashboardScreen: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userProgress"));
        const studentsData: StudentData[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Normalizar o array de dias completados para ter certeza que tem 7 posições
          let completedDays = data.completedDays || [];
          if (completedDays.length < CHALLENGE_DATA.length) {
             completedDays = [...completedDays, ...Array(CHALLENGE_DATA.length - completedDays.length).fill(false)];
          }

          studentsData.push({
            id: doc.id,
            email: data.email || 'Email não registrado',
            phone: data.phone || '-', // Campo placeholder pois não é coletado no login atual
            name: data.email ? data.email.split('@')[0] : 'Usuário',
            currentDay: data.currentDay || 1,
            completedDays: completedDays,
            lastLogin: data.lastLogin
          });
        });

        setStudents(studentsData);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-text">
        <p className="font-serif text-xl animate-pulse">Carregando dados dos alunos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center border-b border-brand-text/20 pb-6">
            <div>
                <h1 className="font-serif text-4xl mb-2">Dashboard de Alunos</h1>
                <p className="opacity-70">Acompanhamento do Desafio dos 7 Dias</p>
            </div>
            <div className="mt-4 md:mt-0 bg-white px-6 py-3 rounded-full shadow-sm">
                <span className="font-bold text-2xl">{students.length}</span> <span className="text-sm uppercase tracking-wider">Alunos Inscritos</span>
            </div>
        </header>

        <div className="grid gap-6">
          {students.map((student) => {
             const completedCount = student.completedDays.filter(Boolean).length;
             
             return (
              <div key={student.id} className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-[1.01] duration-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Informações do Aluno */}
                  <div className="w-full lg:w-1/3">
                    <h3 className="font-serif text-xl capitalize font-bold text-brand-text">
                        {student.name}
                    </h3>
                    <div className="text-sm opacity-70 mt-1 space-y-1">
                        <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            {student.email}
                        </p>
                        <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            {student.phone}
                        </p>
                    </div>
                  </div>

                  {/* Gráfico Criativo de Progresso */}
                  <div className="w-full lg:w-2/3 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold tracking-widest uppercase text-brand-text/60">Jornada</span>
                        <span className="text-xs font-bold bg-brand-green px-2 py-1 rounded text-brand-text">
                            {completedCount} / {CHALLENGE_DATA.length} DIAS
                        </span>
                    </div>
                    
                    {/* Visualização da Timeline */}
                    <div className="relative pt-4 pb-2">
                        {/* Linha de fundo */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-bg -translate-y-1/2 rounded-full z-0"></div>
                        
                        {/* Linha de progresso preenchida */}
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-brand-text -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                            style={{ width: `${(completedCount / (CHALLENGE_DATA.length - 1)) * 100}%` }}
                        ></div>

                        {/* Pontos dos dias */}
                        <div className="relative z-10 flex justify-between w-full">
                            {CHALLENGE_DATA.map((day, index) => {
                                const isCompleted = student.completedDays[index];
                                const isCurrent = (index + 1) === student.currentDay;
                                
                                return (
                                    <div key={day.day} className="flex flex-col items-center group cursor-default">
                                        <div 
                                            className={`
                                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                                ${isCompleted 
                                                    ? 'bg-brand-text border-brand-text text-white' 
                                                    : isCurrent
                                                        ? 'bg-white border-brand-text text-brand-text shadow-[0_0_0_4px_rgba(58,79,77,0.2)] scale-110'
                                                        : 'bg-white border-brand-bg text-gray-300'
                                                }
                                            `}
                                            title={`Dia ${day.day}: ${day.title}`}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            ) : (
                                                <span className="text-xs font-bold">{day.day}</span>
                                            )}
                                        </div>
                                        {/* Tooltip simples no hover */}
                                        <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-brand-text text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                            {day.title.substring(0, 15)}...
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                  </div>

                </div>
              </div>
             );
          })}
        </div>
        
        {students.length === 0 && (
            <div className="text-center py-20 opacity-60">
                <p>Nenhum aluno encontrado.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;