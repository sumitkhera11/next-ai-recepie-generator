// // "use client";
// // import {
// //     Document,
// //     Page,
// //     Text,
// //     View,
// //     StyleSheet,
// //     PDFViewer,
// // } from "@react-pdf/renderer";
// // // Create styles
// // const styles = StyleSheet.create({
// //     page: {
// //         backgroundColor: "#d11fb6",
// //         color: "white",
// //         padding: 20,//1
// //     },
// //     section: {
// //         margin: 10,
// //         padding: 10,
// //     },
// //     viewer: {
// //         // width: window.innerWidth, //the pdf viewer will take up all of the width and height
// //         // height: window.innerHeight,
// //         width: "100%",
// //         height: "100vh",
// //     },
// // });

// // // Create Document Component
// // function RecipePDF() {
// //     return (
// //         <PDFViewer style={styles.viewer}>
// //             {/* Start of the document*/}
// //             <Document>
// //                 {/*render a single page*/}
// //                 <Page size="A4" style={styles.page}>
// //                     <View style={styles.section}>
// //                         <Text>Hello</Text>
// //                     </View>
// //                     <View style={styles.section}>
// //                         <Text>World</Text>
// //                     </View>
// //                 </Page>
// //             </Document>
// //         </PDFViewer>
// //     );
// // }
// // export default RecipePDF;
// // "use client";

// // import {
// //   Document,
// //   Page,
// //   Text,
// //   View,
// //   StyleSheet,
// //   PDFViewer,
// // } from "@react-pdf/renderer";

// // const styles = StyleSheet.create({
// //   page: {
// //     backgroundColor: "#ffffff",
// //     padding: 20,
// //   },
// //   section: {
// //     marginBottom: 10,
// //   },
// //   viewer: {
// //     width: "100%",
// //     height: "100vh",
// //   },
// // });

// // function RecipePDF() {
// //   return (
// //     <PDFViewer style={styles.viewer}>
// //       <Document>
// //         <Page size="A4" style={styles.page}>
// //           <View style={styles.section}>
// //             <Text>Hello</Text>
// //           </View>

// //           <View style={styles.section}>
// //             <Text>World</Text>
// //           </View>
// //         </Page>
// //       </Document>
// //     </PDFViewer>
// //   );
// // }

// // export default RecipePDF;
// "use client";

// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     backgroundColor: "#ffffff",
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   section: {
//     marginBottom: 10,
//   },
// });

// export default function RecipePDF({ recipe }) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
        
//         <View style={styles.section}>
//           <Text style={styles.title}>{recipe.title}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text>Ingredients:</Text>
//         </View>

//         {recipe.ingredients?.map((ing, i) => (
//           <View key={i}>
//             <Text>- {typeof ing === "string" ? ing : ing.item}</Text>
//           </View>
//         ))}

//       </Page>
//     </Document>
//   );
// }
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    fontSize: 12,
    marginBottom: 4,
  }
});

export default function RecipePDF({ recipe }) {

  const ingredients =
    recipe.ingredients?.map((ing) =>
      typeof ing === "string"
        ? ing
        : `${ing.quantity || ""} ${ing.item || ""}`
    ) || [];

  const instructions =
    recipe.instructions?.map((step) =>
      typeof step === "string"
        ? step
        : step.instruction || step.description || ""
    ) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <Text style={styles.title}>{recipe.title}</Text>

        <View>
          <Text style={styles.heading}>Ingredients</Text>

          {ingredients.map((item, i) => (
            <Text key={i} style={styles.item}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.heading}>Instructions</Text>

          {instructions.map((step, i) => (
            <Text key={i} style={styles.item}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>

      </Page>
    </Document>
  );
}