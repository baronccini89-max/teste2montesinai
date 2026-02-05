import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Mail, FileText, Search } from "lucide-react";

export default function CertificateHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const { data: certificates, isLoading } = trpc.certificates.list.useQuery();
  const sendEmailMutation = trpc.certificates.sendEmail.useMutation();

  const filteredCertificates = certificates?.filter(cert => 
    cert.brotherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.degreeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEmailDialog = (certificate: any) => {
    setSelectedCertificate(certificate);
    setRecipientEmail(certificate.brotherEmail || "");
    setEmailMessage(`Prezado Irmão ${certificate.brotherName},\n\nSegue em anexo o certificado de presença referente à sessão ${certificate.sessionName} de grau ${certificate.degreeName}, realizada em ${new Date(certificate.certificateDate).toLocaleDateString("pt-BR")}.\n\nFraternal abraço,\nLoja Monte Sinai`);
    setEmailDialogOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail) {
      toast.error("Informe o e-mail do destinatário");
      return;
    }

    if (!selectedCertificate) {
      toast.error("Nenhum certificado selecionado");
      return;
    }

    try {
      await sendEmailMutation.mutateAsync({
        certificateId: selectedCertificate.id,
        recipientEmail,
        message: emailMessage,
      });
      toast.success("E-mail enviado com sucesso!");
      setEmailDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Funcionalidade de envio de e-mail em desenvolvimento");
    }
  };

  const handleDownload = (pdfUrl: string, brotherName: string) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `certificado-${brotherName.replace(/\s+/g, "-")}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Histórico de Certificados</h1>
          <p className="text-slate-600 mt-2">Visualize e gerencie certificados emitidos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Certificados</CardTitle>
            <CardDescription>
              Pesquise por nome do irmão, sessão ou grau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar certificados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificados Emitidos</CardTitle>
            <CardDescription>
              {filteredCertificates?.length || 0} certificado(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-slate-500 py-8">Carregando...</p>
            ) : filteredCertificates && filteredCertificates.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Irmão</TableHead>
                      <TableHead>Sessão</TableHead>
                      <TableHead>Grau</TableHead>
                      <TableHead>Potência</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>E-mail Enviado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium">{cert.brotherName}</TableCell>
                        <TableCell>{cert.sessionName}</TableCell>
                        <TableCell>{cert.degreeName}</TableCell>
                        <TableCell>{cert.powerName}</TableCell>
                        <TableCell>
                          {new Date(cert.certificateDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {cert.emailSent ? (
                            <Badge variant="default" className="bg-green-600">
                              Sim
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Não</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cert.pdfUrl && handleDownload(cert.pdfUrl, cert.brotherName)}
                              className="gap-2"
                              disabled={!cert.pdfUrl}
                            >
                              <Download className="h-3 w-3" />
                              Baixar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEmailDialog(cert)}
                              className="gap-2"
                            >
                              <Mail className="h-3 w-3" />
                              Enviar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  {searchTerm ? "Nenhum certificado encontrado com os critérios de busca" : "Nenhum certificado emitido ainda"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Dialog */}
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Certificado por E-mail</DialogTitle>
              <DialogDescription>
                Preencha os dados para enviar o certificado
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">E-mail do Destinatário *</Label>
                <Input
                  id="recipient"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="irmao@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <textarea
                  id="message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full min-h-[150px] p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Mensagem personalizada (opcional)"
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Certificado:</strong> {selectedCertificate?.brotherName} - {selectedCertificate?.sessionName}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <strong>Data:</strong> {selectedCertificate?.certificateDate && new Date(selectedCertificate.certificateDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Enviar E-mail
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmailDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
