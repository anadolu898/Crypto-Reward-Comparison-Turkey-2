import { PlatformData, StakingOffer } from './types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add the jsPDF AutoTable module type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = (data: PlatformData[], filters: any = {}) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add report title and date
  doc.setFontSize(20);
  doc.setTextColor(51, 51, 153);
  doc.text('Kripto Ödül Karşılaştırma Raporu', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
  doc.text('KriptoKarşılaştır, bir RightBehind şirketidir.', 14, 35);
  
  // If filters are applied, show them in the report
  if (Object.keys(filters).some(key => filters[key])) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Uygulanan Filtreler:', 14, 45);
    
    let filterY = 50;
    if (filters.minApy) {
      doc.text(`Minimum APY: %${filters.minApy}`, 20, filterY);
      filterY += 6;
    }
    
    if (filters.maxLockup) {
      doc.text(`Maksimum Kilitleme Süresi: ${filters.maxLockup} gün`, 20, filterY);
      filterY += 6;
    }
    
    if (filters.coin) {
      doc.text(`Kripto Para: ${filters.coin}`, 20, filterY);
      filterY += 6;
    }
    
    if (filters.platform) {
      doc.text(`Platform: ${filters.platform}`, 20, filterY);
      filterY += 6;
    }
  }
  
  // Create a flattened data array for the table
  const tableData = [];
  
  data.forEach(platform => {
    platform.stakingOffers.forEach(offer => {
      // Apply filters if provided
      if (filters.minApy && parseFloat(offer.apy) < parseFloat(filters.minApy)) {
        return;
      }
      
      if (filters.maxLockup) {
        if (
          offer.lockupPeriod.toLowerCase() !== 'esnek' && 
          offer.lockupPeriod.toLowerCase() !== 'flexible' && 
          parseInt(offer.lockupPeriod) > parseInt(filters.maxLockup)
        ) {
          return;
        }
      }
      
      if (filters.coin && offer.coin !== filters.coin) {
        return;
      }
      
      if (filters.platform && platform.platform !== filters.platform) {
        return;
      }
      
      // Format the lockup period
      let lockupPeriod = offer.lockupPeriod;
      if (lockupPeriod.toLowerCase() !== 'esnek' && lockupPeriod.toLowerCase() !== 'flexible') {
        lockupPeriod = `${lockupPeriod} gün`;
      } else {
        lockupPeriod = 'Esnek';
      }
      
      // Add row to table data
      tableData.push([
        platform.platform,
        `${offer.coin} (${offer.symbol})`,
        `%${offer.apy}`,
        lockupPeriod,
        offer.minStaking,
        offer.rating.toFixed(1),
      ]);
    });
  });
  
  // Generate the table
  doc.autoTable({
    startY: Object.keys(filters).some(key => filters[key]) ? 60 : 45,
    head: [['Platform', 'Kripto Para', 'APY', 'Kilitleme Süresi', 'Min. Miktar', 'Değerlendirme']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [51, 51, 153],
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: 'center',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      5: { halign: 'center' },
    },
  });
  
  // Add a footer with a disclaimer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      'Bu rapor bilgilendirme amaçlıdır. Yatırım tavsiyesi içermez. Kripto para yatırımları yüksek risk içerir.',
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Sayfa ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Return the document
  return doc;
};

// Function to download PDF
export const downloadPDF = (data: PlatformData[], filters: any = {}) => {
  const doc = generatePDF(data, filters);
  doc.save(`Kripto-Karsilastirma-Raporu-${new Date().toISOString().split('T')[0]}.pdf`);
}; 