import { useState } from 'react';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { Certificate } from '../types';
import { generateCertificatePDF } from '../utils/certificatePdf';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CertificateHistoryProps {
  onBack: () => void;
}

export function CertificateHistory({ onBack }: CertificateHistoryProps) {
  const [certificates, setCertificates] = useLocalStorage<Certificate[]>('certificates', []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCertificates = certificates.filter(cert =>
    cert.brotherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.degreeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (cert: Certificate) => {
    const pdfUrl = generateCertificatePDF(
      cert.sessionName,
      cert.degreeName,
      cert.brotherName,
      cert.workerName,
      cert.powerName,
      cert.certificateDate
    );

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `certificado_${cert.brotherName.replace(/\s+/g, '_')}_${cert.id}.pdf`;
    link.click();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este certificado?')) {
      setCertificates(certificates.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold text-amber-900 mb-8">
          Histórico de Certificados
        </h1>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-100 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome do irmão, sessão ou grau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Table */}
        {filteredCertificates.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">Irmão</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">Sessão</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">Grau</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">Data</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert, idx) => (
                    <tr key={cert.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.brotherName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.sessionName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.degreeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(cert.certificateDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(cert)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Baixar
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 border-2 border-amber-100 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Nenhum certificado encontrado' : 'Nenhum certificado emitido ainda'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
