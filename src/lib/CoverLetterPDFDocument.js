import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  paragraph: {
    marginBottom: 12,
  },
});

export default function CoverLetterPDFDocument({ content }) {
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {paragraphs.map((para, i) => (
          <Text key={i} style={styles.paragraph}>
            {para.trim()}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
