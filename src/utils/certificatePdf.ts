import jsPDF from 'jspdf';

export function generateCertificatePDF(
  sessionName: string,
  degreeName: string,
  brotherName: string,
  _workerName: string,
  powerName: string,
  certificateDate: string
): string {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Fundo bege
  doc.setFillColor(245, 240, 230);
  doc.rect(0, 0, width, height, 'F');

  // Bordas decorativas
  doc.setDrawColor(139, 90, 43);
  doc.setLineWidth(2);
  doc.rect(5, 5, width - 10, height - 10);

  doc.setLineWidth(0.5);
  doc.rect(8, 8, width - 16, height - 16);

  // Cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Augusta Respeitável Benfeitora e Excelsa', width / 2, 25, { align: 'center' });

  doc.setFontSize(22);
  doc.setTextColor(139, 90, 43);
  doc.text('Loja Simbólica Monte Sinai', width / 2, 35, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text('Rito Adonhiramita - Centro Templário', width / 2, 42, { align: 'center' });
  doc.text('Or. de Porto Alegre, RS', width / 2, 47, { align: 'center' });
  doc.text('Fundada em 24 de junho de 1977 - Sessões às segundas-feiras', width / 2, 52, { align: 'center' });
  doc.text('Grande Oriente do Rio Grande do Sul - GORGS', width / 2, 57, { align: 'center' });

  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(139, 90, 43);
  doc.text('CERTIFICADO DE PRESENÇA', width / 2, 70, { align: 'center' });

  // Conteúdo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const textY = 85;
  const lineHeight = 7;
  const margin = 20;

  doc.text('Certifico que abrilhantou a sessão', margin, textY);
  
  doc.setFont('helvetica', 'bold');
  doc.text(sessionName, margin + 50, textY);
  
  doc.setFont('helvetica', 'normal');
  doc.text('de grau', margin + 110, textY);
  
  doc.setFont('helvetica', 'bold');
  doc.text(degreeName, margin + 130, textY);
  
  doc.setFont('helvetica', 'normal');
  doc.text('o Am. Ir.', margin, textY + lineHeight * 1.5);
  
  doc.setFont('helvetica', 'bold');
  doc.text(brotherName.toUpperCase(), margin + 25, textY + lineHeight * 1.5);
  
  doc.setFont('helvetica', 'normal');
  doc.text('C.I.M. obreiro da A. R . L. S.', margin, textY + lineHeight * 3);
  
  doc.setFont('helvetica', 'bold');
  doc.text(powerName, margin + 85, textY + lineHeight * 3);
  
  doc.setFont('helvetica', 'normal');
  doc.text('n° do GOB-RS na data', margin + 145, textY + lineHeight * 3);
  
  doc.setFont('helvetica', 'bold');
  const formattedDate = new Date(certificateDate).toLocaleDateString('pt-BR');
  doc.text(formattedDate, margin, textY + lineHeight * 4.5);
  
  doc.setFont('helvetica', 'normal');
  doc.text('da E V .', margin + 45, textY + lineHeight * 4.5);

  // Assinaturas
  const signatureY = height - 35;
  const signatureLineY = signatureY + 25;
  const signatureSpacing = (width - 2 * margin) / 3;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);

  // Linha 1
  doc.line(margin, signatureLineY, margin + signatureSpacing - 10, signatureLineY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Am. Venerável Mestre', margin + signatureSpacing / 2 - 15, signatureLineY + 5, { align: 'center' });

  // Linha 2
  doc.line(margin + signatureSpacing + 5, signatureLineY, margin + 2 * signatureSpacing - 5, signatureLineY);
  doc.text('Am. Orador', margin + signatureSpacing + signatureSpacing / 2, signatureLineY + 5, { align: 'center' });

  // Linha 3
  doc.line(margin + 2 * signatureSpacing + 10, signatureLineY, width - margin, signatureLineY);
  doc.text('Am. Chanceler', width - margin - signatureSpacing / 2, signatureLineY + 5, { align: 'center' });

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, width / 2, height - 5, { align: 'center' });

  // Retornar como data URL
  return doc.output('dataurlstring');
}
