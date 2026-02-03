import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Define types locally if not available globally
interface Campaign {
    id: string;
    name: string;
    targetUrl: string;
    shortUrl: string;
    scans: number;
    createdAt?: string;
}

interface CampaignAnalytics {
    summary: {
        totalScans: number;
    };
    scans: {
        timeline: { date: string; count: number }[];
        byDevice: { device: string; count: number }[];
        byLocation: { city: string; country: string; count: number }[];
        byHour: { hour: number; count: number }[];
        byOS?: { os: string; count: number }[];
        byBrowser?: { browser: string; count: number }[];
    };
}

export const exportToPDF = (campaign: Campaign, analytics: CampaignAnalytics) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('Campaign Analytics Report', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // --- Campaign Details ---
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, pageWidth - 14, 35);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Campaign Details', 14, 45);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`in Name: ${campaign.name}`, 14, 53);
    doc.text(`Target URL: ${campaign.targetUrl}`, 14, 59);
    doc.text(`Short URL: ${campaign.shortUrl}`, 14, 65);
    doc.text(`Total Scans: ${analytics.summary.totalScans}`, 14, 71);

    let finalY = 80;

    // --- Device Breakdown ---
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Device Breakdown', 14, finalY);

    const deviceData = analytics.scans.byDevice.map(d => [d.device, d.count]);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Device', 'Scans']],
        body: deviceData,
        theme: 'striped',
        headStyles: { fillColor: [66, 66, 66] }
    });

    // Get the Y position after the first table
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // --- Location Breakdown ---
    doc.text('Top Locations', 14, finalY);

    const locationData = analytics.scans.byLocation.map(l => [`${l.city}, ${l.country}`, l.count]);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Location', 'Scans']],
        body: locationData,
        theme: 'striped',
        headStyles: { fillColor: [66, 66, 66] }
    });

    finalY = (doc as any).lastAutoTable.finalY + 15;

    // --- Scan Timeline (Simplified Table for PDF) ---
    // If getting too close to bottom, add new page
    if (finalY > 250) {
        doc.addPage();
        finalY = 20;
    }

    doc.text('Scan History (Last 7 Days / Available)', 14, finalY);

    const timelineData = analytics.scans.timeline.slice(-7).map(t => [t.date, t.count]);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Date', 'Scans']],
        body: timelineData,
        theme: 'striped',
        headStyles: { fillColor: [66, 66, 66] }
    });

    // Save
    doc.save(`${campaign.name.replace(/\s+/g, '_')}_Analytics.pdf`);
};

export const exportToExcel = (campaign: Campaign, analytics: CampaignAnalytics) => {
    const wb = XLSX.utils.book_new();

    // --- 1. Summary Sheet ---
    const summaryData = [
        ['Campaign Analytics Report'],
        ['Generated On', new Date().toLocaleString()],
        [],
        ['Campaign Name', campaign.name],
        ['Target URL', campaign.targetUrl],
        ['Short URL', campaign.shortUrl],
        ['Total Scans', analytics.summary.totalScans]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // --- 2. Timeline Sheet ---
    const timelineData = analytics.scans.timeline.map(t => ({ Date: t.date, Scans: t.count }));
    const wsTimeline = XLSX.utils.json_to_sheet(timelineData);
    XLSX.utils.book_append_sheet(wb, wsTimeline, 'Timeline');

    // --- 3. Locations Sheet ---
    const locationData = analytics.scans.byLocation.map(l => ({ City: l.city, Country: l.country, Scans: l.count }));
    const wsLocations = XLSX.utils.json_to_sheet(locationData);
    XLSX.utils.book_append_sheet(wb, wsLocations, 'Locations');

    // --- 4. Devices Sheet ---
    const deviceData = analytics.scans.byDevice.map(d => ({ Device: d.device, Scans: d.count }));
    const wsDevices = XLSX.utils.json_to_sheet(deviceData);
    XLSX.utils.book_append_sheet(wb, wsDevices, 'Devices');

    // Save
    XLSX.writeFile(wb, `${campaign.name.replace(/\s+/g, '_')}_Analytics.xlsx`);
};
