import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type TabType = "sessions" | "degrees" | "brothers" | "workers" | "powers";

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("sessions");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });

  // Queries
  const { data: sessions } = trpc.sessions.list.useQuery();
  const { data: degrees } = trpc.degrees.list.useQuery();
  const { data: brothers } = trpc.brothers.list.useQuery();
  const { data: workers } = trpc.workers.list.useQuery();
  const { data: powers } = trpc.powers.list.useQuery();

  // Mutations
  const createSessionMutation = trpc.sessions.create.useMutation();
  const updateSessionMutation = trpc.sessions.update.useMutation();
  const deleteSessionMutation = trpc.sessions.delete.useMutation();

  const createDegreeMutation = trpc.degrees.create.useMutation();
  const updateDegreeMutation = trpc.degrees.update.useMutation();
  const deleteDegreeMutation = trpc.degrees.delete.useMutation();

  const createBrotherMutation = trpc.brothers.create.useMutation();
  const updateBrotherMutation = trpc.brothers.update.useMutation();
  const deleteBrotherMutation = trpc.brothers.delete.useMutation();

  const createWorkerMutation = trpc.workers.create.useMutation();
  const updateWorkerMutation = trpc.workers.update.useMutation();
  const deleteWorkerMutation = trpc.workers.delete.useMutation();

  const createPowerMutation = trpc.powers.create.useMutation();
  const updatePowerMutation = trpc.powers.update.useMutation();
  const deletePowerMutation = trpc.powers.delete.useMutation();

  const utils = trpc.useUtils();

  const openDialog = (id?: number, name?: string, email?: string, description?: string) => {
    setEditingId(id || null);
    setFormData({ name: name || "", email: email || "", description: description || "" });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("O nome é obrigatório");
      return;
    }

    try {
      if (activeTab === "sessions") {
        if (editingId) {
          await updateSessionMutation.mutateAsync({ id: editingId, name: formData.name, description: formData.description });
        } else {
          await createSessionMutation.mutateAsync({ name: formData.name, description: formData.description });
        }
        await utils.sessions.list.invalidate();
      } else if (activeTab === "degrees") {
        if (editingId) {
          await updateDegreeMutation.mutateAsync({ id: editingId, name: formData.name, description: formData.description });
        } else {
          await createDegreeMutation.mutateAsync({ name: formData.name, description: formData.description });
        }
        await utils.degrees.list.invalidate();
      } else if (activeTab === "brothers") {
        if (editingId) {
          await updateBrotherMutation.mutateAsync({ id: editingId, name: formData.name, email: formData.email || undefined });
        } else {
          await createBrotherMutation.mutateAsync({ name: formData.name, email: formData.email || undefined });
        }
        await utils.brothers.list.invalidate();
      } else if (activeTab === "workers") {
        if (editingId) {
          await updateWorkerMutation.mutateAsync({ id: editingId, name: formData.name });
        } else {
          await createWorkerMutation.mutateAsync({ name: formData.name });
        }
        await utils.workers.list.invalidate();
      } else if (activeTab === "powers") {
        if (editingId) {
          await updatePowerMutation.mutateAsync({ id: editingId, name: formData.name });
        } else {
          await createPowerMutation.mutateAsync({ name: formData.name });
        }
        await utils.powers.list.invalidate();
      }

      toast.success(editingId ? "Atualizado com sucesso!" : "Criado com sucesso!");
      closeDialog();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (activeTab === "sessions") {
        await deleteSessionMutation.mutateAsync({ id });
        await utils.sessions.list.invalidate();
      } else if (activeTab === "degrees") {
        await deleteDegreeMutation.mutateAsync({ id });
        await utils.degrees.list.invalidate();
      } else if (activeTab === "brothers") {
        await deleteBrotherMutation.mutateAsync({ id });
        await utils.brothers.list.invalidate();
      } else if (activeTab === "workers") {
        await deleteWorkerMutation.mutateAsync({ id });
        await utils.workers.list.invalidate();
      } else if (activeTab === "powers") {
        await deletePowerMutation.mutateAsync({ id });
        await utils.powers.list.invalidate();
      }
      toast.success("Deletado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar");
    }
  };

  const renderTable = (data: any[] | undefined, showEmail = false) => {
    if (!data || data.length === 0) {
      return <p className="text-center text-slate-500 py-8">Nenhum registro encontrado</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            {showEmail && <TableHead>E-mail</TableHead>}
            <TableHead>Inicial</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              {showEmail && <TableCell>{item.email || "-"}</TableCell>}
              <TableCell>{item.initials || item.name.charAt(0).toUpperCase()}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(item.id, item.name, item.email, item.description)}
                    className="gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-3 w-3" />
                        Deletar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar <strong>{item.name}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const tabConfig: Record<TabType, { title: string; data: any[] | undefined; showEmail?: boolean }> = {
    sessions: { title: "Sessões", data: sessions },
    degrees: { title: "Graus", data: degrees },
    brothers: { title: "Irmãos", data: brothers, showEmail: true },
    workers: { title: "Obreiros", data: workers },
    powers: { title: "Potências", data: powers },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciar Dados</h1>
            <p className="text-slate-600 mt-2">Cadastrar e gerenciar informações do sistema</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => openDialog()}>
                <Plus className="h-4 w-4" />
                Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar" : "Novo"} {tabConfig[activeTab].title.slice(0, -1)}
                </DialogTitle>
                <DialogDescription>
                  {editingId ? "Edite" : "Adicione"} os dados abaixo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                {activeTab === "brothers" && (
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                )}
                {(activeTab === "sessions" || activeTab === "degrees") && (
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição opcional"
                    />
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Atualizar" : "Criar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="degrees">Graus</TabsTrigger>
            <TabsTrigger value="brothers">Irmãos</TabsTrigger>
            <TabsTrigger value="workers">Obreiros</TabsTrigger>
            <TabsTrigger value="powers">Potências</TabsTrigger>
          </TabsList>

          {Object.entries(tabConfig).map(([key, config]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle>{config.title}</CardTitle>
                  <CardDescription>
                    Gerencie os registros de {config.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(config.data, config.showEmail)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
