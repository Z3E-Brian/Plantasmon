import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export interface PdfContent {
  projectName: string;
  version: string;
  date: string;
  buildUrl: string;
  screenshots?: { uri: string; label: string }[];
  sections: { title: string; content: string }[];
}

/**
 * Generates a PDF document from the provided content using expo-print.
 * Returns the file URI of the generated PDF.
 */
export async function generateAppProgressPdf(
  content: PdfContent
): Promise<string> {
  try {
    const screenshotsHtml = content.screenshots?.length
      ? content.screenshots
          .map(
            (s) => `
          <div class="screenshot">
            <h3>${s.label}</h3>
            <img src="${s.uri}" alt="${s.label}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 12px;" />
          </div>`
          )
          .join("")
      : "";

    const sectionsHtml = content.sections
      .map(
        (s) => `
      <div class="section">
        <h2>${s.title}</h2>
        <p>${s.content}</p>
      </div>`
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${content.projectName} - Progreso</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          padding: 40px 32px;
          color: #1D3426;
          background: #FFFFFF;
        }
        h1 {
          font-size: 28px;
          font-weight: 800;
          color: #2E5739;
          margin-bottom: 4px;
        }
        .subtitle {
          font-size: 14px;
          color: #667A6A;
          margin-bottom: 32px;
        }
        .section {
          margin-bottom: 24px;
          padding: 16px;
          background: #F5F3ED;
          border-radius: 12px;
        }
        .section h2 {
          font-size: 18px;
          font-weight: 700;
          color: #2E5739;
          margin-bottom: 8px;
        }
        .section p {
          font-size: 14px;
          line-height: 1.6;
          color: #1D3426;
        }
        .screenshot {
          margin-bottom: 20px;
        }
        .screenshot h3 {
          font-size: 14px;
          font-weight: 600;
          color: #667A6A;
          margin-bottom: 8px;
        }
        .build-link {
          display: inline-block;
          padding: 10px 20px;
          background: #2E5739;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #DDD;
          font-size: 12px;
          color: #95A796;
        }
      </style>
    </head>
    <body>
      <h1>${content.projectName}</h1>
      <p class="subtitle">Reporte de Progreso — ${content.date} | v${content.version}</p>

      ${sectionsHtml}

      ${screenshotsHtml}

      <div class="section">
        <h2>🔗 Build Android</h2>
        <p>Descarga la última versión de preview:</p>
        <p><a href="${content.buildUrl}" class="build-link">${content.buildUrl}</a></p>
      </div>

      <div class="footer">
        <p>Generado automáticamente desde PlantasMon • ${content.date}</p>
        <p>EAS Project: 112f23e5-4211-4968-968c-b0cbc6bc6a6d</p>
      </div>
    </body>
    </html>`;

    const { uri } = await Print.printToFileAsync({ html });

    return uri;
  } catch (error) {
    console.error("Error al generar PDF:", error);
    throw new Error("No se pudo generar el PDF. Verifica que el dispositivo tenga suficiente espacio.");
  }
}

/**
 * Shares a PDF file via the system share dialog.
 * Returns early if sharing is not available on the device.
 */
export async function sharePdf(uri: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir reporte de progreso",
      });
    } else {
      console.warn("Compartir no está disponible en este dispositivo.");
    }
  } catch (error) {
    console.error("Error al compartir PDF:", error);
    throw new Error("No se pudo compartir el PDF.");
  }
}
