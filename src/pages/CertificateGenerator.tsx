import { useState } from 'react';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { Certificate, Session, Degree, Brother, Worker, Power } from '../types';
import { generateCertificatePDF } from '../utils/certificatePdf';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CertificateGeneratorProps {
  onBack: () => void;
}

export function CertificateGenerator({ onBack }: CertificateGeneratorProps) {
  const [sessions] = useLocalStorage<Session[]>('sessions', []);
  const [degrees] = useLocalStorage<Degree[]>('degrees', []);
  const [brothers] = useLocalStorage<Brother[]>('brothers', []);
  const [workers] = useLocalStorage<Worker[]>('workers', []);
  const [powers] = useLocalStorage<Power[]>('powers', []);
  const [, setCertificates] = useLocalStorage<Certificate[]>('certificates', []) as [Certificate[], (value: Certificate[] | ((prev: Certificate[]) => Certificate[])) => void];

  const [formData, setFormData] = useState({
    sessionId: '',
    degreeId: '',
    brotherId: '',
    workerId: '',
    powerId: '',
    certificateDate: new Date().toISOString().split('T')[0],
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const selectedSession = sessions.find(s => s.id === formData.sessionId);
  const selectedDegree = degrees.find(d => d.id === formData.degreeId);
  const selectedBrother = brothers.find(b => b.id === formData.brotherId);
  const selectedWorker = workers.find(w => w.id === formData.workerId);
  const selectedPower = powers.find(p => p.id === formData.powerId);

  const handlePreview = () => {
    if (!selectedSession || !selectedDegree || !selectedBrother || !selectedWorker || !selectedPower) {
      alert('Preencha todos os campos');
      return;
    }

    const pdfUrl = generateCertificatePDF(
      selectedSession.name,
      selectedDegree.name,
      selectedBrother.name,
      selectedWorker.name,
      selectedPower.name,
      formData.certificateDate
    );

    setPreviewUrl(pdfUrl);
    setShowPreview(true);
  };

  const handleGenerate = () => {
    if (!selectedSession || !selectedDegree || !selectedBrother || !selectedWorker || !selectedPower) {
      alert('Preencha todos os campos');
      return;
    }

    const pdfUrl = generateCertificatePDF(
      selectedSession.name,
      selectedDegree.name,
      selectedBrother.name,
      selectedWorker.name,
      selectedPower.name,
      formData.certificateDate
    );

    // Salvar no histórico
    const newCertificate: Certificate = {
      id: Date.now().toString(),
      sessionName: selectedSession.name,
      degreeName: selectedDegree.name,
      brotherName: selectedBrother.name,
      brotherEmail: selectedBrother.email,
      workerName: selectedWorker.name,
      powerName: selectedPower.name,
      certificateDate: formData.certificateDate,
      createdAt: new Date().toISOString(),
    };

    setCertificates((prev: Certificate[]) => [...prev, newCertificate]);

    // Download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `certificado_${selectedBrother.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    link.click();

    alert('Certificado gerado e salvo com sucesso!');
    setFormData({
      sessionId: '',
      degreeId: '',
      brotherId: '',
      workerId: '',
      powerId: '',
      certificateDate: new Date().toISOString().split('T')[0],
    });
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
          Emitir Certificado
        </h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-amber-100 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sessão */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Sessão *
              </label>
              <select
                value={formData.sessionId}
                onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione uma sessão</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Grau */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Grau *
              </label>
              <select
                value={formData.degreeId}
                onChange={(e) => setFormData({ ...formData, degreeId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione um grau</option>
                {degrees.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Irmão */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Irmão *
              </label>
              <select
                value={formData.brotherId}
                onChange={(e) => setFormData({ ...formData, brotherId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione um irmão</option>
                {brothers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Obreiro */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Obreiro *
              </label>
              <select
                value={formData.workerId}
                onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione um obreiro</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Potência */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Potência *
              </label>
              <select
                value={formData.powerId}
                onChange={(e) => setFormData({ ...formData, powerId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione uma potência</option>
                {powers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Data do Certificado *
              </label>
              <input
                type="date"
                value={formData.certificateDate}
                onChange={(e) => setFormData({ ...formData, certificateDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Visualizar
            </button>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              Gerar e Baixar
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && previewUrl && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-amber-100">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Visualização</h2>
            <iframe
              src={previewUrl}
              className="w-full h-96 border-2 border-amber-200 rounded-lg"
              title="Visualização do Certificado"
            />
          </div>
        )}
      </div>
    </div>
  );
}
