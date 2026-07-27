import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 9.5,
    color: "#444444",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    borderBottom: "1 solid #1a1a1a",
    paddingBottom: 2,
    marginTop: 12,
    marginBottom: 6,
  },
  summaryText: {
    lineHeight: 1.4,
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
    fontSize: 10,
    color: "#333333",
    marginBottom: 3,
  },
  entryDates: {
    fontSize: 9.5,
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
    lineHeight: 1.35,
  },
  entryBlock: {
    marginBottom: 8,
  },
  skillsText: {
    lineHeight: 1.4,
  },
});

export default function ResumePDFDocument({ draft }) {
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
