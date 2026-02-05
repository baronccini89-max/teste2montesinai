import { FileText, History, Settings } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Loja Simbólica Monte Sinai
          </h1>
          <p className="text-lg text-amber-700">
            Sistema de Emissão de Certificados de Presença
          </p>
          <p className="text-sm text-amber-600 mt-2">
            Rito Adonhiramita - Grande Oriente do Rio Grande do Sul
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Emitir Certificado */}
          <button
            onClick={() => onNavigate('certificate')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-amber-100 hover:border-amber-300"
          >
            <FileText className="w-12 h-12 text-amber-600 mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Emitir Certificado
            </h2>
            <p className="text-gray-600">
              Crie um novo certificado de presença para um irmão
            </p>
          </button>

          {/* Histórico */}
          <button
            onClick={() => onNavigate('history')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-amber-100 hover:border-amber-300"
          >
            <History className="w-12 h-12 text-amber-600 mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Histórico
            </h2>
            <p className="text-gray-600">
              Visualize e gerencie certificados emitidos
            </p>
          </button>
        </div>

        {/* Secondary Card */}
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <button
            onClick={() => onNavigate('data')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-amber-100 hover:border-amber-300"
          >
            <Settings className="w-12 h-12 text-amber-600 mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Gerenciar Dados
            </h2>
            <p className="text-gray-600">
              Cadastre e gerencie sessões, graus, irmãos, obreiros e potências
            </p>
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-amber-100">
          <h3 className="text-xl font-bold text-amber-900 mb-4">
            Sobre o Sistema
          </h3>
          <p className="text-gray-700 mb-4">
            Sistema de gerenciamento e emissão de certificados de presença para a Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Funcionalidades principais:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Emissão de certificados em PDF com layout personalizado</li>
            <li>Cadastro e gerenciamento de dados reutilizáveis</li>
            <li>Histórico completo de certificados emitidos</li>
            <li>Dados salvos localmente no seu navegador</li>
            <li>Sem necessidade de login ou conexão com servidor</li>
          </ul>
          <p className="text-sm text-amber-600 mt-4">
            💾 Todos os seus dados são salvos localmente no navegador
          </p>
        </div>
      </div>
    </div>
  );
}
