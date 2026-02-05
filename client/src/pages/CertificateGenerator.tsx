import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Eye, Loader2 } from "lucide-react";

export default function CertificateGenerator() {
  const [sessionId, setSessionId] = useState<string>("");
  const [degreeId, setDegreeId] = useState<string>("");
  const [brotherId, setBrotherId] = useState<string>("");
  const [workerId, setWorkerId] = useState<string>("");
  const [powerId, setPowerId] = useState<string>("");
  const [certificateDate, setCertificateDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchInitial, setSearchInitial] = useState<{ [key: string]: string }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch data
  const { data: sessions } = trpc.sessions.list.useQuery();
  const { data: degrees } = trpc.degrees.list.useQuery();
  const { data: brothers } = trpc.brothers.list.useQuery({ initial: searchInitial.brother });
  const { data: workers } = trpc.workers.list.useQuery({ initial: searchInitial.worker });
  const { data: powers } = trpc.powers.list.useQuery({ initial: searchInitial.power });

  const generateMutation = trpc.certificates.generate.useMutation();

  // Get selected items
  const selectedSession = sessions?.find(s => s.id === parseInt(sessionId));
  const selectedDegree = degrees?.find(d => d.id === parseInt(degreeId));
  const selectedBrother = brothers?.find(b => b.id === parseInt(brotherId));
  const selectedWorker = workers?.find(w => w.id === parseInt(workerId));
  const selectedPower = powers?.find(p => p.id === parseInt(powerId));

  const isFormValid = sessionId && degreeId && brotherId && workerId && powerId && certificateDate;

  const handleGenerate = async () => {
    if (!isFormValid || !selectedSession || !selectedDegree || !selectedBrother || !selectedWorker || !selectedPower) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({
        sessionName: selectedSession.name,
        degreeName: selectedDegree.name,
        brotherName: selectedBrother.name,
        brotherEmail: selectedBrother.email || undefined,
        workerName: selectedWorker.name,
        powerName: selectedPower.name,
        certificateDate: new Date(certificateDate),
      });

      toast.success("Certificado gerado com sucesso!");

      // Download PDF
      if (result.pdfUrl) {
        const link = document.createElement("a");
        link.href = result.pdfUrl;
        link.download = result.fileName || "certificado.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Reset form
      setSessionId("");
      setDegreeId("");
      setBrotherId("");
      setWorkerId("");
      setPowerId("");
      setCertificateDate(new Date().toISOString().split("T")[0]);
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar certificado");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Emitir Certificado</h1>
          <p className="text-slate-600 mt-2">Preencha os dados para gerar um novo certificado de presença</p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Dados do Certificado</CardTitle>
            <CardDescription>Selecione as informações necessárias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Session */}
              <div className="space-y-2">
                <Label htmlFor="session" className="text-slate-700 font-medium">
                  Sessão *
                </Label>
                <Select value={sessionId} onValueChange={setSessionId}>
                  <SelectTrigger id="session" className="border-slate-300">
                    <SelectValue placeholder="Selecione a sessão" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <Label htmlFor="degree" className="text-slate-700 font-medium">
                  Grau *
                </Label>
                <Select value={degreeId} onValueChange={setDegreeId}>
                  <SelectTrigger id="degree" className="border-slate-300">
                    <SelectValue placeholder="Selecione o grau" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees?.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brother */}
              <div className="space-y-2">
                <Label htmlFor="brother" className="text-slate-700 font-medium">
                  Nome do Irmão *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Inicial"
                    maxLength={1}
                    value={searchInitial.brother || ""}
                    onChange={e => setSearchInitial({ ...searchInitial, brother: e.target.value.toUpperCase() })}
                    className="w-16 border-slate-300"
                  />
                  <Select value={brotherId} onValueChange={setBrotherId}>
                    <SelectTrigger className="flex-1 border-slate-300">
                      <SelectValue placeholder="Selecione o irmão" />
                    </SelectTrigger>
                    <SelectContent>
                      {brothers?.map(b => (
                        <SelectItem key={b.id} value={b.id.toString()}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Worker */}
              <div className="space-y-2">
                <Label htmlFor="worker" className="text-slate-700 font-medium">
                  Obreiro da Loja *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Inicial"
                    maxLength={1}
                    value={searchInitial.worker || ""}
                    onChange={e => setSearchInitial({ ...searchInitial, worker: e.target.value.toUpperCase() })}
                    className="w-16 border-slate-300"
                  />
                  <Select value={workerId} onValueChange={setWorkerId}>
                    <SelectTrigger className="flex-1 border-slate-300">
                      <SelectValue placeholder="Selecione o obreiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers?.map(w => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Power */}
              <div className="space-y-2">
                <Label htmlFor="power" className="text-slate-700 font-medium">
                  Potência *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Inicial"
                    maxLength={1}
                    value={searchInitial.power || ""}
                    onChange={e => setSearchInitial({ ...searchInitial, power: e.target.value.toUpperCase() })}
                    className="w-16 border-slate-300"
                  />
                  <Select value={powerId} onValueChange={setPowerId}>
                    <SelectTrigger className="flex-1 border-slate-300">
                      <SelectValue placeholder="Selecione a potência" />
                    </SelectTrigger>
                    <SelectContent>
                      {powers?.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-700 font-medium">
                  Data do Certificado *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={certificateDate}
                  onChange={e => setCertificateDate(e.target.value)}
                  className="border-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Gerar e Baixar Certificado
                  </>
                )}
              </Button>
              <Button
                onClick={() => setPreviewOpen(true)}
                disabled={!isFormValid}
                variant="outline"
                className="gap-2 border-slate-300"
              >
                <Eye className="w-4 h-4" />
                Visualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Visualização do Certificado</DialogTitle>
              <DialogDescription>Verifique os dados antes de gerar o PDF final</DialogDescription>
            </DialogHeader>
            {selectedSession && selectedDegree && selectedBrother && selectedWorker && selectedPower && (
              <div className="bg-amber-50 p-8 rounded-lg border-2 border-slate-400 text-center space-y-4 overflow-auto max-h-[60vh]">
                <h2 className="text-xl font-bold text-slate-900">Augusta Respeitável Benfeitora e Excelsa</h2>
                <h3 className="text-2xl font-bold text-slate-900">Loja Simbólica Monte Sinai</h3>
                <p className="text-sm text-slate-700">Rito Adonhiramita - Centro Templário - Or.'. de Porto Alegre, RS</p>
                <p className="text-sm text-slate-700">Fundada em 24 de junho de 1977 - Sessões às segundas-feiras</p>
                <p className="text-sm text-slate-700">Grande Oriente do Rio Grande do Sul - GORGS</p>
                <div className="my-6 p-4 bg-white rounded border border-slate-300">
                  <p className="text-sm leading-relaxed text-slate-800">
                    Certifico que abrilhantou a sessão <strong>{selectedSession.name}</strong> de grau{" "}
                    <strong>{selectedDegree.name}</strong> o Am.'. Ir.'. <strong>{selectedBrother.name.toUpperCase()}</strong>{" "}
                    C.'.I.'.M.'. obreiro da A.'. R .'.L.'. S.'. <strong>{selectedPower.name}</strong> n° do GOB-RS na data{" "}
                    <strong>{new Date(certificateDate).toLocaleDateString("pt-BR")}</strong> da E V .
                  </p>
                </div>
                <div className="flex justify-around pt-8 text-xs text-slate-600">
                  <div>
                    <div className="border-t border-slate-400 w-32 mb-1"></div>
                    Am.'. Ir.'. Venerável Mestre
                  </div>
                  <div>
                    <div className="border-t border-slate-400 w-32 mb-1"></div>
                    Am.'. Ir.'. Orador
                  </div>
                  <div>
                    <div className="border-t border-slate-400 w-32 mb-1"></div>
                    Am.'. Ir.'. Chanceler
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
