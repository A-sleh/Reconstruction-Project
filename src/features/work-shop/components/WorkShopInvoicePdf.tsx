import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoicePayload, WorkShop } from "../api/types";

const COLORS = {
  navy: "#0b1f4b",
  navyDark: "#081636",
  blue: "#2563eb",
  blueSoft: "#eff6ff",
  blueBorder: "#bfdbfe",
  emerald: "#059669",
  emeraldSoft: "#ecfdf5",
  emeraldBorder: "#a7f3d0",
  amber: "#d97706",
  amberSoft: "#fffbeb",
  amberBorder: "#fde68a",
  text: "#111827",
  muted: "#64748b",
  border: "#e2e8f0",
  bgSoft: "#f8fafc",
  white: "#ffffff",
};

const statusLabel: Record<string, string> = {
  Pending: "PENDING",
  InProgress: "IN PROGRESS",
  Completed: "COMPLETED",
  Canceled: "CANCELED",
};

interface Props {
  workShop: WorkShop;
  invoices?: InvoicePayload[];
  projectName?: string;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: COLORS.bgSoft,
    paddingBottom: 64,
  },
  // ===== Header =====
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 26,
    paddingHorizontal: 30,
    paddingBottom: 24,
  },
  headerAccentBar: {
    height: 5,
    backgroundColor: COLORS.amber,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.amber,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  brandMarkText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  brandName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  brandSub: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 2,
    letterSpacing: 1,
  },
  invoiceBadgeBox: {
    alignItems: "flex-end",
  },
  docTypeBadge: {
    color: COLORS.amber,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 4,
  },
  docTypeSub: {
    color: "#94a3b8",
    fontSize: 8,
    marginTop: 3,
    letterSpacing: 1,
  },
  workShopTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    marginTop: 20,
  },
  workShopDesc: {
    fontSize: 9.5,
    color: "#c7d2fe",
    marginTop: 6,
    lineHeight: 1.55,
    maxWidth: 430,
  },
  statusPill: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "#1e3a8a",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    color: "#dbeafe",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  metaItem: {
    flex: 1,
    backgroundColor: "#12295c",
    padding: 11,
    borderRightWidth: 1,
    borderRightColor: "#1e3a8a",
  },
  metaLabel: {
    fontSize: 7,
    color: "#8fa3c8",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  metaValue: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
    color: COLORS.white,
  },
  // ===== Body =====
  body: {
    padding: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.navy,
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  kpiCardPaid: {
    backgroundColor: COLORS.emeraldSoft,
    borderColor: COLORS.emeraldBorder,
  },
  kpiCardTotal: {
    backgroundColor: COLORS.blueSoft,
    borderColor: COLORS.blueBorder,
  },
  kpiCardRemaining: {
    backgroundColor: COLORS.amberSoft,
    borderColor: COLORS.amberBorder,
  },
  kpiTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 7.5,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontFamily: "Helvetica-Bold",
  },
  kpiBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  kpiBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  kpiValue: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
  },
  kpiHint: {
    fontSize: 8,
    color: COLORS.muted,
    marginTop: 4,
  },
  progressWrap: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
  },
  progressHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.navy,
  },
  progressPercent: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.blue,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.blue,
  },
  progressLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  progressLegendText: {
    fontSize: 8,
    color: COLORS.muted,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  detailItem: {
    width: "49%",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 11,
  },
  detailLabel: {
    fontSize: 7,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  detailValue: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 5,
    color: COLORS.navy,
  },
  // ===== Table =====
  table: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.navy,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#c7d2fe",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    paddingVertical: 10,
    paddingHorizontal: 11,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  tableRowAlt: {
    backgroundColor: COLORS.bgSoft,
  },
  tableCell: {
    fontSize: 9.5,
    paddingVertical: 10,
    paddingHorizontal: 11,
  },
  colNo: { width: "10%", textAlign: "center", color: COLORS.muted },
  colDate: { width: "20%" },
  colDesc: { width: "50%" },
  colAmount: {
    width: "20%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: COLORS.navy,
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.emeraldSoft,
  },
  totalsLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.emerald,
    paddingVertical: 12,
    paddingHorizontal: 11,
    width: "80%",
    textAlign: "right",
    letterSpacing: 1,
  },
  totalsValue: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.emerald,
    paddingVertical: 12,
    paddingHorizontal: 11,
    textAlign: "right",
  },
  emptyRow: {
    padding: 22,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 9.5,
  },
  // ===== Footer =====
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: 30,
    paddingVertical: 13,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.amber,
    marginRight: 8,
  },
  footerBrand: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    letterSpacing: 1,
  },
  footerNote: {
    fontSize: 7.5,
    color: "#94a3b8",
    marginLeft: 10,
  },
  pageNumber: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
});

const WorkShopInvoicePdf = ({ workShop, invoices = [], projectName }: Props) => {
  const percent =
    workShop.totalCost > 0
      ? Math.min(
          100,
          Math.round((workShop.costPaid / workShop.totalCost) * 100),
        )
      : 0;
  const remaining = Math.max(0, workShop.totalCost - workShop.costPaid);
  const totalPayed = invoices.reduce((sum, i) => sum + i.payedAmount, 0);

  const details = [
    { label: "Number of Workers", value: `${workShop.memberNumber}` },
    { label: "Supervisor Phone", value: workShop.supervisorPhoneNumber },
    { label: "Start Date", value: formatDate(workShop.startWorkDate) },
    { label: "End Date", value: formatDate(workShop.endWorkDate) },
    { label: "Status", value: statusLabel[workShop.status] ?? workShop.status },
  ];

  return (
    <Document
      title={`Workshop Invoice - ${workShop.name}`}
      author="Reconstruction Platform"
    >
      <Page size="A4" style={styles.page}>
        {/* ===== Modern Header ===== */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>RC</Text>
              </View>
              <View>
                <Text style={styles.brandName}>RECONSTRUCTION CO.</Text>
                <Text style={styles.brandSub}>
                  {projectName ? `${projectName} — ` : ""}Workshop Payment
                  Statement
                </Text>
              </View>
            </View>
            <View style={styles.invoiceBadgeBox}>
              <Text style={styles.docTypeBadge}>INVOICE</Text>
              <Text style={styles.docTypeSub}>
                WS-{String(workShop.id).padStart(5, "0")}
              </Text>
            </View>
          </View>

          <Text style={styles.workShopTitle}>{workShop.name}</Text>
          <Text style={styles.workShopDesc}>{workShop.description}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {statusLabel[workShop.status] ?? workShop.status}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Issue Date</Text>
              <Text style={styles.metaValue}>{formatDate(new Date())}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Supervisor Phone</Text>
              <Text style={styles.metaValue}>{workShop.supervisorPhoneNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Workers</Text>
              <Text style={styles.metaValue}>{workShop.memberNumber}</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerAccentBar} />

        <View style={styles.body}>
          {/* ===== KPIs ===== */}
          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, styles.kpiCardPaid]}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>Paid Amount</Text>
                <View
                  style={[
                    styles.kpiBadge,
                    { backgroundColor: "#d1fae5" },
                  ]}
                >
                  <Text style={[styles.kpiBadgeText, { color: COLORS.emerald }]}>
                    {percent}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, { color: COLORS.emerald }]}>
                ${fmt(workShop.costPaid)}
              </Text>
              <Text style={styles.kpiHint}>Total received to date</Text>
            </View>

            <View style={[styles.kpiCard, styles.kpiCardTotal]}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>Total Required</Text>
                <View
                  style={[styles.kpiBadge, { backgroundColor: "#dbeafe" }]}
                >
                  <Text style={[styles.kpiBadgeText, { color: COLORS.blue }]}>
                    CONTRACT
                  </Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, { color: COLORS.blue }]}>
                ${fmt(workShop.totalCost)}
              </Text>
              <Text style={styles.kpiHint}>Agreed contract value</Text>
            </View>

            <View style={[styles.kpiCard, styles.kpiCardRemaining]}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>Remaining</Text>
                <View
                  style={[styles.kpiBadge, { backgroundColor: COLORS.amberSoft }]}
                >
                  <Text style={[styles.kpiBadgeText, { color: COLORS.amber }]}>
                    DUE
                  </Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, { color: COLORS.amber }]}>
                ${fmt(remaining)}
              </Text>
              <Text style={styles.kpiHint}>Outstanding balance</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressWrap}>
            <View style={styles.progressHeadRow}>
              <Text style={styles.progressTitle}>Payment Completion</Text>
              <Text style={styles.progressPercent}>{percent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <View style={styles.progressLegend}>
              <Text style={styles.progressLegendText}>
                Paid ${fmt(workShop.costPaid)}
              </Text>
              <Text style={styles.progressLegendText}>
                Required ${fmt(workShop.totalCost)}
              </Text>
            </View>
          </View>

          {/* ===== Details ===== */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            WORKSHOP INFORMATION
          </Text>
          <View style={styles.detailsGrid}>
            {details.map((d) => (
              <View key={d.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>

          {/* ===== Payments Table ===== */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            PAYMENTS RECORDED ({invoices.length})
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colNo]}>NO.</Text>
              <Text style={[styles.tableHeaderCell, styles.colDate]}>DATE</Text>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>
                DESCRIPTION
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>
                AMOUNT
              </Text>
            </View>

            {invoices.length === 0 ? (
              <Text style={styles.emptyRow}>
                No payments recorded for this workshop yet.
              </Text>
            ) : (
              invoices.map((invoice, index) => (
                <View
                  key={invoice.id}
                  style={[
                    styles.tableRow,
                    ...(index % 2 === 1 ? [styles.tableRowAlt] : []),
                  ]}
                >
                  <Text style={[styles.tableCell, styles.colNo]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.tableCell, styles.colDate]}>
                    {formatDate(invoice.data)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colDesc]}>
                    {invoice.description}
                  </Text>
                  <Text style={[styles.tableCell, styles.colAmount]}>
                    ${fmt(invoice.payedAmount)}
                  </Text>
                </View>
              ))
            )}

            {invoices.length > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>TOTAL PAID</Text>
                <Text style={styles.totalsValue}>${fmt(totalPayed)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ===== Modern Footer ===== */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <View style={styles.footerDot} />
            <Text style={styles.footerBrand}>RECONSTRUCTION CO.</Text>
            <Text style={styles.footerNote}>
              Thank you for your business — generated automatically.
            </Text>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default WorkShopInvoicePdf;
