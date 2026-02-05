import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Session, Degree, Brother, Worker, Power } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DataManagementProps {
  onBack: () => void;
}

export function DataManagement({ onBack }: DataManagementProps) {
  const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', []);
  const [degrees, setDegrees] = useLocalStorage<Degree[]>('degrees', []);
  const [brothers, setBrothers] = useLocalStorage<Brother[]>('brothers', []);
  const [workers, setWorkers] = useLocalStorage<Worker[]>('workers', []);
  const [powers, setPowers] = useLocalStorage<Power[]>('powers', []);

  const [activeTab, setActiveTab] = useState<'sessions' | 'degrees' | 'brothers' | 'workers' | 'powers'>('sessions');
  const [newItem, setNewItem] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleAddSession = () => {
    if (newItem.trim()) {
      setSessions([...sessions, { id: Date.now().toString(), name: newItem }]);
      setNewItem('');
    }
  };

  const handleAddDegree = () => {
    if (newItem.trim()) {
      setDegrees([...degrees, { id: Date.now().toString(), name: newItem }]);
      setNewItem('');
    }
  };

  const handleAddBrother = () => {
    if (newItem.trim()) {
      setBrothers([...brothers, { id: Date.now().toString(), name: newItem, email: newEmail }]);
      setNewItem('');
      setNewEmail('');
    }
  };

  const handleAddWorker = () => {
    if (newItem.trim()) {
      setWorkers([...workers, { id: Date.now().toString(), name: newItem }]);
      setNewItem('');
    }
  };

  const handleAddPower = () => {
    if (newItem.trim()) {
      setPowers([...powers, { id: Date.now().toString(), name: newItem }]);
      setNewItem('');
    }
  };

  const handleDelete = (type: string, id: string) => {
    if (confirm('Tem certeza que deseja deletar?')) {
      switch (type) {
        case 'sessions':
          setSessions(sessions.filter(s => s.id !== id));
          break;
        case 'degrees':
          setDegrees(degrees.filter(d => d.id !== id));
          break;
        case 'brothers':
          setBrothers(brothers.filter(b => b.id !== id));
          break;
        case 'workers':
          setWorkers(workers.filter(w => w.id !== id));
          break;
        case 'powers':
          setPowers(powers.filter(p => p.id !== id));
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold text-amber-900 mb-8">
          Gerenciar Dados
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['sessions', 'degrees', 'brothers', 'workers', 'powers'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-900 border-2 border-amber-200 hover:border-amber-400'
              }`}
            >
              {tab === 'sessions' && 'Sessões'}
              {tab === 'degrees' && 'Graus'}
              {tab === 'brothers' && 'Irmãos'}
              {tab === 'workers' && 'Obreiros'}
              {tab === 'powers' && 'Potências'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-amber-100">
          {/* Add Form */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Adicionar Novo</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nome"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (activeTab === 'sessions') handleAddSession();
                    else if (activeTab === 'degrees') handleAddDegree();
                    else if (activeTab === 'brothers') handleAddBrother();
                    else if (activeTab === 'workers') handleAddWorker();
                    else if (activeTab === 'powers') handleAddPower();
                  }
                }}
                className="flex-1 px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
              {activeTab === 'brothers' && (
                <input
                  type="email"
                  placeholder="E-mail (opcional)"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              )}
              <button
                onClick={() => {
                  if (activeTab === 'sessions') handleAddSession();
                  else if (activeTab === 'degrees') handleAddDegree();
                  else if (activeTab === 'brothers') handleAddBrother();
                  else if (activeTab === 'workers') handleAddWorker();
                  else if (activeTab === 'powers') handleAddPower();
                }}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>

          {/* List */}
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-4">
              {activeTab === 'sessions' && `Sessões (${sessions.length})`}
              {activeTab === 'degrees' && `Graus (${degrees.length})`}
              {activeTab === 'brothers' && `Irmãos (${brothers.length})`}
              {activeTab === 'workers' && `Obreiros (${workers.length})`}
              {activeTab === 'powers' && `Potências (${powers.length})`}
            </h2>

            {activeTab === 'sessions' && (
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <p className="text-gray-500">Nenhuma sessão cadastrada</p>
                ) : (
                  sessions.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-gray-700">{s.name}</span>
                      <button
                        onClick={() => handleDelete('sessions', s.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'degrees' && (
              <div className="space-y-2">
                {degrees.length === 0 ? (
                  <p className="text-gray-500">Nenhum grau cadastrado</p>
                ) : (
                  degrees.map(d => (
                    <div key={d.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-gray-700">{d.name}</span>
                      <button
                        onClick={() => handleDelete('degrees', d.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'brothers' && (
              <div className="space-y-2">
                {brothers.length === 0 ? (
                  <p className="text-gray-500">Nenhum irmão cadastrado</p>
                ) : (
                  brothers.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div>
                        <div className="text-gray-700 font-semibold">{b.name}</div>
                        {b.email && <div className="text-sm text-gray-500">{b.email}</div>}
                      </div>
                      <button
                        onClick={() => handleDelete('brothers', b.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'workers' && (
              <div className="space-y-2">
                {workers.length === 0 ? (
                  <p className="text-gray-500">Nenhum obreiro cadastrado</p>
                ) : (
                  workers.map(w => (
                    <div key={w.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-gray-700">{w.name}</span>
                      <button
                        onClick={() => handleDelete('workers', w.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'powers' && (
              <div className="space-y-2">
                {powers.length === 0 ? (
                  <p className="text-gray-500">Nenhuma potência cadastrada</p>
                ) : (
                  powers.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-gray-700">{p.name}</span>
                      <button
                        onClick={() => handleDelete('powers', p.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
