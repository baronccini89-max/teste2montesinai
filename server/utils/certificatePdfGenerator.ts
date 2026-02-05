import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface CertificateData {
  session: string;
  degree: string;
  brother: string;
  worker: string;
  power: string;
  date: Date;
}

function centerText(text: string, fontSize: number, pageWidth: number): number {
  // Approximate text width calculation
  const textWidth = text.length * fontSize * 0.5;
  return (pageWidth - textWidth) / 2;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([850, 600]);

  const { width, height } = page.getSize();
  const margin = 40;

  // Set background color to cream/beige
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: rgb(0.98, 0.97, 0.95),
  });

  // Draw decorative border
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    borderColor: rgb(0.4, 0.4, 0.5),
    borderWidth: 2,
  });

  // Inner decorative border
  page.drawRectangle({
    x: margin + 8,
    y: margin + 8,
    width: width - margin * 2 - 16,
    height: height - margin * 2 - 16,
    borderColor: rgb(0.4, 0.4, 0.5),
    borderWidth: 1,
  });

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const smallFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let yPosition = height - 80;

  // Title
  const title1 = "Augusta Respeitavel Benfeitora e Excelsa";
  page.drawText(title1, {
    x: centerText(title1, 16, width),
    y: yPosition,
    size: 16,
    font: titleFont,
    color: rgb(0.2, 0.2, 0.3),
  });

  yPosition -= 25;

  const title2 = "Loja Simbolica Monte Sinai";
  page.drawText(title2, {
    x: centerText(title2, 18, width),
    y: yPosition,
    size: 18,
    font: titleFont,
    color: rgb(0.2, 0.2, 0.3),
  });

  yPosition -= 30;

  const subtitle1 = "Rito Adonhiramita - Centro Templarario - Or.'. de Porto Alegre, RS";
  page.drawText(subtitle1, {
    x: centerText(subtitle1, 10, width),
    y: yPosition,
    size: 10,
    font: textFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 15;

  const subtitle2 = "Fundada em 24 de junho de 1977 - Sessoes as segundas-feiras";
  page.drawText(subtitle2, {
    x: centerText(subtitle2, 10, width),
    y: yPosition,
    size: 10,
    font: textFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 15;

  const subtitle3 = "Grande Oriente do Rio Grande do Sul - GORGS";
  page.drawText(subtitle3, {
    x: centerText(subtitle3, 10, width),
    y: yPosition,
    size: 10,
    font: textFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 60;

  // Certificate text box background
  page.drawRectangle({
    x: margin + 16,
    y: yPosition - 60,
    width: width - margin * 2 - 32,
    height: 80,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });

  yPosition -= 20;

  // Certificate text
  const certificateText = `Certifico que abrilhantou a sessao ${data.session} de grau ${data.degree}`;
  page.drawText(certificateText, {
    x: margin + 24,
    y: yPosition,
    size: 11,
    font: textFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  yPosition -= 18;

  const certificateText2 = `o Am.'. Ir.'. ${data.brother.toUpperCase()} C.'.I.'.M.'. obreiro da A.'. R .'.L.'. S.'.`;
  page.drawText(certificateText2, {
    x: margin + 24,
    y: yPosition,
    size: 11,
    font: textFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  yPosition -= 18;

  const certificateText3 = `${data.power} n° do GOB-RS na data ${data.date.toLocaleDateString("pt-BR")} da E V .`;
  page.drawText(certificateText3, {
    x: margin + 24,
    y: yPosition,
    size: 11,
    font: textFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  yPosition -= 80;

  // Signature lines
  const signatureY = yPosition;
  const signatureLineLength = 150;
  const signatureSpacing = (width - margin * 2 - 32 - signatureLineLength * 3) / 4;

  // First signature
  const firstSigX = margin + 16 + signatureSpacing;
  page.drawLine({
    start: { x: firstSigX, y: signatureY },
    end: { x: firstSigX + signatureLineLength, y: signatureY },
    color: rgb(0.2, 0.2, 0.2),
    thickness: 1,
  });

  page.drawText("Am.'. Ir.'. Veneravel Mestre", {
    x: firstSigX + 10,
    y: signatureY - 20,
    size: 9,
    font: smallFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Second signature
  const secondSigX = margin + 16 + signatureSpacing * 2 + signatureLineLength;
  page.drawLine({
    start: { x: secondSigX, y: signatureY },
    end: { x: secondSigX + signatureLineLength, y: signatureY },
    color: rgb(0.2, 0.2, 0.2),
    thickness: 1,
  });

  page.drawText("Am.'. Ir.'. Orador", {
    x: secondSigX + 35,
    y: signatureY - 20,
    size: 9,
    font: smallFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Third signature
  const thirdSigX = margin + 16 + signatureSpacing * 3 + signatureLineLength * 2;
  page.drawLine({
    start: { x: thirdSigX, y: signatureY },
    end: { x: thirdSigX + signatureLineLength, y: signatureY },
    color: rgb(0.2, 0.2, 0.2),
    thickness: 1,
  });

  page.drawText("Am.'. Ir.'. Chanceler", {
    x: thirdSigX + 30,
    y: signatureY - 20,
    size: 9,
    font: smallFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
