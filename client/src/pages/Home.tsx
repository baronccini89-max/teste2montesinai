import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, Users, History } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, isAdmin } = useAuth();

  const quickActions = [
    {
      title: "Emitir Certificado",
      description: "Criar um novo certificado de presença",
      icon: FileText,
      href: "/emitir",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Histórico",
      description: "Ver certificados emitidos",
      icon: History,
      href: "/historico",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Gerenciar Dados",
      description: "Cadastrar sessões, graus, irmãos, etc",
      icon: Database,
      href: "/dados",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (isAdmin) {
    quickActions.push({
      title: "Usuários",
      description: "Gerenciar usuários do sistema",
      icon: Users,
      href: "/usuarios",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-slate-600 mt-2">
            Sistema de Emissão de Certificados - Loja Monte Sinai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <a>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-3`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <CardTitle className="text-xl">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
            <CardDescription>
              Sistema de gerenciamento e emissão de certificados de presença
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Este sistema permite a emissão de certificados de presença para a
              Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai.
            </p>
            <p>
              <strong>Funcionalidades principais:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Emissão de certificados em PDF com layout personalizado</li>
              <li>Cadastro e gerenciamento de sessões, graus, irmãos, obreiros e potências</li>
              <li>Histórico completo de certificados emitidos</li>
              <li>Busca rápida por inicial para facilitar a seleção de dados</li>
              {isAdmin && <li>Gestão de usuários e permissões (administradores)</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
