import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generatePrescriptionPDF = async (prescription) => {
  const filePath = path.join(
    process.cwd(),
    "uploads/prescriptions",
    `prescription_${prescription._id}.pdf`
  );

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("Medical Prescription");

  doc.moveDown();

  prescription.medicines.forEach((med) => {
    doc.text(`${med.name} - ${med.dosage}`);
    doc.text(`Duration: ${med.duration}`);
    doc.text(`Instructions: ${med.instructions}`);
    doc.moveDown();
  });

  if (prescription.notes) {
    doc.text(`Notes: ${prescription.notes}`);
  }

  doc.end();

  return filePath;
};