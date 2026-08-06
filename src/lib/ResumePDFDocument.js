import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Three visual variants, all single-column and plain-text — this keeps every
// template equally ATS-parseable; only spacing/color/weight differ, not structure.
const TEMPLATES = {
  minimal: {
    accentColor: "#1a1a1a",
    nameSize: 20,
    bodySize: 10.5,
    sectionUnderline: true,
    padding: 40,
    lineHeight: 1.4,
    entrySpacing: 8,
  },
  modern: {
    accentColor: "#1b2559",
    nameSize: 22,
    bodySize: 10.5,
    sectionUnderline: true,
    padding: 44,
    lineHeight: 1.45,
    entrySpacing: 9,
  },
  compact: {
    accentColor: "#1a1a1a",
    nameSize: 17,
    bodySize: 9.5,
    sectionUnderline: false,
    padding: 32,
    lineHeight: 1.25,
    entrySpacing: 5,
  },
};

export default function ResumePDFDocument({ draft }) {
  const t = TEMPLATES[draft.template] || TEMPLATES.minimal;

  const styles = StyleSheet.create({
    page: {
      padding: t.padding,
      fontSize: t.bodySize,
      fontFamily: "Helvetica",
      color: "#1a1a1a",
    },
    name: {
      fontSize: t.nameSize,
      fontFamily: "Helvetica-Bold",
      color: t.accentColor,
      marginBottom: 2,
    },
    contactLine: {
      fontSize: t.bodySize - 1,
      color: "#444444",
      marginBottom: t.compact ? 8 : 12,
    },
    sectionTitle: {
      fontSize: t.bodySize + 0.5,
      fontFamily: "Helvetica-Bold",
      color: t.accentColor,
      textTransform: "uppercase",
      borderBottom: t.sectionUnderline ? `1 solid ${t.accentColor}` : "none",
      paddingBottom: t.sectionUnderline ? 2 : 0,
      marginTop: t.entrySpacing + 4,
      marginBottom: 6,
    },
    summaryText: {
      lineHeight: t.lineHeight,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 1,
    },
    entryTitle: {
      fontFamily: "Helvetica-Bold",
    },
    entrySubtitle: {
      fontSize: t.bodySize - 0.5,
      color: "#333333",
      marginBottom: 3,
    },
    entryDates: {
      fontSize: t.bodySize - 1,
      color: "#555555",
    },
    bullet: {
      flexDirection: "row",
      marginBottom: 2,
    },
    bulletDot: {
      width: 10,
    },
    bulletText: {
      flex: 1,
      lineHeight: t.lineHeight,
    },
    entryBlock: {
      marginBottom: t.entrySpacing,
    },
    skillsText: {
      lineHeight: t.lineHeight,
    },
  });

  const contactParts = [
    draft.email,
    draft.phone,
    draft.location,
    draft.linkedin,
    draft.portfolio,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{draft.fullName || "Your Name"}</Text>
        {contactParts.length > 0 && (
          <Text style={styles.contactLine}>{contactParts.join("  |  ")}</Text>
        )}

        {draft.summary && (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{draft.summary}</Text>
          </View>
        )}

        {draft.highlights?.filter(Boolean).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Key Strengths</Text>
            {draft.highlights.filter(Boolean).map((highlight, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{highlight}</Text>
              </View>
            ))}
          </View>
        )}

        {draft.experience?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {draft.experience.map((exp, i) => (
              <View key={i} style={styles.entryBlock} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {exp.role}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </Text>
                  <Text style={styles.entryDates}>
                    {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                  </Text>
                </View>
                {exp.location && (
                  <Text style={styles.entrySubtitle}>{exp.location}</Text>
                )}
                {exp.bullets?.filter(Boolean).map((bullet, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {draft.projects?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {draft.projects.map((proj, i) => (
              <View key={i} style={styles.entryBlock} wrap={false}>
                <Text style={styles.entryTitle}>{proj.name}</Text>
                {proj.description && (
                  <Text style={styles.summaryText}>{proj.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {draft.education?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {draft.education.map((edu, i) => (
              <View key={i} style={styles.entryBlock} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.school}</Text>
                  <Text style={styles.entryDates}>
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                  </Text>
                </View>
                {edu.degree && (
                  <Text style={styles.entrySubtitle}>{edu.degree}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {draft.skills?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{draft.skills.join("  •  ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
